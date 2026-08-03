# 🤖 AI Interview & Resume Assistant

An AI-powered full-stack web application that helps users analyze resumes, improve ATS scores, prepare for interviews, and interact with their resume using Retrieval-Augmented Generation (RAG).

## 🚀 Features

### 👤 Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes

### 📄 Resume Management
- Upload Resume (PDF/DOCX)
- Resume Parsing
- Resume Storage

### 🤖 AI Features
- ATS Resume Analysis
- Resume Chatbot (RAG)
- Job Description Matching
- AI Interview Question Generator
- Personalized Interview Feedback

### 🧠 Retrieval-Augmented Generation (RAG)
- Resume Chunking
- Vector Embeddings
- ChromaDB Vector Database
- Semantic Search
- Context-Aware AI Responses

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Tailwind CSS
- React Router
- Axios

## Backend
- FastAPI
- SQLAlchemy
- SQLite
- JWT Authentication

## AI
- Gemini API / OpenAI API
- LangChain
- ChromaDB
- Sentence Transformers

## Utilities
- PyMuPDF
- python-docx

---

# 📂 Project Structure

```text
AI-Interview-Assistant/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── services/
│   │   ├── rag/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── auth.py
│   │   ├── config.py
│   │   ├── dependencies.py
│   │   └── utils.py
│   │
│   ├── uploads/
│   ├── chroma_db/
│   ├── ai_interview.db
│   ├── requirements.txt
│   └── venv/
│
├── README.md
└── .gitignore
```

---

# ⚙️ Backend Setup

## Clone Repository

```bash
git clone <repository-url>
cd AI-Interview-Assistant
```

## Create Virtual Environment

```bash
cd backend
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Run Backend

```bash
uvicorn app.main:app --reload
```

Backend URL

```
http://127.0.0.1:8000
```

Swagger Documentation

```
http://127.0.0.1:8000/docs
```

---

# 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

# 📌 Development Roadmap

## Phase 1
- [x] Project Setup
- [x] FastAPI Backend
- [x] SQLite Database
- [ ] User Authentication
- [ ] React Frontend Setup

## Phase 2
- [ ] Resume Upload
- [ ] Resume Parser
- [ ] File Storage

## Phase 3
- [ ] ChromaDB Integration
- [ ] Embedding Generation
- [ ] Semantic Search

## Phase 4
- [ ] RAG Chatbot
- [ ] ATS Resume Analysis
- [ ] Resume Suggestions

## Phase 5
- [ ] Job Description Matching
- [ ] AI Interview Generator
- [ ] Interview Feedback

## Phase 6
- [ ] Deployment
- [ ] Docker
- [ ] CI/CD

---

# 📦 Backend Dependencies

- FastAPI
- Uvicorn
- SQLAlchemy
- SQLite
- Pydantic
- python-jose
- passlib
- python-dotenv
- python-multipart
- LangChain
- ChromaDB
- Sentence Transformers
- Google Generative AI
- PyMuPDF
- python-docx

---

# 🎯 Learning Objectives

This project demonstrates:

- Full-Stack Development
- FastAPI
- React.js
- REST API Development
- JWT Authentication
- SQLAlchemy ORM
- SQLite
- Retrieval-Augmented Generation (RAG)
- Vector Databases
- ChromaDB
- Embeddings
- Semantic Search
- Prompt Engineering
- Large Language Models (LLMs)
- AI Application Development

---

# 👨‍💻 Author

**Manoj Veturi**

- GitHub: https://github.com/your-username

---

## 📜 License

This project is licensed under the MIT License.
