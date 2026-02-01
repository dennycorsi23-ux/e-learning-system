import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  GraduationCap, 
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Clock,
  Monitor,
  Building2
} from "lucide-react";
import { Link } from "wouter";

const mockSessions = [
  {
    id: 1,
    title: "Sessione Inglese B2 - Milano",
    language: "Inglese",
    level: "B2",
    date: "2024-02-15",
    time: "09:00",
    location: "Centro Esami Milano",
    isRemote: false,
    maxParticipants: 30,
    currentParticipants: 18,
    price: 150
  },
  {
    id: 2,
    title: "Sessione Inglese C1 - Online",
    language: "Inglese",
    level: "C1",
    date: "2024-02-20",
    time: "14:00",
    location: "Esame a Distanza",
    isRemote: true,
    maxParticipants: 20,
    currentParticipants: 12,
    price: 180
  },
  {
    id: 3,
    title: "Sessione Francese B1 - Roma",
    language: "Francese",
    level: "B1",
    date: "2024-02-22",
    time: "10:00",
    location: "Centro Esami Roma",
    isRemote: false,
    maxParticipants: 25,
    currentParticipants: 8,
    price: 130
  },
  {
    id: 4,
    title: "Sessione Spagnolo A2 - Online",
    language: "Spagnolo",
    level: "A2",
    date: "2024-02-25",
    time: "15:00",
    location: "Esame a Distanza",
    isRemote: true,
    maxParticipants: 20,
    currentParticipants: 5,
    price: 100
  },
];

const levelColors: Record<string, string> = {
  "A1": "bg-emerald-500",
  "A2": "bg-emerald-600",
  "B1": "bg-blue-500",
  "B2": "bg-blue-600",
  "C1": "bg-indigo-600",
  "C2": "bg-indigo-800",
};

export default function SessioniEsame() {
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [modeFilter, setModeFilter] = useState<string>("all");

  const filteredSessions = mockSessions.filter(session => {
    if (languageFilter !== "all" && session.language !== languageFilter) return false;
    if (levelFilter !== "all" && session.level !== levelFilter) return false;
    if (modeFilter === "remote" && !session.isRemote) return false;
    if (modeFilter === "presence" && session.isRemote) return false;
    return true;
  });

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
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Sessioni d'Esame</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Scegli la sessione d'esame più adatta alle tue esigenze. 
              Disponibili esami in presenza e a distanza con proctoring.
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Lingua</label>
                  <Select value={languageFilter} onValueChange={setLanguageFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tutte le lingue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tutte le lingue</SelectItem>
                      <SelectItem value="Inglese">Inglese</SelectItem>
                      <SelectItem value="Francese">Francese</SelectItem>
                      <SelectItem value="Spagnolo">Spagnolo</SelectItem>
                      <SelectItem value="Tedesco">Tedesco</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Livello QCER</label>
                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tutti i livelli" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tutti i livelli</SelectItem>
                      <SelectItem value="A1">A1 - Principiante</SelectItem>
                      <SelectItem value="A2">A2 - Elementare</SelectItem>
                      <SelectItem value="B1">B1 - Intermedio</SelectItem>
                      <SelectItem value="B2">B2 - Intermedio Superiore</SelectItem>
                      <SelectItem value="C1">C1 - Avanzato</SelectItem>
                      <SelectItem value="C2">C2 - Padronanza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Modalità</label>
                  <Select value={modeFilter} onValueChange={setModeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tutte le modalità" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tutte le modalità</SelectItem>
                      <SelectItem value="presence">In presenza</SelectItem>
                      <SelectItem value="remote">A distanza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sessions List */}
          {filteredSessions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Nessuna sessione trovata con i filtri selezionati.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredSessions.map((session) => (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Level Badge */}
                      <div className={`w-16 h-16 ${levelColors[session.level]} rounded-xl flex items-center justify-center shrink-0`}>
                        <span className="text-xl font-bold text-white">{session.level}</span>
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{session.title}</h3>
                          {session.isRemote && (
                            <Badge variant="secondary" className="gap-1">
                              <Monitor className="h-3 w-3" />
                              Online
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(session.date).toLocaleDateString('it-IT', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'long' 
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {session.time}
                          </span>
                          <span className="flex items-center gap-1">
                            {session.isRemote ? <Monitor className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                            {session.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {session.currentParticipants}/{session.maxParticipants} iscritti
                          </span>
                        </div>
                      </div>
                      
                      {/* Price & Action */}
                      <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">€{session.price}</p>
                          <p className="text-xs text-muted-foreground">IVA inclusa</p>
                        </div>
                        <Link href="/login">
                          <Button>Iscriviti</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Info Box */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-medium text-blue-900 mb-2">Informazioni sugli esami a distanza</h3>
              <p className="text-sm text-blue-800">
                Gli esami a distanza si svolgono tramite la nostra piattaforma con sistema di proctoring AI. 
                È necessario disporre di una webcam, microfono e connessione internet stabile. 
                Le prove orali vengono svolte in simultanea con un esaminatore certificato, 
                come richiesto dal DM 62/2022.
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
