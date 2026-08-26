from fastapi import APIRouter, Depends

from app.dependencies import get_current_user
from app.models import User
from app.schemas import ChatRequest, ChatResponse
from app.services.rag_service import answer_question


router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post(
    "/ask",
    response_model=ChatResponse,
)
def ask_question(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
):
    return answer_question(
        question=request.question
    )

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models import Conversation, User
from app.schemas import ChatRequest, ChatResponse
from app.services.rag_service import answer_question


router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post(
    "/ask",
    response_model=ChatResponse,
)
def ask_question(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = answer_question(
        question=request.question
    )

    conversation = Conversation(
        user_id=current_user.id,
        question=request.question,
        answer=result["answer"],
    )

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    return result

@router.get("/history")
def get_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conversations = (
        db.query(Conversation)
        .filter(
            Conversation.user_id == current_user.id
        )
        .order_by(
            Conversation.created_at.desc()
        )
        .all()
    )

    return [
        {
            "id": conversation.id,
            "question": conversation.question,
            "answer": conversation.answer,
            "created_at": conversation.created_at,
        }
        for conversation in conversations
    ]