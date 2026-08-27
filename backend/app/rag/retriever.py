from app.rag.chroma import search_documents
from app.services.embedding_service import generate_embeddings


def retrieve(
    query: str,
    top_k: int = 5,
    distance_threshold: float = 1.2,
) -> list[dict]:

    query_embedding = generate_embeddings([query])[0]

    results = search_documents(
        query_embedding=query_embedding,
        top_k=top_k,
    )

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    print(
        f"RAG query: {query}"
    )

    for document, metadata, distance in zip(
        documents,
        metadatas,
        distances,
    ):
        print(
            f"Distance: {distance:.4f} | "
            f"File: {metadata.get('filename')} | "
            f"Page: {metadata.get('page_number')}"
        )

    retrieved_chunks = []

    for document, metadata, distance in zip(
        documents,
        metadatas,
        distances,
    ):
        # Reject weak matches individually
        if distance > distance_threshold:
            continue

        retrieved_chunks.append({
            "text": document,
            "metadata": metadata,
            "distance": distance,
        })

    return retrieved_chunks