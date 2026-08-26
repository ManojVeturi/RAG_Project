def chunk_pages(
    pages: list[dict],
    chunk_size: int = 1000,
    overlap: int = 150,
) -> list[dict]:
    """
    Split page text into overlapping chunks
    while preserving page metadata.
    """

    chunks = []

    for page in pages:
        text = page["text"]
        page_number = page["page_number"]

        start = 0
        chunk_index = 0

        while start < len(text):
            end = start + chunk_size

            chunk_text = text[start:end].strip()

            if chunk_text:
                chunks.append({
                    "text": chunk_text,
                    "page_number": page_number,
                    "chunk_index": chunk_index,
                })

            chunk_index += 1

            start = end - overlap

            if start < 0:
                start = 0

    return chunks