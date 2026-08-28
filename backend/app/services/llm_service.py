from google import genai

from app.config import settings


_client = None

MODEL_NAME = "gemini-3.6-flash"


def get_client():
    global _client

    if _client is None:
        _client = genai.Client(
            api_key=settings.gemini_api_key
        )

    return _client


def generate_answer(
    question: str,
    context: str,
) -> str:

    prompt = f"""
You are an enterprise knowledge-base assistant.

Answer the user's question using ONLY the supplied
company knowledge-base context.

Rules:
1. Do not use outside knowledge.
2. Do not invent facts.
3. If the context does not contain the answer, say:
   "I couldn't find this information in the company knowledge base."
4. Give a concise and clear answer.
5. Do not mention information that is not supported by
   the provided context.

KNOWLEDGE BASE CONTEXT:
{context}

USER QUESTION:
{question}
"""

    response = get_client().models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
    )

    return response.text

def generate_text(prompt: str) -> str:
    response = get_client().models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
    )

    return response.text