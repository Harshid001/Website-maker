from fastapi import APIRouter

router = APIRouter()


@router.post("/rag/search")
def rag_search(payload: dict):
    return {
        "ok": True,
        "message": "RAG search placeholder. Connect vector storage here later.",
        "query": payload.get("query", ""),
        "results": [],
    }
