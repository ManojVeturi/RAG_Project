from fastapi import FastAPI

from app.database import engine
from app.models import Base
from app.routers.auth import router as auth_router
from app.routers.admin import router as admin_router
from app.routers.documents import router as documents_router
from app.routers.chat import router as chat_router
from app.routers.tickets import router as tickets_router

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AI Enterprise Support & Knowledge Agent",
    description="AI-powered enterprise support and knowledge management system",
    version="1.0.0",
)


app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(documents_router)
app.include_router(chat_router)
app.include_router(tickets_router)

@app.get("/")
def home():
    return {
        "message": "AI Enterprise Support & Knowledge Agent API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }