import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  ArrowLeft,
  CheckCircle2,
  Info
} from "lucide-react";
import { Link } from "wouter";

const pricingData = [
  {
    level: "A1",
    name: "Principiante",
    color: "bg-emerald-500",
    standard: 80,
    remote: 90,
  },
  {
    level: "A2",
    name: "Elementare",
    color: "bg-emerald-600",
    standard: 100,
    remote: 110,
  },
  {
    level: "B1",
    name: "Intermedio",
    color: "bg-blue-500",
    standard: 130,
    remote: 145,
  },
  {
    level: "B2",
    name: "Intermedio Superiore",
    color: "bg-blue-600",
    standard: 150,
    remote: 170,
  },
  {
    level: "C1",
    name: "Avanzato",
    color: "bg-indigo-600",
    standard: 180,
    remote: 200,
  },
  {
    level: "C2",
    name: "Padronanza",
    color: "bg-indigo-800",
    standard: 220,
    remote: 250,
  },
];

const includedFeatures = [
  "Esame completo delle 4 abilità linguistiche",
  "Valutazione secondo descrittori QCER",
  "Attestato conforme al DM 62/2022",
  "Tabella di conversione QCER inclusa",
  "Codice di verifica univoco",
  "Validità per concorsi e graduatorie",
];

export default function Prezzi() {
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
            <Badge variant="secondary" className="mb-4">Trasparenza</Badge>
            <h1 className="text-4xl font-bold mb-4">Listino Prezzi</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Prezzi chiari e trasparenti per tutti i livelli di certificazione. 
              Tutti i prezzi sono IVA inclusa.
            </p>
          </div>

          {/* Pricing Table */}
          <Card className="mb-8 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-4 font-semibold">Livello QCER</th>
                    <th className="text-center p-4 font-semibold">Esame in Presenza</th>
                    <th className="text-center p-4 font-semibold">Esame a Distanza</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingData.map((item, index) => (
                    <tr key={item.level} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                            <span className="text-sm font-bold text-white">{item.level}</span>
                          </div>
                          <div>
                            <p className="font-medium">{item.level}</p>
                            <p className="text-sm text-muted-foreground">{item.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-xl font-bold">€{item.standard}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-xl font-bold">€{item.remote}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* What's Included */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Cosa è incluso nel prezzo</CardTitle>
                <CardDescription>
                  Ogni esame include tutti i servizi necessari per la certificazione
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {includedFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Esami a Distanza</CardTitle>
                <CardDescription>
                  Informazioni sul supplemento per esami online
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Gli esami a distanza prevedono un supplemento per coprire i costi del sistema di proctoring AI 
                  e della piattaforma di videoconferenza per le prove orali in simultanea.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Requisiti tecnici:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Computer con webcam e microfono</li>
                    <li>• Connessione internet stabile (min. 5 Mbps)</li>
                    <li>• Browser Chrome o Firefox aggiornato</li>
                    <li>• Ambiente silenzioso e ben illuminato</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-2">Modalità di Pagamento</h3>
                  <p className="text-sm text-blue-800">
                    Il pagamento può essere effettuato tramite carta di credito, bonifico bancario o PayPal. 
                    Per enti pubblici e scuole è possibile richiedere fatturazione con pagamento differito. 
                    Contattaci per convenzioni e prezzi dedicati per gruppi.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link href="/esami">
              <Button size="lg">Prenota il tuo Esame</Button>
            </Link>
          </div>
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
