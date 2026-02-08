import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, AlertTriangle, Anchor, ArrowLeft, Bell, Droplets, Gauge,
  RefreshCw, Thermometer, Waves, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import {
  generateBuoyData, generateAlerts, calculateGlobalOQI,
  type BuoyData, type Alert
} from '@/lib/buoyData';
// import { LeafletOceanMap } from '@/components/LeafletOceanMap';
import { LeafletOceanMap } from '@/components/LeafletOceanMap';
import { BuoyDetail } from '@/components/OceanMap';

// --- 1. EXTENDED INTERFACE ---
export interface EnrichedBuoyData extends BuoyData {
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// --- 2. REAL-TIME INDIAN SMART BUOYS (FROM INCOIS DATA) ---
// Exact coordinates from Indian oceanographic buoy network
const FIXED_STATIONS = [
  // --- BAY OF BENGAL BUOYS (BD series) ---
  { id: 'BD08', name: "BD08 Buoy", location: "Bay of Bengal", lat: 17.820, lng: 89.240 },
  { id: 'BD09', name: "BD09 Buoy", location: "Bay of Bengal", lat: 17.500, lng: 89.120 },
  { id: 'BD10', name: "BD10 Buoy", location: "Bay of Bengal", lat: 16.360, lng: 87.990 },
  { id: 'BD11', name: "BD11 Buoy", location: "Bay of Bengal", lat: 13.530, lng: 84.170 },
  { id: 'BD12', name: "BD12 Buoy", location: "Andaman Sea", lat: 10.520, lng: 94.070 },
  { id: 'BD13', name: "BD13 Buoy", location: "Bay of Bengal", lat: 13.990, lng: 87.000 },
  { id: 'BD14', name: "BD14 Buoy", location: "Andaman Sea", lat: 6.570, lng: 88.230 },

  // --- ARABIAN SEA BUOYS (AD series) ---
  { id: 'AD06', name: "AD06 Buoy", location: "Arabian Sea", lat: 18.500, lng: 67.450 },
  { id: 'AD07', name: "AD07 Buoy", location: "Arabian Sea", lat: 14.930, lng: 68.980 },
  { id: 'AD08', name: "AD08 Buoy", location: "Arabian Sea", lat: 12.070, lng: 68.630 },
  { id: 'AD09', name: "AD09 Buoy", location: "Arabian Sea", lat: 8.180, lng: 73.300 },
  { id: 'AD10', name: "AD10 Buoy", location: "Arabian Sea", lat: 10.320, lng: 72.590 },
] as const;

// --- COMPONENTS ---

function OHIGauge({ score, status }: { score: number; status: string }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const getColor = () => {
    if (score > 75) return 'hsl(var(--ocean-excellent))';
    if (score > 50) return 'hsl(var(--primary))';
    if (score > 25) return 'hsl(var(--ocean-warning))';
    return 'hsl(var(--ocean-critical))';
  };
  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
        <motion.circle
          cx="50" cy="50" r="45"
          stroke={getColor()} strokeWidth="8" fill="none" strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ strokeDasharray: circumference, filter: `drop-shadow(0 0 8px ${getColor()})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="text-3xl font-bold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: getColor() }}>{score}</motion.span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{status}</span>
      </div>
    </div>
  );
}

function AlertItem({ alert }: { alert: Alert }) {
  const iconMap = { critical: AlertTriangle, warning: Bell, info: Activity };
  const Icon = iconMap[alert.type];
  const colorMap = {
    critical: 'text-destructive bg-destructive/10',
    warning: 'text-orange-400 bg-orange-500/10',
    info: 'text-primary bg-primary/10',
  };
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`p-3 rounded-lg border ${alert.isRead ? 'border-border/50' : 'border-primary/50'}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${colorMap[alert.type]}`}><Icon className="w-4 h-4" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{alert.message}</p>
          <p className="text-xs text-muted-foreground mt-1">{alert.location} • {new Date(alert.timestamp).toLocaleTimeString()}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Generate realistic trending chart data that evolves over time
function generateChartData(baseTime: number = Date.now(), buoyId?: string) {
  const data = [];
  
  // Vary base values slightly per buoy for diversity
  const buoyOffset = buoyId ? (buoyId.charCodeAt(0) + buoyId.charCodeAt(buoyId.length - 1)) % 10 : 0;
  
  // Base values with some natural variation
  const phBase = 7.4 + (buoyOffset * 0.05);
  const turbidityBase = 3 + (buoyOffset * 0.3);
  const doBase = 7;
  const tempBase = 26;
  
  // Random walk parameters for smooth trends
  let phTrend = (Math.random() - 0.5) * 0.1;
  let turbTrend = (Math.random() - 0.5) * 0.3;
  let doTrend = (Math.random() - 0.5) * 0.2;
  let tempTrend = (Math.random() - 0.5) * 0.3;
  
  for (let i = 0; i < 24; i++) {
    // Add small random walk to trends for realistic variation
    phTrend += (Math.random() - 0.5) * 0.05;
    turbTrend += (Math.random() - 0.5) * 0.1;
    doTrend += (Math.random() - 0.5) * 0.08;
    tempTrend += (Math.random() - 0.5) * 0.1;
    
    // Constrain trends to prevent extreme drift
    phTrend = Math.max(-0.3, Math.min(0.3, phTrend));
    turbTrend = Math.max(-1, Math.min(1, turbTrend));
    doTrend = Math.max(-0.5, Math.min(0.5, doTrend));
    tempTrend = Math.max(-1, Math.min(1, tempTrend));
    
    // Calculate values with trend and some noise
    const timeOffset = (23 - i) * 3600000;
    const ph = Math.max(6.0, Math.min(9.0, phBase + phTrend + (Math.random() - 0.5) * 0.2));
    const turbidity = Math.max(0.5, Math.min(12, turbidityBase + turbTrend + (Math.random() - 0.5) * 0.5));
    const dissolvedOxygen = Math.max(5, Math.min(9, doBase + doTrend + (Math.random() - 0.5) * 0.3));
    const temperature = Math.max(24, Math.min(30, tempBase + tempTrend + (Math.random() - 0.5) * 0.4));
    
    data.push({
      time: new Date(baseTime - timeOffset).toLocaleTimeString('en-US', { hour: '2-digit' }),
      ph: parseFloat(ph.toFixed(2)),
      turbidity: parseFloat(turbidity.toFixed(2)),
      dissolvedOxygen: parseFloat(dissolvedOxygen.toFixed(2)),
      temperature: parseFloat(temperature.toFixed(2)),
    });
  }
  
  return data;
}

// Check for out-of-range values and generate alerts
function checkWaterQualityAlerts(buoyData: EnrichedBuoyData[]): Alert[] {
  const newAlerts: Alert[] = [];
  const now = Date.now();
  
  buoyData.forEach((buoy) => {
    // Check pH levels (Normal range: 6.5 - 8.5)
    if (buoy.ph < 6.5) {
      newAlerts.push({
        id: `pH-${buoy.id}-${now}`,
        type: 'critical',
        message: `High Acidity Detected - pH ${buoy.ph}`,
        location: `${buoy.name} (${buoy.location})`,
        timestamp: new Date(),
        isRead: false,
      });
    } else if (buoy.ph > 8.5) {
      newAlerts.push({
        id: `pH-${buoy.id}-${now}`,
        type: 'warning',
        message: `High Alkalinity Detected - pH ${buoy.ph}`,
        location: `${buoy.name} (${buoy.location})`,
        timestamp: new Date(),
        isRead: false,
      });
    }
    
    // Check turbidity levels (Normal range: 0 - 5 NTU)
    if (buoy.turbidity > 5 && buoy.turbidity <= 8) {
      newAlerts.push({
        id: `TURB-${buoy.id}-${now}`,
        type: 'warning',
        message: `Elevated Turbidity - ${buoy.turbidity} NTU`,
        location: `${buoy.name} (${buoy.location})`,
        timestamp: new Date(),
        isRead: false,
      });
    } else if (buoy.turbidity > 8) {
      newAlerts.push({
        id: `TURB-${buoy.id}-${now}`,
        type: 'critical',
        message: `Critical Turbidity - ${buoy.turbidity} NTU`,
        location: `${buoy.name} (${buoy.location})`,
        timestamp: new Date(),
        isRead: false,
      });
    }
  });
  
  return newAlerts;
}

// --- MAIN DASHBOARD ---

export default function Dashboard() {
  const [buoyData, setBuoyData] = useState<EnrichedBuoyData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [globalOQI, setGlobalOQI] = useState(76);
  const [selectedBuoy, setSelectedBuoy] = useState<EnrichedBuoyData | null>(null);
  const [buoyChartData, setBuoyChartData] = useState<Record<string, any[]>>({});
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // --- THE FIXED REFRESH LOGIC ---
  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // 1. Get random sensor data from library
      const randomSensorData = generateBuoyData();
      
      // 2. Map the 12 STATIC buoy stations to the random data
      const stableData = FIXED_STATIONS.map((station, index) => {
        // Grab a random data point for sensor readings only
        const sensorReading = randomSensorData[index % randomSensorData.length];
        
        // Destructure to exclude id, name, location, and coordinates from sensor data
        const { id: _, name: __, location: ___, coordinates: ____, ...sensorData } = sensorReading as any;
        
        // Create immutable coordinate object
        const staticCoordinates = Object.freeze({
          lat: station.lat,
          lng: station.lng
        });
        
        // Build buoy with STATIC location data and DYNAMIC sensor data only
        const buoyData: EnrichedBuoyData = {
          ...sensorData,
          // Static fields - these NEVER change
          id: station.id,
          name: station.name,
          location: station.location,
          coordinates: staticCoordinates
        };
        
        return buoyData;
      });

      setBuoyData(stableData);
      
      // 3. Generate buoy-specific chart data for each buoy
      const newBuoyChartData: Record<string, any[]> = {};
      stableData.forEach((buoy) => {
        newBuoyChartData[buoy.id] = generateChartData(Date.now(), buoy.id);
      });
      setBuoyChartData(newBuoyChartData);
      
      // 4. Check for water quality alerts
      const qualityAlerts = checkWaterQualityAlerts(stableData);
      const generalAlerts = generateAlerts();
      
      // Combine and limit to most recent 10 alerts
      setAlerts([...qualityAlerts, ...generalAlerts].slice(0, 10));
      
      setGlobalOQI(calculateGlobalOQI(randomSensorData));
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 500);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 15000); // Update every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const statusCounts = useMemo(() => ({
    excellent: buoyData.filter((b) => b.status === 'Excellent').length,
    good: buoyData.filter((b) => b.status === 'Good').length,
    poor: buoyData.filter((b) => b.status === 'Poor').length,
    critical: buoyData.filter((b) => b.status === 'Critical').length,
  }), [buoyData]);

  const globalStatus = useMemo(() => {
    if (globalOQI > 75) return 'Excellent';
    if (globalOQI > 50) return 'Good';
    if (globalOQI > 25) return 'Poor';
    return 'Critical';
  }, [globalOQI]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Waves className="w-6 h-6 text-primary" />
              <h1 className="text-lg font-semibold">Command Center</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <Button variant="outline" size="sm" onClick={refreshData} disabled={isRefreshing} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Excellent', value: statusCounts.excellent, color: 'text-green-400', bg: 'bg-green-500/10' },
                { label: 'Good', value: statusCounts.good, color: 'text-sky-400', bg: 'bg-sky-500/10' },
                { label: 'Poor', value: statusCounts.poor, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                { label: 'Critical', value: statusCounts.critical, color: 'text-red-400', bg: 'bg-red-500/10' },
              ].map((stat) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass-card p-4 rounded-xl ${stat.bg}`}>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label} Buoys</div>
                </motion.div>
              ))}
            </div>

            <Card className="glass-card overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Anchor className="w-5 h-5 text-primary" />
                      Live Buoy Network
                    </CardTitle>
                    <CardDescription>INCOIS oceanographic buoys - Arabian Sea & Bay of Bengal</CardDescription>
                  </div>
                  <Badge variant="outline" className="gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    {buoyData.length} Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[500px] w-full relative isolation-auto">
                  <LeafletOceanMap 
                    buoyData={buoyData} 
                    onBuoySelect={(b) => setSelectedBuoy(b as EnrichedBuoyData)} 
                  />
                  
                  <div className="absolute bottom-6 left-4 z-[400] bg-background/90 backdrop-blur p-3 rounded-lg border border-border/50 text-xs shadow-lg pointer-events-none">
                    <div className="font-semibold mb-2">Health Status</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> Excellent</div>
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-sky-500"></span> Good</div>
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Poor</div>
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> Critical</div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedBuoy && (
                      <div className="absolute top-4 right-4 z-[400] max-w-sm">
                        <BuoyDetail buoy={selectedBuoy} onClose={() => setSelectedBuoy(null)} />
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-primary" /> 
                    pH Levels (24h)
                    {selectedBuoy && (
                      <Badge variant="outline" className="ml-auto text-xs">
                        {selectedBuoy.id}
                      </Badge>
                    )}
                  </CardTitle>
                  {selectedBuoy && (
                    <CardDescription className="text-xs">
                      Current: pH {selectedBuoy.ph} • {selectedBuoy.name}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selectedBuoy ? buoyChartData[selectedBuoy.id] : (buoyChartData[FIXED_STATIONS[0]?.id] || [])}>
                        <defs>
                          <linearGradient id="phGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 20%)" />
                        <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(215, 16%, 47%)" />
                        <YAxis domain={[6.0, 9.0]} tick={{ fontSize: 10 }} stroke="hsl(215, 16%, 47%)" />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(222, 40%, 10%)', border: '1px solid hsl(222, 30%, 20%)', borderRadius: '8px' }} />
                        <Area type="monotone" dataKey="ph" stroke="hsl(199, 89%, 48%)" fill="url(#phGradient)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Waves className="w-4 h-4 text-secondary" /> 
                    Turbidity (NTU) (24h)
                    {selectedBuoy && (
                      <Badge variant="outline" className="ml-auto text-xs">
                        {selectedBuoy.id}
                      </Badge>
                    )}
                  </CardTitle>
                  {selectedBuoy && (
                    <CardDescription className="text-xs">
                      Current: {selectedBuoy.turbidity} NTU • {selectedBuoy.name}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selectedBuoy ? buoyChartData[selectedBuoy.id] : (buoyChartData[FIXED_STATIONS[0]?.id] || [])}>
                        <defs>
                          <linearGradient id="turbGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(168, 84%, 40%)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(168, 84%, 40%)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 20%)" />
                        <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(215, 16%, 47%)" />
                        <YAxis domain={[0, 12]} tick={{ fontSize: 10 }} stroke="hsl(215, 16%, 47%)" />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(222, 40%, 10%)', border: '1px solid hsl(222, 30%, 20%)', borderRadius: '8px' }} />
                        <Area type="monotone" dataKey="turbidity" stroke="hsl(168, 84%, 40%)" fill="url(#turbGradient)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><Gauge className="w-4 h-4 text-primary" /> Ocean Health Index</CardTitle>
                <CardDescription>Global average across all buoys</CardDescription>
              </CardHeader>
              <CardContent>
                <OHIGauge score={globalOQI} status={globalStatus} />
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Overall Health</span>
                    <span className="font-medium">{globalOQI}%</span>
                  </div>
                  <Progress value={globalOQI} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icon: Thermometer, label: 'Avg Temperature', value: '27.3°C' },
                  { icon: Droplets, label: 'Avg pH Level', value: '7.6' },
                  { icon: Activity, label: 'Active Alerts', value: alerts.filter(a => !a.isRead).length.toString() },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2"><Bell className="w-4 h-4 text-primary" /> Alert Feed</CardTitle>
                  <Badge variant="destructive" className="text-xs">{alerts.filter(a => !a.isRead).length} New</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <AlertItem key={alert.id} alert={alert} />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
