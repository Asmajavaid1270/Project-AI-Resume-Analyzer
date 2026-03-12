import { useState } from "react";

function Bubble({ style }) {
  return <div style={{
    position: "fixed", borderRadius: "50%", opacity: 0.12,
    background: "radial-gradient(circle, #00ff88, transparent)",
    animation: `float ${style.duration}s ease-in-out infinite`,
    pointerEvents: "none", ...style
  }} />;
}

function LoadingDots() {
  return (
    <div style={{ display: "flex", gap: "6px", alignItems: "center", padding: "12px 16px" }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00ff88", animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
    </div>
  );
}

function ScoreCircle({ score }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;
  const color = score >= 7 ? "#00ff88" : score >= 5 ? "#ffaa00" : "#ff6666";
  const label = score >= 7 ? "Great Resume! 🎉" : score >= 5 ? "Average Resume 📈" : "Needs Improvement ⚠️";
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <svg width="180" height="180" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="90" cy="90" r={radius} fill="none" stroke="#1a1a2e" strokeWidth="12" />
        <circle cx="90" cy="90" r={radius} fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={circumference} strokeDashoffset={circumference - progress}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease", filter: `drop-shadow(0 0 8px ${color})` }} />
      </svg>
      <div style={{ marginTop: "-130px", position: "relative" }}>
        <div style={{ fontSize: "3.5rem", fontWeight: "bold", color, textShadow: `0 0 20px ${color}` }}>{score}</div>
        <div style={{ color: "#666", fontSize: "1rem" }}>/10</div>
      </div>
      <div style={{ marginTop: "20px", color, fontSize: "1.1rem", fontWeight: "bold" }}>{label}</div>
    </div>
  );
}

