from pydantic import BaseModel
from typing import List, Optional

class ContentGenerationRequest(BaseModel):
    businessName: str
    profession: str
    city: str
    services: List[str]
    theme: str

class SEORequest(BaseModel):
    businessName: str
    profession: str
    city: str
    services: List[str]

class TemplateSuggestionRequest(BaseModel):
    profession: str
    theme: str

class AnimationSuggestionRequest(BaseModel):
    profession: str
    theme: str

class DesignTextRequest(BaseModel):
    designType: str
    business: str
    occasion: Optional[str] = None
    offer: Optional[str] = None
