import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Award, Search, Eye, Ban, Download, Loader2, CheckCircle, XCircle, Clock, FileText } from "lucide-react";
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
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [revokeReason, setRevokeReason] = useState("");
  const [generatingPdf, setGeneratingPdf] = useState<number | null>(null);

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

  const generatePdfMutation = trpc.admin.certificates.generatePdf.useMutation({
    onSuccess: (data) => {
      toast.success("PDF generato con successo!");
      setGeneratingPdf(null);
      refetch();
      // Open the PDF in a new tab
      if (data.url) {
        window.open(data.url, '_blank');
      }
    },
    onError: (err: any) => {
      toast.error(err.message || "Errore nella generazione del PDF");
      setGeneratingPdf(null);
    },
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

  const handleView = (cert: Certificate) => {
    setSelectedCertificate(cert);
    setViewDialogOpen(true);
  };

  const handleGeneratePdf = (certId: number) => {
    setGeneratingPdf(certId);
    generatePdfMutation.mutate({ certificateId: certId });
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
                            <div className="flex items-center justify-end gap-1">
                              {/* Generate PDF Button */}
                              {!cert.certificatePdfUrl ? (
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleGeneratePdf(cert.id)}
                                  disabled={generatingPdf === cert.id}
                                  title="Genera PDF"
                                >
                                  {generatingPdf === cert.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <FileText className="h-4 w-4 text-blue-600" />
                                  )}
                                </Button>
                              ) : (
                                <Button variant="ghost" size="icon" asChild title="Scarica PDF">
                                  <a href={cert.certificatePdfUrl} target="_blank" rel="noopener noreferrer">
                                    <Download className="h-4 w-4 text-green-600" />
                                  </a>
                                </Button>
                              )}
                              {/* View Details Button */}
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleView(cert)}
                                title="Visualizza dettagli"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {/* Revoke Button */}
                              {cert.status === "active" && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleRevoke(cert)}
                                  title="Revoca certificato"
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

      {/* View Certificate Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dettagli Certificato</DialogTitle>
          </DialogHeader>
          {selectedCertificate && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Numero Certificato</label>
                  <p className="font-mono font-semibold">{selectedCertificate.certificateNumber}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Codice Verifica</label>
                  <p className="font-mono">{selectedCertificate.verificationCode}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Lingua</label>
                  <p>{getLanguageName(selectedCertificate.languageId)}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Livello QCER</label>
                  <Badge variant="secondary" className="mt-1">{getLevelCode(selectedCertificate.qcerLevelId)}</Badge>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-muted/30">
                <h4 className="font-semibold mb-3">Punteggi per Competenza</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex justify-between">
                    <span>🎧 Ascolto</span>
                    <span className="font-semibold">{selectedCertificate.listeningScore || 0}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>📖 Lettura</span>
                    <span className="font-semibold">{selectedCertificate.readingScore || 0}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>✍️ Scrittura</span>
                    <span className="font-semibold">{selectedCertificate.writingScore || 0}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🗣️ Parlato</span>
                    <span className="font-semibold">{selectedCertificate.speakingScore || 0}/100</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t flex justify-between items-center">
                  <span className="font-semibold">Punteggio Totale</span>
                  <span className="text-2xl font-bold text-primary">{selectedCertificate.totalScore || 0}/100</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <label className="text-muted-foreground">Data Esame</label>
                  <p>{formatDate(selectedCertificate.examDate)}</p>
                </div>
                <div>
                  <label className="text-muted-foreground">Data Emissione</label>
                  <p>{formatDate(selectedCertificate.issueDate)}</p>
                </div>
                <div>
                  <label className="text-muted-foreground">Scadenza</label>
                  <p>{formatDate(selectedCertificate.expiryDate)}</p>
                </div>
              </div>

              {selectedCertificate.examCenterName && (
                <div>
                  <label className="text-sm text-muted-foreground">Centro Esami</label>
                  <p>{selectedCertificate.examCenterName}</p>
                </div>
              )}

              {selectedCertificate.status === "revoked" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-700 mb-2">Certificato Revocato</h4>
                  <p className="text-sm text-red-600">
                    Data revoca: {formatDate(selectedCertificate.revokedAt)}
                  </p>
                  {selectedCertificate.revokedReason && (
                    <p className="text-sm text-red-600 mt-1">
                      Motivo: {selectedCertificate.revokedReason}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {selectedCertificate?.certificatePdfUrl ? (
              <Button asChild>
                <a href={selectedCertificate.certificatePdfUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Scarica PDF
                </a>
              </Button>
            ) : (
              <Button 
                onClick={() => selectedCertificate && handleGeneratePdf(selectedCertificate.id)}
                disabled={generatingPdf === selectedCertificate?.id}
              >
                {generatingPdf === selectedCertificate?.id ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4 mr-2" />
                )}
                Genera PDF
              </Button>
            )}
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Chiudi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
