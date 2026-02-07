// import { motion, AnimatePresence } from 'framer-motion';
// import { useState, useRef, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import { ArrowLeft, Camera, CheckCircle, Loader2, MapPin, Upload, Waves, X, AlertTriangle } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Progress } from '@/components/ui/progress';
// import { Badge } from '@/components/ui/badge';
// import { toast } from 'sonner';

// interface DetectionResult {
//   plasticCount: number;
//   items: string[];
//   confidence: number;
//   isPolluted: boolean;
//   hazardLevel: 'Low' | 'Medium' | 'High';
//   boundingBoxes: { x: number; y: number; width: number; height: number; label: string }[];
// }

// export default function Report() {
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [analysisProgress, setAnalysisProgress] = useState(0);
//   const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
//   const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setSelectedImage(e.target?.result as string);
//         setDetectionResult(null);
//         setIsSubmitted(false);
//       };
//       reader.readAsDataURL(file);
//     }
//   }, []);

//   const getLocation = useCallback(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//           toast.success('Location captured successfully');
//         },
//         () => {
//           toast.error('Unable to get location. Please enable GPS.');
//           // Default to Mumbai
//           setLocation({ lat: 19.076, lng: 72.877 });
//         }
//       );
//     }
//   }, []);

//   const simulateAIAnalysis = useCallback(() => {
//     if (!selectedImage) return;

//     setIsAnalyzing(true);
//     setAnalysisProgress(0);

//     // Simulate AI processing with progress updates
//     const progressInterval = setInterval(() => {
//       setAnalysisProgress((prev) => {
//         if (prev >= 90) {
//           clearInterval(progressInterval);
//           return 90;
//         }
//         return prev + 10;
//       });
//     }, 200);

//     // Simulate AI response after 2.5 seconds
//     setTimeout(() => {
//       clearInterval(progressInterval);
//       setAnalysisProgress(100);

//       // Simulated detection result
//       const isPolluted = Math.random() > 0.3;
//       const plasticCount = isPolluted ? Math.floor(Math.random() * 8) + 2 : Math.floor(Math.random() * 2);

//       const possibleItems = ['Bottle', 'Plastic Bag', 'Fishing Net', 'Cup', 'Container', 'Styrofoam', 'Oil Slick'];
//       const detectedItems = isPolluted
//         ? possibleItems.slice(0, Math.floor(Math.random() * 4) + 2)
//         : possibleItems.slice(0, 1);

//       const result: DetectionResult = {
//         plasticCount,
//         items: detectedItems,
//         confidence: 0.75 + Math.random() * 0.2,
//         isPolluted,
//         hazardLevel: plasticCount > 5 ? 'High' : plasticCount > 2 ? 'Medium' : 'Low',
//         boundingBoxes: detectedItems.map((item, i) => ({
//           x: 20 + Math.random() * 40,
//           y: 20 + Math.random() * 40,
//           width: 15 + Math.random() * 20,
//           height: 15 + Math.random() * 20,
//           label: item,
//         })),
//       };

//       setDetectionResult(result);
//       setIsAnalyzing(false);

//       if (result.isPolluted) {
//         toast.warning(`Detected ${result.plasticCount} pollutant items!`);
//       } else {
//         toast.success('No significant pollution detected.');
//       }
//     }, 2500);
//   }, [selectedImage]);

//   const handleSubmitReport = useCallback(() => {
//     if (!detectionResult || !location) {
//       toast.error('Please analyze image and capture location first');
//       return;
//     }

//     setIsSubmitted(true);
//     toast.success('Report submitted successfully! Ticket #' + Math.floor(Math.random() * 9000 + 1000) + ' created.');
//   }, [detectionResult, location]);

//   const hazardColors = {
//     Low: 'bg-green-500/10 text-green-400 border-green-500/30',
//     Medium: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
//     High: 'bg-red-500/10 text-red-400 border-red-500/30',
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
//               <Camera className="w-6 h-6 text-primary" />
//               <h1 className="text-lg font-semibold">Report Pollution</h1>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-4xl mx-auto">
//           {/* Hero Text */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center mb-8"
//           >
//             <h2 className="text-2xl md:text-3xl font-bold mb-3">
//               <span className="gradient-text">AI-Powered</span> Pollution Detection
//             </h2>
//             <p className="text-muted-foreground max-w-lg mx-auto">
//               Upload a photo of ocean pollution. Our AI will analyze it and alert authorities automatically.
//             </p>
//           </motion.div>

