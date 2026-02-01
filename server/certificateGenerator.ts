import { v2 as cloudinary } from 'cloudinary';
import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';

// Configura Cloudinary dalle variabili d'ambiente
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CertificateData {
  certificateNumber: string;
  verificationCode: string;
  candidateName: string;
  candidateFiscalCode?: string;
  language: string;
  level: string;
  listeningScore: number;
  readingScore: number;
  writingScore: number;
  speakingScore: number;
  totalScore: number;
  examDate: Date;
  issueDate: Date;
  expiryDate: Date;
  examCenterName: string;
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

const getGrade = (score: number): string => {
  if (score >= 90) return 'Eccellente';
  if (score >= 80) return 'Ottimo';
  if (score >= 70) return 'Buono';
  if (score >= 60) return 'Sufficiente';
  return 'Insufficiente';
};

export async function generateCertificatePDF(data: CertificateData): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      // Genera QR code
      const verificationUrl = `https://e-learning-system-production.up.railway.app/verifica/${data.verificationCode}`;
      const qrCodeBuffer = await QRCode.toBuffer(verificationUrl, { width: 100, margin: 1 });

      // Crea documento PDF orizzontale A4
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margins: { top: 40, bottom: 40, left: 50, right: 50 }
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = 842;
      const pageHeight = 595;

      // Sfondo con gradiente simulato
      doc.rect(0, 0, pageWidth, pageHeight).fill('#f8fafc');
      
      // Bordo decorativo esterno
      doc.strokeColor('#2563eb').lineWidth(3);
      doc.rect(15, 15, pageWidth - 30, pageHeight - 30).stroke();
      
      // Bordo interno
      doc.strokeColor('#93c5fd').lineWidth(1);
      doc.rect(22, 22, pageWidth - 44, pageHeight - 44).stroke();

      // Badge DM in alto a destra
      doc.fillColor('#92400e').fontSize(8);
      doc.rect(pageWidth - 170, 30, 140, 20).fill('#fef3c7');
      doc.fillColor('#92400e').text('Conforme DM 62/2022 - MIM', pageWidth - 165, 36, { width: 130, align: 'center' });

      // Header - Logo e nome
      doc.fillColor('#1e40af').fontSize(32).font('Helvetica-Bold');
      doc.text('CertificaLingua', 50, 50, { align: 'center', width: pageWidth - 100 });
      
      doc.fillColor('#6b7280').fontSize(10).font('Helvetica');
      doc.text('ENTE CERTIFICATORE ACCREDITATO', 50, 88, { align: 'center', width: pageWidth - 100 });

      // Linea separatore
      doc.strokeColor('#e5e7eb').lineWidth(1);
      doc.moveTo(100, 110).lineTo(pageWidth - 100, 110).stroke();

      // Titolo certificato
      doc.fillColor('#1e40af').fontSize(26).font('Helvetica-Bold');
      doc.text('Certificato di Competenza Linguistica', 50, 125, { align: 'center', width: pageWidth - 100 });

      // Numero certificato
      doc.fillColor('#6b7280').fontSize(10).font('Helvetica');
      doc.text(`N° ${data.certificateNumber}  •  Codice Verifica: ${data.verificationCode}`, 50, 158, { align: 'center', width: pageWidth - 100 });

      // Sezione candidato
      doc.fillColor('#f1f5f9').rect(50, 180, 380, 70).fill();
      doc.fillColor('#1e40af').fontSize(22).font('Helvetica-Bold');
      doc.text(data.candidateName, 65, 195);
      if (data.candidateFiscalCode) {
        doc.fillColor('#6b7280').fontSize(10).font('Helvetica');
        doc.text(`C.F.: ${data.candidateFiscalCode}`, 65, 225);
      }

      // Testo certificazione
      doc.fillColor('#374151').fontSize(11).font('Helvetica');
      const certText = `Si certifica che il/la candidato/a sopra indicato/a ha sostenuto con esito positivo l'esame di certificazione linguistica in ${data.language} presso ${data.examCenterName}, conseguendo il livello:`;
      doc.text(certText, 50, 265, { width: 380, align: 'justify' });

      // Badge livello QCER
      doc.fillColor('#1d4ed8').rect(50, 320, 180, 60).fill();
      doc.fillColor('#ffffff').fontSize(36).font('Helvetica-Bold');
      doc.text(data.level, 60, 330);
      doc.fontSize(10).font('Helvetica');
      doc.text('Quadro Comune Europeo', 110, 335);
      doc.text('di Riferimento (QCER)', 110, 350);

      // Sezione punteggi (lato destro)
      const scoreX = 470;
      doc.fillColor('#ffffff').rect(scoreX, 180, 320, 200).fill();
      doc.strokeColor('#e5e7eb').rect(scoreX, 180, 320, 200).stroke();

      doc.fillColor('#6b7280').fontSize(10).font('Helvetica-Bold');
      doc.text('PUNTEGGI PER COMPETENZA', scoreX + 20, 195, { width: 280, align: 'center' });

      // Punteggi individuali
      const scores = [
        { label: 'Ascolto (Listening)', score: data.listeningScore, icon: '🎧' },
        { label: 'Lettura (Reading)', score: data.readingScore, icon: '📖' },
        { label: 'Scrittura (Writing)', score: data.writingScore, icon: '✍️' },
        { label: 'Parlato (Speaking)', score: data.speakingScore, icon: '🗣️' },
      ];

      let scoreY = 220;
      scores.forEach((s) => {
        doc.fillColor('#374151').fontSize(11).font('Helvetica');
        doc.text(`${s.label}`, scoreX + 30, scoreY);
        doc.fillColor('#1e40af').font('Helvetica-Bold');
        doc.text(`${s.score}/100`, scoreX + 230, scoreY, { width: 60, align: 'right' });
        
        // Linea separatore
        doc.strokeColor('#f3f4f6').moveTo(scoreX + 20, scoreY + 18).lineTo(scoreX + 300, scoreY + 18).stroke();
        scoreY += 28;
      });

      // Punteggio totale
      doc.fillColor('#f0f9ff').rect(scoreX + 20, scoreY + 5, 280, 45).fill();
      doc.fillColor('#6b7280').fontSize(10).font('Helvetica');
      doc.text('Punteggio Totale', scoreX + 35, scoreY + 12);
      doc.fillColor('#1e40af').fontSize(28).font('Helvetica-Bold');
      doc.text(`${data.totalScore}`, scoreX + 180, scoreY + 10, { width: 100, align: 'right' });
      doc.fillColor('#059669').fontSize(11).font('Helvetica');
      doc.text(getGrade(data.totalScore), scoreX + 35, scoreY + 35);

      // QR Code
      doc.image(qrCodeBuffer, scoreX + 110, 390, { width: 80, height: 80 });
      doc.fillColor('#6b7280').fontSize(8).font('Helvetica');
      doc.text('Scansiona per verificare', scoreX + 90, 475, { width: 120, align: 'center' });

      // Footer con date
      doc.strokeColor('#e5e7eb').moveTo(50, 480).lineTo(pageWidth - 50, 480).stroke();

      doc.fillColor('#6b7280').fontSize(9).font('Helvetica');
      doc.text('Data Esame', 60, 495);
      doc.fillColor('#374151').font('Helvetica-Bold');
      doc.text(formatDate(data.examDate), 60, 508);

      doc.fillColor('#6b7280').font('Helvetica');
      doc.text('Data Emissione', 200, 495);
      doc.fillColor('#374151').font('Helvetica-Bold');
      doc.text(formatDate(data.issueDate), 200, 508);

      doc.fillColor('#6b7280').font('Helvetica');
      doc.text('Validità fino al', 340, 495);
      doc.fillColor('#374151').font('Helvetica-Bold');
      doc.text(formatDate(data.expiryDate), 340, 508);

      // Firma
      doc.strokeColor('#374151').moveTo(pageWidth - 220, 510).lineTo(pageWidth - 70, 510).stroke();
      doc.fillColor('#374151').fontSize(10).font('Helvetica-Bold');
      doc.text('Dott. Marco Bianchi', pageWidth - 220, 515, { width: 150, align: 'center' });
      doc.fillColor('#6b7280').fontSize(8).font('Helvetica');
      doc.text('Direttore Generale', pageWidth - 220, 528, { width: 150, align: 'center' });

      // Nota validità
      doc.fillColor('#6b7280').fontSize(7).font('Helvetica');
      doc.text('Certificato valido ai sensi del DM 62/2022 - Ministero dell\'Istruzione e del Merito', 50, 555, { align: 'center', width: pageWidth - 100 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export async function uploadCertificateToCloudinary(
  pdfBuffer: Buffer, 
  certificateNumber: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'certificates',
        public_id: certificateNumber.replace(/[^a-zA-Z0-9]/g, '-'),
        format: 'pdf'
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result?.secure_url || '');
        }
      }
    );
    
    uploadStream.end(pdfBuffer);
  });
}

export async function generateAndUploadCertificate(data: CertificateData): Promise<string> {
  const pdfBuffer = await generateCertificatePDF(data);
  const url = await uploadCertificateToCloudinary(pdfBuffer, data.certificateNumber);
  return url;
}
