import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import numpy as np
# Ensure you have the utils folder with image_proc.py
from utils.image_proc import detect_algae_bloom, estimate_microplastics

app = Flask(__name__)
CORS(app)

# --- LOAD MODEL ---
# Priority: Custom Trained Model -> Standard YOLOv11
MODEL_PATH = os.path.join("models", "best_underwater.pt")

if os.path.exists(MODEL_PATH):
    print(f"✅ Loading Custom Local Model (YOLOv11): {MODEL_PATH}")
    model = YOLO(MODEL_PATH)
else:
    print("⚠️ Custom model not found. Run 'scripts/2_train_local.py' first!")
    print("➡️ Falling back to standard YOLOv11n (Surface Plastic only).")
    model = YOLO("yolo11n.pt") 

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'image' not in request.files:
        return jsonify({"error": "No file"}), 400

    file = request.files['image']
    img_bytes = file.read()
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # 1. Run YOLOv11 Inference
    results = model(img)
    
    detections = []
    plastic_count = 0

    # Process Results
    for r in results:
        for box in r.boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            class_name = model.names[cls_id]
            
            # Simple Logic: Count everything the model detects as "Debris"
            # Since we trained on a specific trash dataset, everything it sees is trash.
            plastic_count += 1
            detections.append({
                "class": class_name,
                "confidence": round(conf, 2)
            })

    # 2. Run Water Quality Checks
    algae = detect_algae_bloom(img)
    micro = estimate_microplastics(img)

    return jsonify({
        "plastic_stats": {
            "count": plastic_count,
            "items": detections,
            "status": "Polluted" if plastic_count > 0 else "Clean"
        },
        "water_quality": {
            "algae": algae,
            "microplastic_risk": micro
        }
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)