from app.database import SessionLocal
from app.models import Document
from app.services.document_service import ingest_document


def reindex_documents():
    db = SessionLocal()

    try:
        documents = (
            db.query(Document)
            .order_by(Document.id)
            .all()
        )

        print(f"Found {len(documents)} documents.")

        for document in documents:
            print()
            print(f"Re-indexing: {document.filename}")
            print(f"Document ID: {document.id}")
            print(f"Company ID: {document.company_id}")

            result = ingest_document(
                document_id=document.id,
                file_path=document.file_path,
                filename=document.filename,
                company_id=document.company_id,
            )

            print(f"Pages: {result['pages']}")
            print(f"Chunks: {result['chunks']}")

        print()
        print("=" * 60)
        print("RE-INDEXING COMPLETED")
        print("=" * 60)

    finally:
        db.close()


if __name__ == "__main__":
    reindex_documents()