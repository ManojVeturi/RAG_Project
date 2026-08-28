from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime


class UserRegister(BaseModel):
    name: str
    company_code: str
    email: EmailStr
    password: str

class AdminUserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    company_id: int

    model_config = ConfigDict(
        from_attributes=True
    )


class Token(BaseModel):
    access_token: str
    token_type: str

class ChatRequest(BaseModel):
    question: str


class Source(BaseModel):
    filename: str
    page_number: int


class ChatResponse(BaseModel):
    answer: str
    sources: list[Source]
    can_create_ticket: bool = False

class TicketCreate(BaseModel):
    title: str
    description: str


class TicketResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: str
    category: str
    priority: str
    status: str
    ai_summary: str | None
    created_at: datetime
    updated_at: datetime | None

class TicketUpdate(BaseModel):
    status: str | None = None
    priority: str | None = None
    category: str | None = None