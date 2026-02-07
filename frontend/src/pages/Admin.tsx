// import { motion } from 'framer-motion';
// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   ArrowLeft, Bell, CheckCircle, Clock, Mail, MapPin, MoreVertical,
//   RefreshCw, Send, Shield, Trash2, Users, Waves, Plane
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { toast } from 'sonner';
// import { generateUserReports, type UserReport } from '@/lib/buoyData';

// interface EmailLog {
//   id: string;
//   to: string;
//   subject: string;
//   body: string;
//   timestamp: Date;
//   status: 'sent' | 'pending';
// }

// export default function Admin() {
//   const [reports, setReports] = useState<UserReport[]>([]);
//   const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [droneAnimating, setDroneAnimating] = useState<string | null>(null);

//   useEffect(() => {
//     setReports(generateUserReports());
//     setEmailLogs([
//       {
//         id: 'E001',
//         to: 'port-authority@mumbai.gov.in',
//         subject: 'CRITICAL POLLUTION ALERT',
//         body: 'pH levels dropped to 5.2 at Buoy #MJ-001. Immediate action required.',
//         timestamp: new Date(Date.now() - 1000 * 60 * 10),
//         status: 'sent',
//       },
//       {
//         id: 'E002',
//         to: 'coast-guard@chennai.gov.in',
//         subject: 'Oil Slick Detected',
//         body: 'Citizen report verified. Oil contamination at Chennai Port vicinity.',
//         timestamp: new Date(Date.now() - 1000 * 60 * 30),
//         status: 'sent',
//       },
//     ]);
//   }, []);

//   const handleDispatchDrone = (reportId: string) => {
//     setDroneAnimating(reportId);
    
//     // Update report status
//     setReports((prev) =>
//       prev.map((r) =>
//         r.id === reportId ? { ...r, actionTaken: 'Drone Dispatched' as const } : r
//       )
//     );

//     toast.success('🚁 Drone Unit Alpha dispatched!', {
//       description: 'Estimated arrival: 5 minutes',
//     });

//     // Simulate cleanup completion
//     setTimeout(() => {
//       setReports((prev) =>
//         prev.map((r) =>
//           r.id === reportId ? { ...r, actionTaken: 'Resolved' as const } : r
//         )
//       );
//       setDroneAnimating(null);
//       toast.success('✅ Cleanup completed!', {
//         description: 'Collected 2.5kg of plastic debris',
//       });
//     }, 5000);
//   };

//   const handleNotifyPublic = (reportId: string) => {
//     const report = reports.find((r) => r.id === reportId);
//     if (!report) return;

//     const newEmail: EmailLog = {
//       id: `E${emailLogs.length + 1}`.padStart(4, '0'),
//       to: 'public-alerts@aquapulse.gov.in',
//       subject: `Water Quality Advisory - ${report.location.lat.toFixed(2)}°N`,
//       body: `Pollution detected in your vicinity. Avoid swimming. Cleanup in progress.`,
//       timestamp: new Date(),
//       status: 'sent',
//     };

//     setEmailLogs((prev) => [newEmail, ...prev]);
//     toast.success('📧 Public advisory sent!');
//   };

//   const getActionBadge = (action: string) => {
//     switch (action) {
//       case 'Pending':
//         return <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/30">Pending</Badge>;
//       case 'Cleaning':
//         return <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">Cleaning</Badge>;
//       case 'Drone Dispatched':
//         return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">Drone Dispatched</Badge>;
//       case 'Resolved':
//         return <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">Resolved</Badge>;
//       default:
//         return <Badge variant="outline">{action}</Badge>;
//     }
//   };

//   const getSeverity = (count: number) => {
//     if (count > 8) return { label: 'High', color: 'text-red-400' };
//     if (count > 4) return { label: 'Medium', color: 'text-orange-400' };
//     return { label: 'Low', color: 'text-green-400' };
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
//         <div className="container mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
//               <ArrowLeft className="w-5 h-5" />
//               <span className="hidden sm:inline">Back</span>
//             </Link>
//             <div className="h-6 w-px bg-border" />
//             <div className="flex items-center gap-2">
//               <Shield className="w-6 h-6 text-primary" />
//               <h1 className="text-lg font-semibold">Admin Panel</h1>
//             </div>
//           </div>

//           <Badge variant="outline" className="gap-2">
//             <Users className="w-3 h-3" />
//             Authority Access
//           </Badge>
//         </div>
//       </header>

