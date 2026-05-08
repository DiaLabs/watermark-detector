import cv2
import numpy as np
from pathlib import Path
from datetime import datetime


def draw_bboxes(image_path: str | Path, detections: list, output_path: str | Path = None):
    """
    Draw bounding boxes on image and save annotated version.
    
    Args:
        image_path: Path to input image
        detections: List of detection dicts with bbox and confidence
        output_path: Path to save annotated image (auto-generated if None)
        
    Returns:
        Path to saved annotated image
    """
    image_path = Path(image_path)
    
    # Read image
    image = cv2.imread(str(image_path))
    if image is None:
        raise ValueError(f"Could not read image: {image_path}")
    
    # Draw each detection
    for detection in detections:
        x1, y1 = int(detection["x1"]), int(detection["y1"])
        x2, y2 = int(detection["x2"]), int(detection["y2"])
        conf = detection["confidence"]
        
        # Draw rectangle
        cv2.rectangle(image, (x1, y1), (x2, y2), color=(0, 255, 0), thickness=2)
        
        # Draw label with confidence
        label = f"Watermark {conf:.2f}"
        label_size, _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
        cv2.rectangle(
            image,
            (x1, y1 - label_size[1] - 8),
            (x1 + label_size[0] + 4, y1),
            color=(0, 255, 0),
            thickness=-1
        )
        cv2.putText(
            image,
            label,
            (x1 + 2, y1 - 4),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            color=(0, 0, 0),
            thickness=2
        )
    
    # Generate output path if not provided
    if output_path is None:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        output_path = Path(__file__).parent.parent / "outputs" / f"annotated_{timestamp}.jpg"
    else:
        output_path = Path(output_path)
    
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Save annotated image
    cv2.imwrite(str(output_path), image)
    
    return output_path


def format_response(image_path: str | Path, detections: list, annotated_image_path: str | Path = None):
    """
    Format detection results for API response.
    
    Args:
        image_path: Original image path
        detections: List of detection dicts
        annotated_image_path: Path to annotated image
        
    Returns:
        dict ready for JSON response
    """
    original_url = f"/outputs/uploads/{Path(image_path).name}" if Path(image_path).parent.name == "uploads" else str(image_path)
    annotated_url = f"/outputs/{Path(annotated_image_path).name}" if annotated_image_path else None
    
    return {
        "original_image": original_url,
        "annotated_image": annotated_url,
        "detection_count": len(detections),
        "detections": detections,
        "summary": f"Found {len(detections)} watermark(s)"
    }
