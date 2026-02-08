# test_api.py
import requests

# URL of your running Flask app
url = "http://127.0.0.1:5000"

# Path to a sample image you want to test
image_path = "datasets/trash_data/train/images/4oe-ajpfk_jpg.rf.cdf0da665146166df573fb119857ede8.jpg" 

try:
    with open(image_path, "rb") as img:
        # Send the POST request
        response = requests.post(url + "/analyze", files={"image": img})
    
    # Print the JSON response from the server
    print("✅ Status Code:", response.status_code)
    print("📄 Response:", response.json())
    
except FileNotFoundError:
    print(f"❌ Error: Could not find image at {image_path}")
except Exception as e:
    print(f"❌ Connection Error: {e}")