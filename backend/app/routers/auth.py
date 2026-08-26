from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies import get_current_user
from app.auth import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.database import get_db
from app.models import User
from app.schemas import (
    LoginRequest,
    Token,
    UserRegister,
    UserResponse,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register(
    user_data: UserRegister,
    db: Session = Depends(get_db)
):
    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        role="employee"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.post(
    "/login",
    response_model=Token
)
def login(
    user_data: LoginRequest,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(
        user_data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_access_token(
        user_id=user.id,
        role=user.role
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return current_user