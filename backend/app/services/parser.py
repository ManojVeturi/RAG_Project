import fitz


def parse_pdf(file_path: str) -> list[dict]:
    """
    Extract text from a text-based PDF while preserving page numbers.
    """

    pages = []

    document = fitz.open(file_path)

    try:
        for page_number, page in enumerate(document, start=1):
            text = page.get_text("text").strip()

            if text:
                pages.append({
                    "page_number": page_number,
                    "text": text,
                    "source_type": "text",
                })

    finally:
        document.close()

    if not pages:
        raise ValueError(
            "PDF contains no extractable text. "
            "Please upload a text-based PDF."
        )

    return pages