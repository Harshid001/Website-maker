from fastapi import APIRouter

from app.models.request_models import ChatRequest
from app.models.response_models import AiResponse
from app.services.llm_service import llm_service

router = APIRouter()


@router.post("/chat", response_model=AiResponse)
def chat(request: ChatRequest):
    result = llm_service.complete(request.message, request.context)
    return AiResponse(
        provider=result["provider"],
        message=result["message"],
        data={"echo": request.message, "context": request.context},
    )
