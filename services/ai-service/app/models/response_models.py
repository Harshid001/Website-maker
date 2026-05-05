from typing import Any, Dict, List

from pydantic import BaseModel, Field


class AiResponse(BaseModel):
    ok: bool = True
    provider: str = "placeholder"
    message: str
    data: Dict[str, Any] = Field(default_factory=dict)


class TemplateResponse(BaseModel):
    ok: bool = True
    provider: str = "placeholder"
    title: str
    sections: List[str] = Field(default_factory=list)
    content: Dict[str, Any] = Field(default_factory=dict)
