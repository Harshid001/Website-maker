# ShopCraft Studio AI Service

Standalone Python FastAPI service for AI-assisted template, layout, copy, and RAG workflows.

## Run

```bash
cd services/ai-service
python -m venv venv
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

## Environment

Create a local `.env` if you want to connect real providers later.

```env
OPENAI_API_KEY=
GEMINI_API_KEY=
CLAUDE_API_KEY=
```

If no API key is present, endpoints return safe placeholder responses.
