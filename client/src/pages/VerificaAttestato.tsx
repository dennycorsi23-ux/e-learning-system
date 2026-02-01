import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Search, 
  CheckCircle2, 
  XCircle, 
  FileCheck,
  User,
  Calendar,
  Award,
  Building2,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";

export default function VerificaAttestato() {
  const params = useParams<{ code?: string }>();
  const [searchCode, setSearchCode] = useState(params.code || "");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    
    setIsSearching(true);
    setError(null);
    setResult(null);
    
    try {
      // TODO: Implement actual verification with tRPC
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock result for demonstration
      if (searchCode.toUpperCase() === "DEMO123") {
        setResult({
          valid: true,
          certificateNumber: "CL-2024-00001",
          verificationCode: "DEMO123",
          candidate: {
            name: "Mario Rossi",
            fiscalCode: "RSSMRA80A01H501Z"
          },
          certification: {
            language: "Inglese",
            level: "B2",
            levelName: "Intermedio Superiore",
            examDate: "2024-01-15",
            issueDate: "2024-01-20"
          },
          scores: {
            listening: 78,
            reading: 82,
            writing: 75,
            speaking: 80,
            total: 79
          },
          examCenter: "Centro Esami Milano",
          status: "active"
        });
      } else {
        setError("Nessun attestato trovato con questo codice di verifica.");
      }
    } catch (err) {
      setError("Si è verificato un errore durante la verifica. Riprova più tardi.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background">
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
        <div className="container max-w-3xl">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileCheck className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Verifica Attestato</h1>
            <p className="text-muted-foreground">
              Inserisci il codice di verifica presente sull'attestato per verificarne l'autenticità
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="verification-code" className="sr-only">
                    Codice di Verifica
                  </Label>
                  <Input
                    id="verification-code"
                    type="text"
                    placeholder="Inserisci il codice di verifica (es. DEMO123)"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                    className="text-lg"
                  />
                </div>
                <Button type="submit" disabled={isSearching || !searchCode.trim()}>
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  <span className="ml-2">Verifica</span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="border-destructive/50 bg-destructive/5 mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <XCircle className="h-6 w-6 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">Attestato non trovato</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Result */}
          {result && (
            <div className="space-y-6">
              {/* Validity Badge */}
              <Card className={result.valid ? "border-green-500/50 bg-green-50" : "border-red-500/50 bg-red-50"}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    {result.valid ? (
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-600" />
                    )}
                    <div>
                      <p className={`text-xl font-bold ${result.valid ? "text-green-700" : "text-red-700"}`}>
                        {result.valid ? "Attestato Valido" : "Attestato Non Valido"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Numero certificato: {result.certificateNumber}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Certificate Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Dettagli Certificazione</CardTitle>
                  <CardDescription>
                    Informazioni complete sull'attestato verificato
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Candidate Info */}
                  <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Candidato</p>
                      <p className="font-medium">{result.candidate.name}</p>
                      <p className="text-sm text-muted-foreground">CF: {result.candidate.fiscalCode}</p>
                    </div>
                  </div>

                  {/* Certification Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                      <Award className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Certificazione</p>
                        <p className="font-medium">{result.certification.language}</p>
                        <Badge className="mt-1">{result.certification.level} - {result.certification.levelName}</Badge>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="text-sm">Esame: {new Date(result.certification.examDate).toLocaleDateString('it-IT')}</p>
                        <p className="text-sm">Rilascio: {new Date(result.certification.issueDate).toLocaleDateString('it-IT')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Scores */}
                  <div>
                    <h4 className="font-medium mb-3">Punteggi per Abilità</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{result.scores.listening}</p>
                        <p className="text-xs text-muted-foreground">Ascolto</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{result.scores.reading}</p>
                        <p className="text-xs text-muted-foreground">Lettura</p>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <p className="text-2xl font-bold text-amber-600">{result.scores.writing}</p>
                        <p className="text-xs text-muted-foreground">Scrittura</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{result.scores.speaking}</p>
                        <p className="text-xs text-muted-foreground">Parlato</p>
                      </div>
                    </div>
                    <div className="mt-3 text-center p-4 bg-primary/10 rounded-lg">
                      <p className="text-3xl font-bold text-primary">{result.scores.total}/100</p>
                      <p className="text-sm text-muted-foreground">Punteggio Totale</p>
                    </div>
                  </div>

                  {/* Exam Center */}
                  <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                    <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Sede d'Esame</p>
                      <p className="font-medium">{result.examCenter}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Info Box */}
          {!result && !error && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-medium text-blue-900 mb-2">Come trovare il codice di verifica?</h3>
                <p className="text-sm text-blue-800">
                  Il codice di verifica è riportato sull'attestato, solitamente in basso a destra 
                  sotto forma di codice alfanumerico o QR code. Puoi anche scansionare il QR code 
                  presente sull'attestato per accedere direttamente a questa pagina di verifica.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CertificaLingua. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  );
}
