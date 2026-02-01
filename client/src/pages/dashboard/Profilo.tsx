import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function DashboardProfilo() {
  const { user } = useAuth();

  const handleSave = () => {
    toast.info("Funzionalità in arrivo", {
      description: "La modifica del profilo sarà disponibile a breve."
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">Il Mio Profilo</h1>
          <p className="text-muted-foreground">Gestisci le tue informazioni personali</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informazioni Personali</CardTitle>
            <CardDescription>
              I tuoi dati personali associati all'account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  defaultValue={user?.name || ""}
                  className="pl-10"
                  readOnly
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email || ""}
                  className="pl-10"
                  readOnly
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Badge variant="outline" className="gap-1">
                <Shield className="h-3 w-3" />
                {user?.role === "admin" ? "Amministratore" : "Utente"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verifica Identità SPID</CardTitle>
            <CardDescription>
              Collega il tuo account SPID per la verifica dell'identità
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                La verifica SPID è richiesta per sostenere gli esami di certificazione. 
                Questa funzionalità sarà disponibile a breve.
              </p>
            </div>
            <Button variant="outline" className="mt-4" disabled>
              <Shield className="h-4 w-4 mr-2" />
              Collega SPID
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
