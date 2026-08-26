from fastapi import APIRouter, Depends

from app.dependencies import require_admin
from app.models import User


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get("/test")
def admin_test(
    current_user: User = Depends(require_admin),
):
    return {
        "message": "Welcome Admin",
        "user": current_user.email,
        "role": current_user.role,
    }