import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, Eye, FileText, CheckCircle, XCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Certificate {
  id: number;
  certificateNumber: string;
  verificationCode: string;
  languageId: number;
  qcerLevelId: number;
  listeningScore: number | null;
  readingScore: number | null;
  writingScore: number | null;
  speakingScore: number | null;
  totalScore: number | null;
  issueDate: Date;
  examDate: Date | null;
  examCenterName: string | null;
  status: string;
}

interface CertificateViewerProps {
  certificate: Certificate;
}

// Map QCER level IDs to names
const qcerLevelNames: Record<number, string> = {
  1: "A1",
  2: "A2",
  3: "B1",
  4: "B2",
  5: "C1",
  6: "C2",
};

export default function CertificateViewer({ certificate }: CertificateViewerProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  const generatePDF = trpc.certificates.generatePDF.useMutation({
    onSuccess: (data) => {
      if (data.html) {
        setPreviewHtml(data.html);
        setPreviewOpen(true);
      }
    },
  });

  const handlePreview = () => {
    generatePDF.mutate({ certificateId: certificate.id });
  };

  const handleDownload = async () => {
    if (!previewHtml) {
      generatePDF.mutate({ certificateId: certificate.id });
      return;
    }
    
    // Use html2pdf.js for client-side PDF generation
    // @ts-ignore
    if (typeof html2pdf !== "undefined") {
      const element = document.createElement("div");
      element.innerHTML = previewHtml;
      document.body.appendChild(element);
      
      // @ts-ignore
      await html2pdf()
        .set({
          margin: 0,
          filename: `Attestato_${certificate.certificateNumber}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save();
      
      document.body.removeChild(element);
    } else {
      // Fallback: open in new window for printing
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(previewHtml);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const getStatusBadge = () => {
    switch (certificate.status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-700 gap-1">
            <CheckCircle className="h-3 w-3" />
            Valido
          </Badge>
        );
      case "revoked":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Revocato
          </Badge>
        );
      default:
        return <Badge variant="secondary">{certificate.status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Attestato {qcerLevelNames[certificate.qcerLevelId] || "N/A"}
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Numero Attestato</p>
            <p className="font-mono font-medium">{certificate.certificateNumber}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Data Emissione</p>
            <p className="font-medium">
              {new Date(certificate.issueDate).toLocaleDateString("it-IT")}
            </p>
          </div>
        </div>

        {/* Scores */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">Punteggi</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between p-2 bg-muted/50 rounded">
              <span>Ascolto</span>
              <span className="font-medium">{certificate.listeningScore || 0}/100</span>
            </div>
            <div className="flex justify-between p-2 bg-muted/50 rounded">
              <span>Lettura</span>
              <span className="font-medium">{certificate.readingScore || 0}/100</span>
            </div>
            <div className="flex justify-between p-2 bg-muted/50 rounded">
              <span>Scrittura</span>
              <span className="font-medium">{certificate.writingScore || 0}/100</span>
            </div>
            <div className="flex justify-between p-2 bg-muted/50 rounded">
              <span>Parlato</span>
              <span className="font-medium">{certificate.speakingScore || 0}/100</span>
            </div>
          </div>
          <div className="flex justify-between p-2 bg-primary/10 rounded font-medium">
            <span>Totale</span>
            <span>{certificate.totalScore || 0}/100</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={handlePreview}
                disabled={generatePDF.isPending}
              >
                {generatePDF.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                Anteprima
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Anteprima Attestato</DialogTitle>
              </DialogHeader>
              {previewHtml && (
                <div
                  className="border rounded-lg overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              )}
            </DialogContent>
          </Dialog>

          <Button
            className="flex-1 gap-2"
            onClick={handleDownload}
            disabled={generatePDF.isPending || certificate.status === "revoked"}
          >
            <Download className="h-4 w-4" />
            Scarica PDF
          </Button>
        </div>

        {/* Verification code */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">Codice Verifica</p>
          <p className="font-mono text-sm">{certificate.verificationCode}</p>
        </div>
      </CardContent>
    </Card>
  );
}
