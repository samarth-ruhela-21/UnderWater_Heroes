import os
from pathlib import Path
from roboflow import Roboflow
from dotenv import load_dotenv

# Load API Key from .env file
load_dotenv()
api_key = os.getenv("ROBOFLOW_API_KEY")

if not api_key:
    print("❌ Error: ROBOFLOW_API_KEY not found in .env file.")
    exit(1)

# Setup Local Paths (dataset folder placed at project root)
BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_DIR = BASE_DIR / "datasets"
DATASET_DIR.mkdir(parents=True, exist_ok=True)

print(f"⬇️ Downloading Dataset to: {DATASET_DIR}...")

try:
    rf = Roboflow(api_key=api_key)
    # Use the default workspace and correct project name
    project = rf.workspace().project("trash-underwater")

    # Download directly to the local folder (use supported format like 'yolov11')
    dataset = project.version(1).download("yolov11", location=str(DATASET_DIR))

    if hasattr(dataset, 'location') and dataset.location:
        print("\n✅ Data Downloaded Successfully!")
        print(f"📂 Location: {dataset.location}")
        print("👉 Now run 'python scripts/2_train_local.py'")
    else:
        print("\n⚠️  Download finished but returned no location; check the datasets folder")

except Exception as e:
    print(f"\n❌ Failed: {e}")
    print("🔎 Check: .env ROBOFLOW_API_KEY, network access, and that the project/version exist on Roboflow.")