//           <div className="grid md:grid-cols-2 gap-6">
//             {/* Upload Section */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.1 }}
//             >
//               <Card className="glass-card h-full">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Upload className="w-5 h-5 text-primary" />
//                     Upload Photo
//                   </CardTitle>
//                   <CardDescription>Take or upload a photo of pollution</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     capture="environment"
//                     onChange={handleFileSelect}
//                     className="hidden"
//                   />

//                   {!selectedImage ? (
//                     <div
//                       onClick={() => fileInputRef.current?.click()}
//                       className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 transition-colors group"
//                     >
//                       <Camera className="w-12 h-12 mx-auto text-muted-foreground group-hover:text-primary transition-colors mb-4" />
//                       <p className="text-sm text-muted-foreground mb-2">
//                         Click to take photo or upload
//                       </p>
//                       <p className="text-xs text-muted-foreground">
//                         Supports JPG, PNG up to 10MB
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="relative">
//                       <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
//                         <img
//                           src={selectedImage}
//                           alt="Uploaded"
//                           className="w-full h-full object-cover"
//                         />
//                         {/* Bounding boxes overlay */}
//                         {detectionResult && (
//                           <svg className="absolute inset-0 w-full h-full pointer-events-none">
//                             {detectionResult.boundingBoxes.map((box, i) => (
//                               <g key={i}>
//                                 <rect
//                                   x={`${box.x}%`}
//                                   y={`${box.y}%`}
//                                   width={`${box.width}%`}
//                                   height={`${box.height}%`}
//                                   fill="none"
//                                   stroke="hsl(var(--destructive))"
//                                   strokeWidth="2"
//                                   rx="4"
//                                 />
//                                 <text
//                                   x={`${box.x}%`}
//                                   y={`${box.y - 2}%`}
//                                   fill="hsl(var(--destructive))"
//                                   fontSize="10"
//                                   fontWeight="bold"
//                                 >
//                                   {box.label}
//                                 </text>
//                               </g>
//                             ))}
//                           </svg>
//                         )}
//                       </div>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
//                         onClick={() => {
//                           setSelectedImage(null);
//                           setDetectionResult(null);
//                           setIsSubmitted(false);
//                         }}
//                       >
//                         <X className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   )}

//                   {/* Location Button */}
//                   <div className="mt-4 flex items-center gap-3">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={getLocation}
//                       className="gap-2"
//                     >
//                       <MapPin className="w-4 h-4" />
//                       {location ? 'Location Captured' : 'Capture Location'}
//                     </Button>
//                     {location && (
//                       <span className="text-xs text-muted-foreground">
//                         {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
//                       </span>
//                     )}
//                   </div>

//                   {/* Analyze Button */}
//                   {selectedImage && !detectionResult && (
//                     <Button
//                       className="w-full mt-4 gap-2"
//                       onClick={simulateAIAnalysis}
//                       disabled={isAnalyzing}
//                     >
//                       {isAnalyzing ? (
//                         <>
//                           <Loader2 className="w-4 h-4 animate-spin" />
//                           Analyzing...
//                         </>
//                       ) : (
//                         <>
//                           <Waves className="w-4 h-4" />
//                           Analyze with AI
//                         </>
//                       )}
//                     </Button>
//                   )}

//                   {/* Analysis Progress */}
//                   <AnimatePresence>
//                     {isAnalyzing && (
//                       <motion.div
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: 'auto' }}
//                         exit={{ opacity: 0, height: 0 }}
//                         className="mt-4"
//                       >
//                         <div className="flex justify-between text-xs text-muted-foreground mb-2">
//                           <span>Scanning for pollutants...</span>
//                           <span>{analysisProgress}%</span>
//                         </div>
//                         <Progress value={analysisProgress} className="h-2" />
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </CardContent>
//               </Card>
//             </motion.div>

