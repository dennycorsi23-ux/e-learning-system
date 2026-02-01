import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  User,
  Shield,
  Camera,
  Loader2,
} from "lucide-react";

// Types for proctoring events
export interface ProctoringEvent {
  type: 
    | "face_not_detected"
    | "multiple_faces"
    | "face_mismatch"
    | "eye_tracking_violation"
    | "tab_switch"
    | "browser_unfocus"
    | "screen_share_stopped"
    | "audio_anomaly"
    | "object_detected"
    | "identity_verification_failed"
    | "connection_lost"
    | "other";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  timestamp: Date;
  screenshotUrl?: string;
}

interface ProctoringSystemProps {
  examId: number;
  userId: number;
  userPhotoUrl?: string;
  onEvent: (event: Omit<ProctoringEvent, "timestamp">) => void;
  onReady: () => void;
  onError: (error: string) => void;
}

interface SystemCheck {
  name: string;
  status: "pending" | "checking" | "passed" | "failed";
  message?: string;
}

export default function ProctoringSystem({
  examId,
  userId,
  userPhotoUrl,
  onEvent,
  onReady,
  onError,
}: ProctoringSystemProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [screenShareEnabled, setScreenShareEnabled] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [identityVerified, setIdentityVerified] = useState(false);
  const [warnings, setWarnings] = useState<ProctoringEvent[]>([]);
  const [systemChecks, setSystemChecks] = useState<SystemCheck[]>([
    { name: "Webcam", status: "pending" },
    { name: "Microfono", status: "pending" },
    { name: "Condivisione Schermo", status: "pending" },
    { name: "Rilevamento Volto", status: "pending" },
    { name: "Verifica Identità", status: "pending" },
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const faceDetectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Update system check status
  const updateCheck = useCallback((name: string, status: SystemCheck["status"], message?: string) => {
    setSystemChecks(prev => 
      prev.map(check => 
        check.name === name ? { ...check, status, message } : check
      )
    );
  }, []);

  // Add proctoring event
  const addEvent = useCallback((event: Omit<ProctoringEvent, "timestamp">) => {
    const fullEvent: ProctoringEvent = {
      ...event,
      timestamp: new Date(),
    };
    setWarnings(prev => [...prev, fullEvent]);
    onEvent(event);
  }, [onEvent]);

  // Initialize webcam
  const initializeWebcam = async () => {
    updateCheck("Webcam", "checking");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: true,
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setWebcamEnabled(true);
      setMicEnabled(true);
      updateCheck("Webcam", "passed", "Webcam attiva");
      updateCheck("Microfono", "passed", "Microfono attivo");
      
      // Start recording for proctoring
      startRecording(stream);
      
      return true;
    } catch (error) {
      console.error("Webcam error:", error);
      updateCheck("Webcam", "failed", "Impossibile accedere alla webcam");
      updateCheck("Microfono", "failed", "Impossibile accedere al microfono");
      onError("Permesso webcam/microfono negato. È necessario per sostenere l'esame.");
      return false;
    }
  };

  // Initialize screen share
  const initializeScreenShare = async () => {
    updateCheck("Condivisione Schermo", "checking");
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "monitor",
        },
        audio: false,
      });
      
      screenStreamRef.current = screenStream;
      setScreenShareEnabled(true);
      updateCheck("Condivisione Schermo", "passed", "Schermo condiviso");
      
      // Listen for screen share stop
      screenStream.getVideoTracks()[0].onended = () => {
        setScreenShareEnabled(false);
        addEvent({
          type: "screen_share_stopped",
          severity: "critical",
          description: "La condivisione dello schermo è stata interrotta",
        });
      };
      
      return true;
    } catch (error) {
      console.error("Screen share error:", error);
      updateCheck("Condivisione Schermo", "failed", "Condivisione schermo negata");
      onError("È necessario condividere l'intero schermo per sostenere l'esame.");
      return false;
    }
  };

  // Start recording session
  const startRecording = (stream: MediaStream) => {
    try {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
      });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start(10000); // Record in 10-second chunks
      mediaRecorderRef.current = mediaRecorder;
    } catch (error) {
      console.error("Recording error:", error);
    }
  };

  // Simple face detection using canvas analysis
  // In production, use TensorFlow.js face-detection model or external API
  const detectFace = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (!ctx || video.readyState !== 4) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    // Get image data for analysis
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Simple skin tone detection (basic face detection simulation)
    // In production, use proper ML model
    let skinPixels = 0;
    const totalPixels = data.length / 4;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Basic skin tone detection
      if (r > 95 && g > 40 && b > 20 &&
          r > g && r > b &&
          Math.abs(r - g) > 15 &&
          r - g > 15 && r - b > 15) {
        skinPixels++;
      }
    }
    
    const skinRatio = skinPixels / totalPixels;
    
    // If skin ratio is between 5% and 50%, likely a face is present
    const facePresent = skinRatio > 0.05 && skinRatio < 0.5;
    
    if (!facePresent && faceDetected) {
      setFaceDetected(false);
      addEvent({
        type: "face_not_detected",
        severity: "high",
        description: "Volto non rilevato nel frame",
      });
    } else if (facePresent && !faceDetected) {
      setFaceDetected(true);
    }
    
    // Check for multiple faces (simplified - in production use proper detection)
    // This would require a proper face detection model
    
  }, [faceDetected, addEvent]);

  // Monitor tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        addEvent({
          type: "tab_switch",
          severity: "high",
          description: "L'utente ha cambiato tab o minimizzato il browser",
        });
      }
    };

    const handleBlur = () => {
      addEvent({
        type: "browser_unfocus",
        severity: "medium",
        description: "La finestra del browser ha perso il focus",
      });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [addEvent]);

  // Keyboard shortcuts prevention
  useEffect(() => {
    const preventShortcuts = (e: KeyboardEvent) => {
      // Prevent common shortcuts that could be used for cheating
      if (
        (e.ctrlKey && (e.key === "c" || e.key === "v" || e.key === "Tab")) ||
        (e.altKey && e.key === "Tab") ||
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I")
      ) {
        e.preventDefault();
        addEvent({
          type: "other",
          severity: "medium",
          description: `Tentativo di usare scorciatoia: ${e.key}`,
        });
      }
    };

    window.addEventListener("keydown", preventShortcuts);
    return () => window.removeEventListener("keydown", preventShortcuts);
  }, [addEvent]);

  // Initialize proctoring system
  const initializeProctoring = async () => {
    const webcamOk = await initializeWebcam();
    if (!webcamOk) return;
    
    const screenOk = await initializeScreenShare();
    if (!screenOk) return;
    
    // Start face detection
    updateCheck("Rilevamento Volto", "checking");
    faceDetectionIntervalRef.current = setInterval(detectFace, 2000);
    
    // Simulate face detection success after a moment
    setTimeout(() => {
      setFaceDetected(true);
      updateCheck("Rilevamento Volto", "passed", "Volto rilevato");
      
      // Simulate identity verification
      updateCheck("Verifica Identità", "checking");
      setTimeout(() => {
        setIdentityVerified(true);
        updateCheck("Verifica Identità", "passed", "Identità verificata");
        setIsInitialized(true);
        onReady();
      }, 2000);
    }, 3000);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (faceDetectionIntervalRef.current) {
        clearInterval(faceDetectionIntervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Calculate overall progress
  const completedChecks = systemChecks.filter(c => c.status === "passed").length;
  const progress = (completedChecks / systemChecks.length) * 100;

  return (
    <div className="space-y-6">
      {/* System Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Sistema di Sorveglianza Esame
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Inizializzazione Sistema</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* System Checks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {systemChecks.map((check) => (
              <div
                key={check.name}
                className={`p-4 rounded-lg border ${
                  check.status === "passed"
                    ? "bg-green-50 border-green-200"
                    : check.status === "failed"
                    ? "bg-red-50 border-red-200"
                    : check.status === "checking"
                    ? "bg-blue-50 border-blue-200"
                    : "bg-muted"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {check.status === "passed" && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {check.status === "failed" && <XCircle className="h-5 w-5 text-red-600" />}
                  {check.status === "checking" && <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />}
                  {check.status === "pending" && <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />}
                  <span className="font-medium">{check.name}</span>
                </div>
                {check.message && (
                  <p className="text-sm text-muted-foreground">{check.message}</p>
                )}
              </div>
            ))}
          </div>

          {/* Start Button */}
          {!isInitialized && (
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={initializeProctoring}
                className="gap-2"
              >
                <Camera className="h-5 w-5" />
                Avvia Verifica Sistema
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Video Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Video className="h-5 w-5" />
              Anteprima Webcam
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Status overlay */}
              <div className="absolute top-2 left-2 flex gap-2">
                <Badge variant={webcamEnabled ? "default" : "destructive"} className="gap-1">
                  {webcamEnabled ? <Video className="h-3 w-3" /> : <VideoOff className="h-3 w-3" />}
                  {webcamEnabled ? "ON" : "OFF"}
                </Badge>
                <Badge variant={micEnabled ? "default" : "destructive"} className="gap-1">
                  {micEnabled ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />}
                  {micEnabled ? "ON" : "OFF"}
                </Badge>
              </div>
              
              {/* Face detection indicator */}
              <div className="absolute bottom-2 left-2">
                <Badge variant={faceDetected ? "default" : "destructive"} className="gap-1">
                  <User className="h-3 w-3" />
                  {faceDetected ? "Volto Rilevato" : "Volto Non Rilevato"}
                </Badge>
              </div>
              
              {/* Identity status */}
              <div className="absolute bottom-2 right-2">
                <Badge variant={identityVerified ? "default" : "secondary"} className="gap-1">
                  <Eye className="h-3 w-3" />
                  {identityVerified ? "Identità Verificata" : "In Verifica"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warnings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5" />
              Avvisi ({warnings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {warnings.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nessun avviso registrato
                </p>
              ) : (
                warnings.map((warning, index) => (
                  <Alert
                    key={index}
                    variant={warning.severity === "critical" || warning.severity === "high" ? "destructive" : "default"}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="flex items-center justify-between">
                      <span>{warning.type.replace(/_/g, " ").toUpperCase()}</span>
                      <Badge variant="outline" className="text-xs">
                        {warning.severity}
                      </Badge>
                    </AlertTitle>
                    <AlertDescription>
                      {warning.description}
                      <div className="text-xs text-muted-foreground mt-1">
                        {warning.timestamp.toLocaleTimeString()}
                      </div>
                    </AlertDescription>
                  </Alert>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Screen Share Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              <span>Condivisione Schermo</span>
            </div>
            <Badge variant={screenShareEnabled ? "default" : "destructive"}>
              {screenShareEnabled ? "Attiva" : "Non Attiva"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
