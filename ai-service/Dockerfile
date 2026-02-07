# 1. Use a slim Python image (Fast download)
FROM python:3.9-slim

# 2. Install OS dependencies required for OpenCV
# (glib and libgl allow Python to manipulate images)
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 3. Set the working folder inside the container
WORKDIR /app

# 4. Copy requirements first!
# This caches the install step. If you change code but not requirements,
# Docker won't re-download everything.
COPY requirements.txt .

# 5. Install Python Libraries
# --no-cache-dir keeps the image small
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copy the rest of your code
COPY . .

# 7. Expose the port Flask runs on
EXPOSE 5000

# 8. Command to start the server
CMD ["python", "app.py"]