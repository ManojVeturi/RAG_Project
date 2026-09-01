import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.dependencies import get_current_user
from app.auth import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.database import get_db
from app.models import Company, User
from app.schemas import (
    LoginRequest,
    OrganizationCreate,
    OrganizationCreateResponse,
    Token,
    UserRegister,
    UserResponse,
)


REGISTRATION_CODE_PREFIX = "ENT"


def generate_registration_code() -> str:
    """Return a hard-to-guess code employees can use to join a company."""
    return (
        f"{REGISTRATION_CODE_PREFIX}-"
        f"{secrets.token_hex(4).upper()}"
    )


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/organizations",
    response_model=OrganizationCreateResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_organization(
    organization_data: OrganizationCreate,
    db: Session = Depends(get_db),
):
    """Create a company and its founding admin in one transaction."""
    company_name = organization_data.company_name.strip()
    admin_name = organization_data.name.strip()
    email = str(organization_data.email).strip()

    if len(company_name) < 2 or len(admin_name) < 2:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=(
                "Organization name and admin name must each contain "
                "at least two non-space characters."
            ),
        )

    try:
        password_hash = hash_password(
            organization_data.password
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(error),
        )

    existing_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    registration_code = generate_registration_code()

    while (
        db.query(Company.id)
        .filter(
            Company.registration_code == registration_code
        )
        .first()
        is not None
    ):
        registration_code = generate_registration_code()

    company = Company(
        name=company_name,
        registration_code=registration_code,
    )

    try:
        db.add(company)
        db.flush()

        admin = User(
            company_id=company.id,
            name=admin_name,
            email=email,
            password_hash=password_hash,
            role="admin",
        )

        db.add(admin)
        db.commit()
        db.refresh(admin)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "An account or organization with these details "
                "already exists. Please try again."
            ),
        )

    return {
        "user": admin,
        "registration_code": registration_code,
    }


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    user_data: UserRegister,
    db: Session = Depends(get_db),
):
    # Check whether email already exists
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

    # Find company using registration code
    company = (
        db.query(Company)
        .filter(
            Company.registration_code
            == user_data.company_code.strip()
        )
        .first()
    )

    if company is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid company registration code",
        )

    # Create employee
    user = User(
        company_id=company.id,
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
