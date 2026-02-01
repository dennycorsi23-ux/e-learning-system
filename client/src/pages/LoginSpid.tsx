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
  Info, 
  ExternalLink,
  ChevronRight,
  Lock,
  User,
  Building2,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function LoginSpid() {
  const [, navigate] = useLocation();
  const [showProviders, setShowProviders] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  // Fetch lista IdP da API
  const { data: idpList, isLoading: loadingIdpList } = trpc.spid.idpList.useQuery();

  // Mutation per ottenere URL di autenticazione
  const getAuthUrlMutation = trpc.spid.getAuthUrl.useMutation({
    onSuccess: (data) => {
      toast.info(`Reindirizzamento a ${data.idpName}...`, {
        description: "Verrai reindirizzato al tuo Identity Provider SPID"
      });
      
      // In produzione, redirect all'URL SPID
      // window.location.href = data.url;
      
      // Per demo, mostra messaggio
      setTimeout(() => {
        toast.success("Demo SPID", {
          description: "In produzione verrai reindirizzato all'IdP selezionato per l'autenticazione SPID."
        });
        setSelectedProvider(null);
        setShowProviders(false);
      }, 2000);
    },
    onError: (error) => {
      toast.error("Errore", {
        description: error.message || "Impossibile avviare l'autenticazione SPID"
      });
      setSelectedProvider(null);
    },
  });

  const handleSpidLogin = (providerId: string) => {
    setSelectedProvider(providerId);
    getAuthUrlMutation.mutate({ 
      idpId: providerId,
      returnUrl: window.location.origin + "/dashboard"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-semibold text-lg text-slate-900">CertificaLingua</span>
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Accesso Standard
            </Button>
          </Link>
        </div>
      </header>

      <main className="container py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Hero */}
          <div className="text-center space-y-4">
            <Badge variant="outline" className="gap-1 px-3 py-1 bg-white">
              <Shield className="h-3 w-3 text-blue-600" />
              Identità Digitale Certificata
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Accedi con <span className="text-blue-600">SPID</span>
            </h1>
            <p className="text-slate-600 max-w-md mx-auto">
              Utilizza la tua identità digitale SPID per accedere in modo sicuro 
              alla piattaforma di certificazione linguistica.
            </p>
          </div>

          {/* Main Card */}
          <Card className="border-2 shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 w-24 h-24 rounded-full bg-[#0066CC] flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 100 100" className="w-14 h-14">
                  <circle cx="50" cy="50" r="45" fill="white"/>
                  <text x="50" y="62" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#0066CC">
                    SPID
                  </text>
                </svg>
              </div>
              <CardTitle className="text-xl">Sistema Pubblico di Identità Digitale</CardTitle>
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
                disabled={loadingIdpList}
              >
                {loadingIdpList ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Shield className="h-6 w-6" />
                )}
                Entra con SPID
                <ChevronRight className="h-5 w-5 ml-auto" />
              </Button>

              {/* Info */}
              <div className="grid gap-4 pt-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-slate-900">Autenticazione Sicura</p>
                    <p className="text-xs text-slate-600">
                      SPID garantisce la tua identità con il massimo livello di sicurezza
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <User className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-slate-900">Dati Verificati</p>
                    <p className="text-xs text-slate-600">
                      I tuoi dati anagrafici vengono acquisiti direttamente dal sistema SPID
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-slate-900">Riconosciuto dal MIM</p>
                    <p className="text-xs text-slate-600">
                      Requisito per le certificazioni linguistiche valide per concorsi e graduatorie
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Non hai SPID? */}
          <Alert className="bg-white border-amber-200">
            <Info className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-slate-900">Non hai ancora SPID?</AlertTitle>
            <AlertDescription className="space-y-2 text-slate-600">
              <p>
                SPID è l'identità digitale pubblica che ti permette di accedere ai servizi 
                online della Pubblica Amministrazione e dei privati aderenti.
              </p>
              <a 
                href="https://www.spid.gov.it/cos-e-spid/come-attivare-spid/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium"
              >
                Scopri come attivare SPID
                <ExternalLink className="h-3 w-3" />
              </a>
            </AlertDescription>
          </Alert>

          {/* Perché SPID */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">Perché è richiesto SPID?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <p>
                Il <strong className="text-slate-900">Decreto Ministeriale n. 62 del 10 marzo 2022</strong> stabilisce 
                che gli enti certificatori delle competenze linguistiche devono garantire 
                la corretta identificazione dei candidati.
              </p>
              <p>
                L'autenticazione tramite SPID assicura:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
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
            {(idpList || []).map((provider) => (
              <Button
                key={provider.id}
                variant="outline"
                className="w-full justify-start h-14 gap-3 hover:bg-blue-50 hover:border-blue-200"
                onClick={() => handleSpidLogin(provider.id)}
                disabled={getAuthUrlMutation.isPending}
              >
                {getAuthUrlMutation.isPending && selectedProvider === provider.id ? (
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                ) : (
                  <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {provider.name.charAt(0)}
                  </div>
                )}
                <span className="font-medium text-slate-900">{provider.name}</span>
                {getAuthUrlMutation.isPending && selectedProvider === provider.id && (
                  <span className="ml-auto text-xs text-slate-500">
                    Connessione...
                  </span>
                )}
              </Button>
            ))}
          </div>

          <div className="text-center text-xs text-slate-500 pt-2 border-t">
            <p>
              Accedendo dichiari di aver letto e accettato i{" "}
              <Link href="/termini" className="text-blue-600 hover:underline">
                Termini di Servizio
              </Link>{" "}
              e la{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
