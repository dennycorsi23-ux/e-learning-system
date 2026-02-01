import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  ArrowLeft,
  Globe,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Link, useParams } from "wouter";

const languages = [
  { code: "en", name: "Inglese", flag: "🇬🇧", description: "La lingua più richiesta a livello internazionale" },
  { code: "fr", name: "Francese", flag: "🇫🇷", description: "Lingua ufficiale in oltre 29 paesi" },
  { code: "de", name: "Tedesco", flag: "🇩🇪", description: "La lingua più parlata nell'Unione Europea" },
  { code: "es", name: "Spagnolo", flag: "🇪🇸", description: "Seconda lingua più parlata al mondo" },
];

const qcerLevels = [
  { 
    code: "A1", 
    name: "Principiante", 
    color: "bg-emerald-500",
    description: "Comprende e usa espressioni familiari di uso quotidiano e formule molto comuni per soddisfare bisogni di tipo concreto.",
    skills: [
      "Presentarsi e presentare altri",
      "Porre domande su dati personali",
      "Interagire in modo semplice"
    ]
  },
  { 
    code: "A2", 
    name: "Elementare", 
    color: "bg-emerald-600",
    description: "Comunica in attività semplici e di routine che richiedono uno scambio di informazioni su argomenti familiari.",
    skills: [
      "Descrivere aspetti del proprio background",
      "Descrivere l'ambiente circostante",
      "Esprimere bisogni immediati"
    ]
  },
  { 
    code: "B1", 
    name: "Intermedio", 
    color: "bg-blue-500",
    description: "Comprende i punti chiave di argomenti familiari che riguardano la scuola, il tempo libero ecc.",
    skills: [
      "Affrontare situazioni durante viaggi",
      "Produrre testi semplici su argomenti noti",
      "Descrivere esperienze, eventi, sogni"
    ]
  },
  { 
    code: "B2", 
    name: "Intermedio Superiore", 
    color: "bg-blue-600",
    description: "Comprende le idee principali di testi complessi su argomenti sia concreti che astratti.",
    skills: [
      "Interagire con scioltezza e spontaneità",
      "Produrre testi chiari e dettagliati",
      "Spiegare un punto di vista su argomenti di attualità"
    ]
  },
  { 
    code: "C1", 
    name: "Avanzato", 
    color: "bg-indigo-600",
    description: "Comprende un'ampia gamma di testi complessi e lunghi e ne sa riconoscere il significato implicito.",
    skills: [
      "Esprimersi con scioltezza e naturalezza",
      "Usare la lingua in modo flessibile ed efficace",
      "Produrre testi chiari, ben costruiti, dettagliati"
    ]
  },
  { 
    code: "C2", 
    name: "Padronanza", 
    color: "bg-indigo-800",
    description: "Comprende con facilità praticamente tutto ciò che sente e legge.",
    skills: [
      "Riassumere informazioni da diverse fonti",
      "Esprimersi spontaneamente con grande precisione",
      "Rendere distintamente sottili sfumature di significato"
    ]
  },
];

export default function Certificazioni() {
  const params = useParams<{ lingua?: string }>();

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
            <Badge variant="secondary" className="mb-4">Conformi al QCER</Badge>
            <h1 className="text-4xl font-bold mb-4">Le Nostre Certificazioni</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Certificazioni linguistiche riconosciute dal Ministero dell'Istruzione e del Merito, 
              conformi al Quadro Comune Europeo di Riferimento per le lingue.
            </p>
          </div>

          {/* Languages */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Lingue Disponibili</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {languages.map((lang) => (
                <Card key={lang.code} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="text-center">
                    <div className="text-4xl mb-2">{lang.flag}</div>
                    <CardTitle>{lang.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center mb-4">{lang.description}</p>
                    <Link href={`/esami?lingua=${lang.code}`}>
                      <Button variant="outline" className="w-full" size="sm">
                        Vedi Sessioni
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* QCER Levels Detail */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Livelli di Competenza QCER</h2>
            <div className="space-y-6">
              {qcerLevels.map((level) => (
                <Card key={level.code}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 ${level.color} rounded-xl flex items-center justify-center shrink-0`}>
                        <span className="text-2xl font-bold text-white">{level.code}</span>
                      </div>
                      <div>
                        <CardTitle className="text-xl">{level.name}</CardTitle>
                        <CardDescription className="mt-1">{level.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-medium mb-3">Competenze principali:</h4>
                    <ul className="space-y-2">
                      {level.skills.map((skill, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-sm">{skill}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t">
                      <Link href={`/esami?livello=${level.code}`}>
                        <Button size="sm">
                          Prenota Esame {level.code}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
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
