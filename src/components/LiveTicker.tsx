import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Activity, Droplets, Thermometer, Waves } from 'lucide-react';

interface TickerItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
}

interface LiveTickerProps {
  globalOQI: number;
  activeBuoys: number;
  reportsToday: number;
}

export function LiveTicker({ globalOQI, activeBuoys, reportsToday }: LiveTickerProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getOQIStatus = (score: number): 'good' | 'warning' | 'critical' => {
    if (score > 75) return 'good';
    if (score > 50) return 'warning';
    return 'critical';
  };

  const tickerItems: TickerItem[] = [
    {
      id: '1',
      icon: <Waves className="w-4 h-4" />,
      label: 'Global Ocean Quality Index',
      value: `${globalOQI} (${globalOQI > 75 ? 'Excellent' : globalOQI > 50 ? 'Good' : 'Poor'})`,
      status: getOQIStatus(globalOQI),
    },
    {
      id: '2',
      icon: <Activity className="w-4 h-4" />,
      label: 'Active Monitoring Stations',
      value: `${activeBuoys} Buoys Online`,
      status: 'good',
    },
    {
      id: '3',
      icon: <Droplets className="w-4 h-4" />,
      label: 'Reports Today',
      value: `${reportsToday} Pollution Reports`,
      status: reportsToday > 10 ? 'warning' : 'good',
    },
    {
      id: '4',
      icon: <Thermometer className="w-4 h-4" />,
      label: 'Avg. Sea Temperature',
      value: '27.3°C (Normal)',
      status: 'good',
    },
  ];

  const statusColors = {
    good: 'text-ocean-excellent',
    warning: 'text-ocean-warning',
    critical: 'text-ocean-critical',
  };

  return (
    <div className="w-full bg-card/60 backdrop-blur-md border-y border-border/50 overflow-hidden">
      <div className="flex items-center h-10">
        {/* Live indicator */}
        <div className="flex items-center gap-2 px-4 bg-primary/10 h-full border-r border-border/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-xs font-medium text-primary uppercase tracking-wider">Live</span>
        </div>

        {/* Scrolling ticker */}
        <div className="flex-1 overflow-hidden">
          <motion.div
            className="flex items-center gap-12 whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex items-center gap-3">
                <span className={statusColors[item.status]}>{item.icon}</span>
                <span className="text-xs text-muted-foreground">{item.label}:</span>
                <span className={`text-sm font-semibold ${statusColors[item.status]}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Current time */}
        <div className="px-4 bg-muted/30 h-full flex items-center border-l border-border/50">
          <span className="text-xs font-mono text-muted-foreground">
            {currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
