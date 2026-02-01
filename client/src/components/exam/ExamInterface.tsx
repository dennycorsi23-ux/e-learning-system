import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Clock, 
  Volume2, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Headphones,
  PenTool,
  MessageSquare
} from "lucide-react";

// Types
interface ExamQuestion {
  id: number;
  skill: "listening" | "reading" | "writing" | "speaking";
  questionType: "multiple_choice" | "fill_blank" | "true_false" | "essay" | "oral_response";
  questionText: string;
  questionAudioUrl?: string;
  options?: { id: string; text: string }[];
  points: number;
  timeLimit?: number;
}

interface ExamAnswer {
  questionId: number;
  answerText?: string;
  selectedOptionId?: string;
  answerAudioUrl?: string;
}

interface ExamInterfaceProps {
  examId: number;
  questions: ExamQuestion[];
  timeLimit: number; // in minutes
  onSubmit: (answers: ExamAnswer[]) => void;
  onProctoringEvent: (event: { type: string; severity: string; description: string }) => void;
}

const skillIcons = {
  listening: Headphones,
  reading: BookOpen,
  writing: PenTool,
  speaking: MessageSquare,
};

const skillLabels = {
  listening: "Comprensione Orale",
  reading: "Comprensione Scritta",
  writing: "Produzione Scritta",
  speaking: "Produzione Orale",
};

