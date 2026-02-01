import { v2 as cloudinary } from 'cloudinary';
import QRCode from 'qrcode';

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

export async function generateCertificateHTML(data: CertificateData): Promise<string> {
  // Genera QR code per verifica
  const verificationUrl = `https://e-learning-system-production.up.railway.app/verifica/${data.verificationCode}`;
  const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, { width: 120, margin: 1 });
  
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

  return `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Open+Sans:wght@400;600&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Open Sans', sans-serif;
      background: white;
      color: #1a1a2e;
    }
    
    .certificate {
      width: 842px;
      height: 595px;
      padding: 30px;
      position: relative;
      background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 50%, #f0f4ff 100%);
    }
    
    .border-frame {
      position: absolute;
      top: 15px;
      left: 15px;
      right: 15px;
      bottom: 15px;
      border: 3px solid #2563eb;
      border-radius: 8px;
    }
    
    .border-frame-inner {
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 20px;
      border: 1px solid #93c5fd;
      border-radius: 4px;
    }
    
    .content {
      position: relative;
      z-index: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .header {
      text-align: center;
      padding-bottom: 15px;
      border-bottom: 2px solid #e5e7eb;
    }
    
    .logo-section {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
      margin-bottom: 10px;
    }
    
    .logo {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 28px;
      font-weight: bold;
    }
    
    .org-name {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      font-weight: 700;
      color: #1e40af;
    }
    
    .subtitle {
      font-size: 11px;
      color: #6b7280;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-top: 5px;
    }
    
    .title {
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      font-weight: 600;
      color: #1e40af;
      text-align: center;
      margin: 20px 0 10px;
    }
    
    .certificate-number {
      text-align: center;
      font-size: 11px;
      color: #6b7280;
      margin-bottom: 15px;
    }
    
    .main-content {
      flex: 1;
      display: flex;
      gap: 30px;
      padding: 0 20px;
    }
    
    .left-section {
      flex: 1;
    }
    
    .candidate-section {
      background: #f8fafc;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
    }
    
    .candidate-name {
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      font-weight: 600;
      color: #1e40af;
      margin-bottom: 5px;
    }
    
    .candidate-info {
      font-size: 12px;
      color: #6b7280;
    }
    
    .certification-text {
      font-size: 13px;
      line-height: 1.6;
      color: #374151;
      margin-bottom: 15px;
    }
    
    .level-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: white;
      padding: 12px 25px;
      border-radius: 8px;
      margin-bottom: 15px;
    }
    
    .level-code {
      font-size: 28px;
      font-weight: 700;
    }
    
    .level-name {
      font-size: 14px;
      opacity: 0.9;
    }
    
    .right-section {
      width: 280px;
    }
    
    .scores-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
    }
    
    .scores-title {
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
      text-align: center;
    }
    
    .score-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f3f4f6;
    }
    
    .score-row:last-child {
      border-bottom: none;
    }
    
    .score-label {
      font-size: 12px;
      color: #374151;
    }
    
    .score-value {
      font-size: 14px;
      font-weight: 600;
      color: #1e40af;
    }
    
    .total-score {
      background: #f0f9ff;
      border-radius: 6px;
      padding: 10px;
      text-align: center;
      margin-top: 10px;
    }
    
    .total-label {
      font-size: 11px;
      color: #6b7280;
      text-transform: uppercase;
    }
    
    .total-value {
      font-size: 32px;
      font-weight: 700;
      color: #1e40af;
    }
    
    .total-grade {
      font-size: 12px;
      color: #059669;
      font-weight: 600;
    }
    
    .qr-section {
      text-align: center;
      padding: 10px;
      background: #f8fafc;
      border-radius: 8px;
    }
    
    .qr-code {
      width: 100px;
      height: 100px;
      margin: 0 auto 8px;
    }
    
    .qr-text {
      font-size: 10px;
      color: #6b7280;
    }
    
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: 15px 20px 0;
      border-top: 1px solid #e5e7eb;
      margin-top: auto;
    }
    
    .date-section {
      font-size: 11px;
      color: #6b7280;
    }
    
    .date-value {
      font-weight: 600;
      color: #374151;
    }
    
    .signature-section {
      text-align: center;
    }
    
    .signature-line {
      width: 180px;
      border-bottom: 1px solid #374151;
      margin-bottom: 5px;
    }
    
    .signature-name {
      font-size: 11px;
      font-weight: 600;
      color: #374151;
    }
    
    .signature-title {
      font-size: 10px;
      color: #6b7280;
    }
    
    .validity {
      font-size: 10px;
      color: #6b7280;
      text-align: right;
    }
    
    .dm-badge {
      position: absolute;
      top: 25px;
      right: 35px;
      background: #fef3c7;
      color: #92400e;
      font-size: 9px;
      padding: 4px 10px;
      border-radius: 4px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="border-frame"></div>
    <div class="border-frame-inner"></div>
    <div class="dm-badge">Conforme DM 62/2022 - MIM</div>
    
    <div class="content">
      <div class="header">
        <div class="logo-section">
          <div class="logo">🎓</div>
          <div>
            <div class="org-name">CertificaLingua</div>
            <div class="subtitle">Ente Certificatore Accreditato</div>
          </div>
        </div>
      </div>
      
      <div class="title">Certificato di Competenza Linguistica</div>
      <div class="certificate-number">N° ${data.certificateNumber} • Codice Verifica: ${data.verificationCode}</div>
      
      <div class="main-content">
        <div class="left-section">
          <div class="candidate-section">
            <div class="candidate-name">${data.candidateName}</div>
            ${data.candidateFiscalCode ? `<div class="candidate-info">C.F.: ${data.candidateFiscalCode}</div>` : ''}
          </div>
          
          <div class="certification-text">
            Si certifica che il/la candidato/a sopra indicato/a ha sostenuto con esito positivo 
            l'esame di certificazione linguistica in <strong>${data.language}</strong> presso 
            <strong>${data.examCenterName}</strong>, conseguendo il livello:
          </div>
          
          <div class="level-badge">
            <span class="level-code">${data.level}</span>
            <span class="level-name">Quadro Comune Europeo<br>di Riferimento (QCER)</span>
          </div>
        </div>
        
        <div class="right-section">
          <div class="scores-card">
            <div class="scores-title">Punteggi per Competenza</div>
            <div class="score-row">
              <span class="score-label">🎧 Ascolto</span>
              <span class="score-value">${data.listeningScore}/100</span>
            </div>
            <div class="score-row">
              <span class="score-label">📖 Lettura</span>
              <span class="score-value">${data.readingScore}/100</span>
            </div>
            <div class="score-row">
              <span class="score-label">✍️ Scrittura</span>
              <span class="score-value">${data.writingScore}/100</span>
            </div>
            <div class="score-row">
              <span class="score-label">🗣️ Parlato</span>
              <span class="score-value">${data.speakingScore}/100</span>
            </div>
            <div class="total-score">
              <div class="total-label">Punteggio Totale</div>
              <div class="total-value">${data.totalScore}</div>
              <div class="total-grade">${getGrade(data.totalScore)}</div>
            </div>
          </div>
          
          <div class="qr-section">
            <img src="${qrCodeDataUrl}" alt="QR Code Verifica" class="qr-code" />
            <div class="qr-text">Scansiona per verificare<br>l'autenticità del certificato</div>
          </div>
        </div>
      </div>
      
      <div class="footer">
        <div class="date-section">
          <div>Data Esame: <span class="date-value">${formatDate(data.examDate)}</span></div>
          <div>Data Emissione: <span class="date-value">${formatDate(data.issueDate)}</span></div>
        </div>
        
        <div class="signature-section">
          <div class="signature-line"></div>
          <div class="signature-name">Dott. Marco Bianchi</div>
          <div class="signature-title">Direttore Generale</div>
        </div>
        
        <div class="validity">
          Validità: ${formatDate(data.expiryDate)}<br>
          <em>Certificato valido ai sensi del DM 62/2022</em>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export async function generateCertificatePDF(data: CertificateData): Promise<Buffer> {
  const puppeteer = await import('puppeteer');
  
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  const html = await generateCertificateHTML(data);
  
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  const pdfBuffer = await page.pdf({
    width: '842px',
    height: '595px',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  
  await browser.close();
  
  return Buffer.from(pdfBuffer);
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
