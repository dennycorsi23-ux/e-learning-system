import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Award,
  Building2,
  FileText,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user && user.role !== "admin") {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  const stats = [
    { label: "Utenti Totali", value: "0", icon: Users, color: "bg-blue-100 text-blue-600" },
    { label: "Corsi Attivi", value: "0", icon: BookOpen, color: "bg-green-100 text-green-600" },
    { label: "Esami Questo Mese", value: "0", icon: Calendar, color: "bg-amber-100 text-amber-600" },
    { label: "Certificati Emessi", value: "0", icon: Award, color: "bg-purple-100 text-purple-600" },
    { label: "Sedi Accreditate", value: "0", icon: Building2, color: "bg-indigo-100 text-indigo-600" },
    { label: "Esaminatori", value: "0", icon: FileText, color: "bg-pink-100 text-pink-600" },
  ];

  const quickLinks = [
    { href: "/admin/utenti", label: "Gestione Utenti", icon: Users },
    { href: "/admin/corsi", label: "Gestione Corsi", icon: BookOpen },
    { href: "/admin/esami", label: "Gestione Esami", icon: Calendar },
    { href: "/admin/sedi", label: "Gestione Sedi", icon: Building2 },
    { href: "/admin/certificati", label: "Certificati", icon: Award },
    { href: "/admin/report", label: "Report", icon: TrendingUp },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Pannello Amministrazione</h1>
          <p className="text-muted-foreground">Gestisci la piattaforma di certificazione linguistica</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Accesso Rapido</CardTitle>
            <CardDescription>Gestisci le principali sezioni della piattaforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                    <link.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{link.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-900">Configurazione Iniziale</h3>
                <p className="text-sm text-amber-800 mt-1">
                  La piattaforma è in fase di configurazione. Aggiungi lingue, livelli QCER, 
                  sedi d'esame e contenuti per completare la configurazione.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