//             {/* Results Section */}
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2 }}
//             >
//               <Card className="glass-card h-full">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <AlertTriangle className="w-5 h-5 text-primary" />
//                     Analysis Results
//                   </CardTitle>
//                   <CardDescription>AI detection output</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <AnimatePresence mode="wait">
//                     {!detectionResult && !isSubmitted ? (
//                       <motion.div
//                         key="empty"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="text-center py-12"
//                       >
//                         <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
//                           <Waves className="w-8 h-8 text-muted-foreground" />
//                         </div>
//                         <p className="text-sm text-muted-foreground">
//                           Upload and analyze an image to see results
//                         </p>
//                       </motion.div>
//                     ) : isSubmitted ? (
//                       <motion.div
//                         key="submitted"
//                         initial={{ opacity: 0, scale: 0.9 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         className="text-center py-8"
//                       >
//                         <motion.div
//                           initial={{ scale: 0 }}
//                           animate={{ scale: 1 }}
//                           transition={{ type: 'spring', delay: 0.2 }}
//                           className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"
//                         >
//                           <CheckCircle className="w-10 h-10 text-green-400" />
//                         </motion.div>
//                         <h3 className="text-lg font-semibold mb-2">Report Submitted!</h3>
//                         <p className="text-sm text-muted-foreground mb-4">
//                           Ticket #{Math.floor(Math.random() * 9000 + 1000)} created
//                         </p>
//                         <p className="text-xs text-muted-foreground">
//                           Alert sent to Mumbai Port Authority
//                         </p>
//                         <Button
//                           variant="outline"
//                           className="mt-6"
//                           onClick={() => {
//                             setSelectedImage(null);
//                             setDetectionResult(null);
//                             setIsSubmitted(false);
//                             setLocation(null);
//                           }}
//                         >
//                           Submit Another Report
//                         </Button>
//                       </motion.div>
//                     ) : (
//                       <motion.div
//                         key="results"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         className="space-y-4"
//                       >
//                         {/* Hazard Level */}
//                         <div className="flex items-center justify-between">
//                           <span className="text-sm text-muted-foreground">Hazard Level</span>
//                           <Badge className={hazardColors[detectionResult!.hazardLevel]}>
//                             {detectionResult!.hazardLevel}
//                           </Badge>
//                         </div>

//                         {/* Stats */}
//                         <div className="grid grid-cols-2 gap-4">
//                           <div className="bg-muted/50 rounded-lg p-4 text-center">
//                             <div className="text-3xl font-bold text-destructive">
//                               {detectionResult!.plasticCount}
//                             </div>
//                             <div className="text-xs text-muted-foreground">Items Detected</div>
//                           </div>
//                           <div className="bg-muted/50 rounded-lg p-4 text-center">
//                             <div className="text-3xl font-bold text-primary">
//                               {Math.round(detectionResult!.confidence * 100)}%
//                             </div>
//                             <div className="text-xs text-muted-foreground">Confidence</div>
//                           </div>
//                         </div>

//                         {/* Detected Items */}
//                         <div>
//                           <span className="text-sm text-muted-foreground block mb-2">Detected Items</span>
//                           <div className="flex flex-wrap gap-2">
//                             {detectionResult!.items.map((item) => (
//                               <Badge key={item} variant="outline">
//                                 {item}
//                               </Badge>
//                             ))}
//                           </div>
//                         </div>

//                         {/* Submit Button */}
//                         <Button
//                           className="w-full mt-4 gap-2"
//                           onClick={handleSubmitReport}
//                           disabled={!location}
//                         >
//                           <AlertTriangle className="w-4 h-4" />
//                           Alert Authorities
//                         </Button>

//                         {!location && (
//                           <p className="text-xs text-center text-muted-foreground">
//                             Please capture your location first
//                           </p>
//                         )}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



/////////////////////////////////////////////////////////////////////////////////////////////


// import { motion, AnimatePresence } from 'framer-motion';
// import { useState, useRef, useCallback, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { ArrowLeft, Camera, CheckCircle, Loader2, MapPin, RefreshCw, AlertTriangle, Video, XCircle } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { toast } from 'sonner';
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// // --- Types ---
// interface DetectionResult {
//   plasticCount: number;
//   items: string[];
//   confidence: number;
//   isPolluted: boolean;
//   hazardLevel: 'Low' | 'Medium' | 'High';
//   boundingBoxes: { x: number; y: number; width: number; height: number; label: string }[];
// }

// interface LocationData {
//   lat: number;
//   lng: number;
//   accuracy: number;
// }

// // --- Constants ---
// // Replace with your actual Google Maps API Key
// const GOOGLE_MAPS_API_KEY = "AIzaSyD8AUTdqP7v_JyY7MIZIYF4erTArugTYf8"; 

// const mapContainerStyle = {
//   width: '100%',
//   height: '200px',
//   borderRadius: '0.5rem'
// };

// export default function Report() {
//   // State
//   const [isCameraOpen, setIsCameraOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [location, setLocation] = useState<LocationData | null>(null);
  
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   // Refs
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   // 1. Start Camera
//   const startCamera = async () => {
//     try {
//       setIsCameraOpen(true);
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         video: { facingMode: 'environment' } // Prefer back camera
//       });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//     } catch (err) {
//       toast.error("Camera access denied. Please enable camera permissions.");
//       setIsCameraOpen(false);
//     }
//   };

