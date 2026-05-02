from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from schemas.request_schemas import (
    ContentGenerationRequest, 
    SEORequest, 
    TemplateSuggestionRequest, 
    AnimationSuggestionRequest, 
    DesignTextRequest
)
from services.content_generator import generate_website_content
from services.seo_generator import generate_seo_content
from services.template_suggester import suggest_template
from services.animation_suggester import suggest_animations
from services.design_text_generator import generate_design_text
from services.image_processor import process_image
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="ShopCraft Python AI Service")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "ShopCraft Python AI Service is running"}

@app.post("/generate-content")
async def content_gen(request: ContentGenerationRequest):
    content = generate_website_content(request.dict())
    return content

@app.post("/generate-seo")
async def seo_gen(request: SEORequest):
    seo = generate_seo_content(request.dict())
    return seo

@app.post("/suggest-template")
async def template_suggestion(request: TemplateSuggestionRequest):
    suggestion = suggest_template(request.profession, request.theme)
    return suggestion

@app.post("/suggest-animation")
async def animation_suggestion(request: AnimationSuggestionRequest):
    animations = suggest_animations(request.profession, request.theme)
    return animations

@app.post("/generate-design-text")
async def design_text_gen(request: DesignTextRequest):
    text = generate_design_text(request.dict())
    return text

@app.post("/process-image")
async def image_proc(
    operation: str = Form(...),
    file: UploadFile = File(...)
):
    # Read image content
    contents = await file.read()
    result = process_image(contents, operation=operation)
    return result

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
