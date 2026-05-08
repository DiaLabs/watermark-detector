"""
Backend initialization for watermark detector.
"""

from src.inference import WatermarkDetector
from src.utils import draw_bboxes, format_response

__all__ = ['WatermarkDetector', 'draw_bboxes', 'format_response']
