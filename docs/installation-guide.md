# Installation Guide

## Prerequisites

### Required Software
- **Node.js** 18+ (recommended: 20 LTS)
  - Download: https://nodejs.org
- **Python** 3.10+
  - Download: https://www.python.org/downloads/
- **Git** (optional, for cloning)
  - Download: https://git-scm.com

### Verify Installation
```bash
node --version    # Should show v18+ 
npm --version     # Should show 9+
python --version  # Should show 3.10+
pip --version     # Should show 23+
```

---

## Setup Instructions

### 1. Clone/Download the Project
```bash
git clone <repository-url>
cd Games_Project
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# (Recommended) Create a virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn app.main:app --reload --port 8000
```

The backend will be running at **http://localhost:8000**

Verify by visiting: http://localhost:8000/docs (Swagger UI)

### 3. Frontend Setup

Open a **new terminal**:

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be running at **http://localhost:5173**

### 4. Access the Application

Open your browser and navigate to: **http://localhost:5173**

---

## Project Structure

```
Games_Project/
├── frontend/           # React + TypeScript (Vite)
│   ├── src/
│   │   ├── features/   # Game feature modules
│   │   ├── components/ # Shared UI components
│   │   └── pages/      # Page components
│   ├── package.json
│   └── vite.config.ts
├── backend/            # Python FastAPI
│   ├── app/
│   │   ├── api/        # REST endpoints
│   │   ├── engine/     # AI algorithms
│   │   ├── models/     # Database models
│   │   └── schemas/    # Request/response schemas
│   └── requirements.txt
├── docs/               # Documentation
└── README.md
```

---

## Troubleshooting

### Backend Issues

**`ModuleNotFoundError: No module named 'chess'`**
```bash
pip install python-chess
```

**Port 8000 already in use:**
```bash
uvicorn app.main:app --reload --port 8001
```

### Frontend Issues

**`npm install` fails:**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules
npm install
```

**Tailwind styles not loading:**
Ensure `@import "tailwindcss"` is in `src/index.css`

### CORS Errors
The Vite dev server proxies `/api` requests to `localhost:8000`. Both servers must be running.
