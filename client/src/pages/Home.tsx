import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Shield, 
  Globe, 
  Award, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight,
  Building2,
  FileCheck,
  Headphones,
  BookText,
  Mic,
  PenTool,
  MapPin,
  Phone,
  Mail,
  Clock
} from "lucide-react";
import { Link } from "wouter";

const qcerLevels = [
  { code: "A1", name: "Principiante", color: "bg-emerald-500", description: "Comprende e usa espressioni familiari di uso quotidiano" },
  { code: "A2", name: "Elementare", color: "bg-emerald-600", description: "Comunica in attività semplici e di routine" },
  { code: "B1", name: "Intermedio", color: "bg-blue-500", description: "Affronta situazioni durante viaggi e descrive esperienze" },
  { code: "B2", name: "Intermedio Superiore", color: "bg-blue-600", description: "Interagisce con scioltezza e spontaneità" },
  { code: "C1", name: "Avanzato", color: "bg-indigo-600", description: "Usa la lingua in modo flessibile ed efficace" },
  { code: "C2", name: "Padronanza", color: "bg-indigo-800", description: "Comprende praticamente tutto con facilità" },
];

const skills = [
  { name: "Comprensione Orale", icon: Headphones, description: "Ascolto e comprensione di testi audio" },
  { name: "Comprensione Scritta", icon: BookText, description: "Lettura e comprensione di testi scritti" },
  { name: "Produzione Orale", icon: Mic, description: "Interazione e produzione orale in tempo reale" },
  { name: "Produzione Scritta", icon: PenTool, description: "Scrittura di testi di vario genere" },
];

