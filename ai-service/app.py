import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import numpy as np
from utils.image_proc import detect_algae_bloom, estimate_microplastics

app = Flask(__name__)
CORS(app)

# --- LOAD YOUR LOCAL MODEL ---
# It looks for the file we just trained in Step 2
MODEL_PATH = os.path.join("models", "best_underwater.pt")

if os.path.exists(MODEL_PATH):
    print(f"✅ Loading Custom Local Model: {MODEL_PATH}")
    model = YOLO(MODEL_PATH)
else:
    print("⚠️ Custom model not found. Run 'scripts/2_train_local.py' first!")
    print("➡️ Falling back to standard YOLOv8n (Surface Plastic only).")
    model = YOLO("yolov8n.pt")

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'image' not in request.files:
        return jsonify({"error": "No file"}), 400

    file = request.files['image']
    img_bytes = file.read()
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # 1. Run Local Inference
    results = model(img)
    
    detections = []
    plastic_count = 0

    for r in results:
        for box in r.boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            
            # Add detection logic
            plastic_count += 1
            detections.append({
                "class": model.names[cls_id],
                "confidence": round(conf, 2)
            })

    # 2. Run Image Utils
    algae = detect_algae_bloom(img)
    micro = estimate_microplastics(img)

    return jsonify({
        "plastic_stats": {
            "count": plastic_count,
            "items": detections
        },
        "water_quality": {
            "algae": algae,
            "microplastic_risk": micro
        }
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)