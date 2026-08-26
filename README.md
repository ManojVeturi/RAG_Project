# 🤖 AI Enterprise Support & Knowledge Agent

An AI-powered enterprise support and knowledge management platform that enables employees to interact with company documents using **Retrieval-Augmented Generation (RAG)**.

The system allows administrators to securely manage enterprise knowledge, while employees can ask natural-language questions and receive **context-aware, source-cited answers** based on the organization's internal documents.

If the required information cannot be found in the knowledge base, the system avoids hallucinating and can automatically generate a **support ticket** for further assistance.

---

## 🚀 Key Features

### 🔐 1. Enterprise Authentication

Secure authentication and role-based authorization using JWT.

**Admin**

* Upload enterprise documents
* Delete documents
* Manage the knowledge base
* View system analytics
* Manage support tickets

**Employee**

* Ask questions
* Search enterprise knowledge
* View conversation history
* Create support tickets

---

### 📚 2. Enterprise Knowledge Base

Administrators can upload and manage company documents in multiple formats:

* PDF
* DOCX
* TXT
* Markdown

Example knowledge base:

```text
knowledge_base/
├── HR_Policy.pdf
├── Employee_Handbook.pdf
├── Leave_Policy.pdf
├── IT_Support_Guide.pdf
├── Security_Policy.pdf
└── Product_Documentation.pdf
```

Uploaded documents are processed and converted into searchable vector representations.

---

### 🧠 3. Retrieval-Augmented Generation (RAG)

The core of the application is a RAG pipeline that combines semantic search with an LLM.

#### Document Ingestion Pipeline

```text
Enterprise Documents
        ↓
Document Parser
        ↓
Text Extraction
        ↓
Text Chunking
        ↓
Embeddings
        ↓
ChromaDB
```

#### Question Answering Pipeline

```text
Employee Question
        ↓
Question Embedding
        ↓
ChromaDB Semantic Search
        ↓
Top-K Relevant Chunks
        ↓
Context Construction
        ↓
LLM
        ↓
Grounded Answer
```

This allows employees to ask questions using natural language without needing to know the exact terminology used inside company documents.

For example:

> "How can I get money back for business travel?"

can retrieve information from a document titled:

> "Travel Expense Reimbursement Procedure"

---

### 💬 4. AI Enterprise Support Chat

Employees can interact with the AI assistant through a conversational interface.

Example questions:

```text
How many casual leaves can I take?

How do I reset my company laptop?

What is the reimbursement process?

What are the company's password security requirements?

How can I access the VPN?
```

The AI generates answers using information retrieved from the enterprise knowledge base.

---

### 📌 5. Source Citations

Every knowledge-grounded response can include its source document and page information.

Example:

```text
You can take 12 casual leaves per year.

Source:
Employee Leave Policy — Page 4
```

Source citations improve transparency and make it easier for employees to verify AI-generated responses.

---

### 🚫 6. Hallucination Control

The system is designed to avoid generating unsupported answers.

If the required information does not exist in the enterprise knowledge base, the assistant responds:

```text
I couldn't find this information in the company knowledge base.
```

Instead of allowing the LLM to invent an answer, the system can suggest creating a support ticket.

This provides an important reliability layer for enterprise AI applications.

---

### 🔎 7. Semantic Knowledge Search

The application uses vector embeddings and ChromaDB to perform semantic search.

For example:

```text
User:
How can I get money back for business travel?
```

The system can retrieve:

```text
Travel Expense Reimbursement Procedure
```

even though the user's wording does not exactly match the document.

---

### 🎫 8. Support Ticket Generation

When the AI cannot resolve an employee's issue, the employee can create a support ticket.

Example:

```text
AI couldn't resolve your issue.

Create Support Ticket?
```

A ticket can contain:

```text
Ticket #1042

Issue:
Unable to access company VPN

Priority:
Medium

Category:
IT Support

Status:
Open
```

Administrators can then review and manage unresolved issues.

---

### 🤖 9. AI Ticket Classification

The system can automatically classify newly created tickets using the LLM.

```text
Employee Problem
       ↓
      LLM
       ↓
 ┌─────┼──────────┐
 ↓     ↓          ↓
Category Priority Summary
```

Example:

```text
Category: IT Support
Priority: High
Summary: Employee unable to access company VPN
```

This reduces manual ticket triaging and helps support teams prioritize issues.

---

### 📊 10. Admin Dashboard

Administrators can monitor the overall performance of the platform.

Example metrics:

```text
Total Questions       1,284
Resolved Questions      972
Open Tickets             42
Knowledge Documents      86
Active Employees        241
```

The dashboard can also display:

* Most frequently asked questions
* Failed queries
* Ticket categories
* Resolution rate
* Knowledge-base usage
* Support ticket trends
* Document usage

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │    React Frontend    │
                         │  Employee / Admin UI │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      FastAPI API     │
                         │   REST API Backend   │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌─────────────┐       ┌─────────────┐      ┌─────────────┐
       │   SQLite    │       │    JWT      │      │   Support   │
       │   Database  │       │    Auth     │      │   Tickets   │
       └─────────────┘       └─────────────┘      └─────────────┘
                                    │
                                    ▼
                           ┌─────────────────┐
                           │   RAG Pipeline  │
                           └────────┬────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     │                             │
                     ▼                             ▼
             ┌──────────────┐             ┌────────────────┐
             │   ChromaDB   │             │  Gemini / LLM  │
             │ Vector Store │             │ Answer Engine  │
             └───────▲──────┘             └────────┬───────┘
                     │                             │
                     │                             │
             ┌───────┴────────┐                    │
             │  Enterprise    │────────────────────┘
             │   Documents    │
             └────────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

```text
React.js
Tailwind CSS
Axios
React Router
Recharts
```

