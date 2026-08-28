from sentence_transformers import SentenceTransformer


MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

_model = None


def get_model():
    global _model

    if _model is None:
        print("Loading embedding model...", flush=True)

        _model = SentenceTransformer(MODEL_NAME)

        print("Embedding model loaded.", flush=True)

    return _model


def generate_embeddings(
    texts: list[str],
) -> list[list[float]]:
    """
    Generate vector embeddings for a list of texts.
    """

    model = get_model()

    embeddings = model.encode(
        texts,
        normalize_embeddings=True,
    )

    return embeddings.tolist()