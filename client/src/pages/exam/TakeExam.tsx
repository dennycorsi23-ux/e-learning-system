import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  Shield,
  CheckCircle,
  Clock,
  BookOpen,
  Headphones,
  PenTool,
  MessageSquare,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import ProctoringSystem from "@/components/proctoring/ProctoringSystem";
import ExamInterface from "@/components/exam/ExamInterface";

type ExamPhase = "instructions" | "proctoring-setup" | "exam" | "completed";

// Mock exam questions for demonstration
const mockQuestions = [
  // Listening
  {
    id: 1,
    skill: "listening" as const,
    questionType: "multiple_choice" as const,
    questionText: "Ascolta l'audio e seleziona la risposta corretta. Di cosa parla principalmente il dialogo?",
    questionAudioUrl: "/audio/sample-listening.mp3",
    options: [
      { id: "a", text: "Una prenotazione al ristorante" },
      { id: "b", text: "Un appuntamento dal medico" },
      { id: "c", text: "Una riunione di lavoro" },
      { id: "d", text: "Una lezione universitaria" },
    ],
    points: 5,
  },
  {
    id: 2,
    skill: "listening" as const,
    questionType: "true_false" as const,
    questionText: "Ascolta l'audio. Il parlante afferma che il progetto sarà completato entro venerdì.",
    questionAudioUrl: "/audio/sample-listening-2.mp3",
    options: [
      { id: "true", text: "Vero" },
      { id: "false", text: "Falso" },
    ],
    points: 3,
  },
  // Reading
  {
    id: 3,
    skill: "reading" as const,
    questionType: "multiple_choice" as const,
    questionText: `Leggi il seguente testo e rispondi alla domanda.

"La sostenibilità ambientale è diventata una priorità per molte aziende. Secondo un recente studio, il 78% delle imprese europee ha implementato politiche green negli ultimi tre anni. Questo cambiamento è guidato non solo dalla consapevolezza ambientale, ma anche dalla pressione dei consumatori che preferiscono prodotti eco-friendly."

Qual è la causa principale del cambiamento nelle politiche aziendali secondo il testo?`,
    options: [
      { id: "a", text: "Solo la consapevolezza ambientale" },
      { id: "b", text: "Solo la pressione dei consumatori" },
      { id: "c", text: "Sia la consapevolezza ambientale che la pressione dei consumatori" },
      { id: "d", text: "Le normative governative" },
    ],
    points: 5,
  },
  {
    id: 4,
    skill: "reading" as const,
    questionType: "fill_blank" as const,
    questionText: `Completa il riassunto del testo precedente con le parole appropriate.

La sostenibilità è importante per le _______ europee. I _______ preferiscono prodotti rispettosi dell'ambiente.`,
    points: 4,
  },
  // Writing
  {
    id: 5,
    skill: "writing" as const,
    questionType: "essay" as const,
    questionText: `Scrivi un breve testo (150-200 parole) sul seguente argomento:

"L'importanza dell'apprendimento delle lingue straniere nel mondo moderno"

Includi:
- Almeno due vantaggi dell'apprendimento delle lingue
- Un esempio personale o generale
- Una conclusione`,
    points: 20,
    timeLimit: 20,
  },
  // Speaking
  {
    id: 6,
    skill: "speaking" as const,
    questionType: "oral_response" as const,
    questionText: `Rispondi oralmente alla seguente domanda (1-2 minuti):

"Descrivi la tua giornata tipica. Cosa fai dalla mattina alla sera? Quali sono le tue attività preferite?"

Ricorda di:
- Usare connettori temporali (prima, poi, dopo, infine)
- Descrivere almeno 4-5 attività
- Esprimere le tue preferenze`,
    points: 15,
    timeLimit: 3,
  },
];

