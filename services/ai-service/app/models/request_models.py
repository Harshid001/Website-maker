from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(default="")
    context: Dict[str, Any] = Field(default_factory=dict)


class TemplateGenerationRequest(BaseModel):
    prompt: str = Field(default="")
    template_type: str = Field(default="website")
    profession: Optional[str] = None
    design_type: Optional[str] = None
    sections: List[str] = Field(default_factory=list)
    context: Dict[str, Any] = Field(default_factory=dict)


class LayoutSuggestionRequest(BaseModel):
    goal: str = Field(default="")
    profession: Optional[str] = None
    design_type: Optional[str] = None
    constraints: Dict[str, Any] = Field(default_factory=dict)


class ImproveCopyRequest(BaseModel):
    copy: str = Field(default="")
    tone: str = Field(default="professional")
    audience: Optional[str] = None
