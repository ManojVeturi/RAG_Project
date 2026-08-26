from sentence_transformers import SentenceTransformer


MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


model = SentenceTransformer(MODEL_NAME)


def generate_embeddings(
    texts: list[str],
) -> list[list[float]]:
    """
    Generate vector embeddings for a list of texts.
    """

    embeddings = model.encode(
        texts,
        normalize_embeddings=True,
    )

    return embeddings.tolist()