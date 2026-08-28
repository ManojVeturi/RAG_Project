from app.rag.retriever import retrieve
from app.services.llm_service import generate_answer


def answer_question(
    question: str,
    company_id: int,
    top_k: int = 5,
) -> dict:

    results = retrieve(
        query=question,
        top_k=top_k,
        distance_threshold=1.2,
        company_id=company_id,
    )

    # No relevant information found
    if not results:
        return {
            "answer": (
                "I couldn't find this information "
                "in your company's knowledge base."
            ),
            "sources": [],
            "can_create_ticket": True,
        }

    # Build context for the LLM
    context_parts = []

    for result in results:
        metadata = result["metadata"]

        context_parts.append(
            f"""
Source: {metadata["filename"]}
Page: {metadata["page_number"]}

Content:
{result["text"]}
"""
        )

    context = "\n\n".join(
        context_parts
    )

    # Generate grounded answer
    answer = generate_answer(
        question=question,
        context=context,
    )

    # Build citations
    sources = []

    seen = set()

    for result in results:
        metadata = result["metadata"]

        source_key = (
            metadata["filename"],
            metadata["page_number"],
        )

        if source_key in seen:
            continue

        seen.add(source_key)

        sources.append({
            "filename": metadata["filename"],
            "page_number": metadata["page_number"],
        })

    return {
        "answer": answer,
        "sources": sources,
        "can_create_ticket": False,
    }