from typing import Iterable


def build_template_prompt(prompt: str, template_type: str, sections: Iterable[str]) -> str:
    section_text = ", ".join(sections) if sections else "hero, features, proof, contact, footer"
    return f"Create a {template_type} template. User prompt: {prompt}. Required sections: {section_text}."


def build_copy_prompt(copy: str, tone: str, audience: str | None = None) -> str:
    audience_text = f" for {audience}" if audience else ""
    return f"Improve this copy in a {tone} tone{audience_text}: {copy}"
