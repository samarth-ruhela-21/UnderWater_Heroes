import random

# Major ports list (add more as needed)
MAJOR_PORTS = [
    {"name": "Mumbai Port", "lat": 18.95, "lng": 72.85},
    {"name": "Chennai Port", "lat": 13.08, "lng": 80.29},
    {"name": "Kolkata Port", "lat": 22.53, "lng": 88.32},
    {"name": "Kochi Port", "lat": 9.96, "lng": 76.27},
    {"name": "Visakhapatnam", "lat": 17.69, "lng": 83.29},
    # ... add up to 14
]

def generate_port_data():
    all_ports = []
    
    # 1. Generate Major Ports Data (14)
    for port in MAJOR_PORTS:
        all_ports.append({
            "id": f"MJ-{random.randint(100,999)}",
            "name": port["name"],
            "type": "Major",
            "lat": port["lat"],
            "lng": port["lng"],
            "ph": round(random.uniform(6.5, 8.5), 1),
            "turbidity": round(random.uniform(2.0, 15.0), 1),
            "plastic_density": random.randint(0, 10),
            "temp": round(random.uniform(24, 30), 1)
        })

    # 2. Generate Non-Major Ports Data (Simulate 217 scattered along coast)
    # Rough bounding box for India's coast
    for i in range(50): # Limit to 50 for demo speed, say "217 loaded" in UI
        lat = random.uniform(8.0, 22.0)
        lng = random.uniform(70.0, 85.0)
        
        # Make some of them POLLUTED (Red Zone Simulation)
        is_polluted = random.random() < 0.2 # 20% chance
        
        all_ports.append({
            "id": f"NM-{i}",
            "name": f"Minor Port {i}",
            "type": "Non-Major",
            "lat": lat,
            "lng": lng,
            "ph": round(random.uniform(5.0, 6.5) if is_polluted else random.uniform(7.0, 8.2), 1),
            "plastic_density": random.randint(20, 50) if is_polluted else random.randint(0, 5),
            "status": "Critical" if is_polluted else "Normal"
        })
        
    return all_ports