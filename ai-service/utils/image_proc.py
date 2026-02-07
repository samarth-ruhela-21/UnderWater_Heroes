import cv2
import numpy as np

def detect_algae_bloom(img_array):
    """
    DETECT ALGAE (No training needed)
    Logic: Algae makes water excessively green. We measure the "Green Saturation".
    """
    # Convert to HSV color space (better for color detection)
    hsv = cv2.cvtColor(img_array, cv2.COLOR_BGR2HSV)

    # Define the "Algae Green" color range
    lower_green = np.array([35, 50, 50])  # Light green
    upper_green = np.array([85, 255, 255]) # Dark muck green

    # Create a mask (1 for green pixels, 0 for others)
    mask = cv2.inRange(hsv, lower_green, upper_green)

    # Count how much of the image is green
    total_pixels = img_array.shape[0] * img_array.shape[1]
    green_pixels = cv2.countNonZero(mask)
    ratio = (green_pixels / total_pixels) * 100

    return {
        "detected": ratio > 15.0, # If >15% of image is green bloom
        "severity": round(ratio, 2),
        "status": "Critical Algae Bloom" if ratio > 40 else "Moderate Algae" if ratio > 15 else "Clear"
    }

def estimate_microplastics(img_array):
    """
    DETECT MICROPLASTICS PROXY (Turbidity)
    Logic: Microplastics make water cloudy. We measure 'Edge Sharpness'.
    Clear water = Sharp edges. Polluted water = Blurry.
    """
    gray = cv2.cvtColor(img_array, cv2.COLOR_BGR2GRAY)
    
    # Laplacian Variance measures "focus". Low variance = Blurry = Turbid.
    clarity_score = cv2.Laplacian(gray, cv2.CV_64F).var()
    
    # Invert score: High Clarity (500) -> Low Turbidity (0)
    # Low Clarity (50) -> High Turbidity (100)
    turbidity_index = max(0, min(100, 100 - (clarity_score / 5)))
    
    return {
        "turbidity_index": round(turbidity_index, 2),
        "risk_level": "High Microplastic Risk" if turbidity_index > 80 else "Low Risk"
    }