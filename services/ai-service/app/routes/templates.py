from fastapi import APIRouter

from app.models.request_models import ImproveCopyRequest, LayoutSuggestionRequest, TemplateGenerationRequest
from app.models.response_models import AiResponse, TemplateResponse
from app.services.llm_service import llm_service
from app.services.prompt_builder import build_copy_prompt, build_template_prompt
from app.services.template_generator import placeholder_template

router = APIRouter()


@router.post("/generate-template", response_model=TemplateResponse)
def generate_template(request: TemplateGenerationRequest):
    prompt = build_template_prompt(request.prompt, request.template_type, request.sections)
    result = llm_service.complete(prompt, request.context)
    template = placeholder_template(request.design_type or "AI Generated Template", request.sections)
    return TemplateResponse(provider=result["provider"], **template)


@router.post("/suggest-layout", response_model=AiResponse)
def suggest_layout(request: LayoutSuggestionRequest):
    result = llm_service.complete(request.goal, request.constraints)
    return AiResponse(
        provider=result["provider"],
        message="Suggested a safe layout direction.",
        data={
            "designType": request.design_type or "Clean Service Landing",
            "profession": request.profession,
            "sections": ["Navbar", "Hero", "Features", "Proof", "CTA", "Footer"],
        },
    )


@router.post("/improve-copy", response_model=AiResponse)
def improve_copy(request: ImproveCopyRequest):
    prompt = build_copy_prompt(request.copy, request.tone, request.audience)
    result = llm_service.complete(prompt)
    improved = request.copy.strip() or "Clear, conversion-focused copy for your ShopCraft template."
    return AiResponse(
        provider=result["provider"],
        message="Copy improvement placeholder generated.",
        data={"copy": improved, "tone": request.tone, "audience": request.audience},
    )
