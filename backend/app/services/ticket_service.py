import json

from app.services.llm_service import generate_text


def classify_ticket(
    title: str,
    description: str,
) -> dict:
    context = f"""
Ticket title:
{title}

Ticket description:
{description}
"""

    prompt = f"""
You are an enterprise IT support ticket classifier.

Analyze the ticket below and return ONLY valid JSON.

Allowed categories:
- IT Support
- HR
- Finance
- Security
- Facilities
- General

Allowed priorities:
- Low
- Medium
- High
- Critical

Return exactly:

{{
  "category": "...",
  "priority": "...",
  "summary": "..."
}}

Ticket:
{context}
"""

    response = generate_text(prompt)

    try:
        result = json.loads(response)
    except json.JSONDecodeError:
        return {
            "category": "General",
            "priority": "Medium",
            "summary": description[:500],
        }

    return {
        "category": result.get("category", "General"),
        "priority": result.get("priority", "Medium"),
        "summary": result.get(
            "summary",
            description[:500],
        ),
    }