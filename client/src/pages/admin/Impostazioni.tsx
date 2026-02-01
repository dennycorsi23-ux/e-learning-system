import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Globe, Mail, Building } from "lucide-react";
import { toast } from "sonner";

export default function AdminImpostazioni() {
  const handleSave = () => {
    toast.info("Funzionalità in arrivo", {
      description: "Il salvataggio delle impostazioni sarà disponibile a breve."
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold">Impostazioni</h1>
          <p className="text-muted-foreground">Configura le impostazioni della piattaforma</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informazioni Ente
            </CardTitle>
            <CardDescription>
              Dati dell'ente certificatore che appariranno sugli attestati
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="entity-name">Nome Ente</Label>
              <Input id="entity-name" placeholder="Nome dell'ente certificatore" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entity-address">Indirizzo Sede Legale</Label>
              <Textarea id="entity-address" placeholder="Via, CAP, Città, Provincia" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entity-vat">Partita IVA</Label>
                <Input id="entity-vat" placeholder="IT00000000000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entity-cf">Codice Fiscale</Label>
                <Input id="entity-cf" placeholder="00000000000" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contatti
            </CardTitle>
            <CardDescription>
              Informazioni di contatto pubbliche
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input id="contact-email" type="email" placeholder="info@esempio.it" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Telefono</Label>
                <Input id="contact-phone" placeholder="+39 02 1234567" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-pec">PEC</Label>
              <Input id="contact-pec" type="email" placeholder="pec@esempio.it" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Lingue Disponibili
            </CardTitle>
            <CardDescription>
              Configura le lingue per cui offrite certificazioni
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              La gestione delle lingue sarà disponibile a breve.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Settings className="h-4 w-4 mr-2" />
            Salva Impostazioni
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