//   // 2. Stop Camera
//   const stopCamera = () => {
//     if (videoRef.current && videoRef.current.srcObject) {
//       const stream = videoRef.current.srcObject as MediaStream;
//       stream.getTracks().forEach(track => track.stop());
//       videoRef.current.srcObject = null;
//     }
//     setIsCameraOpen(false);
//   };

//   // 3. Capture Image & Location Simultaneously
//   const captureImageAndLocation = () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     // A. Get Location First (Blocking)
//     if (!navigator.geolocation) {
//       toast.error("Geolocation is not supported by your browser");
//       return;
//     }

//     toast.loading("Acquiring precise location...");

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         // 1. Save Location
//         setLocation({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//           accuracy: position.coords.accuracy
//         });

//         // 2. Draw Video Frame to Canvas
//         const video = videoRef.current!;
//         const canvas = canvasRef.current!;
//         const context = canvas.getContext('2d');
        
//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;
        
//         if (context) {
//           context.drawImage(video, 0, 0, canvas.width, canvas.height);
//           // Convert to Base64
//           const imageData = canvas.toDataURL('image/jpeg');
//           setSelectedImage(imageData);
          
//           // Cleanup
//           stopCamera();
//           toast.dismiss();
//           toast.success(`Photo captured at ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
//         }
//       },
//       (error) => {
//         toast.dismiss();
//         toast.error("Location access denied. Cannot verify report location.");
//         console.error(error);
//       },
//       { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//     );
//   };

//   // 4. Send to ML Model (Simulated)
//   const analyzeImage = async () => {
//     if (!selectedImage) return;

//     setIsAnalyzing(true);
    
//     // --- REAL API INTEGRATION PATTERN ---
//     // const formData = new FormData();
//     // formData.append('file', dataURItoBlob(selectedImage));
//     // const response = await fetch('YOUR_FLASK_API_URL/detect', { method: 'POST', body: formData });
//     // const result = await response.json();
    
//     // --- SIMULATION (Replace this block with above fetch when backend is ready) ---
//     await new Promise(resolve => setTimeout(resolve, 3000)); // Fake delay
    
//     const isPolluted = Math.random() > 0.2; // 80% chance of pollution for demo
//     const plasticCount = isPolluted ? Math.floor(Math.random() * 8) + 2 : 0;
    
//     const mockResult: DetectionResult = {
//       plasticCount,
//       items: isPolluted ? ['Plastic Bag', 'Bottle', 'Wrapper'] : [],
//       confidence: 0.89,
//       isPolluted,
//       hazardLevel: plasticCount > 5 ? 'High' : plasticCount > 2 ? 'Medium' : 'Low',
//       boundingBoxes: [] // You would populate this from your YOLO/ML model output
//     };
//     // ---------------------------------------------------------------------------

//     setDetectionResult(mockResult);
//     setIsAnalyzing(false);
    
//     if (mockResult.isPolluted) {
//       toast.warning(`Detected ${mockResult.plasticCount} items.`);
//     } else {
//       toast.success('Area looks clean.');
//     }
//   };

//   const handleRetake = () => {
//     setSelectedImage(null);
//     setDetectionResult(null);
//     setLocation(null);
//     setIsSubmitted(false);
//     startCamera();
//   };

//   return (
//     <div className="min-h-screen bg-background pb-20">
//       {/* Header */}
//       <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
//         <div className="container mx-auto px-4 h-16 flex items-center justify-between">
//             <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
//               <ArrowLeft className="w-5 h-5" />
//               <span>Back</span>
//             </Link>
//             <h1 className="font-semibold">Live Report</h1>
//             <div className="w-8" /> {/* Spacer */}
//         </div>
//       </header>

//       <div className="container mx-auto px-4 py-6 max-w-lg">
        
//         {/* STEP 1: CAMERA VIEW */}
//         {!selectedImage && (
//           <div className="space-y-4">
//             <div className="relative aspect-[3/4] bg-black rounded-2xl overflow-hidden shadow-2xl">
//               {!isCameraOpen ? (
//                 <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
//                   <Camera className="w-16 h-16 mb-4 opacity-50" />
//                   <Button onClick={startCamera} variant="secondary">
//                     Open Camera
//                   </Button>
//                 </div>
//               ) : (
//                 <>
//                   <video 
//                     ref={videoRef} 
//                     autoPlay 
//                     playsInline 
//                     className="w-full h-full object-cover"
//                   />
//                   {/* Overlay Guides */}
//                   <div className="absolute inset-0 border-2 border-white/30 m-8 rounded-lg pointer-events-none" />
                  
