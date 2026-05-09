from pathlib import Path
import logging
import torch
import torch.nn as nn
import numpy as np

try:
    from ultralytics.utils import loss as ultralytics_loss
except Exception:  # ultralytics may not be importable yet
    ultralytics_loss = None

if ultralytics_loss is not None and not hasattr(ultralytics_loss, "DFLoss"):
    class DFLoss(nn.Module):
        """Fallback to satisfy older ultralytics checkpoints during unpickle."""

        def __init__(self, *args, **kwargs):
            super().__init__()

        def forward(self, *args, **kwargs):
            raise RuntimeError("DFLoss is training-only and should not run in inference.")

    ultralytics_loss.DFLoss = DFLoss

# Patch torch.load to disable weights_only for ultralytics compatibility
_original_torch_load = torch.load

def patched_torch_load(f, *args, **kwargs):
    """Patched torch.load that disables weights_only for .pt model files."""
    if isinstance(f, (str, Path)) and str(f).endswith('.pt'):
        kwargs['weights_only'] = False
    return _original_torch_load(f, *args, **kwargs)

torch.load = patched_torch_load

from ultralytics import YOLO

logger = logging.getLogger(__name__)


class WatermarkDetector:
    """Load and run YOLOv8 watermark detection model."""

    def __init__(self, model_path: str | Path):
        """
        Initialize detector with trained model.
        
        Args:
            model_path: Path to best.pt model file
        """
        self.model_path = Path(model_path)
        
        if not self.model_path.exists():
            raise FileNotFoundError(f"Model not found: {self.model_path}")
        
        logger.info(f"Loading model from {self.model_path}")
        self.model = YOLO(str(self.model_path))
        logger.info("Model loaded successfully")

    def detect(self, source: str | Path | np.ndarray, conf: float = 0.5, iou: float = 0.5):
        """
        Detect watermarks in image.
        
        Args:
            source: Path to input image OR numpy array (OpenCV image)
            conf: Confidence threshold (0-1)
            iou: IoU threshold for NMS (0-1)
            
        Returns:
            dict with detections: bounding boxes, confidences, class labels
        """
        is_path = isinstance(source, (str, Path))
        
        if is_path:
            source_path = Path(source)
            if not source_path.exists():
                raise FileNotFoundError(f"Image not found: {source_path}")
            source_input = str(source_path)
        else:
            source_input = source
        
        # Run inference
        results = self.model.predict(
            source=source_input,
            conf=conf,
            iou=iou,
            verbose=False
        )
        
        # Extract detections from result
        result = results[0]  # Single image
        detections = []
        
        if result.boxes is not None:
            for box in result.boxes:
                detection = {
                    "x1": float(box.xyxy[0][0]),
                    "y1": float(box.xyxy[0][1]),
                    "x2": float(box.xyxy[0][2]),
                    "y2": float(box.xyxy[0][3]),
                    "confidence": float(box.conf),
                    "class_name": "watermark",
                    "class_id": int(box.cls)
                }
                detections.append(detection)
        
        return {
            "detections": detections,
            "count": len(detections)
        }
