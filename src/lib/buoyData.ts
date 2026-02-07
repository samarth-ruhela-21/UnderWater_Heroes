// Simulated buoy data for the AquaPulse demo
// In production, this would come from real IoT sensors or a backend API

export interface BuoyData {
  id: string;
  name: string;
  type: 'Major' | 'Non-Major';
  lat: number;
  lng: number;
  ph: number;
  turbidity: number;
  dissolvedOxygen: number;
  temperature: number;
  plasticDensity: number;
  ohiScore: number;
  status: 'Excellent' | 'Good' | 'Poor' | 'Critical';
  lastUpdated: Date;
}

export interface UserReport {
  id: string;
  imageUrl: string;
  location: { lat: number; lng: number };
  uploadTime: Date;
  plasticCount: number;
  debrisDetected: string[];
  confidence: number;
  isVerified: boolean;
  actionTaken: 'Pending' | 'Cleaning' | 'Resolved' | 'Drone Dispatched';
  reporterName?: string;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  location: string;
  timestamp: Date;
  isRead: boolean;
}

// Calculate OHI Score based on CPCB standards
export function calculateOHI(
  ph: number,
  turbidity: number,
  plasticDensity: number,
  temperature: number
): { score: number; status: 'Excellent' | 'Good' | 'Poor' | 'Critical' } {
  // pH Score (Optimal is 6.5 - 8.5, ideal 7.5)
  const distPh = Math.abs(ph - 7.5);
  const phScore = Math.max(0, 100 - distPh * 20);

  // Turbidity Score (Lower is better, 0 NTU = 100, 50+ = 0)
  const turbScore = Math.max(0, 100 - turbidity * 2);

  // Plastic Density Score (0 items = 100)
  const plasticScore = Math.max(0, 100 - plasticDensity * 5);

  // Temperature Score (20-30C is ideal for Indian waters)
  let tempScore = 100;
  if (temperature < 20 || temperature > 30) {
    tempScore = Math.max(0, 100 - Math.abs(temperature - 25) * 5);
  }

  // Weighted Calculation
  const finalOHI =
    phScore * 0.3 + turbScore * 0.3 + plasticScore * 0.25 + tempScore * 0.15;

  let status: 'Excellent' | 'Good' | 'Poor' | 'Critical';
  if (finalOHI > 75) status = 'Excellent';
  else if (finalOHI > 50) status = 'Good';
  else if (finalOHI > 25) status = 'Poor';
  else status = 'Critical';

  return { score: Math.round(finalOHI), status };
}

// Generate random drift for realistic sensor values
function generateDrift(currentVal: number, min: number, max: number, volatility = 0.1): number {
  const change = (Math.random() * volatility * 2) - volatility;
  const newVal = currentVal + change;
  return Math.max(min, Math.min(max, newVal));
}

// Major Indian ports
const MAJOR_PORTS = [
  { id: 'MJ-001', name: 'Mumbai Port', lat: 18.94, lng: 72.83 },
  { id: 'MJ-002', name: 'Chennai Port', lat: 13.08, lng: 80.27 },
  { id: 'MJ-003', name: 'Kolkata Port', lat: 22.57, lng: 88.36 },
  { id: 'MJ-004', name: 'Kochi Port', lat: 9.96, lng: 76.27 },
  { id: 'MJ-005', name: 'Visakhapatnam Port', lat: 17.69, lng: 83.29 },
  { id: 'MJ-006', name: 'Kandla Port', lat: 23.03, lng: 70.22 },
  { id: 'MJ-007', name: 'JNPT Navi Mumbai', lat: 18.95, lng: 72.95 },
  { id: 'MJ-008', name: 'Paradip Port', lat: 20.26, lng: 86.61 },
  { id: 'MJ-009', name: 'New Mangalore Port', lat: 12.92, lng: 74.81 },
  { id: 'MJ-010', name: 'Ennore Port', lat: 13.22, lng: 80.32 },
];

