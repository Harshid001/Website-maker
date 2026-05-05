from typing import Any, Dict, List


def placeholder_template(title: str, sections: List[str]) -> Dict[str, Any]:
    safe_sections = sections or ["Navbar", "Hero", "Features", "Testimonials", "Contact", "Footer"]
    return {
        "title": title or "AI Suggested Template",
        "sections": safe_sections,
        "content": {
            "html": "<section><h1>AI Suggested Template</h1><p>Edit this starter in ShopCraft Studio.</p></section>",
            "css": "section { padding: 80px; font-family: Inter, sans-serif; }",
            "js": "",
        },
    }
