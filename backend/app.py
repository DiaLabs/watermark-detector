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

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Watermark Detector", version="1.0.0")

# Mount outputs directory for static file serving
app.mount("/outputs", StaticFiles(directory=str(Path(__file__).parent / "outputs")), name="outputs")

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
    original_image: str
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
    Detect watermarks in image.
    
    Args:
        request.image_path: Path to input image (relative or absolute)
        
    Returns:
        Detection results with annotated image and metadata
    """
    if detector is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Resolve image path
        image_path = Path(request.image_path)
        if not image_path.is_absolute():
            # Relative path - resolve from backend root
            image_path = Path(__file__).parent / image_path
        
        # Run detection
        result = detector.detect(
            image_path,
            conf=config.CONFIDENCE_THRESHOLD,
            iou=config.IOU_THRESHOLD
        )
        
        # Draw bounding boxes
        annotated_path = draw_bboxes(image_path, result["detections"])
        
        # Format response
        response = format_response(image_path, result["detections"], annotated_path)
        
        return response
        
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Detection error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/detect-upload", response_model=DetectionResponse)
async def detect_watermarks_upload(file: UploadFile = File(...)):
    """
    Detect watermarks in uploaded image file.
    
    Args:
        file: Image file upload (JPG, PNG, etc.)
        
    Returns:
        Detection results with annotated image and metadata
    """
    if detector is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Validate file type
        allowed_types = {"image/jpeg", "image/png", "image/bmp", "image/gif", "image/tiff"}
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {file.content_type}. Allowed: JPG, PNG, BMP, GIF, TIFF"
            )
        
        # Save uploaded file to temporary location
        temp_dir = Path(config.OUTPUT_DIR) / "uploads"
        temp_dir.mkdir(parents=True, exist_ok=True)
        
        temp_image_path = temp_dir / file.filename
        
        with open(temp_image_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        
        # Run detection
        result = detector.detect(
            temp_image_path,
            conf=config.CONFIDENCE_THRESHOLD,
            iou=config.IOU_THRESHOLD
        )
        
        # Draw bounding boxes
        annotated_path = draw_bboxes(temp_image_path, result["detections"])
        
        # Format response
        response = format_response(temp_image_path, result["detections"], annotated_path)
        
        return response
        
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
