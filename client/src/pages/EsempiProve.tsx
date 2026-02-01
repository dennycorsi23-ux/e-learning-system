import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  ArrowLeft,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  Download,
  Play
} from "lucide-react";
import { Link, useLocation } from "wouter";

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

const sampleExams = {
  listening: {
    title: "Comprensione Orale",
    icon: Headphones,
    description: "Ascolta registrazioni audio e rispondi alle domande",
    samples: [
      { level: "A1", duration: "15 min", questions: 10 },
      { level: "A2", duration: "20 min", questions: 15 },
      { level: "B1", duration: "25 min", questions: 20 },
      { level: "B2", duration: "30 min", questions: 25 },
      { level: "C1", duration: "35 min", questions: 30 },
      { level: "C2", duration: "40 min", questions: 35 },
    ]
  },
  reading: {
    title: "Comprensione Scritta",
    icon: BookOpen,
    description: "Leggi testi e rispondi alle domande di comprensione",
    samples: [
      { level: "A1", duration: "20 min", questions: 15 },
      { level: "A2", duration: "25 min", questions: 20 },
      { level: "B1", duration: "35 min", questions: 25 },
      { level: "B2", duration: "45 min", questions: 30 },
      { level: "C1", duration: "50 min", questions: 35 },
      { level: "C2", duration: "60 min", questions: 40 },
    ]
  },
  writing: {
    title: "Produzione Scritta",
    icon: PenTool,
    description: "Scrivi testi su argomenti specifici",
    samples: [
      { level: "A1", duration: "20 min", tasks: 2 },
      { level: "A2", duration: "30 min", tasks: 2 },
      { level: "B1", duration: "40 min", tasks: 2 },
      { level: "B2", duration: "50 min", tasks: 2 },
      { level: "C1", duration: "60 min", tasks: 2 },
      { level: "C2", duration: "70 min", tasks: 2 },
    ]
  },
  speaking: {
    title: "Produzione Orale",
    icon: Mic,
    description: "Interazione orale in simultanea con esaminatore",
    samples: [
      { level: "A1", duration: "10 min", parts: 3 },
      { level: "A2", duration: "12 min", parts: 3 },
      { level: "B1", duration: "15 min", parts: 4 },
      { level: "B2", duration: "18 min", parts: 4 },
      { level: "C1", duration: "20 min", parts: 4 },
      { level: "C2", duration: "25 min", parts: 4 },
    ]
  }
};

export default function EsempiProve() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">CertificaLingua</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Torna alla Home</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container">
          {/* Title */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Preparazione</Badge>
            <h1 className="text-4xl font-bold mb-4">Esempi di Prove</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Familiarizza con il formato degli esami scaricando esempi di prove per ogni livello QCER e abilità linguistica.
            </p>
          </div>

          {/* Skills Tabs */}
          <Tabs defaultValue="listening" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
              <TabsTrigger value="listening" className="gap-2">
                <Headphones className="h-4 w-4" />
                <span className="hidden sm:inline">Ascolto</span>
              </TabsTrigger>
              <TabsTrigger value="reading" className="gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Lettura</span>
              </TabsTrigger>
              <TabsTrigger value="writing" className="gap-2">
                <PenTool className="h-4 w-4" />
                <span className="hidden sm:inline">Scrittura</span>
              </TabsTrigger>
              <TabsTrigger value="speaking" className="gap-2">
                <Mic className="h-4 w-4" />
                <span className="hidden sm:inline">Parlato</span>
              </TabsTrigger>
            </TabsList>

            {Object.entries(sampleExams).map(([key, skill]) => (
              <TabsContent key={key} value={key}>
                <Card className="mb-6">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <skill.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{skill.title}</CardTitle>
                        <CardDescription>{skill.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skill.samples.map((sample) => (
                    <Card key={sample.level} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-lg px-3 py-1">
                            {sample.level}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{sample.duration}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {'questions' in sample && `${sample.questions} domande`}
                          {'tasks' in sample && `${sample.tasks} compiti`}
                          {'parts' in sample && `${sample.parts} parti`}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setLocation(`/demo/${key}/${sample.level}`)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setLocation(`/demo/${key}/${sample.level}`)}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Demo
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Info */}
          <Card className="mt-8 bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <h3 className="font-medium text-amber-900 mb-2">Nota importante</h3>
              <p className="text-sm text-amber-800">
                Gli esempi di prove sono forniti esclusivamente a scopo di preparazione e familiarizzazione 
                con il formato dell'esame. Le domande effettive dell'esame saranno diverse. 
                La prova di produzione orale viene svolta in simultanea con un esaminatore certificato, 
                come previsto dal DM 62/2022.
              </p>
            </CardContent>
          </Card>
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
