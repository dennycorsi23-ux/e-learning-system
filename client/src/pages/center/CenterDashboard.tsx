import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  Users, 
  Calendar, 
  ClipboardCheck, 
  Award, 
  TrendingUp,
  Clock,
  MapPin,
  Monitor,
  AlertCircle,
  CheckCircle2,
  Play,
  Eye,
  FileText,
  Download
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useState } from "react";

export default function CenterDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [selectedTab, setSelectedTab] = useState("overview");

  // Query per i dati del centro (usando list e filtrando)
  const { data: centers, isLoading: centerLoading } = trpc.examCenters.list.useQuery(
    undefined,
    { enabled: !!user }
  );
  
  // Prendi il primo centro associato all'utente (in produzione filtrare per userId)
  const centerData = centers?.[0];

  // Query per le sessioni d'esame
  const { data: sessions, isLoading: sessionsLoading } = trpc.examSessions.list.useQuery(
    undefined,
    { enabled: !!centerData?.id }
  );
  
  // Filtra sessioni per centro
  const centerSessions = sessions?.filter(s => s.examCenterId === centerData?.id);

  // Dati mock per demo (in produzione verranno dalle API)
  const statsData = {
    totalExams: 156,
    passRate: 78,
    avgScore: 72,
    certificatesIssued: 122,
    monthlyGrowth: 12
  };

  const activeExamsData: Array<{
    id: number;
    candidate: string;
    language: string;
    level: string;
    startTime: string;
    progress: number;
    status: string;
    alerts: number;
  }> = [];

  // Per ora usiamo dati mock per esami attivi e statistiche
  // In produzione, aggiungere le API specifiche
  const activeExams = activeExamsData;
  const stats = statsData;

  if (authLoading || centerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Accesso Richiesto</CardTitle>
            <CardDescription>
              Effettua il login per accedere alla dashboard del centro d'esame.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Accedi</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dati mock per demo (in produzione verranno dalle API)
  const mockCenter = {
    name: "Centro Esami Roma Centrale",
    code: "CE-RM-001",
    address: "Via Roma 123, 00100 Roma",
    capacity: 50,
    currentOccupancy: 32,
    status: "active" as const,
    equipment: {
      computers: 50,
      webcams: 50,
      headsets: 50,
      workingStations: 48
    }
  };

  const mockSessions = [
    { id: 1, date: "2026-02-15", time: "09:00", language: "Inglese", level: "B2", registered: 25, capacity: 30, status: "scheduled" },
    { id: 2, date: "2026-02-15", time: "14:00", language: "Francese", level: "B1", registered: 18, capacity: 25, status: "scheduled" },
    { id: 3, date: "2026-02-16", time: "09:00", language: "Tedesco", level: "A2", registered: 12, capacity: 20, status: "scheduled" },
    { id: 4, date: "2026-02-10", time: "09:00", language: "Inglese", level: "C1", registered: 22, capacity: 25, status: "completed" },
  ];



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{mockCenter.name}</h1>
                <p className="text-sm text-muted-foreground">
                  Codice: {mockCenter.code} | {mockCenter.address}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={mockCenter.status === "active" ? "default" : "secondary"}>
                {mockCenter.status === "active" ? "Attivo" : "Inattivo"}
              </Badge>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Esami Totali</p>
                  <p className="text-2xl font-bold">{stats.totalExams}</p>
                </div>
                <ClipboardCheck className="h-8 w-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tasso Superamento</p>
                  <p className="text-2xl font-bold">{stats.passRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500/20" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Punteggio Medio</p>
                  <p className="text-2xl font-bold">{stats.avgScore}/100</p>
                </div>
                <Award className="h-8 w-8 text-yellow-500/20" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Certificati</p>
                  <p className="text-2xl font-bold">{stats.certificatesIssued}</p>
                </div>
                <Award className="h-8 w-8 text-blue-500/20" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Crescita Mensile</p>
                  <p className="text-2xl font-bold text-green-600">+{stats.monthlyGrowth}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Panoramica</TabsTrigger>
            <TabsTrigger value="sessions">Sessioni</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoraggio</TabsTrigger>
            <TabsTrigger value="reports">Report</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Capacità Centro */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Capacità e Dotazioni
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Occupazione Attuale</span>
                      <span>{mockCenter.currentOccupancy}/{mockCenter.capacity} postazioni</span>
                    </div>
                    <Progress value={(mockCenter.currentOccupancy / mockCenter.capacity) * 100} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Computer: {mockCenter.equipment.computers}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Webcam: {mockCenter.equipment.webcams}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Funzionanti: {mockCenter.equipment.workingStations}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">In manutenzione: {mockCenter.equipment.computers - mockCenter.equipment.workingStations}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Prossime Sessioni */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Prossime Sessioni
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockSessions.filter(s => s.status === "scheduled").slice(0, 3).map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{session.language} - {session.level}</p>
                          <p className="text-sm text-muted-foreground">
                            {session.date} alle {session.time}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{session.registered}/{session.capacity}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Esami in Corso */}
            {activeExams.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-green-500" />
                    Esami in Corso ({activeExams.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidato</TableHead>
                        <TableHead>Esame</TableHead>
                        <TableHead>Inizio</TableHead>
                        <TableHead>Progresso</TableHead>
                        <TableHead>Alert</TableHead>
                        <TableHead>Azioni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeExams.map((exam) => (
                        <TableRow key={exam.id}>
                          <TableCell className="font-medium">{exam.candidate}</TableCell>
                          <TableCell>{exam.language} {exam.level}</TableCell>
                          <TableCell>{exam.startTime}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={exam.progress} className="w-20" />
                              <span className="text-sm">{exam.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {exam.alerts > 0 ? (
                              <Badge variant="destructive">{exam.alerts}</Badge>
                            ) : (
                              <Badge variant="outline">0</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Sessioni d'Esame</CardTitle>
                  <Button>
                    <Calendar className="h-4 w-4 mr-2" />
                    Nuova Sessione
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Orario</TableHead>
                      <TableHead>Lingua</TableHead>
                      <TableHead>Livello</TableHead>
                      <TableHead>Iscritti</TableHead>
                      <TableHead>Stato</TableHead>
                      <TableHead>Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>{session.date}</TableCell>
                        <TableCell>{session.time}</TableCell>
                        <TableCell>{session.language}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{session.level}</Badge>
                        </TableCell>
                        <TableCell>{session.registered}/{session.capacity}</TableCell>
                        <TableCell>
                          <Badge variant={session.status === "completed" ? "secondary" : "default"}>
                            {session.status === "completed" ? "Completata" : "Programmata"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Users className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring">
            <Card>
              <CardHeader>
                <CardTitle>Monitoraggio Esami in Tempo Reale</CardTitle>
                <CardDescription>
                  Visualizza e monitora gli esami attualmente in corso presso il centro.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeExams.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeExams.map((exam) => (
                      <Card key={exam.id} className="border-2">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="font-medium">{exam.candidate}</p>
                              <p className="text-sm text-muted-foreground">{exam.language} {exam.level}</p>
                            </div>
                            {exam.alerts > 0 ? (
                              <Badge variant="destructive" className="animate-pulse">
                                {exam.alerts} Alert
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-green-600">
                                OK
                              </Badge>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progresso</span>
                              <span>{exam.progress}%</span>
                            </div>
                            <Progress value={exam.progress} />
                          </div>
                          
                          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Iniziato alle {exam.startTime}</span>
                          </div>
                          
                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="h-4 w-4 mr-1" />
                              Visualizza
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nessun esame in corso al momento</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Report Disponibili</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Report Mensile Esami
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Statistiche Certificati
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Report Presenze
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Report per Ministero
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Statistiche per Livello</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
                      <div key={level} className="flex items-center gap-4">
                        <Badge variant="outline" className="w-12 justify-center">{level}</Badge>
                        <Progress value={Math.random() * 100} className="flex-1" />
                        <span className="text-sm text-muted-foreground w-16 text-right">
                          {Math.floor(Math.random() * 50)} esami
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
