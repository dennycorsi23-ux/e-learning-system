import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Camera,
  Mic,
  Monitor,
  Shield
} from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import { toast } from "sonner";

export default function ExamRoom() {
  const { examId } = useParams<{ examId: string }>();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"setup" | "identity" | "environment" | "ready" | "exam">("setup");
  const [cameraReady, setCameraReady] = useState(false);
  const [micReady, setMicReady] = useState(false);

  // Mock exam data
  const exam = {
    id: examId,
    title: "Esame Inglese B2",
    language: "Inglese",
    level: "B2",
    duration: 120, // minutes
    sections: [
      { name: "Comprensione Orale", duration: 30, questions: 25 },
      { name: "Comprensione Scritta", duration: 45, questions: 30 },
      { name: "Produzione Scritta", duration: 45, tasks: 2 },
    ]
  };

  const checkCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setCameraReady(true);
      toast.success("Webcam rilevata correttamente");
    } catch (error) {
      toast.error("Impossibile accedere alla webcam");
    }
  };

  const checkMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicReady(true);
      toast.success("Microfono rilevato correttamente");
    } catch (error) {
      toast.error("Impossibile accedere al microfono");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Accesso Richiesto</h2>
            <p className="text-muted-foreground mb-4">
              Devi effettuare l'accesso per sostenere l'esame.
            </p>
            <Link href="/login">
              <Button>Accedi</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div>
              <h1 className="font-semibold">{exam.title}</h1>
              <p className="text-sm text-muted-foreground">Sessione d'esame</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            {exam.duration} minuti
          </Badge>
        </div>
      </header>

      <main className="container py-8 max-w-3xl">
        {step === "setup" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verifica Requisiti Tecnici</CardTitle>
                <CardDescription>
                  Prima di iniziare l'esame, verifica che il tuo dispositivo soddisfi i requisiti tecnici.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Camera className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Webcam</p>
                      <p className="text-sm text-muted-foreground">Richiesta per il proctoring</p>
                    </div>
                  </div>
                  {cameraReady ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      OK
                    </Badge>
                  ) : (
                    <Button size="sm" onClick={checkCamera}>Verifica</Button>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mic className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Microfono</p>
                      <p className="text-sm text-muted-foreground">Richiesto per la prova orale</p>
                    </div>
                  </div>
                  {micReady ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      OK
                    </Badge>
                  ) : (
                    <Button size="sm" onClick={checkMic}>Verifica</Button>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Browser</p>
                      <p className="text-sm text-muted-foreground">Chrome o Firefox aggiornato</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    OK
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-900">Importante</h3>
                    <p className="text-sm text-amber-800 mt-1">
                      Durante l'esame non potrai lasciare la pagina o aprire altre applicazioni. 
                      Assicurati di avere una connessione internet stabile e di essere in un ambiente 
                      silenzioso e ben illuminato.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Link href="/dashboard/esami">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Torna Indietro
                </Button>
              </Link>
              <Button 
                onClick={() => setStep("identity")}
                disabled={!cameraReady || !micReady}
              >
                Continua
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === "identity" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Verifica Identità
                </CardTitle>
                <CardDescription>
                  Per garantire l'integrità dell'esame, è necessario verificare la tua identità.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      La verifica dell'identità sarà disponibile a breve
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Posiziona il tuo documento d'identità davanti alla webcam e assicurati che sia 
                  leggibile. Il sistema confronterà la foto del documento con il tuo volto.
                </p>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("setup")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Indietro
              </Button>
              <Button onClick={() => setStep("ready")}>
                Continua
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === "ready" && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Pronto per Iniziare</CardTitle>
                <CardDescription>
                  Hai completato tutti i controlli preliminari. Sei pronto per iniziare l'esame.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Riepilogo Esame</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Lingua:</span>
                        <span>{exam.language}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Livello:</span>
                        <span>{exam.level}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Durata totale:</span>
                        <span>{exam.duration} minuti</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Sezioni:</span>
                        <span>{exam.sections.length}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>Attenzione:</strong> Una volta iniziato l'esame, il timer non potrà 
                      essere messo in pausa. Assicurati di avere tutto il tempo necessario.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("identity")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Indietro
              </Button>
              <Button 
                size="lg"
                onClick={() => {
                  toast.info("Funzionalità in arrivo", {
                    description: "Il sistema d'esame sarà disponibile a breve."
                  });
                }}
              >
                Inizia Esame
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