//                   {/* Capture Button */}
//                   <div className="absolute bottom-8 inset-x-0 flex justify-center">
//                     <button 
//                       onClick={captureImageAndLocation}
//                       className="w-20 h-20 bg-white rounded-full border-4 border-white/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg"
//                     >
//                       <div className="w-16 h-16 bg-red-500 rounded-full" />
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//             <p className="text-center text-xs text-muted-foreground">
//               We capture your GPS location automatically when you take the photo.
//             </p>
//           </div>
//         )}

//         {/* STEP 2: PREVIEW & MAP */}
//         {selectedImage && (
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
//             {/* Image Preview Card */}
//             <Card>
//               <CardContent className="p-0 overflow-hidden relative">
//                 <img src={selectedImage} alt="Captured" className="w-full h-64 object-cover" />
//                 <Button 
//                   size="icon" 
//                   variant="destructive" 
//                   className="absolute top-2 right-2 rounded-full shadow-md"
//                   onClick={handleRetake}
//                 >
//                   <RefreshCw className="w-4 h-4" />
//                 </Button>
//               </CardContent>
              
//               {/* Google Map Preview */}
//               <div className="p-4 border-t border-border">
//                 <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
//                   <MapPin className="w-4 h-4 text-primary" />
//                   Report Location
//                 </div>
//                 {location && (
//                   <div className="rounded-lg overflow-hidden border border-border">
//                     <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
//                       <GoogleMap
//                         mapContainerStyle={mapContainerStyle}
//                         center={location}
//                         zoom={15}
//                         options={{ disableDefaultUI: true, zoomControl: false }}
//                       >
//                         <Marker position={location} />
//                       </GoogleMap>
//                     </LoadScript>
//                     <div className="bg-muted/50 p-2 text-xs text-center font-mono">
//                       {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </Card>

//             {/* Analysis & Results */}
//             {!detectionResult ? (
//               <Button 
//                 size="lg" 
//                 className="w-full text-lg h-12 gap-2" 
//                 onClick={analyzeImage}
//                 disabled={isAnalyzing}
//               >
//                 {isAnalyzing ? <Loader2 className="animate-spin" /> : <AlertTriangle />}
//                 Detect Pollution (ML)
//               </Button>
//             ) : (
//               <Card className="border-primary/50 bg-primary/5">
//                 <CardHeader>
//                   <CardTitle className="flex items-center justify-between">
//                     Results
//                     <Badge variant={detectionResult.isPolluted ? "destructive" : "secondary"}>
//                       {detectionResult.hazardLevel} Hazard
//                     </Badge>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="flex justify-between items-center bg-background/50 p-3 rounded-lg">
//                     <span className="text-muted-foreground">Plastic Count</span>
//                     <span className="text-xl font-bold">{detectionResult.plasticCount}</span>
//                   </div>
                  
//                   <div className="flex flex-wrap gap-2">
//                     {detectionResult.items.map((item, i) => (
//                       <Badge key={i} variant="outline" className="bg-background">
//                         {item}
//                       </Badge>
//                     ))}
//                   </div>

//                   {!isSubmitted ? (
//                     <Button className="w-full" onClick={() => setIsSubmitted(true)}>
//                       Submit Verified Report
//                     </Button>
//                   ) : (
//                     <div className="flex flex-col items-center py-4 text-green-600">
//                       <CheckCircle className="w-12 h-12 mb-2" />
//                       <span className="font-semibold">Report Sent to Authorities</span>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             )}

//           </motion.div>
//         )}

//         {/* Hidden Canvas for Capture */}
//         <canvas ref={canvasRef} className="hidden" />
//       </div>
//     </div>
//   );
// }



/////////////////////////////////////////////////////////////////////////////////////////

// import { motion } from 'framer-motion';
// import { useState, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { ArrowLeft, Camera, CheckCircle, Loader2, MapPin, RefreshCw, AlertTriangle, Building2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { toast } from 'sonner';
// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // --- LEAFLET ICON FIX ---
// import icon from 'leaflet/dist/images/marker-icon.png';
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// const DefaultIcon = L.icon({
//     iconUrl: icon,
//     shadowUrl: iconShadow,
//     iconSize: [25, 41],
//     iconAnchor: [12, 41]
// });
// L.Marker.prototype.options.icon = DefaultIcon;

