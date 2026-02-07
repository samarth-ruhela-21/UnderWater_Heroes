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
import { OceanMap, MapLegend, BuoyDetail } from '@/components/OceanMap';

// OHI Gauge Component
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
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
          fill="none"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          stroke={getColor()}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
            filter: `drop-shadow(0 0 8px ${getColor()})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ color: getColor() }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{status}</span>
      </div>
    </div>
  );
}

// Alert Item Component
function AlertItem({ alert }: { alert: Alert }) {
  const iconMap = {
    critical: AlertTriangle,
    warning: Bell,
    info: Activity,
  };
  const Icon = iconMap[alert.type];

  const colorMap = {
    critical: 'text-destructive bg-destructive/10',
    warning: 'text-orange-400 bg-orange-500/10',
    info: 'text-primary bg-primary/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-3 rounded-lg border ${alert.isRead ? 'border-border/50' : 'border-primary/50'}`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${colorMap[alert.type]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{alert.message}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {alert.location} • {new Date(alert.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Generate chart data
function generateChartData() {
  const data = [];
  const now = Date.now();
  for (let i = 0; i < 24; i++) {
    data.push({
      time: new Date(now - (23 - i) * 3600000).toLocaleTimeString('en-US', { hour: '2-digit' }),
      ph: 7.2 + Math.random() * 0.8,
      turbidity: 2 + Math.random() * 4,
      dissolvedOxygen: 6 + Math.random() * 2,
      temperature: 25 + Math.random() * 4,
    });
  }
  return data;
}

export default function Dashboard() {
  const [buoyData, setBuoyData] = useState<BuoyData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [globalOQI, setGlobalOQI] = useState(76);
  const [selectedBuoy, setSelectedBuoy] = useState<BuoyData | null>(null);
  const [chartData] = useState(generateChartData);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const data = generateBuoyData();
      setBuoyData(data);
      setGlobalOQI(calculateGlobalOQI(data));
      setAlerts(generateAlerts());
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 500);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, []);

  const statusCounts = useMemo(() => {
    return {
      excellent: buoyData.filter((b) => b.status === 'Excellent').length,
      good: buoyData.filter((b) => b.status === 'Good').length,
      poor: buoyData.filter((b) => b.status === 'Poor').length,
      critical: buoyData.filter((b) => b.status === 'Critical').length,
    };
  }, [buoyData]);

  const globalStatus = useMemo(() => {
    if (globalOQI > 75) return 'Excellent';
    if (globalOQI > 50) return 'Good';
    if (globalOQI > 25) return 'Poor';
    return 'Critical';
  }, [globalOQI]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content - Map & Charts */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Excellent', value: statusCounts.excellent, color: 'text-green-400', bg: 'bg-green-500/10' },
                { label: 'Good', value: statusCounts.good, color: 'text-sky-400', bg: 'bg-sky-500/10' },
                { label: 'Poor', value: statusCounts.poor, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                { label: 'Critical', value: statusCounts.critical, color: 'text-red-400', bg: 'bg-red-500/10' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`glass-card p-4 rounded-xl ${stat.bg}`}
                >
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label} Stations</div>
                </motion.div>
              ))}
            </div>

            {/* Interactive Map */}
            <Card className="glass-card overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Anchor className="w-5 h-5 text-primary" />
                      Monitoring Network
                    </CardTitle>
                    <CardDescription>
                      Real-time buoy status across Indian coastline
                    </CardDescription>
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
                <div className="h-[400px] relative">
                  <OceanMap buoyData={buoyData} onBuoySelect={setSelectedBuoy} />
                  <MapLegend />
                  <AnimatePresence>
                    {selectedBuoy && (
                      <BuoyDetail buoy={selectedBuoy} onClose={() => setSelectedBuoy(null)} />
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            {/* Charts Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* pH Chart */}
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-primary" />
                    pH Levels (24h)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="phGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 20%)" />
                        <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(215, 16%, 47%)" />
                        <YAxis domain={[6.5, 8.5]} tick={{ fontSize: 10 }} stroke="hsl(215, 16%, 47%)" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(222, 40%, 10%)',
                            border: '1px solid hsl(222, 30%, 20%)',
                            borderRadius: '8px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="ph"
                          stroke="hsl(199, 89%, 48%)"
                          fill="url(#phGradient)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Turbidity Chart */}
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Waves className="w-4 h-4 text-secondary" />
                    Turbidity (NTU) (24h)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="turbGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(168, 84%, 40%)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(168, 84%, 40%)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 20%)" />
                        <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(215, 16%, 47%)" />
                        <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} stroke="hsl(215, 16%, 47%)" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(222, 40%, 10%)',
                            border: '1px solid hsl(222, 30%, 20%)',
                            borderRadius: '8px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="turbidity"
                          stroke="hsl(168, 84%, 40%)"
                          fill="url(#turbGradient)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar - OHI Gauge & Alerts */}
          <div className="space-y-6">
            {/* Global OHI */}
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-primary" />
                  Ocean Health Index
                </CardTitle>
                <CardDescription>Global average across all stations</CardDescription>
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

            {/* Quick Stats */}
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Quick Stats
                </CardTitle>
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

            {/* Alerts Feed */}
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary" />
                    Alert Feed
                  </CardTitle>
                  <Badge variant="destructive" className="text-xs">
                    {alerts.filter(a => !a.isRead).length} New
                  </Badge>
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