// Generate initial buoy data
export function generateBuoyData(): BuoyData[] {
  const buoys: BuoyData[] = [];

  // Major ports
  MAJOR_PORTS.forEach((port) => {
    const isPolluted = Math.random() < 0.15; // 15% chance of pollution
    const ph = isPolluted
      ? generateDrift(5.5, 4.5, 6.0, 0.3)
      : generateDrift(7.8, 7.2, 8.2, 0.1);
    const turbidity = isPolluted
      ? generateDrift(20, 15, 30, 2)
      : generateDrift(3, 1, 5, 0.5);
    const plasticDensity = isPolluted
      ? Math.floor(Math.random() * 30) + 15
      : Math.floor(Math.random() * 5);
    const temperature = generateDrift(27, 24, 30, 0.5);
    const dissolvedOxygen = isPolluted
      ? generateDrift(4, 2, 5, 0.3)
      : generateDrift(7, 6, 9, 0.2);

    const { score, status } = calculateOHI(ph, turbidity, plasticDensity, temperature);

    buoys.push({
      id: port.id,
      name: port.name,
      type: 'Major',
      lat: port.lat,
      lng: port.lng,
      ph: parseFloat(ph.toFixed(2)),
      turbidity: parseFloat(turbidity.toFixed(1)),
      dissolvedOxygen: parseFloat(dissolvedOxygen.toFixed(1)),
      temperature: parseFloat(temperature.toFixed(1)),
      plasticDensity,
      ohiScore: score,
      status,
      lastUpdated: new Date(),
    });
  });

  // Non-major ports (scattered along Indian coast)
  for (let i = 0; i < 20; i++) {
    const lat = 8 + Math.random() * 15; // 8°N to 23°N
    const lng = 68 + Math.random() * 20; // 68°E to 88°E
    const isPolluted = Math.random() < 0.2;

    const ph = isPolluted
      ? generateDrift(5.5, 4.5, 6.0, 0.3)
      : generateDrift(7.8, 7.2, 8.2, 0.1);
    const turbidity = isPolluted
      ? generateDrift(20, 15, 30, 2)
      : generateDrift(3, 1, 5, 0.5);
    const plasticDensity = isPolluted
      ? Math.floor(Math.random() * 30) + 15
      : Math.floor(Math.random() * 5);
    const temperature = generateDrift(27, 24, 30, 0.5);
    const dissolvedOxygen = isPolluted
      ? generateDrift(4, 2, 5, 0.3)
      : generateDrift(7, 6, 9, 0.2);

    const { score, status } = calculateOHI(ph, turbidity, plasticDensity, temperature);

    buoys.push({
      id: `NM-${i.toString().padStart(3, '0')}`,
      name: `Coastal Station ${i + 1}`,
      type: 'Non-Major',
      lat,
      lng,
      ph: parseFloat(ph.toFixed(2)),
      turbidity: parseFloat(turbidity.toFixed(1)),
      dissolvedOxygen: parseFloat(dissolvedOxygen.toFixed(1)),
      temperature: parseFloat(temperature.toFixed(1)),
      plasticDensity,
      ohiScore: score,
      status,
      lastUpdated: new Date(),
    });
  }

  return buoys;
}

// Generate sample user reports
export function generateUserReports(): UserReport[] {
  return [
    {
      id: 'RPT-001',
      imageUrl: '/placeholder.svg',
      location: { lat: 19.07, lng: 72.87 },
      uploadTime: new Date(Date.now() - 1000 * 60 * 30),
      plasticCount: 5,
      debrisDetected: ['Bottle', 'Bag', 'Net'],
      confidence: 0.89,
      isVerified: true,
      actionTaken: 'Pending',
      reporterName: 'Anonymous Citizen',
    },
    {
      id: 'RPT-002',
      imageUrl: '/placeholder.svg',
      location: { lat: 13.05, lng: 80.25 },
      uploadTime: new Date(Date.now() - 1000 * 60 * 120),
      plasticCount: 12,
      debrisDetected: ['Bottle', 'Cup', 'Fishing Net', 'Oil Slick'],
      confidence: 0.94,
      isVerified: true,
      actionTaken: 'Drone Dispatched',
      reporterName: 'Marine Watch Volunteer',
    },
    {
      id: 'RPT-003',
      imageUrl: '/placeholder.svg',
      location: { lat: 15.42, lng: 73.98 },
      uploadTime: new Date(Date.now() - 1000 * 60 * 60),
      plasticCount: 3,
      debrisDetected: ['Bottle', 'Container'],
      confidence: 0.76,
      isVerified: false,
      actionTaken: 'Pending',
    },
  ];
}

// Generate alerts
export function generateAlerts(): Alert[] {
  return [
    {
      id: 'ALT-001',
      type: 'critical',
      message: 'pH Critical at Buoy #4 (Chennai Port)',
      location: 'Chennai Port',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isRead: false,
    },
    {
      id: 'ALT-002',
      type: 'warning',
      message: 'Plastic Debris reported by User at Juhu Beach',
      location: 'Mumbai, Juhu Beach',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      isRead: false,
    },
    {
      id: 'ALT-003',
      type: 'warning',
      message: 'Turbidity levels rising at Kolkata Port',
      location: 'Kolkata Port',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isRead: true,
    },
    {
      id: 'ALT-004',
      type: 'info',
      message: 'Drone cleanup completed at Visakhapatnam',
      location: 'Visakhapatnam Port',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      isRead: true,
    },
    {
      id: 'ALT-005',
      type: 'critical',
      message: 'Oil slick detected near Kandla Port',
      location: 'Kandla Port',
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
      isRead: true,
    },
  ];
}

// Calculate global OQI average
export function calculateGlobalOQI(buoys: BuoyData[]): number {
  if (buoys.length === 0) return 0;
  const sum = buoys.reduce((acc, buoy) => acc + buoy.ohiScore, 0);
  return Math.round(sum / buoys.length);
}

// Get status color class
export function getStatusColor(status: string): string {
  switch (status) {
    case 'Excellent':
      return 'status-excellent';
    case 'Good':
      return 'status-good';
    case 'Poor':
      return 'status-poor';
    case 'Critical':
      return 'status-critical';
    default:
      return 'status-good';
  }
}

// Get status badge variant
export function getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'Excellent':
    case 'Good':
      return 'default';
    case 'Poor':
      return 'secondary';
    case 'Critical':
      return 'destructive';
    default:
      return 'outline';
  }
}
