import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Download, 
  FileText, 
  Calendar,
  Users,
  Award,
  BarChart3
} from "lucide-react";
import { toast } from "sonner";

export default function AdminReport() {
  const handleDownload = (reportType: string) => {
    toast.info("Funzionalità in arrivo", {
      description: `Il download del report "${reportType}" sarà disponibile a breve.`
    });
  };

  const reports = [
    {
      title: "Report Annuale MIM",
      description: "Relazione annuale per il Ministero dell'Istruzione e del Merito",
      icon: FileText,
      type: "ministry"
    },
    {
      title: "Statistiche Esami",
      description: "Riepilogo esami sostenuti, superati e percentuali di successo",
      icon: BarChart3,
      type: "exams"
    },
    {
      title: "Report Utenti",
      description: "Analisi degli utenti registrati e attività sulla piattaforma",
      icon: Users,
      type: "users"
    },
    {
      title: "Certificati Emessi",
      description: "Elenco completo dei certificati emessi per periodo",
      icon: Award,
      type: "certificates"
    },
    {
      title: "Report Mensile",
      description: "Riepilogo mensile di tutte le attività",
      icon: Calendar,
      type: "monthly"
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Report e Statistiche</h1>
          <p className="text-muted-foreground">Genera report e visualizza le statistiche della piattaforma</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">0</p>
              <p className="text-sm text-muted-foreground">Esami Totali</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-green-600">0%</p>
              <p className="text-sm text-muted-foreground">Tasso Successo</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-blue-600">0</p>
              <p className="text-sm text-muted-foreground">Certificati Emessi</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-amber-600">0</p>
              <p className="text-sm text-muted-foreground">Utenti Attivi</p>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <div className="grid md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <Card key={report.type}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <report.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{report.title}</CardTitle>
                      <CardDescription className="text-sm">{report.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDownload(report.title)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Genera Report
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ministry Report Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">Report per il Ministero</h3>
                <p className="text-sm text-blue-800 mt-1">
                  Il DM 62/2022 richiede la presentazione di una relazione annuale al Ministero 
                  contenente il numero di candidati per ciascun livello QCER, le percentuali di 
                  superamento e altre informazioni statistiche. Questo report viene generato 
                  automaticamente dalla piattaforma.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
