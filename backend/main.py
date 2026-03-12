from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import httpx
import PyPDF2
import io
import re
import tempfile
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from auth import (SessionLocal, User, AnalysisHistory,
                  verify_password, hash_password, create_token, verify_token)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

import os
from dotenv import load_dotenv
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
security = HTTPBearer(auto_error=False)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    cv_text: Optional[str] = ""

class MatchRequest(BaseModel):
    cv_text: str
    job_description: str

class ReportRequest(BaseModel):
    analysis: str
    score: int
    field: str
    job_role: str

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class SaveHistoryRequest(BaseModel):
    field: str
    job_role: str
    score: int
    analysis: str

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        return None
    email = verify_token(credentials.credentials)
    if not email:
        return None
    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    db.close()
    return user

def extract_text_from_pdf(contents):
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(contents))
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def extract_text_from_docx(contents):
    from docx import Document
    doc = Document(io.BytesIO(contents))
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text

@app.post("/register")
async def register(request: RegisterRequest):
    db = SessionLocal()
    if db.query(User).filter(User.email == request.email).first():
        db.close()
        raise HTTPException(status_code=400, detail="Email already registered!")
    if db.query(User).filter(User.username == request.username).first():
        db.close()
        raise HTTPException(status_code=400, detail="Username already taken!")
    user = User(
        email=request.email,
        username=request.username,
        hashed_password=hash_password(request.password)
    )
    db.add(user)
    db.commit()
    db.close()
    return {"message": "Account created successfully!"}

@app.post("/login")
async def login(request: LoginRequest):
    db = SessionLocal()
    user = db.query(User).filter(User.email == request.email).first()
    db.close()
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password!")
    token = create_token({"sub": user.email})
    return {"token": token, "username": user.username, "email": user.email}

@app.post("/save-history")
async def save_history(request: SaveHistoryRequest, user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Please login first!")
    db = SessionLocal()
    history = AnalysisHistory(
        user_id=user.id,
        field=request.field,
        job_role=request.job_role,
        score=request.score,
        analysis=request.analysis
    )
    db.add(history)
    db.commit()
    db.close()
    return {"message": "Saved!"}

@app.get("/history")
async def get_history(user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Please login first!")
    db = SessionLocal()
    records = db.query(AnalysisHistory).filter(
        AnalysisHistory.user_id == user.id
    ).order_by(AnalysisHistory.created_at.desc()).limit(10).all()
    db.close()
    return {"history": [
        {"id": r.id, "field": r.field, "job_role": r.job_role,
         "score": r.score, "created_at": str(r.created_at)}
        for r in records
    ]}

@app.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    field: str = Form("Computer Science / IT"),
    job_role: str = Form("Overall / General")
):
    contents = await file.read()
    filename = file.filename.lower()
    if filename.endswith(".pdf"):
        text = extract_text_from_pdf(contents)
    elif filename.endswith(".docx"):
        text = extract_text_from_docx(contents)
    else:
        return {"error": "Unsupported file type!"}

    if job_role == "Overall / General":
        role_instruction = f"Analyze for overall {field} field."
    else:
        role_instruction = f"Analyze specifically for {job_role} in {field}."

    prompt = f"""You are a STRICT and HONEST resume evaluator.
Field: {field}
{role_instruction}

SCORING RULES:
- 9-10: Perfect professional resume, 5+ years experience
- 7-8: Good resume, real work experience + strong projects
- 5-6: Average student resume, has internship or projects
- 3-4: Weak resume, missing experience
- 1-2: Very poor resume

Respond in EXACTLY this format:

Score out of 10: [X]/10

Strengths:
1. [strength]
2. [strength]
3. [strength]

Weaknesses:
1. [weakness]
2. [weakness]
3. [weakness]

Suggestions:
1. [suggestion]
2. [suggestion]
3. [suggestion]

Resume:
{text[:3000]}"""

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
            json={"model": "llama-3.3-70b-versatile", "messages": [{"role": "user", "content": prompt}]},
            timeout=60.0
        )
    result = response.json()
    reply = result["choices"][0]["message"]["content"] if "choices" in result else str(result)
    score = 5
    match = re.search(r'Score out of 10:\s*(\d+)/10', reply)
    if match:
        score = int(match.group(1))
    return {"analysis": reply, "cv_text": text[:3000], "score": score}

@app.post("/chat")
async def chat(request: ChatRequest):
    last_message = request.messages[-1].content
    if request.cv_text:
        system_prompt = f"""You are a helpful resume advisor.
Resume: {request.cv_text}
RULES:
- Answer based on THIS resume only
- Give clean bullet points
- Maximum 5 bullet points
- End with 3 follow-up questions:
---
💬 **Continue the conversation:**
[Q1]: Question 1?
[Q2]: Question 2?
[Q3]: Question 3?"""
    else:
        system_prompt = "You are a helpful resume advisor."
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
            json={"model": "llama-3.3-70b-versatile", "messages": [{"role": "system", "content": system_prompt}, {"role": "user", "content": last_message}]},
            timeout=60.0
        )
    result = response.json()
    reply = result["choices"][0]["message"]["content"] if "choices" in result else str(result)
    return {"reply": reply}

@app.post("/match")
async def match_cv(request: MatchRequest):
    prompt = f"""You are a resume matching expert.
CV: {request.cv_text[:2000]}
Job Description: {request.job_description[:1000]}

Respond in EXACTLY this format:

Match Percentage: [X]%

**Matched Skills:**
- [skill]
- [skill]
- [skill]

**Missing Skills:**
- [skill]
- [skill]
- [skill]

**Verdict:**
[2-3 lines about overall fit]"""

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
            json={"model": "llama-3.3-70b-versatile", "messages": [{"role": "user", "content": prompt}]},
            timeout=60.0
        )
    result = response.json()
    reply = result["choices"][0]["message"]["content"] if "choices" in result else str(result)
    percentage = 50
    match = re.search(r'Match Percentage:\s*(\d+)%', reply)
    if match:
        percentage = int(match.group(1))
    return {"percentage": percentage, "details": reply}

@app.post("/download-report")
async def download_report(request: ReportRequest):
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    doc = SimpleDocTemplate(tmp.name, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    title_style = ParagraphStyle('title', fontSize=24, textColor=colors.HexColor('#007744'), spaceAfter=20, fontName='Helvetica-Bold')
    heading_style = ParagraphStyle('heading', fontSize=14, textColor=colors.HexColor('#0055aa'), spaceAfter=10, fontName='Helvetica-Bold')
    body_style = ParagraphStyle('body', fontSize=11, textColor=colors.black, spaceAfter=8, fontName='Helvetica')
    story.append(Paragraph("AI Resume Analyzer Report", title_style))
    story.append(Paragraph(f"Field: {request.field} | Role: {request.job_role}", body_style))
    story.append(Paragraph(f"Resume Score: {request.score}/10", heading_style))
    story.append(Spacer(1, 20))
    for line in request.analysis.split('\n'):
        if line.strip():
            if any(line.startswith(h) for h in ['Strengths', 'Weaknesses', 'Suggestions', 'Score']):
                story.append(Paragraph(line.strip(), heading_style))
            else:
                clean = line.replace('**', '').strip()
                story.append(Paragraph(clean, body_style))
    doc.build(story)
    return FileResponse(tmp.name, media_type='application/pdf', filename='resume_report.pdf')
