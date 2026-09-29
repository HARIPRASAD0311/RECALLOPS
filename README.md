# RecallOps — SRE Incident Memory & Vector Intelligence

RecallOps is an AI-powered SRE Incident Memory Platform that indexes historical post-mortems, runs vector similarity searches, and synthesizes instant mitigation briefs, verified runbooks, and pre-deploy risk assessments to slash MTTR.

---

## 🏗️ Architecture

- **Frontend (`/frontend`)**: React 18 + Vite + TailwindCSS
  - **Incident Intelligence**: Real-time AI Resolution Briefs, root cause correlation, verified mitigation action plan, and post-mortem explorer.
  - **Search & Recall**: High-speed hybrid vector & semantic incident search.
  - **MTTR Analytics**: Live MTTR reduction metrics, baseline comparisons, and service savings.
  - **Pre-Deploy Risk**: Historical regression detection before releasing code.
  - **Post-Mortem Logger**: Ingest new incidents and instantly generate vector embeddings.
- **Backend (`/backend`)**: FastAPI + SQLAlchemy + SQLite + Vector Embeddings
  - **FastAPI Endpoints**: `/api/incidents`, `/api/search`, `/api/brief`, `/api/stats`, `/api/deploy-risk`, `/api/health`.
  - **Vector Similarity**: SentenceTransformer embeddings (`all-MiniLM-L6-v2`) with zero-dependency fallback.
  - **AI Engine**: Groq Llama 3.3 70B integration with deterministic schema-based fallback.

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt

# (Optional) Add your Groq API key to backend/.env
# GROQ_API_KEY=your_key_here

# Run backend (auto-seeds SQLite DB on first run):
python main.py
# Backend runs at http://127.0.0.1:8000
```

### 2. Frontend Setup

Option A (From Root Directory):
```bash
# Install root/frontend dependencies if needed
cd frontend && npm install && cd ..

# Start frontend dev server:
npm run dev
```

Option B (Directly inside `frontend/` directory):
```bash
cd frontend
npm install
npm run dev
# Frontend runs at http://localhost:3000 (proxies /api -> http://127.0.0.1:8000)
```

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | Health check and indexed incident count |
| `/api/incidents` | GET | List historical incidents with optional service filter |
| `/api/incidents` | POST | Ingest new post-mortem incident and generate embedding |
| `/api/incidents/{code}` | GET | Get detailed post-mortem by incident code |
| `/api/search` | POST | Perform semantic vector similarity search |
| `/api/brief?query=...` | GET | Synthesize AI incident mitigation brief |
| `/api/stats` | GET | MTTR metrics, baseline comparisons, and analytics |
| `/api/deploy-risk` | POST | Pre-deploy risk evaluation |

---

## 🌿 Branch Info
- Branch: `front-back-integration` (integrates `frontend` and `srinivas-work` branches)
