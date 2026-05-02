def format_business_name(name):
    return name.strip().title()

def clean_list(items):
    return [item.strip() for item in items if item.strip()]

def get_placeholder_image(width, height, text="Placeholder"):
    return f"https://via.placeholder.com/{width}x{height}?text={text}"
