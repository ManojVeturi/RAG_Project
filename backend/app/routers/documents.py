import os

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import (
    get_current_user,
    require_admin,
)
from app.models import Document, User
from app.services.document_service import ingest_document
from app.rag.chroma import delete_document as delete_chroma_document


router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


UPLOAD_DIR = "uploads"

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".docx",
    ".txt",
    ".md",
}


os.makedirs(
    UPLOAD_DIR,
    exist_ok=True,
)


@router.post(
    "/upload",
    status_code=status.HTTP_201_CREATED,
)
def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    filename = file.filename or ""

    extension = os.path.splitext(
        filename
    )[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Unsupported file type. "
                "Allowed: PDF, DOCX, TXT, MD"
            ),
        )

    file_path = os.path.join(
        UPLOAD_DIR,
        filename,
    )

    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    document = Document(
        company_id=current_user.company_id,
        filename=filename,
        file_type=extension,
        file_path=file_path,
        uploaded_by=current_user.id,
        status="uploaded",
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    try:
        ingestion_result = ingest_document(
            document_id=document.id,
            file_path=file_path,
            filename=filename,
            company_id=current_user.company_id,
        )

        document.status = "processed"

        db.commit()

    except Exception as exc:
        document.status = "failed"

        db.commit()

        raise HTTPException(
            status_code=500,
            detail=f"Document ingestion failed: {exc}",
        )

    return {
        "id": document.id,
        "filename": document.filename,
        "file_type": document.file_type,
        "status": document.status,
        "pages": ingestion_result["pages"],
        "chunks": ingestion_result["chunks"],
    }


@router.get("/")
def list_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    documents = (
        db.query(Document)
        .filter(
            Document.company_id == current_user.company_id
        )
        .order_by(
            Document.created_at.desc()
        )
        .all()
    )

    return [
        {
            "id": document.id,
            "filename": document.filename,
            "file_type": document.file_type,
            "status": document.status,
            "uploaded_by": document.uploaded_by,
            "created_at": document.created_at,
        }
        for document in documents
    ]


@router.delete("/{document_id}")
def delete_document_endpoint(
    document_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.company_id == current_user.company_id,
        )
        .first()
    )

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    delete_chroma_document(
        document.id
    )

    if os.path.exists(document.file_path):
        os.remove(document.file_path)

    db.delete(document)
    db.commit()

    return {
        "message": "Document deleted successfully",
        "document_id": document_id,
    }