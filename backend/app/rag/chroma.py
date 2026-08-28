from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    Filter,
    FieldCondition,
    MatchValue,
    PointStruct,
    VectorParams,
)

from app.config import settings


COLLECTION_NAME = settings.qdrant_collection


_client = None
_initialized = False


def get_client() -> QdrantClient:
    global _client

    if _client is None:
        _client = QdrantClient(
            url=settings.qdrant_url,
            api_key=settings.qdrant_api_key,
            check_compatibility=False,
        )

    return _client


def _ensure_collection():
    global _initialized

    if _initialized:
        return

    client = get_client()

    collections = client.get_collections()

    existing_names = {
        collection.name
        for collection in collections.collections
    }

    if COLLECTION_NAME not in existing_names:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(
                size=384,
                distance=Distance.COSINE,
            ),
        )

    # Index fields used for filtering
    client.create_payload_index(
        collection_name=COLLECTION_NAME,
        field_name="company_id",
        field_schema="integer",
    )

    client.create_payload_index(
        collection_name=COLLECTION_NAME,
        field_name="document_id",
        field_schema="integer",
    )

    _initialized = True


def add_documents(
    ids: list[str],
    texts: list[str],
    embeddings: list[list[float]],
    metadatas: list[dict],
):
    _ensure_collection()

    client = get_client()

    points = []

    for id_, text, embedding, metadata in zip(
        ids,
        texts,
        embeddings,
        metadatas,
    ):
        points.append(
            PointStruct(
                id=id_,
                vector=embedding,
                payload={
                    "text": text,
                    **metadata,
                },
            )
        )

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points,
    )


def search_documents(
    query_embedding: list[float],
    top_k: int = 5,
    company_id: int | None = None,
):
    _ensure_collection()

    client = get_client()

    query_filter = None

    if company_id is not None:
        query_filter = Filter(
            must=[
                FieldCondition(
                    key="company_id",
                    match=MatchValue(
                        value=company_id
                    ),
                )
            ]
        )

    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_embedding,
        query_filter=query_filter,
        limit=top_k,
        with_payload=True,
        with_vectors=False,
    )

    documents = []
    metadatas = []
    distances = []

    for point in results.points:
        payload = point.payload or {}

        documents.append(
            payload.get("text", "")
        )

        metadata = {
            key: value
            for key, value in payload.items()
            if key != "text"
        }

        metadatas.append(metadata)
        distances.append(point.score)

    return {
        "documents": [documents],
        "metadatas": [metadatas],
        "distances": [distances],
    }


def delete_document(
    document_id: int,
):
    _ensure_collection()

    client = get_client()

    client.delete(
        collection_name=COLLECTION_NAME,
        points_selector=Filter(
            must=[
                FieldCondition(
                    key="document_id",
                    match=MatchValue(
                        value=document_id
                    ),
                )
            ]
        ),
    )