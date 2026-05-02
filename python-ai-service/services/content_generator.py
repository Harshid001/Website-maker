def generate_website_content(data):
    business_name = data.get("businessName", "Your Business")
    profession = data.get("profession", "Business")
    city = data.get("city", "your city")
    services = ", ".join(data.get("services", []))
    
    # Mock logic based on profession
    if "jewellery" in profession.lower():
        return {
            "heroTitle": f"Premium {profession} in {city}",
            "heroSubtitle": f"Discover trusted craftsmanship, elegant designs, and reliable services at {business_name}.",
            "aboutContent": f"{business_name} is a leading {profession} in {city}, specializing in {services}. We pride ourselves on quality and trust.",
            "callToAction": "Explore Our Collection"
        }
    elif "clinic" in profession.lower() or "doctor" in profession.lower():
        return {
            "heroTitle": f"Professional Healthcare at {business_name}",
            "heroSubtitle": f"Expert medical care and dedicated services in {city}.",
            "aboutContent": f"{business_name} provides comprehensive healthcare services including {services}. Your health is our priority.",
            "callToAction": "Book an Appointment"
        }
    elif "restaurant" in profession.lower() or "food" in profession.lower():
        return {
            "heroTitle": f"Delicious Flavors at {business_name}",
            "heroSubtitle": f"Experience the best {profession} in {city} with our unique menu.",
            "aboutContent": f"At {business_name}, we serve authentic dishes and provide top-notch services like {services}.",
            "callToAction": "View Menu & Order"
        }
    else:
        return {
            "heroTitle": f"Welcome to {business_name}",
            "heroSubtitle": f"Providing top-quality {profession} services in {city}.",
            "aboutContent": f"{business_name} is your trusted partner for {services} in {city}.",
            "callToAction": "Contact Us Now"
        }
