def generate_design_text(data):
    design_type = data.get("designType", "Poster")
    business = data.get("business", "Your Business")
    occasion = data.get("occasion", "Special Event")
    offer = data.get("offer", "Great Discount")
    
    return {
        "title": f"{occasion} {design_type}",
        "subtitle": f"Celebrate with {business}",
        "offerText": f"Enjoy {offer}",
        "cta": f"Visit {business} Today"
    }