// // Helper to center map
// function ChangeView({ center }: { center: [number, number] }) {
//   const map = useMap();
//   map.setView(center);
//   return null;
// }

// interface LocationData {
//   lat: number;
//   lng: number;
//   method: 'GPS' | 'IP' | 'STATIC';
// }

// interface DetectionResult {
//   plasticCount: number;
//   items: string[];
//   confidence: number;
//   isPolluted: boolean;
//   hazardLevel: 'Low' | 'Medium' | 'High';
// }

// export default function Report() {
//   const [isCameraOpen, setIsCameraOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [location, setLocation] = useState<LocationData | null>(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   // 1. Start Camera
//   const startCamera = async () => {
//     try {
//       setIsCameraOpen(true);
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         video: { facingMode: 'environment' } // Uses back camera on phone
//       });
//       if (videoRef.current) videoRef.current.srcObject = stream;
//     } catch (err) {
//       toast.error("Camera access denied");
//     }
//   };

//   const stopCamera = () => {
//     if (videoRef.current?.srcObject) {
//       const stream = videoRef.current.srcObject as MediaStream;
//       stream.getTracks().forEach(track => track.stop());
//       videoRef.current.srcObject = null;
//     }
//     setIsCameraOpen(false);
//   };

//   const captureFrame = () => {
//     if (!videoRef.current || !canvasRef.current) return;
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     if (context) {
//       context.drawImage(video, 0, 0, canvas.width, canvas.height);
//       setSelectedImage(canvas.toDataURL('image/jpeg'));
//       stopCamera();
//     }
//   };

//   // --- STATIC LOCATION LOGIC ---
//   const useThaparLocation = () => {
//     // Coordinates for Thapar Institute (TIET), Patiala
//     const thaparCoords = {
//       lat: 30.3564, 
//       lng: 76.3647
//     };

//     setLocation({ 
//       ...thaparCoords, 
//       method: 'STATIC' 
//     });
    
//     captureFrame();
//     toast.success("Location set to Thapar Campus");
//   };

//   const analyzeImage = async () => {
//     if (!selectedImage) return;
//     setIsAnalyzing(true);
//     // Simulate ML Delay
//     await new Promise(resolve => setTimeout(resolve, 2000));
    
//     setDetectionResult({
//       plasticCount: 4,
//       items: ['Wrapper', 'Plastic Bottle'],
//       confidence: 0.94,
//       isPolluted: true,
//       hazardLevel: 'Medium',
//     });
//     setIsAnalyzing(false);
//   };

//   const handleRetake = () => {
//     setSelectedImage(null);
//     setDetectionResult(null);
//     setLocation(null);
//     setIsSubmitted(false);
//     startCamera();
//   };

//   return (
//     <div className="min-h-screen bg-background pb-20">
//       <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
//         <div className="container mx-auto px-4 h-16 flex items-center justify-between">
//             <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
//               <ArrowLeft className="w-5 h-5" />
//               <span>Back</span>
//             </Link>
//             <h1 className="font-semibold">Report Issue</h1>
//             <div className="w-8" />
//         </div>
//       </header>

//       <div className="container mx-auto px-4 py-6 max-w-lg">
        
//         {/* CAMERA VIEW */}
//         {!selectedImage && (
//           <div className="space-y-4">
//             <div className="relative aspect-[3/4] bg-black rounded-2xl overflow-hidden shadow-2xl">
//                {!isCameraOpen ? (
//                   <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
//                     <Camera className="w-16 h-16 mb-4 opacity-50" />
//                     <Button onClick={startCamera} variant="secondary">Open Camera</Button>
//                   </div>
//                 ) : (
//                   <>
//                     <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    
//                     {/* Controls Overlay */}
//                     <div className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-4">
                      
//                       {/* Capture Button (Triggers Thapar Location) */}
//                       <button 
//                         onClick={useThaparLocation}
//                         className="w-20 h-20 bg-white rounded-full border-4 border-white/30 flex items-center justify-center hover:scale-105 transition-transform shadow-lg group"
//                       >
//                         <div className="w-16 h-16 bg-red-500 rounded-full group-active:scale-90 transition-transform" />
//                       </button>

//                       <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white/80 flex items-center gap-2">
//                         <MapPin className="w-3 h-3" />
//                         <span>Capturing at Thapar Campus</span>
//                       </div>
//                     </div>
//                   </>
//                 )}
//             </div>
//           </div>
//         )}

//         {/* RESULTS VIEW */}
//         {selectedImage && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
//             <Card>
//               <CardContent className="p-0 overflow-hidden relative">
//                 <img src={selectedImage} alt="Captured" className="w-full h-64 object-cover" />
//                 <Button size="icon" variant="destructive" className="absolute top-2 right-2 rounded-full" onClick={handleRetake}>
//                   <RefreshCw className="w-4 h-4" />
//                 </Button>
//               </CardContent>
              
//               <div className="p-4 border-t border-border">
//                 <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
//                         <MapPin className="w-4 h-4 text-primary" />
//                         Report Location
//                     </div>
//                     <Badge variant="outline" className="gap-1">
//                         <Building2 className="w-3 h-3" /> TIET Patiala
//                     </Badge>
//                 </div>
                
//                 {location && (
//                   <div className="h-[200px] w-full rounded-lg overflow-hidden border border-border relative z-0">
//                     <MapContainer 
//                       center={[location.lat, location.lng]} 
//                       zoom={16} // Zoomed in closer for campus view
//                       style={{ height: "100%", width: "100%" }}
//                       dragging={false}
//                       zoomControl={false}
//                     >
//                       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                       <Marker position={[location.lat, location.lng]}>
//                         <Popup>Thapar Institute (TIET)</Popup>
//                       </Marker>
//                       <ChangeView center={[location.lat, location.lng]} />
//                     </MapContainer>
//                   </div>
//                 )}
                
//                 {location && (
//                   <div className="mt-2 text-xs text-center font-mono text-muted-foreground">
//                     {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
//                   </div>
//                 )}
//               </div>
//             </Card>

//             {!detectionResult ? (
//               <Button size="lg" className="w-full h-12 gap-2" onClick={analyzeImage} disabled={isAnalyzing}>
//                 {isAnalyzing ? <Loader2 className="animate-spin" /> : <AlertTriangle />}
//                  Scan for Pollution
//               </Button>
//             ) : (
//                <Card className="border-primary/50 bg-primary/5">
//                  <CardHeader><CardTitle>Results</CardTitle></CardHeader>
//                  <CardContent>
//                     <div className="flex justify-between items-center bg-background/50 p-3 rounded-lg mb-4">
//                         <span className="text-muted-foreground">Plastic Items</span>
//                         <span className="text-xl font-bold">{detectionResult.plasticCount}</span>
//                     </div>
//                     {!isSubmitted ? (
//                         <Button className="w-full" onClick={() => setIsSubmitted(true)}>Submit Report</Button>
//                     ) : (
//                         <div className="text-green-600 font-bold text-center flex items-center justify-center gap-2">
//                             <CheckCircle /> Sent to Admin
//                         </div>
//                     )}
//                  </CardContent>
//                </Card>
//             )}
//           </motion.div>
//         )}

//         <canvas ref={canvasRef} className="hidden" />
//       </div>
//     </div>
//   );
// }



/////////////////////////////////////////////////////////////////////////////////////////

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Camera, CheckCircle, Loader2, MapPin, RefreshCw, AlertTriangle, Building2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- LEAFLET ICON FIX ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center);
  return null;
}

