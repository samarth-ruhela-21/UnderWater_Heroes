from ultralytics import YOLO
import os

# 1. Define Paths
# We look for the data.yaml file inside the datasets folder we just created
# Note: The folder name inside datasets might vary slightly (e.g., "trash-underwater-1")
# Check your folder name after downloading if this fails!
DATASET_PATH = os.path.join(os.getcwd(), "datasets", "trash-underwater-1", "data.yaml")

# 2. Setup Model
print("🚀 Loading YOLOv8 Nano model...")
model = YOLO('yolov8n.pt') 

# 3. Start Local Training
print(f"🏋️ Starting Training using data at: {DATASET_PATH}")
print("☕ This may take a while (1-2 hours on CPU, 10 mins on GPU)...")

# Check if GPU is available, otherwise use CPU
import torch
device = 0 if torch.cuda.is_available() else 'cpu'
print(f"⚙️ Compute Device: {device} (0=GPU, cpu=Slow)")

try:
    results = model.train(
        data=DATASET_PATH,
        epochs=15,             # Reduced to 15 for faster local testing
        imgsz=640,
        batch=8,               # Lower batch size to prevent crashing your PC
        name='my_local_underwater_model',
        device=device
    )

    print("\n✅ Training Complete!")
    
    # 4. Move the best model to the main models folder automatically
    source = os.path.join("runs", "detect", "my_local_underwater_model", "weights", "best.pt")
    destination = os.path.join("models", "best_underwater.pt")
    
    if os.path.exists(source):
        os.rename(source, destination)
        print(f"🏆 Model saved to: {destination}")
    else:
        print(f"⚠️ Could not auto-move model. Look for it in: {source}")

except Exception as e:
    print(f"\n❌ Training Error: {e}")
    print("Tip: Check if the 'datasets' folder path is correct.")