import chromadb


CHROMA_PATH = "./chroma_db"

client = chromadb.PersistentClient(
    path=CHROMA_PATH
)


collection = client.get_or_create_collection(
    name="enterprise_knowledge"
)


def add_documents(
    ids: list[str],
    texts: list[str],
    embeddings: list[list[float]],
    metadatas: list[dict],
):
    collection.add(
        ids=ids,
        documents=texts,
        embeddings=embeddings,
        metadatas=metadatas,
    )


def search_documents(
    query_embedding: list[float],
    top_k: int = 5,
):
    return collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
    )

def delete_document(document_id: int):
    collection.delete(
        where={
            "document_id": document_id
        }
    )