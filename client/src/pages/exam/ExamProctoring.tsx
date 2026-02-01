import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  Mic, 
  Eye,
  AlertTriangle,
  CheckCircle2,
  Shield,
  Monitor,
  Users
} from "lucide-react";
import { useParams } from "wouter";

type ProctoringStatus = "active" | "warning" | "violation";

interface ProctoringEvent {
  id: string;
  type: "face_detected" | "face_lost" | "multiple_faces" | "looking_away" | "audio_detected" | "tab_switch";
  timestamp: Date;
  severity: "info" | "warning" | "critical";
  message: string;
}

export default function ExamProctoring() {
  const { examId } = useParams<{ examId: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<ProctoringStatus>("active");
  const [faceDetected, setFaceDetected] = useState(true);
  const [events, setEvents] = useState<ProctoringEvent[]>([]);

  // Simulated proctoring checks
  const checks = [
    { name: "Riconoscimento Facciale", status: faceDetected ? "ok" : "warning", icon: Eye },
    { name: "Webcam Attiva", status: "ok", icon: Camera },
    { name: "Microfono Attivo", status: "ok", icon: Mic },
    { name: "Schermo Monitorato", status: "ok", icon: Monitor },
    { name: "Singolo Utente", status: "ok", icon: Users },
  ];

  useEffect(() => {
    // Request camera access
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user" },
          audio: true 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Camera access denied:", error);
      }
    };

    startCamera();

    return () => {
      // Cleanup camera stream
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const getStatusColor = (status: ProctoringStatus) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "warning": return "bg-amber-500";
      case "violation": return "bg-red-500";
    }
  };

  const getStatusText = (status: ProctoringStatus) => {
    switch (status) {
      case "active": return "Monitoraggio Attivo";
      case "warning": return "Attenzione Richiesta";
      case "violation": return "Violazione Rilevata";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Status Bar */}
        <div className="flex items-center justify-between bg-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(status)} animate-pulse`} />
            <span className="font-medium">{getStatusText(status)}</span>
          </div>
          <Badge variant="outline" className="border-slate-600 text-slate-300">
            <Shield className="h-3 w-3 mr-1" />
            Proctoring AI Attivo
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Video Feed */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Feed Video</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay indicators */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded text-xs">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      REC
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/50 rounded-lg p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">Analisi in tempo reale</span>
                        <span className="text-green-400">Volto rilevato</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Proctoring Status */}
          <div className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Controlli Attivi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {checks.map((check) => (
                  <div 
                    key={check.name}
                    className="flex items-center justify-between p-2 bg-slate-700/50 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <check.icon className="h-4 w-4 text-slate-400" />
                      <span className="text-sm">{check.name}</span>
                    </div>
                    {check.status === "ok" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Info Proctoring</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-300 space-y-2">
                <p>Il sistema di proctoring AI monitora:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>Presenza continua del volto</li>
                  <li>Direzione dello sguardo</li>
                  <li>Presenza di altre persone</li>
                  <li>Suoni nell'ambiente</li>
                  <li>Cambio di tab/finestra</li>
                </ul>
                <p className="text-amber-400 mt-4">
                  Eventuali anomalie verranno registrate e segnalate.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Events Log */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">Log Eventi</CardTitle>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-4">
                Nessun evento registrato. Il sistema sta monitorando la sessione.
              </p>
            ) : (
              <div className="space-y-2">
                {events.map((event) => (
                  <div 
                    key={event.id}
                    className={`p-2 rounded text-sm ${
                      event.severity === "critical" ? "bg-red-500/20 text-red-300" :
                      event.severity === "warning" ? "bg-amber-500/20 text-amber-300" :
                      "bg-slate-700/50 text-slate-300"
                    }`}
                  >
                    <span className="text-slate-500 mr-2">
                      {event.timestamp.toLocaleTimeString()}
                    </span>
                    {event.message}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