export default function ExamInterface({ 
  examId, 
  questions, 
  timeLimit, 
  onSubmit,
  onProctoringEvent 
}: ExamInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, ExamAnswer>>(new Map());
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60); // in seconds
  const [isRecording, setIsRecording] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [webcamEnabled, setWebcamEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const SkillIcon = skillIcons[currentQuestion?.skill || "reading"];

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Initialize webcam for proctoring
  useEffect(() => {
    const initWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
        onProctoringEvent({
          type: "connection_lost",
          severity: "high",
          description: "Impossibile accedere alla webcam"
        });
      }
    };

    initWebcam();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle answer change
  const handleAnswerChange = useCallback((questionId: number, answer: Partial<ExamAnswer>) => {
    setAnswers((prev) => {
      const newAnswers = new Map(prev);
      const existing = newAnswers.get(questionId) || { questionId };
      newAnswers.set(questionId, { ...existing, ...answer });
      return newAnswers;
    });
  }, []);

  // Audio playback for listening questions
  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setAudioPlaying(!audioPlaying);
    }
  };

  // Voice recording for speaking questions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        // In production, upload to Cloudinary and get URL
        const audioUrl = URL.createObjectURL(audioBlob);
        handleAnswerChange(currentQuestion.id, { answerAudioUrl: audioUrl });
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      onProctoringEvent({
        type: "audio_anomaly",
        severity: "medium",
        description: "Impossibile avviare la registrazione audio"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Navigation
  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  // Submit exam
  const handleSubmitExam = () => {
    const answersArray = Array.from(answers.values());
    onSubmit(answersArray);
  };

  // Get progress by skill
  const getSkillProgress = (skill: string) => {
    const skillQuestions = questions.filter(q => q.skill === skill);
    const answeredQuestions = skillQuestions.filter(q => answers.has(q.id));
    return (answeredQuestions.length / skillQuestions.length) * 100;
  };

  // Render question based on type
  const renderQuestion = () => {
    if (!currentQuestion) return null;

    const currentAnswer = answers.get(currentQuestion.id);

    switch (currentQuestion.questionType) {
      case "multiple_choice":
      case "true_false":
        return (
          <div className="space-y-4">
            <div className="prose max-w-none">
              <p className="text-lg">{currentQuestion.questionText}</p>
            </div>
            <RadioGroup
              value={currentAnswer?.selectedOptionId || ""}
              onValueChange={(value) => 
                handleAnswerChange(currentQuestion.id, { selectedOptionId: value })
              }
            >
              {currentQuestion.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case "essay":
      case "fill_blank":
        return (
          <div className="space-y-4">
            <div className="prose max-w-none">
              <p className="text-lg">{currentQuestion.questionText}</p>
            </div>
            <Textarea
              placeholder="Scrivi la tua risposta qui..."
              value={currentAnswer?.answerText || ""}
              onChange={(e) => 
                handleAnswerChange(currentQuestion.id, { answerText: e.target.value })
              }
              className="min-h-[200px]"
            />
            <div className="text-sm text-muted-foreground">
              Caratteri: {(currentAnswer?.answerText || "").length}
            </div>
          </div>
        );

      case "oral_response":
        return (
          <div className="space-y-4">
            <div className="prose max-w-none">
              <p className="text-lg">{currentQuestion.questionText}</p>
            </div>
            <div className="flex flex-col items-center gap-4 p-6 bg-muted/30 rounded-lg">
              <div className="text-center mb-4">
                <p className="text-muted-foreground">
                  Registra la tua risposta orale. Parla chiaramente verso il microfono.
                </p>
              </div>
              <Button
                size="lg"
                variant={isRecording ? "destructive" : "default"}
                onClick={isRecording ? stopRecording : startRecording}
                className="gap-2"
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-5 w-5" />
                    Ferma Registrazione
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5" />
                    Inizia Registrazione
                  </>
                )}
              </Button>
              {isRecording && (
                <div className="flex items-center gap-2 text-destructive">
                  <span className="animate-pulse">●</span>
                  Registrazione in corso...
                </div>
              )}
              {currentAnswer?.answerAudioUrl && !isRecording && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Risposta registrata
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with timer and controls */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="container py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="gap-2 text-base px-3 py-1">
                <SkillIcon className="h-4 w-4" />
                {skillLabels[currentQuestion?.skill || "reading"]}
              </Badge>
              <span className="text-muted-foreground">
                Domanda {currentQuestionIndex + 1} di {questions.length}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Timer */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeRemaining < 300 ? "bg-destructive/10 text-destructive" : "bg-muted"
              }`}>
                <Clock className="h-5 w-5" />
                <span className="font-mono text-lg font-semibold">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              
              {/* Webcam preview */}
              <div className="relative w-24 h-18 rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 right-1 flex gap-1">
                  <button
                    onClick={() => setWebcamEnabled(!webcamEnabled)}
                    className={`p-1 rounded ${webcamEnabled ? "bg-green-500" : "bg-red-500"}`}
                  >
                    {webcamEnabled ? <Video className="h-3 w-3 text-white" /> : <VideoOff className="h-3 w-3 text-white" />}
                  </button>
                  <button
                    onClick={() => setMicEnabled(!micEnabled)}
                    className={`p-1 rounded ${micEnabled ? "bg-green-500" : "bg-red-500"}`}
                  >
                    {micEnabled ? <Mic className="h-3 w-3 text-white" /> : <MicOff className="h-3 w-3 text-white" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Audio player for listening questions */}
            {currentQuestion?.skill === "listening" && currentQuestion.questionAudioUrl && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handlePlayAudio}
                      className="gap-2"
                    >
                      <Volume2 className="h-5 w-5" />
                      {audioPlaying ? "Pausa" : "Riproduci Audio"}
                    </Button>
                    <audio
                      ref={audioRef}
                      src={currentQuestion.questionAudioUrl}
                      onEnded={() => setAudioPlaying(false)}
                    />
                    <span className="text-muted-foreground">
                      Ascolta attentamente prima di rispondere
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Question card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    Domanda {currentQuestionIndex + 1}
                  </CardTitle>
                  <Badge>{currentQuestion?.points || 1} punti</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {renderQuestion()}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => goToQuestion(currentQuestionIndex - 1)}
                disabled={currentQuestionIndex === 0}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Precedente
              </Button>
              
              {currentQuestionIndex === questions.length - 1 ? (
                <Button onClick={handleSubmitExam} className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Consegna Esame
                </Button>
              ) : (
                <Button
                  onClick={() => goToQuestion(currentQuestionIndex + 1)}
                  className="gap-2"
                >
                  Successiva
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress by skill */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progresso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(["listening", "reading", "writing", "speaking"] as const).map((skill) => {
                  const Icon = skillIcons[skill];
                  const progress = getSkillProgress(skill);
                  const hasQuestions = questions.some(q => q.skill === skill);
                  
                  if (!hasQuestions) return null;
                  
                  return (
                    <div key={skill} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{skillLabels[skill]}</span>
                        </div>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Question navigator */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navigazione</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, index) => {
                    const isAnswered = answers.has(q.id);
                    const isCurrent = index === currentQuestionIndex;
                    
                    return (
                      <button
                        key={q.id}
                        onClick={() => goToQuestion(index)}
                        className={`
                          w-full aspect-square rounded-lg text-sm font-medium
                          transition-colors
                          ${isCurrent 
                            ? "bg-primary text-primary-foreground" 
                            : isAnswered 
                              ? "bg-green-100 text-green-700 border border-green-300" 
                              : "bg-muted hover:bg-muted/80"
                          }
                        `}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-100 border border-green-300" />
                    <span>Risposta data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-muted" />
                    <span>Da completare</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Warning */}
            {timeRemaining < 300 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Meno di 5 minuti rimasti! Assicurati di completare tutte le risposte.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
