from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.models import Ticket, User
from app.schemas import (
    TicketCreate,
    TicketResponse,
    TicketUpdate,
)
from app.services.ticket_service import classify_ticket


router = APIRouter(
    prefix="/tickets",
    tags=["Tickets"],
)


@router.post(
    "/",
    response_model=TicketResponse,
    status_code=201,
)
def create_ticket(
    request: TicketCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    classification = classify_ticket(
        title=request.title,
        description=request.description,
    )

    ticket = Ticket(
        user_id=current_user.id,
        title=request.title,
        description=request.description,
        category=classification["category"],
        priority=classification["priority"],
        status="Open",
        ai_summary=classification["summary"],
    )

    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return ticket

@router.get(
    "/",
    response_model=list[TicketResponse],
)
def list_tickets(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tickets = (
        db.query(Ticket)
        .filter(Ticket.user_id == current_user.id)
        .order_by(Ticket.created_at.desc())
        .all()
    )

    return tickets

@router.get(
    "/admin/all",
    response_model=list[TicketResponse],
)
def list_all_tickets(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    tickets = (
        db.query(Ticket)
        .order_by(Ticket.created_at.desc())
        .all()
    )

    return tickets

@router.patch(
    "/{ticket_id}",
    response_model=TicketResponse,
)
def update_ticket(
    ticket_id: int,
    request: TicketUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    ticket = (
        db.query(Ticket)
        .filter(Ticket.id == ticket_id)
        .first()
    )

    if ticket is None:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found",
        )

    if request.status is not None:
        ticket.status = request.status

    if request.priority is not None:
        ticket.priority = request.priority

    if request.category is not None:
        ticket.category = request.category

    db.commit()
    db.refresh(ticket)

    return ticket