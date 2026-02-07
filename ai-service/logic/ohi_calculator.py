def calculate_ohi(ph, turbidity, plastic_density, temp):
    """
    Calculates Ocean Health Index (0-100) based on weighted parameters.
    Weights: pH (30%), Turbidity (30%), Plastic (25%), Temp (15%)
    """
    
    # 1. pH Score (Optimal is 6.5 - 8.5)
    # Distance from ideal 7.5. Max deduction if pH < 4 or > 10
    dist_ph = abs(ph - 7.5)
    ph_score = max(0, 100 - (dist_ph * 20))
    
    # 2. Turbidity Score (Lower is better)
    # 0 NTU = 100 score, 50+ NTU = 0 score
    turb_score = max(0, 100 - (turbidity * 2))
    
    # 3. Plastic Density Score (Lower is better)
    # Density is items/m2. 0 items = 100 score.
    plastic_score = max(0, 100 - (plastic_density * 5))
    
    # 4. Temperature Score (Stable is good)
    # Assume 20-30C is ideal for Indian waters
    if 20 <= temp <= 30:
        temp_score = 100
    else:
        temp_score = max(0, 100 - (abs(temp - 25) * 5))

    # Weighted Calculation
    final_ohi = (
        (ph_score * 0.30) + 
        (turb_score * 0.30) + 
        (plastic_score * 0.25) + 
        (temp_score * 0.15)
    )

    # Determine Status Color (from your notes)
    if final_ohi > 75: status = "Green"    # Excellent
    elif final_ohi > 50: status = "Yellow" # Moderate
    elif final_ohi > 25: status = "Orange" # Poor
    else: status = "Red"                   # Critical

    return int(final_ohi), status