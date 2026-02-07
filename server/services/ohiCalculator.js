// server/services/ohiCalculator.js

// Weights adjusted to sum to 1.0 for Sensor Data
const WEIGHTS = { ph: 0.4, turb: 0.4, temp: 0.2 };

const calculateOHI = (ph, turbidity, temp) => {
  // 1. pH Score (Ideal: 6.5 - 8.5)
  // Deviation from 7.5 reduces score
  let phScore = 100 - (Math.abs(ph - 7.5) * 20);
  if (phScore < 0) phScore = 0;

  // 2. Turbidity Score (Ideal: < 5 NTU)
  let turbScore = 100 - (turbidity * 3);
  if (turbScore < 0) turbScore = 0;

  // 3. Temperature Score (Ideal: 20-30°C)
  let tempScore = (temp >= 20 && temp <= 30) ? 100 : 50;

  // Final Weighted Average (Sums to 100 max)
  const totalScore = (phScore * WEIGHTS.ph) + (turbScore * WEIGHTS.turb) + (tempScore * WEIGHTS.temp);
  
  return Math.round(totalScore);
};

module.exports = calculateOHI;