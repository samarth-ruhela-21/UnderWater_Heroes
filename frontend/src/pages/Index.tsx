import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Camera, Globe, Shield, Waves, Anchor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import heroImage from '@/assets/hero-ocean.jpg';
import { LiveTicker } from '@/components/LiveTicker';
import { useState, useEffect } from 'react';
import { generateBuoyData, calculateGlobalOQI, type BuoyData } from '@/lib/buoyData';

const Index = () => {
  const [buoyData, setBuoyData] = useState<BuoyData[]>([]);
  const [globalOQI, setGlobalOQI] = useState(76);

  useEffect(() => {
    const data = generateBuoyData();
    setBuoyData(data);
    setGlobalOQI(calculateGlobalOQI(data));

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newData = generateBuoyData();
      setBuoyData(newData);
      setGlobalOQI(calculateGlobalOQI(newData));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Activity,
      title: 'Real-time Monitoring',
      description: 'IoT sensors deployed across 231 ports continuously track ocean health metrics.',
    },
    {
      icon: Camera,
      title: 'AI-Powered Detection',
      description: 'Advanced computer vision identifies plastic debris and pollution from citizen photos.',
    },
    {
      icon: Shield,
      title: 'Rapid Response',
      description: 'Automated alerts dispatch cleanup crews and drones to pollution hotspots.',
    },
  ];

  const stats = [
    { value: '231', label: 'Ports Monitored' },
    { value: '14', label: 'Major Stations' },
    { value: '24/7', label: 'Live Tracking' },
    { value: '5kg+', label: 'Plastic Removed Daily' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Waves className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold gradient-text">AquaPulse</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link to="/report" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Report Pollution
            </Link>
            <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Admin
            </Link>
          </div>

          <Link to="/dashboard">
            <Button variant="default" size="sm" className="gap-2">
              Launch Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Live Ticker */}
      <div className="fixed top-16 left-0 right-0 z-40">
        <LiveTicker globalOQI={globalOQI} activeBuoys={buoyData.length} reportsToday={12} />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-28">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Ocean underwater"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">SDG 14: Life Below Water</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Protecting Our
              <span className="block gradient-text glow-text">Ocean Ecosystems</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              AquaPulse combines IoT sensors, AI-powered detection, and citizen reporting to monitor
              and protect marine ecosystems in real-time across India's coastline.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="gap-2 glow w-full sm:w-auto">
                  <Activity className="w-5 h-5" />
                  Check Ocean Health
                </Button>
              </Link>
              <Link to="/report">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto border-primary/50 hover:bg-primary/10">
                  <Camera className="w-5 h-5" />
                  Report Pollution
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-primary" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How <span className="gradient-text">AquaPulse</span> Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our integrated platform combines cutting-edge technology with citizen science
              to create a comprehensive ocean monitoring network.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card h-full hover:border-primary/50 transition-colors group">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at center, hsl(var(--primary) / 0.1) 0%, transparent 50%)',
            backgroundSize: '200% 200%',
          }}
        />

        <div className="container relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <Anchor className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join the Mission
            </h2>
            <p className="text-muted-foreground mb-8">
              Every photo you take, every report you submit helps protect our oceans.
              Together, we can make a difference for SDG 14: Life Below Water.
            </p>
            <Link to="/report">
              <Button size="lg" className="gap-2 glow">
                Start Contributing
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Waves className="w-6 h-6 text-primary" />
              <span className="font-bold">AquaPulse</span>
              <span className="text-muted-foreground text-sm">| Ocean Monitoring System</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Built for UN SDG 14 | Hackathon Project 2024
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
