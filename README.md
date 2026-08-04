# AI Resume Analyzer

An AI-powered resume analysis tool that parses uploaded resumes, evaluates their content, and provides intelligent feedback and ATS (Applicant Tracking System) insights to help users improve their job applications.

## 🚀 Live Demo

- **Frontend:** [project-ai-resume-analyzer-94f4.vercel.app](https://project-ai-resume-analyzer-94f4.vercel.app)
- **Backend API:** [project-ai-resume-analyzer-tau.vercel.app](https://project-ai-resume-analyzer-tau.vercel.app)

## ✨ Features

- 📄 Upload your resume (PDF)
- 🤖 AI-powered analysis using Groq's LLM API
- 📊 Get feedback and insights to improve your resume
- ⚡ Fast, serverless architecture deployed on Vercel

## 🛠️ Tech Stack

- **Frontend:** React (deployed on Vercel)
- **Backend:** Python (FastAPI), deployed on Vercel as serverless functions
- **Database:** Supabase (PostgreSQL)
- **AI Provider:** Groq API
- **Hosting:** Vercel

## 📦 Project Structure

```
Project-AI-Resume-Analyzer/
├── backend/            # FastAPI backend (handles resume parsing & AI analysis)
│   ├── requirements.txt
│   └── ...
├── frontend/           # React frontend (upload UI, results display)
│   └── ...
└── README.md
```

## ⚙️ Environment Variables

The backend requires the following environment variable to be set in Vercel:

| Variable        | Description                          |
|-----------------|---------------------------------------|
| `GROQ_API_KEY`  | API key for Groq's LLM API (used for resume analysis) |

> ⚠️ Never commit API keys to the repository or share them in chats/screenshots. Keep them only in Vercel's Environment Variables settings.

## 🧑‍💻 Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Asmajavaid1270/Project-AI-Resume-Analyzer.git
   cd Project-AI-Resume-Analyzer
   ```

2. **Backend setup:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
   Create a `.env` file with:
   ```
   GROQ_API_KEY=your_key_here
   ```

3. **Frontend setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🚢 Deployment

This project is deployed on **Vercel**:
- The frontend and backend are deployed as **separate Vercel projects**.
- Pushing to the `main` branch on GitHub automatically triggers a new deployment on Vercel.
- After changing any environment variable in Vercel, a manual **Redeploy** is required for changes to take effect.

## 📝 Recent Updates

- Migrated database to **Supabase (PostgreSQL)**
- Fixed Vercel deployment and environment variable configuration issues
- Rotated and secured Groq API key

## 📄 License

This project is open for educational and personal use.
