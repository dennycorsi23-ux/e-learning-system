import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Shield, 
  CheckCircle, 
  Info, 
  ExternalLink,
  ChevronRight,
  Lock,
  User,
  Building2,
  Loader2,
} from "lucide-react";
import { Link } from "wouter";

// Lista degli Identity Provider SPID
const SPID_PROVIDERS = [
  { id: 'aruba', name: 'Aruba ID', logo: '/images/spid/aruba.png' },
  { id: 'infocert', name: 'InfoCert ID', logo: '/images/spid/infocert.png' },
  { id: 'intesa', name: 'Intesa ID', logo: '/images/spid/intesa.png' },
  { id: 'lepida', name: 'Lepida ID', logo: '/images/spid/lepida.png' },
  { id: 'namirial', name: 'Namirial ID', logo: '/images/spid/namirial.png' },
  { id: 'poste', name: 'Poste ID', logo: '/images/spid/poste.png' },
  { id: 'sielte', name: 'Sielte ID', logo: '/images/spid/sielte.png' },
  { id: 'register', name: 'SpidItalia', logo: '/images/spid/register.png' },
  { id: 'tim', name: 'TIM ID', logo: '/images/spid/tim.png' },
];

export default function LoginSpid() {
  const [, navigate] = useLocation();
  const [showProviders, setShowProviders] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSpidLogin = (providerId: string) => {
    setSelectedProvider(providerId);
    setIsLoading(true);
    
    // In produzione, questo redirect all'IdP SPID selezionato
    // Per ora simuliamo il flusso
    setTimeout(() => {
      // Redirect alla callback SPID (simulato)
      navigate('/api/spid/login?idp=' + providerId);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="font-semibold text-lg">CertificaLingua</span>
          </Link>
          <Link href="/login">
            <Button variant="ghost">Accesso Standard</Button>
          </Link>
        </div>
      </header>

      <main className="container py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Hero */}
          <div className="text-center space-y-4">
            <Badge variant="outline" className="gap-1 px-3 py-1">
              <Shield className="h-3 w-3" />
              Identità Digitale Certificata
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">
              Accedi con <span className="text-primary">SPID</span>
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Utilizza la tua identità digitale SPID per accedere in modo sicuro 
              alla piattaforma di certificazione linguistica.
            </p>
          </div>

          {/* Main Card */}
          <Card className="border-2">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-[#0066CC] flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-12 h-12">
                  <circle cx="50" cy="50" r="45" fill="white"/>
                  <text x="50" y="60" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#0066CC">
                    SPID
                  </text>
                </svg>
              </div>
              <CardTitle>Sistema Pubblico di Identità Digitale</CardTitle>
              <CardDescription>
                Seleziona il tuo Identity Provider per accedere
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* SPID Button */}
              <Button
                size="lg"
                className="w-full h-14 text-lg gap-3 bg-[#0066CC] hover:bg-[#0052A3]"
                onClick={() => setShowProviders(true)}
              >
                <Shield className="h-6 w-6" />
                Entra con SPID
                <ChevronRight className="h-5 w-5 ml-auto" />
              </Button>

              {/* Info */}
              <div className="grid gap-4 pt-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Lock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Autenticazione Sicura</p>
                    <p className="text-xs text-muted-foreground">
                      SPID garantisce la tua identità con il massimo livello di sicurezza
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <User className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Dati Verificati</p>
                    <p className="text-xs text-muted-foreground">
                      I tuoi dati anagrafici vengono acquisiti direttamente dal sistema SPID
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Building2 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Riconosciuto dal MIM</p>
                    <p className="text-xs text-muted-foreground">
                      Requisito per le certificazioni linguistiche valide per concorsi e graduatorie
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Non hai SPID? */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Non hai ancora SPID?</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>
                SPID è l'identità digitale pubblica che ti permette di accedere ai servizi 
                online della Pubblica Amministrazione e dei privati aderenti.
              </p>
              <a 
                href="https://www.spid.gov.it/cos-e-spid/come-attivare-spid/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
              >
                Scopri come attivare SPID
                <ExternalLink className="h-3 w-3" />
              </a>
            </AlertDescription>
          </Alert>

          {/* Perché SPID */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Perché è richiesto SPID?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                Il <strong>Decreto Ministeriale n. 62 del 10 marzo 2022</strong> stabilisce 
                che gli enti certificatori delle competenze linguistiche devono garantire 
                la corretta identificazione dei candidati.
              </p>
              <p>
                L'autenticazione tramite SPID assicura:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Verifica certa dell'identità del candidato</li>
                <li>Acquisizione automatica dei dati anagrafici (nome, cognome, codice fiscale)</li>
                <li>Conformità ai requisiti normativi per l'accreditamento MIM</li>
                <li>Validità legale degli attestati rilasciati</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Provider Selection Dialog */}
      <Dialog open={showProviders} onOpenChange={setShowProviders}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#0066CC]" />
              Seleziona il tuo Identity Provider
            </DialogTitle>
            <DialogDescription>
              Scegli l'Identity Provider con cui hai attivato la tua identità SPID
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-2 py-4 max-h-[400px] overflow-y-auto">
            {SPID_PROVIDERS.map((provider) => (
              <Button
                key={provider.id}
                variant="outline"
                className="w-full justify-start h-14 gap-3"
                onClick={() => handleSpidLogin(provider.id)}
                disabled={isLoading}
              >
                {isLoading && selectedProvider === provider.id ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs font-bold">
                    {provider.name.charAt(0)}
                  </div>
                )}
                <span className="font-medium">{provider.name}</span>
                {isLoading && selectedProvider === provider.id && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    Connessione...
                  </span>
                )}
              </Button>
            ))}
          </div>

          <div className="text-center text-xs text-muted-foreground pt-2 border-t">
            <p>
              Accedendo dichiari di aver letto e accettato i{" "}
              <Link href="/termini" className="text-primary hover:underline">
                Termini di Servizio
              </Link>{" "}
              e la{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
