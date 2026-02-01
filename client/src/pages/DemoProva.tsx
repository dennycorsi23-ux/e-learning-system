import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  GraduationCap, 
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  RotateCcw
} from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

const skillIcons: Record<string, any> = {
  listening: Headphones,
  reading: BookOpen,
  writing: PenTool,
  speaking: Mic,
};

const skillNames: Record<string, string> = {
  listening: "Comprensione Orale",
  reading: "Comprensione Scritta",
  writing: "Produzione Scritta",
  speaking: "Produzione Orale",
};

const levelToId: Record<string, number> = {
  "A1": 1, "A2": 2, "B1": 3, "B2": 4, "C1": 5, "C2": 6
};

interface Question {
  id: number;
  type: string;
  question?: string;
  options?: string[];
  correct?: number;
  audio_transcript?: string;
}

interface Passage {
  id: number;
  title: string;
  text: string;
  questions: Question[];
}

interface Task {
  id: number;
  type: string;
  title: string;
  description: string;
  fields?: string[];
  example?: string;
  example_structure?: string[];
  prompts?: string[];
}

interface Part {
  id: number;
  title: string;
  duration: string;
  description: string;
  sample_questions?: string[];
  sample_topics?: string[];
  sample_prompts?: string[];
  sample_situations?: string[];
}

interface ExamContent {
  instructions: string;
  duration: string;
  questions?: Question[];
  passages?: Passage[];
  tasks?: Task[];
  parts?: Part[];
}

