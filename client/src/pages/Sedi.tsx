import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Monitor,
  Users,
  CheckCircle2,
  Building2
} from "lucide-react";
import { Link } from "wouter";

const mockCenters = [
  {
    id: 1,
    name: "Centro Esami Milano",
    address: "Via Example 123",
    city: "Milano",
    province: "MI",
    region: "Lombardia",
    phone: "+39 02 1234567",
    email: "milano@certificalingua.it",
    maxCapacity: 50,
    hasComputerLab: true,
    hasVideoConference: true,
    supportsRemoteExams: true,
    isAccredited: true
  },
  {
    id: 2,
    name: "Centro Esami Roma",
    address: "Via Roma 456",
    city: "Roma",
    province: "RM",
    region: "Lazio",
    phone: "+39 06 7654321",
    email: "roma@certificalingua.it",
    maxCapacity: 40,
    hasComputerLab: true,
    hasVideoConference: true,
    supportsRemoteExams: true,
    isAccredited: true
  },
  {
    id: 3,
    name: "Centro Esami Napoli",
    address: "Via Napoli 789",
    city: "Napoli",
    province: "NA",
    region: "Campania",
    phone: "+39 081 9876543",
    email: "napoli@certificalingua.it",
    maxCapacity: 35,
    hasComputerLab: true,
    hasVideoConference: false,
    supportsRemoteExams: false,
    isAccredited: true
  },
  {
    id: 4,
    name: "Centro Esami Torino",
    address: "Via Torino 321",
    city: "Torino",
    province: "TO",
    region: "Piemonte",
    phone: "+39 011 1234567",
    email: "torino@certificalingua.it",
    maxCapacity: 30,
    hasComputerLab: true,
    hasVideoConference: true,
    supportsRemoteExams: true,
    isAccredited: true
  },
];

export default function Sedi() {
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
            <Badge variant="secondary" className="mb-4">Rete Nazionale</Badge>
            <h1 className="text-4xl font-bold mb-4">Sedi d'Esame</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              La nostra rete di sedi accreditate in tutta Italia garantisce 
              la possibilità di sostenere gli esami vicino a te.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-primary">{mockCenters.length}</p>
                <p className="text-sm text-muted-foreground">Sedi Attive</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-primary">{mockCenters.filter(c => c.supportsRemoteExams).length}</p>
                <p className="text-sm text-muted-foreground">Con Esami Online</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-primary">{new Set(mockCenters.map(c => c.region)).size}</p>
                <p className="text-sm text-muted-foreground">Regioni Coperte</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-primary">{mockCenters.reduce((acc, c) => acc + c.maxCapacity, 0)}</p>
                <p className="text-sm text-muted-foreground">Posti Totali</p>
              </CardContent>
            </Card>
          </div>

          {/* Centers List */}
          <div className="grid md:grid-cols-2 gap-6">
            {mockCenters.map((center) => (
              <Card key={center.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        {center.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {center.region}
                      </CardDescription>
                    </div>
                    {center.isAccredited && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Accreditata
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {center.address}, {center.city} ({center.province})
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {center.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {center.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      Capacità: {center.maxCapacity} posti
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {center.hasComputerLab && (
                      <Badge variant="outline" className="text-xs">Laboratorio informatico</Badge>
                    )}
                    {center.hasVideoConference && (
                      <Badge variant="outline" className="text-xs">Videoconferenza</Badge>
                    )}
                    {center.supportsRemoteExams && (
                      <Badge variant="secondary" className="text-xs gap-1">
                        <Monitor className="h-3 w-3" />
                        Esami a distanza
                      </Badge>
                    )}
                  </div>
                  
                  <Link href={`/esami?sede=${center.id}`}>
                    <Button variant="outline" className="w-full">
                      Vedi sessioni disponibili
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info */}
          <Card className="mt-12 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-medium text-blue-900 mb-2">Vuoi diventare una sede d'esame?</h3>
              <p className="text-sm text-blue-800 mb-4">
                Se la tua struttura possiede i requisiti tecnici e logistici richiesti dal DM 62/2022, 
                puoi richiedere l'accreditamento come sede d'esame. Contattaci per maggiori informazioni.
              </p>
              <Link href="/contatti">
                <Button variant="outline" size="sm">Richiedi informazioni</Button>
              </Link>
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