## Backend

```text
FastAPI
SQLAlchemy
SQLite
Pydantic
JWT Authentication
```

## AI / RAG

```text
Gemini API
LangChain
ChromaDB
Sentence Transformers
```

## Document Processing

```text
PyMuPDF
python-docx
```

---

# 📂 Project Structure

```text
AI-Enterprise-Support-Knowledge-Agent/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── App.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── config.py
│   │   ├── dependencies.py
│   │   ├── utils.py
│   │   │
│   │   ├── auth/
│   │   │   └── auth.py
│   │   │
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── chat.py
│   │   │   ├── documents.py
│   │   │   ├── tickets.py
│   │   │   └── admin.py
│   │   │
│   │   ├── rag/
│   │   │   ├── chroma.py
│   │   │   ├── retriever.py
│   │   │   ├── generator.py
│   │   │   └── pipeline.py
│   │   │
│   │   └── services/
│   │       ├── parser.py
│   │       ├── embedding_service.py
│   │       ├── ticket_service.py
│   │       └── analytics_service.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── knowledge_base/
│
├── .gitignore
└── README.md
```

---

# ⚙️ How It Works

## 1. Admin Uploads a Document

```text
Admin
  ↓
Upload PDF/DOCX/TXT/MD
  ↓
Document Parser
  ↓
Extract Text
```

## 2. Document Is Indexed

```text
Extracted Text
      ↓
Text Chunking
      ↓
Embedding Model
      ↓
Vector Embeddings
      ↓
ChromaDB
```

## 3. Employee Asks a Question

```text
Employee
   ↓
Question
   ↓
Embedding
   ↓
ChromaDB
   ↓
Relevant Chunks
```

## 4. LLM Generates the Answer

```text
Question + Retrieved Context
            ↓
           LLM
            ↓
    Grounded Response
            ↓
      Source Citation
```

## 5. If No Relevant Information Exists

```text
Question
   ↓
Knowledge Search
   ↓
No Relevant Information
   ↓
"I couldn't find this information..."
   ↓
Create Support Ticket
```

---

# 🔐 Security

The application uses several security mechanisms:

* JWT-based authentication
* Password hashing
* Role-based authorization
* Protected admin endpoints
* Environment variables for API keys
* Input validation using Pydantic
* Restricted document management
* Protected support-ticket operations

Sensitive credentials should never be committed to GitHub.

Create a `.env` file:

```env
DATABASE_URL=sqlite:///./enterprise.db

SECRET_KEY=your_secret_key

GEMINI_API_KEY=your_gemini_api_key
```

Add `.env` to `.gitignore`:

```gitignore
.env
__pycache__/
*.pyc
*.db
chroma/
node_modules/
dist/
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

```text
Python 3.11+
Node.js 18+
npm
Git
```

---

## Clone the Repository

```bash
git clone https://github.com/<your-username>/AI-Enterprise-Support-Knowledge-Agent.git

cd AI-Enterprise-Support-Knowledge-Agent
```

---

# 🐍 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create your `.env` file:

```env
SECRET_KEY=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=sqlite:///./enterprise.db
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

# ⚛️ Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will usually be available at:

```text
http://localhost:5173
```

---

# 🔌 Example API Flow

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Knowledge Base

```http
POST   /api/documents/upload
GET    /api/documents
DELETE /api/documents/{document_id}
```

### AI Chat

```http
POST /api/chat
GET  /api/chat/history
```

### Support Tickets

```http
POST /api/tickets
GET  /api/tickets
PUT  /api/tickets/{ticket_id}
```

### Analytics

```http
GET /api/admin/analytics
```

---

# 🧪 Example RAG Query

### User Input

```text
How many casual leaves can employees take?
```

### Retrieval

```text
Top relevant chunks:

1. Employee Leave Policy - Page 4
2. HR Handbook - Page 12
3. Employee Benefits - Page 8
```

### LLM Context

```text
Answer the question using only the provided context.

Context:
Employee Leave Policy - Page 4:
Employees are entitled to 12 casual leaves per year...
```

### Response

```text
Employees are entitled to 12 casual leaves per year.

Source:
Employee Leave Policy — Page 4
```

---

# 🎯 Project Goals

The project aims to demonstrate how modern AI technologies can be integrated into enterprise applications to improve:

* Employee productivity
* Internal knowledge discovery
* IT support
* HR support
* Document accessibility
* Support-ticket management
* AI reliability
* Enterprise knowledge management

---

# 🌟 Future Enhancements

Potential future improvements include:

* PostgreSQL for production deployment
* Redis caching
* Background document processing with Celery
* Role-specific knowledge bases
* Multi-tenant enterprise support
* Conversation memory
* Hybrid search
* Reranking models
* Advanced document metadata filtering
* Email notifications for tickets
* Real-time ticket updates
* SSO integration
* Microsoft Teams / Slack integration
* Advanced analytics
* Feedback-based RAG evaluation
* RAGAS-based evaluation
* Production monitoring and logging

---

# 📈 Why This Project Is Different

This project is more than a simple chatbot.

It combines:

```text
Full-Stack Development
        +
Authentication
        +
Role-Based Access
        +
Document Processing
        +
Vector Databases
        +
RAG
        +
LLMs
        +
Source Citations
        +
Hallucination Control
        +
AI Ticket Classification
        +
Enterprise Analytics
```

This makes it a strong portfolio project for demonstrating **full-stack engineering + AI/ML + RAG + enterprise software development**.

---

# 👨‍💻 Author

**Manoj Veturi**

Metallurgical & Materials Engineering
NIT Durgapur

### Technologies

```text
React.js • FastAPI • Python • SQLAlchemy
ChromaDB • RAG • Gemini API • JWT
Tailwind CSS • SQLite • LangChain
```

---
