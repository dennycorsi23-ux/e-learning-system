import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Award, Search, Eye, Ban, Download, Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Certificate {
  id: number;
  certificateNumber: string;
  verificationCode: string;
  userId: number;
  languageId: number;
  qcerLevelId: number;
  listeningScore: number | null;
  readingScore: number | null;
  writingScore: number | null;
  speakingScore: number | null;
  totalScore: number | null;
  issueDate: Date | string;
  expiryDate: Date | string | null;
  examDate: Date | string;
  examCenterName: string | null;
  certificatePdfUrl: string | null;
  status: "active" | "revoked" | "expired";
  revokedAt: Date | string | null;
  revokedReason: string | null;
}

const statusConfig = {
  active: { label: "Attivo", color: "bg-green-100 text-green-700", icon: CheckCircle },
  revoked: { label: "Revocato", color: "bg-red-100 text-red-700", icon: XCircle },
  expired: { label: "Scaduto", color: "bg-gray-100 text-gray-700", icon: Clock },
};

export default function AdminCertificati() {
  const [searchQuery, setSearchQuery] = useState("");
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [revokeReason, setRevokeReason] = useState("");

  const { data: certificates = [], isLoading, refetch } = trpc.admin.certificates.list.useQuery();
  const { data: languages = [] } = trpc.languages.list.useQuery();
  const { data: levels = [] } = trpc.qcerLevels.list.useQuery();

  const revokeMutation = trpc.admin.certificates.revoke.useMutation({
    onSuccess: () => {
      toast.success("Certificato revocato");
      setRevokeDialogOpen(false);
      setSelectedCertificate(null);
      setRevokeReason("");
      refetch();
    },
    onError: (err: any) => toast.error(err.message || "Errore"),
  });

  const getLanguageName = (id: number) => (languages as any[]).find((l) => l.id === id)?.name || "N/A";
  const getLevelCode = (id: number) => (levels as any[]).find((l) => l.id === id)?.code || "N/A";

  const filteredCertificates = (certificates as Certificate[]).filter((cert) =>
    cert.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.verificationCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("it-IT");
  };

  const handleRevoke = (cert: Certificate) => {
    setSelectedCertificate(cert);
    setRevokeDialogOpen(true);
  };

  const confirmRevoke = () => {
    if (selectedCertificate && revokeReason.trim()) {
      revokeMutation.mutate({
        certificateId: selectedCertificate.id,
        reason: revokeReason,
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Gestione Certificati</h1>
          <p className="text-muted-foreground">Visualizza e gestisci gli attestati emessi</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cerca per numero certificato o codice verifica..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredCertificates.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Award className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Nessun certificato</h3>
                <p>I certificati emessi appariranno qui.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Numero</TableHead>
                      <TableHead>Lingua</TableHead>
                      <TableHead>Livello</TableHead>
                      <TableHead>Punteggio</TableHead>
                      <TableHead>Data Esame</TableHead>
                      <TableHead>Emesso il</TableHead>
                      <TableHead>Scadenza</TableHead>
                      <TableHead>Stato</TableHead>
                      <TableHead className="text-right">Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCertificates.map((cert) => {
                      const status = statusConfig[cert.status] || statusConfig.active;
                      const StatusIcon = status.icon;
                      return (
                        <TableRow key={cert.id}>
                          <TableCell className="font-mono text-sm">{cert.certificateNumber}</TableCell>
                          <TableCell>{getLanguageName(cert.languageId)}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{getLevelCode(cert.qcerLevelId)}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold">{cert.totalScore || "N/A"}</span>
                            <span className="text-muted-foreground">/100</span>
                          </TableCell>
                          <TableCell>{formatDate(cert.examDate)}</TableCell>
                          <TableCell>{formatDate(cert.issueDate)}</TableCell>
                          <TableCell>{formatDate(cert.expiryDate)}</TableCell>
                          <TableCell>
                            <Badge className={status.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {cert.certificatePdfUrl && (
                                <Button variant="ghost" size="icon" asChild>
                                  <a href={cert.certificatePdfUrl} target="_blank" rel="noopener noreferrer">
                                    <Download className="h-4 w-4" />
                                  </a>
                                </Button>
                              )}
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {cert.status === "active" && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleRevoke(cert)}
                                >
                                  <Ban className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Revoke Dialog */}
      <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoca Certificato</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Stai per revocare il certificato <strong>{selectedCertificate?.certificateNumber}</strong>. 
              Questa azione è irreversibile.
            </p>
            <div>
              <label className="text-sm font-medium">Motivo della revoca</label>
              <Textarea
                placeholder="Inserisci il motivo della revoca..."
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeDialogOpen(false)}>
              Annulla
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmRevoke}
              disabled={!revokeReason.trim() || revokeMutation.isPending}
            >
              {revokeMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Ban className="h-4 w-4 mr-2" />
              )}
              Revoca
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
