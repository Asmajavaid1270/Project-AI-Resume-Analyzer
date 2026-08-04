# 🤖 AI Resume Analyzer

A smart, AI-powered web application that analyzes your CV/resume and gives instant, detailed feedback to help you land your dream job.

## 🔗 Live Demo

- **Frontend:** [project-ai-resume-analyzer-94f4.vercel.app](https://project-ai-resume-analyzer-94f4.vercel.app)
- **Backend API:** [project-ai-resume-analyzer-tau.vercel.app](https://project-ai-resume-analyzer-tau.vercel.app)
- **GitHub:** [https://github.com/Asmajavaid1270/Project-AI-Resume-Analyzer](https://github.com/Asmajavaid1270/Project-AI-Resume-Analyzer)

## ✨ Key Features

- 📄 Upload your CV in **PDF or DOCX** format
- ⭐ Get an **AI-powered score out of 10**
- ✅ See your **strengths** highlighted
- ❌ Know your **weaknesses** clearly
- 💡 Get **personalized suggestions** to improve
- 🎯 **Job Description Match %** — paste any job description and see how well your CV matches
- 💬 **Chat with AI** about your resume — ask anything!
- 📥 **Download PDF report** of your analysis
- 🌍 Works across multiple fields — CS/IT, Medical, Engineering, Food Science, MLT

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python + FastAPI |
| Frontend | React + Vite |
| AI Engine | Groq API (LLaMA 3.3 70B) |
| Database | Supabase (PostgreSQL) |
| Backend Hosting | Vercel |
| Frontend Hosting | Vercel |
| Version Control | Git + GitHub |

> **Note:** This project was migrated from SQLite → Supabase (PostgreSQL) and from Railway → Vercel for backend hosting. Update this table further if login/auth or other features change.

## 📦 Project Structure

```
Project-AI-Resume-Analyzer/
├── backend/            # FastAPI backend (resume parsing, AI analysis, API routes)
│   ├── requirements.txt
│   └── ...
├── frontend/           # React + Vite frontend
│   └── ...
└── README.md
```

## ⚙️ Environment Variables

The backend requires the following environment variables (set in Vercel → Project → Environment Variables):

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | API key for Groq's LLaMA 3.3 70B model, used for resume analysis |
| `DATABASE_URL` / Supabase connection string | Connection to the Supabase PostgreSQL database |

> ⚠️ Never commit API keys or database credentials to the repository or share them publicly. Keep them only in Vercel's Environment Variables settings.

## 🧑‍💻 Local Setup

1. **Clone the repository:**
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
   DATABASE_URL=your_supabase_connection_string
   ```
   Run the backend:
   ```bash
   uvicorn main:app --reload
   ```

3. **Frontend setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🚢 Deployment

- Both **backend** and **frontend** are deployed on **Vercel** as separate projects.
- Pushing to the `main` branch on GitHub triggers automatic redeployment on Vercel.
- After changing any environment variable in Vercel, a manual **Redeploy** is required for changes to take effect (Deployments tab → "..." → Redeploy).

## 📚 Concepts Learned & Applied

- REST API design with FastAPI
- Database management with Supabase (PostgreSQL)
- File handling — PDF & DOCX parsing
- React hooks & state management
- Frontend-backend integration (CORS)
- Environment variables & API key security
- Serverless deployment on Vercel
- Git & GitHub version control
- AI API integration (Groq / LLaMA)
- Responsive UI with dark theme

## ⚡ Challenges Faced

- 🔧 Migrating database from SQLite to Supabase (PostgreSQL)
- 🔧 Fixing Vercel deployment/build configuration issues
- 🔧 API key security — keeping keys out of chats and commits, rotating revoked keys
- 🔧 CORS issues between frontend & backend
- 🔧 Finding the right free AI API — tried Anthropic, Gemini, OpenRouter before settling on Groq

## 🙏 What's Next

- Adding more fields & languages
- Improving AI analysis quality
- Building more AI-powered projects!

## 📄 License

This project is open for educational and personal use.

---

Built as a student full-stack project. Feedback and suggestions are welcome!