interface LocationData {
  lat: number;
  lng: number;
  method: 'GPS' | 'IP' | 'STATIC';
}

interface DetectionResult {
  plasticCount: number;
  items: string[];
  confidence: number;
  isPolluted: boolean;
  hazardLevel: 'Low' | 'Medium' | 'High';
}

export default function Report() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      toast.error("Camera access denied");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      setSelectedImage(canvas.toDataURL('image/jpeg'));
      stopCamera();
    }
  };

  const useThaparLocation = () => {
    const thaparCoords = { lat: 30.3564, lng: 76.3647 };
    setLocation({ ...thaparCoords, method: 'STATIC' });
    captureFrame();
    toast.success("Location fixed to Thapar Campus");
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setDetectionResult({
      plasticCount: Math.floor(Math.random() * 10) + 1,
      items: ['Plastic Bottle', 'Wrapper', 'Nets'],
      confidence: 0.94,
      isPolluted: true,
      hazardLevel: 'Medium',
    });
    setIsAnalyzing(false);
    toast.info("AI Analysis Complete");
  };

  // --- SUBMISSION LOGIC TO CONNECT TO ADMIN ---
  const handleSubmitReport = () => {
    if (!detectionResult || !location) return;

    // Create the report object matching Admin's expectations
    const newReport = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      location: { lat: location.lat, lng: location.lng },
      plasticCount: detectionResult.plasticCount,
      items: detectionResult.items,
      timestamp: new Date().toISOString(),
      actionTaken: 'Pending', // Initial status for Admin to manage
    };

    // Store in localStorage for the Admin panel to pick up
    const existingReports = JSON.parse(localStorage.getItem('user-reports') || '[]');
    localStorage.setItem('user-reports', JSON.stringify([newReport, ...existingReports]));

    setIsSubmitted(true);
    toast.success("Report sent to Authorities", {
      description: "Drone units have been notified."
    });
  };

  const handleRetake = () => {
    setSelectedImage(null);
    setDetectionResult(null);
    setLocation(null);
    setIsSubmitted(false);
    startCamera();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
            <h1 className="font-semibold">AquaPulse Reporter</h1>
            <div className="w-8" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-lg">
        
        {/* CAMERA VIEW */}
        {!selectedImage && (
          <div className="space-y-4">
            <div className="relative aspect-[3/4] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
               {!isCameraOpen ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <Camera className="w-16 h-16 mb-4 opacity-20" />
                    <Button onClick={startCamera} variant="secondary" className="gap-2">
                      <Camera className="w-4 h-4" /> Start Camera
                    </Button>
                  </div>
                ) : (
                  <>
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-4">
                      <button 
                        onClick={useThaparLocation}
                        className="w-20 h-20 bg-white rounded-full border-4 border-white/30 flex items-center justify-center hover:scale-105 transition-transform shadow-lg group"
                      >
                        <div className="w-16 h-16 bg-red-500 rounded-full group-active:scale-90 transition-transform" />
                      </button>
                      <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white/80 flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        <span>Auto-tagging: TIET Patiala</span>
                      </div>
                    </div>
                  </>
                )}
            </div>
          </div>
        )}

        {/* RESULTS VIEW */}
        {selectedImage && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card className="overflow-hidden glass-card">
              <div className="relative h-64">
                <img src={selectedImage} alt="Captured" className="w-full h-full object-cover" />
                {!isSubmitted && (
                  <Button size="icon" variant="destructive" className="absolute top-2 right-2 rounded-full" onClick={handleRetake}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <MapPin className="w-4 h-4 text-primary" />
                        Incident Location
                    </div>
                    <Badge variant="outline" className="gap-1 bg-primary/5">
                        <Building2 className="w-3 h-3" /> TIET Patiala
                    </Badge>
                </div>
                
                {location && (
                  <div className="h-[180px] w-full rounded-lg overflow-hidden border border-border relative z-0">
                    <MapContainer 
                      center={[location.lat, location.lng]} 
                      zoom={16} 
                      style={{ height: "100%", width: "100%" }}
                      dragging={false}
                      zoomControl={false}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[location.lat, location.lng]}>
                        <Popup>Thapar Campus</Popup>
                      </Marker>
                      <ChangeView center={[location.lat, location.lng]} />
                    </MapContainer>
                  </div>
                )}
              </div>
            </Card>

            {!detectionResult ? (
              <Button size="lg" className="w-full h-14 gap-2 text-lg shadow-lg" onClick={analyzeImage} disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    AI is Analyzing...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5" />
                    Scan for Pollutants
                  </>
                )}
              </Button>
            ) : (
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                 <Card className="border-primary/50 bg-primary/5">
                   <CardHeader className="pb-2">
                     <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Detection Results</CardTitle>
                   </CardHeader>
                   <CardContent>
                      <div className="flex justify-between items-center bg-background/50 p-4 rounded-xl mb-4 border border-border">
                          <span className="font-medium">Identified Plastic Items</span>
                          <span className="text-2xl font-bold text-primary">{detectionResult.plasticCount}</span>
                      </div>
                      {!isSubmitted ? (
                          <Button className="w-full h-12 gap-2" size="lg" onClick={handleSubmitReport}>
                            <Send className="w-4 h-4" /> Submit to Authority Panel
                          </Button>
                      ) : (
                          <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl text-green-600 font-bold text-center flex flex-col items-center gap-2">
                              <CheckCircle className="w-8 h-8" />
                              <div className="text-sm">Report Successfully Transmitted</div>
                              <Link to="/" className="text-xs underline mt-2 text-green-700">Return to Dashboard</Link>
                          </div>
                      )}
                   </CardContent>
                 </Card>
               </motion.div>
            )}
          </motion.div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}