export default function TakeExam() {
  const params = useParams<{ examId: string }>();
  const [, navigate] = useLocation();
  const examId = parseInt(params.examId || "0");

  const [phase, setPhase] = useState<ExamPhase>("instructions");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [proctoringReady, setProctoringReady] = useState(false);
  const [proctoringEvents, setProctoringEvents] = useState<any[]>([]);
  const [examAnswers, setExamAnswers] = useState<any[]>([]);
  const [examResult, setExamResult] = useState<any>(null);

  // Handle proctoring events
  const handleProctoringEvent = (event: any) => {
    setProctoringEvents((prev) => [...prev, { ...event, timestamp: new Date() }]);
    
    // Log critical events
    if (event.severity === "critical") {
      console.error("Critical proctoring event:", event);
      // In production, this would send to the server immediately
    }
  };

  // Handle proctoring ready
  const handleProctoringReady = () => {
    setProctoringReady(true);
  };

  // Handle proctoring error
  const handleProctoringError = (error: string) => {
    console.error("Proctoring error:", error);
  };

  // Handle exam submission
  const handleExamSubmit = (answers: any[]) => {
    setExamAnswers(answers);
    
    // Calculate mock result
    const answeredQuestions = answers.length;
    const totalQuestions = mockQuestions.length;
    const mockScore = Math.round((answeredQuestions / totalQuestions) * 100);
    
    setExamResult({
      score: mockScore,
      passed: mockScore >= 60,
      details: {
        listening: Math.round(Math.random() * 30 + 70),
        reading: Math.round(Math.random() * 30 + 70),
        writing: Math.round(Math.random() * 30 + 60),
        speaking: Math.round(Math.random() * 30 + 65),
      },
    });
    
    setPhase("completed");
  };

  // Start proctoring setup
  const startProctoringSetup = () => {
    if (acceptedTerms) {
      setPhase("proctoring-setup");
    }
  };

  // Start exam
  const startExam = () => {
    if (proctoringReady) {
      setPhase("exam");
    }
  };

  // Render based on phase
  const renderContent = () => {
    switch (phase) {
      case "instructions":
        return (
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  Istruzioni per l'Esame
                </CardTitle>
                <CardDescription>
                  Leggi attentamente le istruzioni prima di iniziare
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Exam info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Durata</p>
                    <p className="font-semibold">90 minuti</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <Headphones className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Ascolto</p>
                    <p className="font-semibold">2 domande</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Lettura</p>
                    <p className="font-semibold">2 domande</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <PenTool className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Scrittura</p>
                    <p className="font-semibold">1 domanda</p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Requisiti Tecnici</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Webcam funzionante e ben illuminata</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Microfono funzionante per le prove orali</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Connessione internet stabile</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Browser aggiornato (Chrome, Firefox, Edge)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Ambiente silenzioso e senza distrazioni</span>
                    </li>
                  </ul>
                </div>

                {/* Rules */}
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Regole dell'Esame</AlertTitle>
                  <AlertDescription className="mt-2">
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Non è consentito l'uso di materiali di supporto</li>
                      <li>Non è consentito comunicare con altre persone</li>
                      <li>Non è consentito cambiare tab o finestra del browser</li>
                      <li>Il volto deve essere sempre visibile nella webcam</li>
                      <li>L'esame verrà registrato per motivi di sicurezza</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                {/* Proctoring info */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900">Sistema di Sorveglianza</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        L'esame utilizza un sistema di proctoring automatico che monitora:
                        riconoscimento facciale, eye-tracking, condivisione schermo e audio ambiente.
                        Eventuali violazioni verranno segnalate e potrebbero invalidare l'esame.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Terms acceptance */}
                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    Ho letto e accetto le istruzioni e le regole dell'esame. Acconsento alla
                    registrazione della sessione d'esame e al monitoraggio tramite sistema di
                    proctoring automatico. Dichiaro di sostenere l'esame in autonomia e senza
                    l'ausilio di materiali o persone non autorizzate.
                  </Label>
                </div>

                <Button
                  size="lg"
                  className="w-full gap-2"
                  onClick={startProctoringSetup}
                  disabled={!acceptedTerms}
                >
                  Procedi alla Verifica Sistema
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "proctoring-setup":
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <ProctoringSystem
              examId={examId}
              userId={1} // Would come from auth context
              onEvent={handleProctoringEvent}
              onReady={handleProctoringReady}
              onError={handleProctoringError}
            />
            
            {proctoringReady && (
              <div className="flex justify-center">
                <Button size="lg" onClick={startExam} className="gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Inizia l'Esame
                </Button>
              </div>
            )}
          </div>
        );

      case "exam":
        return (
          <ExamInterface
            examId={examId}
            questions={mockQuestions}
            timeLimit={90}
            onSubmit={handleExamSubmit}
            onProctoringEvent={handleProctoringEvent}
          />
        );

      case "completed":
        return (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  {examResult?.passed ? (
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="h-10 w-10 text-red-600" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-2xl">
                  {examResult?.passed ? "Esame Superato!" : "Esame Non Superato"}
                </CardTitle>
                <CardDescription>
                  {examResult?.passed
                    ? "Complimenti! Hai superato l'esame con successo."
                    : "Purtroppo non hai raggiunto il punteggio minimo."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Score */}
                <div className="text-center">
                  <p className="text-5xl font-bold text-primary">{examResult?.score}%</p>
                  <p className="text-muted-foreground">Punteggio Totale</p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <Headphones className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-sm text-muted-foreground">Ascolto</p>
                    <p className="font-semibold">{examResult?.details?.listening}%</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <BookOpen className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-sm text-muted-foreground">Lettura</p>
                    <p className="font-semibold">{examResult?.details?.reading}%</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <PenTool className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-sm text-muted-foreground">Scrittura</p>
                    <p className="font-semibold">{examResult?.details?.writing}%</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <MessageSquare className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-sm text-muted-foreground">Parlato</p>
                    <p className="font-semibold">{examResult?.details?.speaking}%</p>
                  </div>
                </div>

                {/* Proctoring summary */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Riepilogo Sorveglianza
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {proctoringEvents.length === 0
                      ? "Nessuna anomalia rilevata durante l'esame."
                      : `${proctoringEvents.length} eventi registrati durante l'esame.`}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/dashboard/esami")}
                  >
                    Torna ai Miei Esami
                  </Button>
                  {examResult?.passed && (
                    <Button
                      className="flex-1"
                      onClick={() => navigate("/dashboard/certificati")}
                    >
                      Visualizza Certificato
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {phase !== "exam" && (
        <header className="border-b bg-background">
          <div className="container py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                <div>
                  <h1 className="font-semibold">Esame di Certificazione</h1>
                  <p className="text-sm text-muted-foreground">Livello B2 - Inglese</p>
                </div>
              </div>
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                90 minuti
              </Badge>
            </div>
          </div>
        </header>
      )}

      {/* Content */}
      <main className={phase === "exam" ? "" : "container py-8"}>
        {renderContent()}
      </main>
    </div>
  );
}
