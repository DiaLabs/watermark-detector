from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
from pathlib import Path
import shutil
import tempfile

from src.inference import WatermarkDetector
from src.utils import draw_bboxes, format_response
import config
import cv2
import numpy as np

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Watermark Detector", version="1.0.0")

# app.mount("/outputs", StaticFiles(directory=str(Path(__file__).parent / "outputs")), name="outputs")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global detector instance
detector: WatermarkDetector = None


class DetectionRequest(BaseModel):
    """Request schema for detection endpoint."""
    image_path: str


class DetectionResponse(BaseModel):
    """Response schema for detection endpoint."""
    annotated_image: str | None
    detection_count: int
    detections: list
    summary: str


@app.on_event("startup")
async def startup_event():
    """Load model on startup."""
    global detector
    try:
        detector = WatermarkDetector(config.MODEL_PATH)
        logger.info("✅ Watermark detector initialized successfully")
    except Exception as e:
        logger.error(f"❌ Failed to load model: {e}")
        raise


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "model_loaded": detector is not None}


@app.post("/detect", response_model=DetectionResponse)
async def detect_watermarks(request: DetectionRequest):
    """
    Detect watermarks in image from path.
    """
    if detector is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        image_path = Path(request.image_path)
        image = cv2.imread(str(image_path))
        if image is None:
            raise HTTPException(status_code=404, detail="Image not found")
        
        # Run detection
        result = detector.detect(image)
        
        # Draw bounding boxes
        annotated_base64 = draw_bboxes(image, result["detections"])
        
        # Format response
        return format_response(result["detections"], annotated_base64, result.get("heatmap_image"))
        
    except Exception as e:
        logger.error(f"Detection error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/detect-upload", response_model=DetectionResponse)
async def detect_watermarks_upload(file: UploadFile = File(...)):
    """
    Detect watermarks in uploaded image file (Processed in memory).
    """
    if detector is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Validate file type
        allowed_types = {"image/jpeg", "image/png", "image/bmp", "image/gif", "image/tiff"}
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {file.content_type}"
            )
        
        # Read file into memory
        contents = await file.read()
        
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image data")
        
        # Run detection
        result = detector.detect(
            image,
            conf=config.CONFIDENCE_THRESHOLD,
            iou=config.IOU_THRESHOLD
        )
        
        # Draw bounding boxes
        annotated_base64 = draw_bboxes(image, result["detections"])
        
        # Format response
        return format_response(result["detections"], annotated_base64, result.get("heatmap_image"))
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Detection error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
async def root():
    """Root endpoint with API info."""
    return {
        "name": "Watermark Detection API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "detect": "/detect (POST) - Use image file path",
            "detect-upload": "/detect-upload (POST) - Upload image file directly",
            "docs": "/docs"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host=config.HOST,
        port=config.PORT,
        reload=config.RELOAD
    )