const features = [
  { 
    icon: Shield, 
    title: "Sistema Anti-Frode", 
    description: "Proctoring AI avanzato con riconoscimento facciale, eye-tracking e monitoraggio ambiente per garantire l'integrità degli esami" 
  },
  { 
    icon: Award, 
    title: "Attestati Conformi", 
    description: "Certificazioni conformi al DM 62/2022 con tabella di conversione QCER, codice di verifica univoco e firma digitale" 
  },
  { 
    icon: Globe, 
    title: "Esami a Distanza", 
    description: "Possibilità di sostenere gli esami online con prove orali in simultanea, come richiesto dalla normativa ministeriale" 
  },
  { 
    icon: FileCheck, 
    title: "Verifica Identità SPID", 
    description: "Identificazione sicura tramite SPID per garantire l'autenticità dei candidati" 
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">CertificaLingua</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/certificazioni" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Certificazioni
            </Link>
            <Link href="/esami" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sessioni d'Esame
            </Link>
            <Link href="/sedi" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sedi
            </Link>
            <Link href="/prezzi" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Prezzi
            </Link>
            <Link href="/verifica" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Verifica Attestato
            </Link>
            <Link href="/faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Accedi</Button>
            </Link>
            <Link href="/registrati">
              <Button size="sm">Iscriviti</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-white -z-10" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10" />
          
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">
                Conforme al DM 62/2022 - MIM
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
                Certificazioni Linguistiche{" "}
                <span className="text-primary">Riconosciute</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Ottieni la tua certificazione linguistica conforme al Quadro Comune Europeo di Riferimento (QCER). 
                Esami sicuri, attestati validi per concorsi e graduatorie scolastiche.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/esami">
                  <Button size="lg" className="gap-2">
                    Prenota il tuo Esame
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/certificazioni">
                  <Button size="lg" variant="outline">
                    Scopri le Certificazioni
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* QCER Levels Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Livelli QCER</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Il Quadro Comune Europeo di Riferimento per le lingue definisce sei livelli di competenza linguistica, 
                dal principiante assoluto alla padronanza completa.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {qcerLevels.map((level) => (
                <Card key={level.code} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className={`w-16 h-16 ${level.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <span className="text-2xl font-bold text-white">{level.code}</span>
                    </div>
                    <CardTitle className="text-lg">{level.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{level.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Le 4 Abilità Linguistiche</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                I nostri esami valutano tutte e quattro le abilità linguistiche secondo i descrittori del QCER, 
                garantendo una certificazione completa delle tue competenze.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map((skill) => (
                <Card key={skill.name} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <skill.icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{skill.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{skill.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Perché Sceglierci</h2>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto">
                La nostra piattaforma offre un sistema di certificazione all'avanguardia, 
                progettato per garantire la massima sicurezza e conformità normativa.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-white/10 border-white/20 text-primary-foreground">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                        <CardDescription className="text-primary-foreground/70">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Conformity Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="outline" className="mb-4">Conformità Normativa</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Certificazioni Valide per il Personale Scolastico
                </h2>
                <p className="text-muted-foreground mb-6">
                  Le nostre certificazioni sono conformi al Decreto Ministeriale n. 62 del 10 marzo 2022, 
                  che stabilisce i requisiti per il riconoscimento della validità delle certificazioni 
                  delle competenze linguistico-comunicative in lingua straniera del personale scolastico.
                </p>
                <ul className="space-y-3">
                  {[
                    "Conformità al QCER e alla Scala Globale",
                    "Attestazione del livello finale secondo descrittori QCER",
                    "Valutazione di tutte e 4 le abilità linguistiche",
                    "Tabella di conversione QCER inclusa nell'attestato",
                    "Prove orali svolte in simultanea (non asincrone)",
                    "Sistema di proctoring per esami a distanza"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-muted/50 rounded-2xl p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileCheck className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">DM 62/2022</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Ministero dell'Istruzione e del Merito
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-background rounded-lg p-4">
                      <div className="text-2xl font-bold text-primary">6</div>
                      <div className="text-xs text-muted-foreground">Livelli QCER</div>
                    </div>
                    <div className="bg-background rounded-lg p-4">
                      <div className="text-2xl font-bold text-primary">4</div>
                      <div className="text-xs text-muted-foreground">Abilità Valutate</div>
                    </div>
                    <div className="bg-background rounded-lg p-4">
                      <div className="text-2xl font-bold text-primary">3</div>
                      <div className="text-xs text-muted-foreground">Anni Validità</div>
                    </div>
                    <div className="bg-background rounded-lg p-4">
                      <div className="text-2xl font-bold text-primary">100%</div>
                      <div className="text-xs text-muted-foreground">Conforme</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pronto a Certificare le Tue Competenze?
              </h2>
              <p className="text-muted-foreground mb-8">
                Scegli la lingua e il livello, prenota la tua sessione d'esame e ottieni 
                una certificazione riconosciuta a livello nazionale ed europeo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/esami">
                  <Button size="lg" className="gap-2">
                    Visualizza Sessioni Disponibili
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contatti">
                  <Button size="lg" variant="outline">
                    Contattaci
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-6 w-6" />
                <span className="text-lg font-bold">CertificaLingua</span>
              </div>
              <p className="text-sm text-background/70">
                Ente certificatore di competenze linguistiche conforme al DM 62/2022 
                e al Quadro Comune Europeo di Riferimento per le lingue.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Certificazioni</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><Link href="/certificazioni/inglese">Inglese</Link></li>
                <li><Link href="/certificazioni/francese">Francese</Link></li>
                <li><Link href="/certificazioni/spagnolo">Spagnolo</Link></li>
                <li><Link href="/certificazioni/tedesco">Tedesco</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Risorse</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><Link href="/esempi-prove">Esempi di Prove</Link></li>
                <li><Link href="/faq">Domande Frequenti</Link></li>
                <li><Link href="/verifica">Verifica Attestato</Link></li>
                <li><Link href="/normativa">Normativa di Riferimento</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contatti</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Via Example 123, Milano</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+39 02 1234567</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>info@certificalingua.it</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-background/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-background/60">
              © {new Date().getFullYear()} CertificaLingua. Tutti i diritti riservati.
            </p>
            <div className="flex gap-4 text-sm text-background/60">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/termini">Termini e Condizioni</Link>
              <Link href="/cookie">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
