def generate_seo_content(data):
    business_name = data.get("businessName", "Your Business")
    profession = data.get("profession", "Business")
    city = data.get("city", "your city")
    services_list = data.get("services", [])
    
    return {
        "seoTitle": f"Best {profession} in {city} | {business_name}",
        "seoDescription": f"Visit {business_name} in {city} for professional {profession} services including {', '.join(services_list[:3])}.",
        "keywords": [
            f"{profession.lower()} in {city}",
            f"{business_name.lower()} {city}",
        ] + [s.lower() for s in services_list]
    }
