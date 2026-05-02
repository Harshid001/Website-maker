def suggest_animations(profession, theme):
    base_animations = ["Smooth Scroll Animation", "Fade In Hero Section"]
    
    if "jewellery" in profession.lower():
        return {
            "animations": base_animations + [
                "Gold Shine Effect",
                "Product Card Hover Animation",
                "Logo Reveal Animation"
            ]
        }
    elif "clinic" in profession.lower():
        return {
            "animations": base_animations + [
                "Gentle Fade Transition",
                "Service Icon Pulse Animation"
            ]
        }
    else:
        return {
            "animations": base_animations + [
                "Slide Up Content Blocks",
                "Button Hover Scale"
            ]
        }
