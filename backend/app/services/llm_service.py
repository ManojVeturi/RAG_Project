from google import genai

from app.config import settings


client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


MODEL_NAME = "gemini-3.6-flash"


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

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
    )

    return response.text

def generate_text(prompt: str) -> str:
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
    )

    return response.text