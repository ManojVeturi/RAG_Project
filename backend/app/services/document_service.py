from app.rag.chroma import add_documents
from app.rag.chunker import chunk_pages
from app.services.embedding_service import generate_embeddings
from app.services.parser import parse_pdf


def ingest_document(
    document_id: int,
    file_path: str,
    filename: str,
    company_id: int,
):
    # 1. Parse document
    pages = parse_pdf(file_path)

    # 2. Create chunks
    chunks = chunk_pages(pages)

    if not chunks:
        raise ValueError(
            "Document contains no usable text."
        )

    # 3. Extract text
    texts = [
        chunk["text"]
        for chunk in chunks
    ]

    # 4. Generate embeddings
    embeddings = generate_embeddings(texts)

    # 5. Create unique ChromaDB IDs
    ids = [
        f"document_{document_id}_chunk_{index}"
        for index in range(len(chunks))
    ]

    # 6. Create metadata
    metadatas = [
        {
            "document_id": document_id,
            "company_id": company_id,
            "filename": filename,
            "page_number": chunk["page_number"],
            "chunk_index": chunk["chunk_index"],
        }
        for chunk in chunks
    ]

    # 7. Store in ChromaDB
    add_documents(
        ids=ids,
        texts=texts,
        embeddings=embeddings,
        metadatas=metadatas,
    )

    return {
        "pages": len(pages),
        "chunks": len(chunks),
    }