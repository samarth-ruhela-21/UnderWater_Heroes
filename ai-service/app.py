# import os
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from ultralytics import YOLO
# import cv2
# import numpy as pipnp
# # Ensure you have the utils folder with image_proc.py
# from utils.image_proc import detect_algae_bloom, estimate_microplastics

# app = Flask(__name__)
# CORS(app)

# # --- LOAD MODEL ---
# # Priority: Custom Trained Model -> Standard YOLOv11
# MODEL_PATH = os.path.join("models", "best_underwater.pt")

# if os.path.exists(MODEL_PATH):
#     print(f"[OK] Loading Custom Local Model (YOLOv11): {MODEL_PATH}")
#     model = YOLO(MODEL_PATH)
# else:
#     print("[WARNING] Custom model not found. Run 'scripts/2_train_local.py' first!")
#     print("[INFO] Falling back to standard YOLOv11n (Surface Plastic only).")
#     model = YOLO("yolo11n.pt") 

# @app.route('/analyze', methods=['POST'])
# def analyze():
#     if 'image' not in request.files:
#         return jsonify({"error": "No file"}), 400

#     file = request.files['image']
#     img_bytes = file.read()
#     nparr = np.frombuffer(img_bytes, np.uint8)
#     img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

#     # 1. Run YOLOv11 Inference
#     results = model(img)
    
#     detections = []
#     plastic_count = 0

#     # Process Results
#     for r in results:
#         for box in r.boxes:
#             cls_id = int(box.cls[0])
#             conf = float(box.conf[0])
#             class_name = model.names[cls_id]
            
#             # Simple Logic: Count everything the model detects as "Debris"
#             # Since we trained on a specific trash dataset, everything it sees is trash.
#             plastic_count += 1
#             detections.append({
#                 "class": class_name,
#                 "confidence": round(conf, 2)
#             })

#     # 2. Run Water Quality Checks
#     algae = detect_algae_bloom(img)
#     micro = estimate_microplastics(img)

#     return jsonify({
#         "plastic_stats": {
#             "count": plastic_count,
#             "items": detections,
#             "status": "Polluted" if plastic_count > 0 else "Clean"
#         },
#         "water_quality": {
#             "algae": algae,
#             "microplastic_risk": micro
#         }
#     })

# @app.route('/')
# def home():
#     return "Hello, World! The server is working."

# if __name__ == '__main__':
#     app.run(port=5000, debug=True)



# //////////////////////////////////
# ////////////////////////////////////////////

import os
import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO

# --- UTILS IMPORT ---
# Ensure your directory structure has: /utils/image_proc.py
try:
    from utils.image_proc import detect_algae_bloom, estimate_microplastics
except ImportError:
    print("[ERROR] utils/image_proc.py not found. Please ensure the file exists.")
    # Fallback dummy functions if file is missing for testing
    def detect_algae_bloom(img): return False
    def estimate_microplastics(img): return "Low"

app = Flask(__name__)

# --- CORS CONFIGURATION ---
# This allows your React frontend (usually on port 5173 or 3000) 
# to make requests to this Flask server.
CORS(app)

# --- LOAD MODEL ---
# Priority: Custom Trained Model -> Standard YOLOv11
MODEL_PATH = os.path.join("models", "best_underwater.pt")

if os.path.exists(MODEL_PATH):
    print(f"[OK] Loading Custom Local Model (YOLOv11): {MODEL_PATH}")
    model = YOLO(MODEL_PATH)
else:
    print("[WARNING] Custom model not found. Run 'scripts/2_train_local.py' first!")
    print("[INFO] Falling back to standard YOLOv11n (General Debris).")
    model = YOLO("yolo11n.pt") 

@app.route('/analyze', methods=['POST'])
def analyze():
    # Check if image was sent
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided in the request"}), 400

    try:
        file = request.files['image']
        
        # Convert the uploaded file to an OpenCV image
        img_bytes = file.read()
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({"error": "Invalid image format"}), 400

        # 1. Run YOLOv11 Inference
        # We set stream=False for simple single-image API processing
        results = model(img)
        
        detections = []
        plastic_count = 0

        # Process Results
        for r in results:
            for box in r.boxes:
                cls_id = int(box.cls[0])
                conf = float(box.conf[0])
                class_name = model.names[cls_id]
                
                # Increment count for every detected item (Trash/Debris)
                plastic_count += 1
                detections.append({
                    "class": class_name,
                    "confidence": round(conf, 2)
                })

        # 2. Run Water Quality Checks (Heuristic/CV based)
        algae_detected = detect_algae_bloom(img)
        micro_risk = estimate_microplastics(img)

        # 3. Return JSON response structured for the React Report.tsx
        return jsonify({
            "plastic_stats": {
                "count": plastic_count,
                "items": detections,
                "status": "Polluted" if plastic_count > 0 else "Clean"
            },
            "water_quality": {
                "algae": algae_detected,
                "microplastic_risk": micro_risk
            }
        })

    except Exception as e:
        print(f"[SERVER ERROR] {str(e)}")
        return jsonify({"error": "Internal server error during analysis"}), 500

@app.route('/')
def home():
    return jsonify({
        "status": "online",
        "message": "AquaPulse ML Server is running",
        "model_loaded": MODEL_PATH if os.path.exists(MODEL_PATH) else "yolo11n.pt"
    })

if __name__ == '__main__':
    # Run on port 5000 - matches the React 'fetch' URL
    app.run(host='0.0.0.0', port=5000, debug=True)