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
    company_id: int | None = None,
):
    query_kwargs = {
        "query_embeddings": [query_embedding],
        "n_results": top_k,
    }

    if company_id is not None:
        query_kwargs["where"] = {
            "company_id": company_id
        }

    return collection.query(
        **query_kwargs
    )


def delete_document(
    document_id: int,
):
    collection.delete(
        where={
            "document_id": document_id
        }
    )