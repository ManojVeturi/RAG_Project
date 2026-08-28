from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import hash_password
from app.database import get_db
from app.dependencies import require_admin
from app.models import User, Ticket, Conversation, Document
from app.schemas import AdminUserCreate, UserResponse


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


@router.get("/test")
def admin_test(
    current_user: User = Depends(require_admin),
):
    return {
        "message": "Welcome Admin",
        "user": current_user.email,
        "role": current_user.role,
        "company_id": current_user.company_id,
    }


@router.post(
    "/users/employee",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_employee(
    user_data: AdminUserCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user = User(
        company_id=current_user.company_id,
        name=user_data.name.strip(),
        email=user_data.email,
        password_hash=hash_password(
            user_data.password
        ),
        role="employee",
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.get(
    "/users",
    response_model=list[UserResponse],
)
def list_users(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return (
        db.query(User)
        .filter(
            User.company_id == current_user.company_id
        )
        .order_by(User.id.desc())
        .all()
    )


@router.get("/stats")
def admin_stats(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    company_id = current_user.company_id

    employee_count = (
        db.query(User)
        .filter(
            User.company_id == company_id,
            User.role == "employee",
        )
        .count()
    )

    ticket_count = (
        db.query(Ticket)
        .filter(
            Ticket.company_id == company_id
        )
        .count()
    )

    conversation_count = (
        db.query(Conversation)
        .filter(
            Conversation.company_id == company_id
        )
        .count()
    )

    document_count = (
        db.query(Document)
        .filter(
            Document.company_id == company_id
        )
        .count()
    )

    return {
        "employees": employee_count,
        "tickets": ticket_count,
        "conversations": conversation_count,
        "documents": document_count,
    }