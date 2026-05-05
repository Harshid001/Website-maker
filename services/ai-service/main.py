from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import chat, rag, templates

app = FastAPI(title="ShopCraft Studio AI Service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "shopcraft-ai-service"}


app.include_router(chat.router, prefix="/api/ai", tags=["chat"])
app.include_router(templates.router, prefix="/api/ai", tags=["templates"])
app.include_router(rag.router, prefix="/api/ai", tags=["rag"])
