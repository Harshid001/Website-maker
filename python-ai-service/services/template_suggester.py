def suggest_template(profession, theme):
    profession_lower = profession.lower()
    
    if "jewellery" in profession_lower:
        return {
            "templateName": "Luxury Jewellery Template",
            "theme": theme or "Elegant Gold",
            "reason": "Best suitable for premium jewellery businesses with high-end visuals."
        }
    elif "clinic" in profession_lower or "doctor" in profession_lower:
        return {
            "templateName": "Clean Clinic Appointment Template",
            "theme": theme or "Classic White",
            "reason": "Offers a professional and trustworthy look for healthcare providers."
        }
    elif "restaurant" in profession_lower or "cafe" in profession_lower:
        return {
            "templateName": "Modern Foodie Template",
            "theme": theme or "Rustic Wood",
            "reason": "Highlighting your dishes with large images and easy navigation."
        }
    else:
        return {
            "templateName": "Business Professional Template",
            "theme": theme or "Corporate Blue",
            "reason": "A versatile template that works well for any industry."
        }