export default function DemoProva() {
  const params = useParams<{ skill: string; level: string }>();
  const [, setLocation] = useLocation();
  const skill = params.skill || "listening";
  const level = params.level || "A1";
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  
  const qcerLevelId = levelToId[level] || 1;
  
  const { data: sampleExams, isLoading } = trpc.sampleExams.getByLevelAndSkill.useQuery({
    qcerLevelId,
    skill: skill as "listening" | "reading" | "writing" | "speaking",
  });
  
  const examData = sampleExams?.[0];
  const content: ExamContent | null = examData?.content ? 
    (typeof examData.content === 'string' ? JSON.parse(examData.content) : examData.content) : null;
  
  // Timer
  useEffect(() => {
    if (!isStarted || showResults) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          setShowResults(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isStarted, showResults]);
  
  const startExam = () => {
    setIsStarted(true);
    // Parse duration from content
    const durationStr = content?.duration || "15 min";
    const minutes = parseInt(durationStr) || 15;
    setTimeLeft(minutes * 60);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get all questions from content
  const getAllQuestions = (): Question[] => {
    if (!content) return [];
    
    // Check for questions directly in content
    if (content.questions && content.questions.length > 0) {
      return content.questions;
    }
    
    // Check for questions inside parts (listening/reading format)
    if (content.parts && Array.isArray(content.parts)) {
      const allQuestions: Question[] = [];
      content.parts.forEach((part: any) => {
        if (part.questions && Array.isArray(part.questions)) {
          allQuestions.push(...part.questions);
        }
      });
      if (allQuestions.length > 0) {
        return allQuestions;
      }
    }
    
    // Check for questions inside passages (reading format)
    if (content.passages && Array.isArray(content.passages)) {
      return content.passages.flatMap((p: any) => p.questions || []);
    }
    
    return [];
  };
  
  const questions = getAllQuestions();
  const totalQuestions = questions.length;
  
  const handleAnswer = (questionId: number, answer: number | string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };
  
  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (q.correct !== undefined && answers[q.id] === q.correct) {
        correct++;
      }
    });
    return { correct, total: totalQuestions, percentage: Math.round((correct / totalQuestions) * 100) };
  };
  
  const resetExam = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setIsStarted(false);
  };
  
  const SkillIcon = skillIcons[skill] || BookOpen;
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!examData || !content) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">CertificaLingua</span>
            </Link>
            <Link href="/esempi-prove" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Torna agli Esempi</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Esempio di prova non disponibile per questo livello.</p>
              <Button className="mt-4" onClick={() => setLocation("/esempi-prove")}>
                Torna agli Esempi
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }
  
  // Render based on skill type
  const renderContent = () => {
    if (skill === "listening" || skill === "reading") {
      // Multiple choice questions
      if (!isStarted) {
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <SkillIcon className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">{skillNames[skill]} - Livello {level}</CardTitle>
              <CardDescription>{content.instructions}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{content.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{totalQuestions} domande</span>
                </div>
              </div>
              <Button className="w-full" size="lg" onClick={startExam}>
                Inizia la Demo
              </Button>
            </CardContent>
          </Card>
        );
      }
      
      if (showResults) {
        const score = calculateScore();
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                score.percentage >= 60 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {score.percentage >= 60 ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-600" />
                )}
              </div>
              <CardTitle className="text-2xl">Risultato Demo</CardTitle>
              <CardDescription>
                {score.percentage >= 60 ? 'Ottimo lavoro!' : 'Continua a esercitarti!'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">{score.percentage}%</div>
                <p className="text-muted-foreground">
                  {score.correct} risposte corrette su {score.total}
                </p>
              </div>
              <Progress value={score.percentage} className="h-3" />
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={resetExam}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Riprova
                </Button>
                <Button className="flex-1" onClick={() => setLocation("/esempi-prove")}>
                  Altri Esempi
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      }
      
      const currentQ = questions[currentQuestion];
      const passage = content.passages?.find(p => p.questions.some(q => q.id === currentQ?.id));
      
      return (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Progress bar */}
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">
              Domanda {currentQuestion + 1} di {totalQuestions}
            </Badge>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span className={timeLeft < 60 ? 'text-red-500 font-bold' : ''}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          <Progress value={(currentQuestion / totalQuestions) * 100} className="h-2" />
          
          {/* Passage (for reading) */}
          {passage && (
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg">{passage.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-line">{passage.text}</p>
              </CardContent>
            </Card>
          )}
          
          {/* Audio transcript (for listening) */}
          {currentQ?.audio_transcript && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Headphones className="h-4 w-4" />
                  Trascrizione Audio (nella prova reale ascolterai l'audio)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm italic">{currentQ.audio_transcript}</p>
              </CardContent>
            </Card>
          )}
          
          {/* Question */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{currentQ?.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[currentQ?.id]?.toString()}
                onValueChange={(value) => handleAnswer(currentQ?.id, parseInt(value))}
              >
                {currentQ?.options?.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                    <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
          
          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(prev => prev - 1)}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Precedente
            </Button>
            {currentQuestion < totalQuestions - 1 ? (
              <Button
                onClick={() => setCurrentQuestion(prev => prev + 1)}
                disabled={answers[currentQ?.id] === undefined}
              >
                Successiva
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => setShowResults(true)}
                disabled={Object.keys(answers).length < totalQuestions}
              >
                Termina Demo
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      );
    }
    
    if (skill === "writing") {
      // Writing tasks
      if (!isStarted) {
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <PenTool className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Produzione Scritta - Livello {level}</CardTitle>
              <CardDescription>{content.instructions}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{content.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{content.tasks?.length || 0} compiti</span>
                </div>
              </div>
              <Button className="w-full" size="lg" onClick={startExam}>
                Inizia la Demo
              </Button>
            </CardContent>
          </Card>
        );
      }
      
      const tasks = content.tasks || [];
      const currentTask = tasks[currentQuestion];
      
      if (showResults) {
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Demo Completata</CardTitle>
              <CardDescription>
                Hai completato la demo di produzione scritta. Nella prova reale, i tuoi testi saranno valutati da esaminatori certificati.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={resetExam}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Riprova
                </Button>
                <Button className="flex-1" onClick={() => setLocation("/esempi-prove")}>
                  Altri Esempi
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      }
      
      return (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">
              Compito {currentQuestion + 1} di {tasks.length}
            </Badge>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span className={timeLeft < 60 ? 'text-red-500 font-bold' : ''}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          <Progress value={(currentQuestion / tasks.length) * 100} className="h-2" />
          
          <Card>
            <CardHeader>
              <CardTitle>{currentTask?.title}</CardTitle>
              <CardDescription>{currentTask?.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentTask?.fields && (
                <div className="grid grid-cols-2 gap-4">
                  {currentTask.fields.map((field, idx) => (
                    <div key={idx}>
                      <Label>{field}</Label>
                      <Textarea 
                        placeholder={`Inserisci ${field.toLowerCase()}...`}
                        className="mt-1"
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {currentTask?.prompts && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium mb-2">Suggerimenti:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {currentTask.prompts.map((prompt, idx) => (
                      <li key={idx}>{prompt}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {currentTask?.example && (
                <div className="bg-blue-50 border-blue-200 border p-4 rounded-lg">
                  <p className="font-medium mb-2 text-blue-900">Esempio:</p>
                  <p className="text-sm text-blue-800 italic">{currentTask.example}</p>
                </div>
              )}
              
              {!currentTask?.fields && (
                <Textarea 
                  placeholder="Scrivi qui il tuo testo..."
                  className="min-h-[200px]"
                  value={answers[currentTask?.id] as string || ''}
                  onChange={(e) => handleAnswer(currentTask?.id, e.target.value)}
                />
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(prev => prev - 1)}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Precedente
            </Button>
            {currentQuestion < tasks.length - 1 ? (
              <Button onClick={() => setCurrentQuestion(prev => prev + 1)}>
                Successivo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={() => setShowResults(true)}>
                Termina Demo
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      );
    }
    
    if (skill === "speaking") {
      // Speaking parts
      const parts = content.parts || [];
      
      if (!isStarted) {
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Produzione Orale - Livello {level}</CardTitle>
              <CardDescription>{content.instructions}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{content.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{parts.length} parti</span>
                </div>
              </div>
              <div className="bg-amber-50 border-amber-200 border p-4 rounded-lg text-sm text-amber-800">
                <strong>Nota:</strong> Questa è una demo informativa. La prova orale reale si svolge in videoconferenza con un esaminatore certificato.
              </div>
              <Button className="w-full" size="lg" onClick={startExam}>
                Visualizza Struttura Esame
              </Button>
            </CardContent>
          </Card>
        );
      }
      
      return (
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <p className="text-sm text-amber-800">
                <strong>Demo informativa:</strong> Di seguito puoi vedere la struttura della prova orale e le tipologie di domande. 
                La prova reale si svolge in videoconferenza con un esaminatore certificato.
              </p>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            {parts.map((part, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Parte {idx + 1}: {part.title}</CardTitle>
                    <Badge variant="outline">{part.duration}</Badge>
                  </div>
                  <CardDescription>{part.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {part.sample_questions && (
                    <div className="space-y-2">
                      <p className="font-medium text-sm">Esempi di domande:</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {part.sample_questions.map((q, qIdx) => (
                          <li key={qIdx}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {part.sample_topics && (
                    <div className="space-y-2">
                      <p className="font-medium text-sm">Argomenti possibili:</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {part.sample_topics.map((t, tIdx) => (
                          <li key={tIdx}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {part.sample_prompts && (
                    <div className="space-y-2">
                      <p className="font-medium text-sm">Suggerimenti:</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {part.sample_prompts.map((p, pIdx) => (
                          <li key={pIdx}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {part.sample_situations && (
                    <div className="space-y-2">
                      <p className="font-medium text-sm">Situazioni esempio:</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {part.sample_situations.map((s, sIdx) => (
                          <li key={sIdx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button onClick={() => setLocation("/esempi-prove")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna agli Esempi
            </Button>
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">CertificaLingua</span>
          </Link>
          <Link href="/esempi-prove" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Torna agli Esempi</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CertificaLingua. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  );
}
