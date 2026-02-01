import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function DashboardCertificati() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">I Miei Certificati</h1>
          <p className="text-muted-foreground">Scarica e gestisci i tuoi attestati di certificazione</p>
        </div>

        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Award className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Nessun certificato</h3>
              <p className="mb-4">Non hai ancora ottenuto nessun certificato.</p>
              <Link href="/esami">
                <Button>
                  Prenota un Esame
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
