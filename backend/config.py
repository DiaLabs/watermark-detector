import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent
MODEL_PATH = BASE_DIR / "best.pt"
OUTPUT_DIR = BASE_DIR / "outputs"

# Ensure output directory exists
OUTPUT_DIR.mkdir(exist_ok=True)

# FastAPI Server
HOST = "0.0.0.0"
PORT = 8000
RELOAD = True

# YOLO Inference
CONFIDENCE_THRESHOLD = 0.5
IOU_THRESHOLD = 0.5
