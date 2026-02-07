from ultralytics import YOLO
import os
import torch

# --- CONFIGURATION ---
# Point this to the data.yaml file you just edited
# Use "os.path.abspath" to avoid path errors
DATASET_YAML = os.path.abspath("datasets/trash_data/data.yaml")

def train_model():
    print(f"🚀 Loading YOLOv11 (yolo11n.pt)...")
    model = YOLO('yolo11n.pt') 

    print(f"📂 Training on dataset: {DATASET_YAML}")
    
    # Check for GPU
    device = 0 if torch.cuda.is_available() else 'cpu'
    print(f"⚙️ Device: {device}")

    # Start Training
    model.train(
        data=DATASET_YAML,
        epochs=15,          
        imgsz=640,
        batch=8,           # Keep small for laptops
        name='my_local_model',
        device=device
    )

    print("✅ Training Complete!")
    
    # Move model
    source = os.path.join("runs", "detect", "my_local_model", "weights", "best.pt")
    dest = os.path.join("models", "best_underwater.pt")
    
    os.makedirs("models", exist_ok=True)
    if os.path.exists(source):
        os.replace(source, dest)
        print(f"🏆 Model moved to: {dest}")
    else:
        print(f"⚠️ Model saved at: {source}")

if __name__ == "__main__":
    train_model()