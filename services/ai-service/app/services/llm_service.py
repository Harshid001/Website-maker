import os
from typing import Any, Dict, Optional

from dotenv import load_dotenv

load_dotenv()


class LlmService:
    def __init__(self) -> None:
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        self.claude_key = os.getenv("CLAUDE_API_KEY")

    @property
    def has_provider_key(self) -> bool:
        return bool(self.openai_key or self.gemini_key or self.claude_key)

    def complete(self, prompt: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        if not self.has_provider_key:
            return {
                "provider": "placeholder",
                "message": "AI provider key is not configured. Returning a safe placeholder response.",
                "prompt": prompt,
                "context": context or {},
            }

        return {
            "provider": "configured",
            "message": "Provider key detected. Real provider integration can be enabled here.",
            "prompt": prompt,
            "context": context or {},
        }


llm_service = LlmService()