//       <div className="container mx-auto px-4 py-6">
//         {/* Stats Overview */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//           {[
//             { label: 'Pending Reports', value: reports.filter((r) => r.actionTaken === 'Pending').length, icon: Clock, color: 'text-orange-400' },
//             { label: 'In Progress', value: reports.filter((r) => r.actionTaken === 'Drone Dispatched').length, icon: Plane, color: 'text-primary' },
//             { label: 'Resolved Today', value: reports.filter((r) => r.actionTaken === 'Resolved').length, icon: CheckCircle, color: 'text-green-400' },
//             { label: 'Alerts Sent', value: emailLogs.length, icon: Mail, color: 'text-blue-400' },
//           ].map((stat) => (
//             <motion.div
//               key={stat.label}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="glass-card p-4 rounded-xl"
//             >
//               <div className="flex items-center gap-3">
//                 <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
//                   <stat.icon className="w-5 h-5" />
//                 </div>
//                 <div>
//                   <div className="text-2xl font-bold">{stat.value}</div>
//                   <div className="text-xs text-muted-foreground">{stat.label}</div>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Incident Table */}
//           <div className="lg:col-span-2">
//             <Card className="glass-card">
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <CardTitle className="flex items-center gap-2">
//                       <Trash2 className="w-5 h-5 text-primary" />
//                       Pollution Reports
//                     </CardTitle>
//                     <CardDescription>Manage incoming citizen reports</CardDescription>
//                   </div>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => {
//                       setIsRefreshing(true);
//                       setTimeout(() => setIsRefreshing(false), 500);
//                     }}
//                   >
//                     <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
//                   </Button>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="rounded-lg border border-border overflow-hidden">
//                   <Table>
//                     <TableHeader>
//                       <TableRow className="bg-muted/50">
//                         <TableHead>Report ID</TableHead>
//                         <TableHead>Location</TableHead>
//                         <TableHead>Severity</TableHead>
//                         <TableHead>Status</TableHead>
//                         <TableHead className="text-right">Actions</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {reports.map((report) => {
//                         const severity = getSeverity(report.plasticCount);
//                         return (
//                           <TableRow key={report.id} className="relative">
//                             {droneAnimating === report.id && (
//                               <motion.div
//                                 className="absolute inset-0 bg-primary/5 pointer-events-none"
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: [0, 1, 0] }}
//                                 transition={{ duration: 2, repeat: Infinity }}
//                               />
//                             )}
//                             <TableCell className="font-mono text-sm">{report.id}</TableCell>
//                             <TableCell>
//                               <div className="flex items-center gap-1.5">
//                                 <MapPin className="w-3 h-3 text-muted-foreground" />
//                                 <span className="text-sm">
//                                   {report.location.lat.toFixed(2)}°N, {report.location.lng.toFixed(2)}°E
//                                 </span>
//                               </div>
//                             </TableCell>
//                             <TableCell>
//                               <span className={`font-medium ${severity.color}`}>
//                                 {severity.label}
//                               </span>
//                             </TableCell>
//                             <TableCell>{getActionBadge(report.actionTaken)}</TableCell>
//                             <TableCell className="text-right">
//                               <DropdownMenu>
//                                 <DropdownMenuTrigger asChild>
//                                   <Button variant="ghost" size="icon" disabled={report.actionTaken === 'Resolved'}>
//                                     <MoreVertical className="w-4 h-4" />
//                                   </Button>
//                                 </DropdownMenuTrigger>
//                                 <DropdownMenuContent align="end">
//                                   <DropdownMenuItem
//                                     onClick={() => handleDispatchDrone(report.id)}
//                                     disabled={report.actionTaken !== 'Pending'}
//                                   >
//                                     <Plane className="w-4 h-4 mr-2" />
//                                     Dispatch Drone
//                                   </DropdownMenuItem>
//                                   <DropdownMenuItem onClick={() => handleNotifyPublic(report.id)}>
//                                     <Bell className="w-4 h-4 mr-2" />
//                                     Notify Public
//                                   </DropdownMenuItem>
//                                 </DropdownMenuContent>
//                               </DropdownMenu>
//                             </TableCell>
//                           </TableRow>
//                         );
//                       })}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Email Log Sidebar */}
//           <div>
//             <Card className="glass-card">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 text-sm">
//                   <Send className="w-4 h-4 text-primary" />
//                   Email Alert Log
//                 </CardTitle>
//                 <CardDescription>Real-time notification log</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ScrollArea className="h-[400px] pr-4">
//                   <div className="space-y-4">
//                     {emailLogs.map((email, index) => (
//                       <motion.div
//                         key={email.id}
//                         initial={{ opacity: 0, x: 20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ delay: index * 0.1 }}
//                         className="p-3 rounded-lg bg-muted/50 border border-border/50"
//                       >
//                         <div className="flex items-center justify-between mb-2">
//                           <Badge
//                             variant="outline"
//                             className={
//                               email.status === 'sent'
//                                 ? 'bg-green-500/10 text-green-400 border-green-500/30'
//                                 : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
//                             }
//                           >
//                             {email.status === 'sent' ? 'Sent' : 'Pending'}
//                           </Badge>
//                           <span className="text-xs text-muted-foreground">
//                             {email.timestamp.toLocaleTimeString()}
//                           </span>
//                         </div>
//                         <div className="text-xs text-muted-foreground mb-1">
//                           To: {email.to}
//                         </div>
//                         <div className="text-sm font-medium mb-1">{email.subject}</div>
//                         <div className="text-xs text-muted-foreground line-clamp-2">
//                           {email.body}
//                         </div>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </ScrollArea>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Drone Animation Demo */}
//         {droneAnimating && (
//           <motion.div
//             className="fixed bottom-8 right-8 z-50"
//             initial={{ x: 200, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             exit={{ x: -200, opacity: 0 }}
//           >
//             <div className="glass-card p-4 rounded-xl flex items-center gap-4">
//               <motion.div
//                 animate={{ y: [-2, 2, -2] }}
//                 transition={{ duration: 0.5, repeat: Infinity }}
//               >
//                 <Plane className="w-8 h-8 text-primary" />
//               </motion.div>
//               <div>
//                 <div className="text-sm font-medium">Drone Unit Alpha</div>
//                 <div className="text-xs text-muted-foreground">En route to cleanup site...</div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// }




