import cv2
import numpy as np
from pathlib import Path
import base64


def image_to_base64(image: np.ndarray, format: str = ".jpg") -> str:
    """Convert OpenCV image to base64 string."""
    _, buffer = cv2.imencode(format, image)
    return base64.b64encode(buffer).decode("utf-8")


def draw_bboxes(image: np.ndarray, detections: list) -> str:
    """
    Draw bounding boxes on image and return base64 string.
    """
    annotated = image.copy()
    
    for detection in detections:
        x1, y1 = int(detection["x1"]), int(detection["y1"])
        x2, y2 = int(detection["x2"]), int(detection["y2"])
        conf = detection.get("ensemble_score", detection.get("confidence", 0))
        ocr_text = detection.get("ocr_text", "")
        
        cv2.rectangle(annotated, (x1, y1), (x2, y2), color=(0, 255, 0), thickness=2)
        
        label = f"WM {conf:.2f}"
        if ocr_text:
            label += f" | '{ocr_text[:12]}...'" if len(ocr_text) > 12 else f" | '{ocr_text}'"
            
        label_size, _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
        cv2.rectangle(
            annotated,
            (x1, y1 - label_size[1] - 8),
            (x1 + label_size[0] + 4, y1),
            color=(0, 255, 0),
            thickness=-1
        )
        cv2.putText(
            annotated,
            label,
            (x1 + 2, y1 - 4),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            color=(0, 0, 0),
            thickness=2
        )
    
    return image_to_base64(annotated)


def format_response(detections: list, annotated_base64: str = None, heatmap_image: np.ndarray = None):
    """
    Format detection results for API response.
    """
    heatmap_base64 = None
    if heatmap_image is not None:
        heatmap_base64 = image_to_base64(heatmap_image)
        
    return {
        "annotated_image": f"data:image/jpeg;base64,{annotated_base64}" if annotated_base64 else None,
        "heatmap_image": f"data:image/jpeg;base64,{heatmap_base64}" if heatmap_base64 else None,
        "detection_count": len(detections),
        "detections": detections,
        "summary": f"Found {len(detections)} watermark(s)"
    }