function ChatMessage({ msg, onFollowUp }) {
  const mainContent = msg.content.split(/\[Q\d+\]:/)[0];
  const followUps = msg.content.match(/\[Q\d+\]:\s*(.+)/g)?.map(q => q.replace(/\[Q\d+\]:\s*/, "").trim()) || [];
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ maxWidth: "80%", padding: "14px 18px", borderRadius: "18px", background: msg.role === "user" ? "linear-gradient(135deg, #00ff88, #00aaff)" : "rgba(255,255,255,0.05)", color: msg.role === "user" ? "#0a0a15" : "#ddd", fontSize: "0.95rem", lineHeight: "1.7", border: msg.role === "assistant" ? "1px solid #ffffff11" : "none", marginLeft: msg.role === "user" ? "auto" : "0" }}>
        <span dangerouslySetInnerHTML={{__html: mainContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')}} />
      </div>
      {followUps.length > 0 && (
        <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <p style={{ color: "#666", fontSize: "0.8rem", margin: "0 0 4px 0" }}>💬 Continue the conversation:</p>
          {followUps.map((q, i) => (
            <button key={i} onClick={() => onFollowUp(q)}
              style={{ alignSelf: "flex-start", padding: "8px 16px", background: "rgba(0,170,255,0.08)", border: "1px solid #00aaff33", borderRadius: "20px", color: "#00aaff", fontSize: "0.85rem", cursor: "pointer", transition: "all 0.2s" }}
              onMouseOver={e => e.target.style.background = "rgba(0,170,255,0.2)"}
              onMouseOut={e => e.target.style.background = "rgba(0,170,255,0.08)"}>
              💬 {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const fieldRoles = {
  "Computer Science / IT": ["Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist", "Machine Learning Engineer", "DevOps Engineer", "Mobile App Developer", "Cybersecurity Analyst"],
  "Medical / Healthcare": ["Doctor", "Nurse", "Pharmacist", "Dentist", "Physiotherapist", "Medical Officer", "Healthcare Administrator"],
  "Engineering": ["Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "Chemical Engineer", "Structural Engineer", "Project Engineer"],
  "Food Science / Nutrition": ["Food Scientist", "Nutritionist", "Dietitian", "Food Safety Officer", "Quality Control Analyst", "Food Technologist"],
  "MLT / Lab Sciences": ["Medical Lab Technologist", "Lab Technician", "Clinical Biochemist", "Microbiologist", "Histopathologist", "Research Assistant"],
};

export default function App() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [cvText, setCvText] = useState("");
  const [error, setError] = useState("");
  const [fileError, setFileError] = useState("");
  const [cvScore, setCvScore] = useState(null);
  const [field, setField] = useState("Computer Science / IT");
  const [jobRole, setJobRole] = useState("Overall / General");
  const [specificRole, setSpecificRole] = useState(false);
  const [jobDesc, setJobDesc] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);

  // Auth states
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ username: "", email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const bubbles = [
    { width: 80, height: 80, left: "5%", top: "10%", duration: 6 },
    { width: 120, height: 120, left: "85%", top: "15%", duration: 8 },
    { width: 60, height: 60, left: "15%", top: "70%", duration: 5 },
    { width: 100, height: 100, left: "75%", top: "60%", duration: 7 },
    { width: 40, height: 40, left: "45%", top: "85%", duration: 4 },
    { width: 90, height: 90, left: "60%", top: "35%", duration: 9 },
  ];

  const suggestedQuestions = [
    "💪 How can I improve my resume?",
    "🛠️ What skills should I add?",
    "📁 How to improve projects section?",
    "📜 What certifications should I do?",
    "💼 Am I ready to apply for this role?",
    "✨ How to make my resume stand out?",
  ];

  const handleFieldChange = (e) => {
    const newField = e.target.value;
    setField(newField);
    setJobRole("Overall / General");
    setSpecificRole(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFileError("");
    if (!selectedFile) return;
    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(selectedFile.type)) { setFileError("❌ Only PDF or DOCX files are allowed!"); setFile(null); return; }
    if (selectedFile.size > 5 * 1024 * 1024) { setFileError("❌ File size must be less than 5MB!"); setFile(null); return; }
    setFile(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true); setAnalysis(""); setError("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("field", field);
    formData.append("job_role", jobRole);
    try {
      const res = await fetch("http://localhost:8000/analyze", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setAnalysis(data.analysis);
      setCvText(data.cv_text || "");
      setCvScore(data.score || null);
      setMessages([]);
      if (token && data.score) {
        await fetch("http://localhost:8000/save-history", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ field, job_role: jobRole, score: data.score, analysis: data.analysis })
        });
      }
    } catch (err) {
      setError("⚠️ Could not connect to backend! Make sure server is running.");
    }
    setLoading(false);
  };

  const handleChat = async (customMsg) => {
    const msg = customMsg || input;
    if (!msg.trim()) return;
    const userMsg = { role: "user", content: msg };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setChatLoading(true);
    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, cv_text: cvText }),
      });
      const data = await res.json();
      setMessages([...updatedMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages([...updatedMessages, { role: "assistant", content: "⚠️ AI connection failed!" }]);
    }
    setChatLoading(false);
  };

  const handleMatchCheck = async () => {
    if (!cvText || !jobDesc.trim()) return;
    setMatchLoading(true); setMatchResult(null);
    try {
      const res = await fetch("http://localhost:8000/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv_text: cvText, job_description: jobDesc }),
      });
      const data = await res.json();
      setMatchResult(data);
    } catch (err) {
      setMatchResult({ percentage: 0, details: "⚠️ Connection failed!" });
    }
    setMatchLoading(false);
  };

  const handleDownloadReport = async () => {
    if (!analysis || !cvScore) return;
    try {
      const res = await fetch("http://localhost:8000/download-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis, score: cvScore, field, job_role: jobRole }),
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "resume_report.pdf"; a.click();
    } catch (err) {
      alert("⚠️ Could not download report!");
    }
  };

  const handleAuth = async () => {
    setAuthLoading(true); setAuthError("");
    try {
      const url = authMode === "login" ? "http://localhost:8000/login" : "http://localhost:8000/register";
      const body = authMode === "login"
        ? { email: authForm.email, password: authForm.password }
        : { username: authForm.username, email: authForm.email, password: authForm.password };
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Error!");
      if (authMode === "login") {
        setUser({ username: data.username, email: data.email });
        setToken(data.token);
        setShowAuth(false);
      } else {
        setAuthMode("login");
        setAuthError("✅ Account created! Please login.");
      }
    } catch (err) {
      setAuthError(err.message);
    }
    setAuthLoading(false);
  };

  const handleGetHistory = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/history", { headers: { "Authorization": `Bearer ${token}` } });
      const data = await res.json();
      setHistory(data.history || []);
      setShowHistory(true);
    } catch (err) {
      console.log(err);
    }
  };

  const parseAnalysis = (text) => {
    const lines = text.split("\n").filter(l => l.trim());
    const sections = { score: "", strengths: [], weaknesses: [], suggestions: [] };
    let current = "";
    lines.forEach(line => {
      if (line.match(/score/i)) { sections.score = line; current = "score"; }
      else if (line.match(/strength/i)) current = "strengths";
      else if (line.match(/weakness/i)) current = "weaknesses";
      else if (line.match(/suggest/i)) current = "suggestions";
      else if (line.trim().match(/^\d+\./) || line.trim().startsWith("*")) {
        const clean = line.replace(/\*\*/g, "").replace(/^\d+\.\s*/, "").replace(/^\*+\s*/, "").trim();
        if (current === "strengths") sections.strengths.push(clean);
        else if (current === "weaknesses") sections.weaknesses.push(clean);
        else if (current === "suggestions") sections.suggestions.push(clean);
      }
    });
    return sections;
  };

  const parsed = analysis ? parseAnalysis(analysis) : null;

  return (
    <>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-30px) scale(1.1)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bounce { 0%,100%{transform:translateY(0);opacity:0.4} 50%{transform:translateY(-8px);opacity:1} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .card { animation: fadeIn 0.5s ease forwards }
        select option { background: #1a1a2e; color: white; }
        input::placeholder { color: #444; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0a0a15", padding: "40px 20px", fontFamily: "'Segoe UI', sans-serif", position: "relative", overflow: "hidden" }}>
        {bubbles.map((b, i) => <Bubble key={i} style={b} />)}

        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ fontSize: "60px", animation: "float 3s ease-in-out infinite" }}>🤖</div>
            <h1 style={{ color: "#00ff88", fontSize: "2.8rem", margin: "10px 0", textShadow: "0 0 30px #00ff8866" }}>AI Resume Analyzer</h1>
            <p style={{ color: "#888", fontSize: "1.1rem" }}>Upload your resume and get instant AI-powered feedback!</p>

            {/* Auth Buttons */}
            <div style={{ marginTop: "15px", display: "flex", justifyContent: "center", gap: "10px" }}>
              {user ? (
                <>
                  <span style={{ color: "#00ff88", padding: "8px 16px", background: "rgba(0,255,136,0.1)", borderRadius: "20px" }}>👋 {user.username}</span>
                  <button onClick={handleGetHistory} style={{ padding: "8px 16px", background: "rgba(0,170,255,0.1)", border: "1px solid #00aaff33", borderRadius: "20px", color: "#00aaff", cursor: "pointer" }}>📋 History</button>
                  <button onClick={() => { setUser(null); setToken(null); }} style={{ padding: "8px 16px", background: "rgba(255,100,100,0.1)", border: "1px solid #ff666633", borderRadius: "20px", color: "#ff8888", cursor: "pointer" }}>Logout</button>
                </>
              ) : (
                <>
                  <button onClick={() => { setShowAuth(true); setAuthMode("login"); }} style={{ padding: "8px 20px", background: "rgba(0,255,136,0.1)", border: "1px solid #00ff8833", borderRadius: "20px", color: "#00ff88", cursor: "pointer", fontWeight: "bold" }}>🔐 Login</button>
                  <button onClick={() => { setShowAuth(true); setAuthMode("register"); }} style={{ padding: "8px 20px", background: "linear-gradient(135deg, #00ff88, #00aaff)", border: "none", borderRadius: "20px", color: "#0a0a15", cursor: "pointer", fontWeight: "bold" }}>✨ Sign Up</button>
                </>
              )}
            </div>
          </div>

          {/* Auth Modal */}
          {showAuth && (
            <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: "#0d0d1a", border: "1px solid #00ff8833", borderRadius: "24px", padding: "40px", width: "380px", position: "relative" }}>
                <button onClick={() => setShowAuth(false)} style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", color: "#666", fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
                <h2 style={{ color: "#00ff88", marginTop: 0, textAlign: "center" }}>{authMode === "login" ? "🔐 Login" : "✨ Sign Up"}</h2>
                {authMode === "register" && (
                  <input value={authForm.username} onChange={e => setAuthForm({...authForm, username: e.target.value})}
                    placeholder="Username" style={{ width: "100%", padding: "12px", marginBottom: "12px", borderRadius: "12px", border: "1px solid #00ff8833", background: "rgba(255,255,255,0.03)", color: "white", fontSize: "1rem", outline: "none", boxSizing: "border-box" }} />
                )}
                <input value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})}
                  placeholder="Email" type="email" style={{ width: "100%", padding: "12px", marginBottom: "12px", borderRadius: "12px", border: "1px solid #00ff8833", background: "rgba(255,255,255,0.03)", color: "white", fontSize: "1rem", outline: "none", boxSizing: "border-box" }} />
                <input value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})}
                  placeholder="Password" type="password" onKeyPress={e => e.key === "Enter" && handleAuth()} style={{ width: "100%", padding: "12px", marginBottom: "12px", borderRadius: "12px", border: "1px solid #00ff8833", background: "rgba(255,255,255,0.03)", color: "white", fontSize: "1rem", outline: "none", boxSizing: "border-box" }} />
                {authError && <p style={{ color: authError.startsWith("✅") ? "#00ff88" : "#ff8888", fontSize: "0.9rem", marginBottom: "10px" }}>{authError}</p>}
                <button onClick={handleAuth} disabled={authLoading}
                  style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #00ff88, #00aaff)", color: "#0a0a15", border: "none", borderRadius: "12px", fontSize: "1.1rem", fontWeight: "bold", cursor: "pointer" }}>
                  {authLoading ? "Please wait..." : authMode === "login" ? "Login" : "Create Account"}
                </button>
                <p style={{ color: "#666", textAlign: "center", marginTop: "15px", fontSize: "0.9rem" }}>
                  {authMode === "login" ? "No account? " : "Already have account? "}
                  <span onClick={() => { setAuthMode(authMode === "login" ? "register" : "login"); setAuthError(""); }} style={{ color: "#00ff88", cursor: "pointer" }}>
                    {authMode === "login" ? "Sign Up" : "Login"}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* History Modal */}
          {showHistory && (
            <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: "#0d0d1a", border: "1px solid #00aaff33", borderRadius: "24px", padding: "40px", width: "500px", maxHeight: "70vh", overflowY: "auto", position: "relative" }}>
                <button onClick={() => setShowHistory(false)} style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", color: "#666", fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
                <h2 style={{ color: "#00aaff", marginTop: 0 }}>📋 Analysis History</h2>
                {history.length === 0 ? <p style={{ color: "#666" }}>No history yet!</p> : history.map((h, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #ffffff11", borderRadius: "12px", padding: "15px", marginBottom: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ color: "#00ff88", fontWeight: "bold" }}>{h.field}</span>
                        <span style={{ color: "#888", margin: "0 8px" }}>→</span>
                        <span style={{ color: "#00aaff" }}>{h.job_role}</span>
                      </div>
                      <span style={{ color: h.score >= 7 ? "#00ff88" : h.score >= 5 ? "#ffaa00" : "#ff6666", fontWeight: "bold", fontSize: "1.2rem" }}>{h.score}/10</span>
                    </div>
                    <p style={{ color: "#555", fontSize: "0.8rem", margin: "5px 0 0 0" }}>{new Date(h.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Card */}
          <div className="card" style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)", border: "1px solid #00ff8822", borderRadius: "24px", padding: "30px", marginBottom: "25px" }}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ color: "#00ff88", fontSize: "0.95rem", fontWeight: "bold", display: "block", marginBottom: "8px" }}>🎓 Select Your Field:</label>
              <select value={field} onChange={handleFieldChange} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #00ff8833", background: "rgba(0,255,136,0.05)", color: "white", fontSize: "1rem", outline: "none", cursor: "pointer" }}>
                {Object.keys(fieldRoles).map((f, i) => <option key={i} value={f}>{f}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ color: "#00aaff", fontSize: "0.95rem", fontWeight: "bold", display: "block", marginBottom: "8px" }}>💼 Analyze for specific role? (Optional)</label>
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <button onClick={() => { setSpecificRole(false); setJobRole("Overall / General"); }} style={{ padding: "8px 18px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: "bold", background: !specificRole ? "linear-gradient(135deg, #00ff88, #00aaff)" : "rgba(255,255,255,0.05)", color: !specificRole ? "#0a0a15" : "#888" }}>Overall {field}</button>
                <button onClick={() => { setSpecificRole(true); setJobRole(fieldRoles[field][0]); }} style={{ padding: "8px 18px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: "bold", background: specificRole ? "linear-gradient(135deg, #00ff88, #00aaff)" : "rgba(255,255,255,0.05)", color: specificRole ? "#0a0a15" : "#888" }}>Specific Role</button>
              </div>
              {specificRole && (
                <select value={jobRole} onChange={e => setJobRole(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #00aaff33", background: "rgba(0,170,255,0.05)", color: "white", fontSize: "1rem", outline: "none", cursor: "pointer" }}>
                  {fieldRoles[field].map((role, i) => <option key={i} value={role}>{role}</option>)}
                </select>
              )}
            </div>
            <div style={{ border: `2px dashed ${fileError ? "#ff6666" : "#00ff8844"}`, borderRadius: "16px", padding: "40px", textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>📄</div>
              <input type="file" accept=".pdf,.docx" onChange={handleFileChange} style={{ color: "#aaa" }} />
              {file && !fileError && <p style={{ color: "#00ff88", fontWeight: "bold", marginTop: "10px" }}>✅ {file.name} ({(file.size/1024).toFixed(1)} KB)</p>}
              {fileError && <p style={{ color: "#ff6666", marginTop: "10px", padding: "10px", background: "rgba(255,102,102,0.1)", borderRadius: "8px" }}>{fileError}</p>}
              <p style={{ color: "#555", fontSize: "0.85rem", marginTop: "8px" }}>PDF or DOCX • Max 5MB</p>
            </div>
            {error && <div style={{ background: "rgba(255,102,102,0.1)", border: "1px solid #ff666644", borderRadius: "12px", padding: "15px", marginBottom: "15px", color: "#ff8888", textAlign: "center" }}>{error}</div>}
            <button onClick={handleAnalyze} disabled={!file || loading || !!fileError}
              style={{ width: "100%", padding: "15px", background: loading ? "#1a1a2e" : (!file||fileError) ? "#222" : "linear-gradient(135deg, #00ff88, #00aaff)", color: loading ? "#00ff88" : (!file||fileError) ? "#555" : "#0a0a15", border: loading ? "1px solid #00ff8844" : "none", borderRadius: "14px", fontSize: "1.1rem", fontWeight: "bold", cursor: (!file||loading||fileError) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              {loading ? <><div style={{ width: "20px", height: "20px", border: "2px solid #00ff8833", borderTop: "2px solid #00ff88", borderRadius: "50%", animation: "spin 1s linear infinite" }} />Analyzing...</> : `🚀 Analyze for ${jobRole}`}
            </button>
          </div>

          {/* Score + Cards */}
          {parsed && (
            <div style={{ marginBottom: "25px" }}>
              <div className="card" style={{ background: "rgba(0,255,136,0.05)", border: "1px solid #00ff8833", borderRadius: "24px", padding: "20px", marginBottom: "15px" }}>
                <h2 style={{ color: "#00ff88", margin: "0 0 5px 0", textAlign: "center" }}>⭐ Resume Score for {jobRole}</h2>
                {cvScore && <ScoreCircle score={cvScore} />}
                <div style={{ textAlign: "center", marginTop: "10px" }}>
                  <button onClick={handleDownloadReport} style={{ padding: "12px 30px", background: "linear-gradient(135deg, #00ff88, #00aaff)", color: "#0a0a15", border: "none", borderRadius: "14px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer" }}>
                    📥 Download PDF Report
                  </button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
                {[
                  { title: "✅ Strengths", items: parsed.strengths, color: "#00ff88", bg: "rgba(0,255,136,0.03)", border: "#00ff8833" },
                  { title: "❌ Weaknesses", items: parsed.weaknesses, color: "#ff6666", bg: "rgba(255,68,68,0.03)", border: "#ff444433" },
                  { title: "💡 Suggestions", items: parsed.suggestions, color: "#ffaa00", bg: "rgba(255,170,0,0.03)", border: "#ffaa0033" },
                ].map((section, si) => (
                  <div key={si} className="card" style={{ background: section.bg, border: `1px solid ${section.border}`, borderRadius: "20px", padding: "20px" }}>
                    <h3 style={{ color: section.color, margin: "0 0 15px 0" }}>{section.title}</h3>
                    {section.items.length > 0 ? section.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                        <span style={{ color: section.color }}>▶</span>
                        <span style={{ color: "#ccc", fontSize: "0.9rem", lineHeight: "1.5" }}>{item}</span>
                      </div>
                    )) : <p style={{ color: "#555" }}>None found</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Job Match */}
          <div className="card" style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)", border: "1px solid #aa00ff22", borderRadius: "24px", padding: "30px", marginBottom: "25px" }}>
            <h2 style={{ color: "#aa00ff", marginTop: 0 }}>🎯 Job Description Match</h2>
            <hr style={{ border: "1px solid #ffffff11", marginBottom: "20px" }} />
            <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)}
              placeholder="Paste the job description here..."
              style={{ width: "100%", minHeight: "120px", padding: "14px", borderRadius: "14px", border: "1px solid #aa00ff33", background: "rgba(170,0,255,0.05)", color: "white", fontSize: "0.95rem", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
            <button onClick={handleMatchCheck} disabled={!cvText || !jobDesc.trim() || matchLoading}
              style={{ width: "100%", marginTop: "12px", padding: "14px", background: (!cvText||!jobDesc.trim()||matchLoading) ? "#222" : "linear-gradient(135deg, #aa00ff, #ff00aa)", color: (!cvText||!jobDesc.trim()||matchLoading) ? "#555" : "white", border: "none", borderRadius: "14px", fontSize: "1.1rem", fontWeight: "bold", cursor: (!cvText||!jobDesc.trim()||matchLoading) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              {matchLoading ? <><div style={{ width: "20px", height: "20px", border: "2px solid #aa00ff33", borderTop: "2px solid #aa00ff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />Checking...</> : "🔍 Check Match"}
            </button>
            {matchResult && (
              <div style={{ marginTop: "20px" }}>
                <div style={{ textAlign: "center", marginBottom: "15px" }}>
                  <div style={{ fontSize: "3.5rem", fontWeight: "bold", color: matchResult.percentage >= 70 ? "#00ff88" : matchResult.percentage >= 50 ? "#ffaa00" : "#ff6666" }}>{matchResult.percentage}%</div>
                  <div style={{ color: "#888" }}>Match Score</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "15px", color: "#ccc", lineHeight: "1.7" }}
                  dangerouslySetInnerHTML={{__html: matchResult.details.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#aa00ff">$1</strong>').replace(/\n/g, '<br/>')}} />
              </div>
            )}
          </div>

          {/* Chat */}
          <div className="card" style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)", border: "1px solid #00aaff22", borderRadius: "24px", padding: "30px" }}>
            <h2 style={{ color: "#00aaff", marginTop: 0 }}>💬 Ask AI About Your Resume</h2>
            <hr style={{ border: "1px solid #ffffff11", marginBottom: "20px" }} />
            {cvText && (
              <div style={{ marginBottom: "15px" }}>
                <p style={{ color: "#666", fontSize: "0.85rem", marginBottom: "8px" }}>💡 Quick questions:</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {suggestedQuestions.map((q, i) => (
                    <button key={i} onClick={() => handleChat(q.replace(/^[^\w]+/, ""))}
                      style={{ padding: "7px 14px", background: "rgba(0,255,136,0.07)", border: "1px solid #00ff8833", borderRadius: "20px", color: "#00ff88", fontSize: "0.82rem", cursor: "pointer", transition: "all 0.2s" }}
                      onMouseOver={e => e.target.style.background = "rgba(0,255,136,0.2)"}
                      onMouseOut={e => e.target.style.background = "rgba(0,255,136,0.07)"}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {!cvText && <p style={{ color: "#555", textAlign: "center", fontSize: "0.9rem", marginBottom: "15px" }}>Please analyze your resume first!</p>}
            <div style={{ minHeight: "200px", maxHeight: "400px", overflowY: "auto", marginBottom: "15px" }}>
              {messages.length === 0 && <p style={{ color: "#444", textAlign: "center", marginTop: "80px" }}>Ask anything about your resume...</p>}
              {messages.map((msg, i) => <ChatMessage key={i} msg={msg} onFollowUp={handleChat} />)}
              {chatLoading && <div style={{ display: "flex" }}><div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "18px", border: "1px solid #ffffff11" }}><LoadingDots /></div></div>}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === "Enter" && handleChat()}
                placeholder={cvText ? "Type your question..." : "Analyze resume first..."}
                style={{ flex: 1, padding: "12px 16px", borderRadius: "14px", border: "2px solid #ffffff11", background: "rgba(255,255,255,0.03)", color: "white", fontSize: "1rem", outline: "none" }} />
              <button onClick={() => handleChat()} disabled={chatLoading || !input.trim()}
                style={{ padding: "12px 24px", background: "linear-gradient(135deg, #00ff88, #00aaff)", color: "#0a0a15", border: "none", borderRadius: "14px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer" }}>
                Send 🚀
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