///////////////////////////////////////////////////////////////////////////////////////

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Bell, CheckCircle, Clock, Mail, MapPin, MoreVertical,
  RefreshCw, Send, Shield, Trash2, Users, Waves, Plane
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { generateUserReports, type UserReport } from '@/lib/buoyData';

interface EmailLog {
  id: string;
  to: string;
  subject: string;
  body: string;
  timestamp: Date;
  status: 'sent' | 'pending';
}

export default function Admin() {
  const [reports, setReports] = useState<UserReport[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [droneAnimating, setDroneAnimating] = useState<string | null>(null);

  // --- LOAD LIVE DATA FROM LOCAL STORAGE ---
  const loadReports = () => {
    setIsRefreshing(true);
    
    // 1. Get the static mock data from your buoyData lib
    const mockData = generateUserReports(); 
    
    // 2. Get the real data submitted via the Report file
    const localData = JSON.parse(localStorage.getItem('user-reports') || '[]');
    
    // 3. Format localData to match the UserReport interface
    const formattedLocalData = localData.map((report: any) => ({
      ...report,
      id: report.id,
      timestamp: new Date(report.timestamp),
      // Ensure it has all properties expected by the UI
      actionTaken: report.actionTaken || 'Pending'
    }));

    // 4. Combine (Local submissions at the top)
    setReports([...formattedLocalData, ...mockData]);
    
    setTimeout(() => setIsRefreshing(false), 600);
  };

  useEffect(() => {
    loadReports();
    setEmailLogs([
      {
        id: 'E001',
        to: 'port-authority@patiala.gov.in',
        subject: 'THAPAR CAMPUS POLLUTION ALERT',
        body: 'Manual report received. Plastic accumulation detected near campus lake.',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        status: 'sent',
      }
    ]);

    // Listen for storage changes in case reports are submitted in another tab
    window.addEventListener('storage', loadReports);
    return () => window.removeEventListener('storage', loadReports);
  }, []);

  const handleDispatchDrone = (reportId: string) => {
    setDroneAnimating(reportId);
    
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, actionTaken: 'Drone Dispatched' as const } : r
      )
    );

    toast.success('🚁 Drone Unit Alpha dispatched!', {
      description: 'En route to coordinates. Estimated arrival: 3 mins.',
    });

    // Simulate cleanup completion and update LocalStorage to persist the "Resolved" status
    setTimeout(() => {
      setReports((prev) => {
        const updated = prev.map((r) =>
          r.id === reportId ? { ...r, actionTaken: 'Resolved' as const } : r
        );
        
        // Sync back to local storage so the status stays "Resolved"
        const localOnly = updated.filter(r => r.id.startsWith('USR-'));
        localStorage.setItem('user-reports', JSON.stringify(localOnly));
        
        return updated;
      });
      
      setDroneAnimating(null);
      toast.success('✅ Area Sanitized', {
        description: 'Waste collected and logged to blockchain.',
      });
    }, 5000);
  };

  const handleNotifyPublic = (reportId: string) => {
    const report = reports.find((r) => r.id === reportId);
    if (!report) return;

    const newEmail: EmailLog = {
      id: `E${emailLogs.length + 1}`.padStart(4, '0'),
      to: 'campus-alerts@tiet.edu',
      subject: `Environment Advisory - TIET`,
      body: `Cleanup drones are active at ${report.location.lat.toFixed(3)}, ${report.location.lng.toFixed(3)}. Please avoid the area.`,
      timestamp: new Date(),
      status: 'sent',
    };

    setEmailLogs((prev) => [newEmail, ...prev]);
    toast.success('📧 Community notification sent!');
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'Pending':
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/30 animate-pulse">Pending</Badge>;
      case 'Drone Dispatched':
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">In Flight</Badge>;
      case 'Resolved':
        return <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">Resolved</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  const getSeverity = (count: number) => {
    if (count > 7) return { label: 'High', color: 'text-red-400' };
    if (count > 3) return { label: 'Medium', color: 'text-orange-400' };
    return { label: 'Low', color: 'text-green-400' };
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <h1 className="text-lg font-semibold">Admin Command</h1>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
            System Admin: TIET Hub
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Unresolved', value: reports.filter((r) => r.actionTaken === 'Pending').length, icon: Clock, color: 'text-orange-400' },
            { label: 'Drones Active', value: reports.filter((r) => r.actionTaken === 'Drone Dispatched').length, icon: Plane, color: 'text-primary' },
            { label: 'Total Cleaned', value: reports.filter((r) => r.actionTaken === 'Resolved').length, icon: CheckCircle, color: 'text-green-400' },
            { label: 'Alerts Logs', value: emailLogs.length, icon: Mail, color: 'text-blue-400' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-5 rounded-2xl border border-border/50">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-muted/50 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Incident Table */}
          <div className="lg:col-span-2">
            <Card className="glass-card border-border/50 shadow-xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/20">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Waves className="w-5 h-5 text-primary" />
                    Incoming Reports
                  </CardTitle>
                  <CardDescription>Live pollution feed from citizens and buoys</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={loadReports} className="hover:rotate-180 transition-transform duration-500">
                  <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="pl-6">Origin ID</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right pr-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {reports.map((report) => {
                        const severity = getSeverity(report.plasticCount);
                        const isUserReport = report.id.startsWith('USR-');

                        return (
                          <TableRow key={report.id} className={`group ${isUserReport ? 'bg-primary/5' : ''}`}>
                            <TableCell className="pl-6 font-mono text-xs">
                              <div className="flex flex-col">
                                <span className="font-bold">{report.id}</span>
                                <span className="text-[10px] text-muted-foreground">
                                  {isUserReport ? 'Citizen App' : 'Buoy Sensor'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-primary" />
                                <span className="text-sm">{report.location.lat.toFixed(3)}, {report.location.lng.toFixed(3)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`text-sm font-semibold ${severity.color}`}>
                                {report.plasticCount} Units
                              </span>
                            </TableCell>
                            <TableCell>{getActionBadge(report.actionTaken)}</TableCell>
                            <TableCell className="text-right pr-6">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" disabled={report.actionTaken === 'Resolved'}>
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem onClick={() => handleDispatchDrone(report.id)} disabled={report.actionTaken !== 'Pending'}>
                                    <Plane className="w-4 h-4 mr-2 text-primary" />
                                    Dispatch Alpha Drone
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleNotifyPublic(report.id)}>
                                    <Bell className="w-4 h-4 mr-2 text-orange-400" />
                                    Send Public Advisory
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Email Log Sidebar */}
          <div className="space-y-6">
            <Card className="glass-card border-border/50 h-full">
              <CardHeader className="bg-muted/20 border-b border-border/50">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Send className="w-4 h-4 text-primary" />
                  Communication Logs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="p-4 space-y-4">
                    {emailLogs.map((email) => (
                      <div key={email.id} className="p-4 rounded-xl bg-muted/40 border border-border/40 hover:border-primary/30 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-500">Sent</Badge>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {email.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-[11px] font-bold truncate mb-1">TO: {email.to}</div>
                        <div className="text-xs font-semibold text-primary mb-1">{email.subject}</div>
                        <div className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 italic">
                          "{email.body}"
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Drone Active Notification */}
      <AnimatePresence>
        {droneAnimating && (
          <motion.div
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            <div className="bg-primary text-primary-foreground px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
               <motion.div animate={{ y: [-3, 3, -3] }} transition={{ repeat: Infinity, duration: 1 }}>
                  <Plane className="w-8 h-8 rotate-45" />
               </motion.div>
               <div>
                  <div className="font-bold">Drone Alpha-01 Dispatched</div>
                  <div className="text-xs opacity-90">Executing vacuum protocol at target...</div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
