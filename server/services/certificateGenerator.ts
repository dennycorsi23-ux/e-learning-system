/**
 * Certificate Generator Service
 * Generates PDF certificates compliant with DM 62/2022
 * 
 * The certificate includes:
 * - Entity logo and information
 * - Candidate personal data
 * - QCER level achieved
 * - Scores for each skill (listening, reading, writing, speaking)
 * - QCER conversion table on the back
 * - Unique verification code
 * - Digital signature placeholder
 */

import { nanoid } from "nanoid";

// Types
interface CandidateData {
  firstName: string;
  lastName: string;
  fiscalCode: string;
  birthDate: Date;
  birthPlace: string;
}

interface ExamScores {
  listening: number;
  reading: number;
  writing: number;
  speaking: number;
  total: number;
}

interface CertificateData {
  candidate: CandidateData;
  language: string;
  languageNative: string;
  qcerLevel: string;
  scores: ExamScores;
  examDate: Date;
  examCenter: string;
  examCenterCity: string;
}

interface EntityInfo {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  logoUrl?: string;
  accreditationNumber?: string;
}

// QCER Level descriptions for the conversion table
const QCER_DESCRIPTIONS = {
  A1: {
    name: "Livello A1 - Contatto",
    description: "Comprende e usa espressioni di uso quotidiano e frasi basilari tese a soddisfare bisogni di tipo concreto. Sa presentare sé stesso/a e gli altri ed è in grado di fare domande e rispondere su particolari personali come dove abita, le persone che conosce e le cose che possiede. Interagisce in modo semplice, purché l'altra persona parli lentamente e chiaramente e sia disposta a collaborare.",
    listening: "Riconosce parole familiari ed espressioni molto semplici riferite a se stesso, alla propria famiglia e al proprio ambiente.",
    reading: "Comprende i nomi e le parole familiari e frasi molto semplici.",
    writing: "È in grado di scrivere una breve e semplice cartolina e compilare moduli con dati personali.",
    speaking: "È in grado di usare espressioni e frasi semplici per descrivere il luogo dove abita e la gente che conosce."
  },
  A2: {
    name: "Livello A2 - Sopravvivenza",
    description: "Comprende frasi ed espressioni usate frequentemente relative ad ambiti di immediata rilevanza. Comunica in attività semplici e di abitudine che richiedono un semplice scambio di informazioni su argomenti familiari e comuni. Sa descrivere in termini semplici aspetti della propria vita, dell'ambiente circostante; sa esprimere bisogni immediati.",
    listening: "Comprende espressioni e parole di uso molto frequente ed afferra l'essenziale di messaggi e annunci brevi, chiari e semplici.",
    reading: "Legge testi molto brevi e semplici e trova informazioni specifiche e prevedibili in materiale di uso quotidiano.",
    writing: "È in grado di scrivere semplici appunti e brevi messaggi su argomenti riguardanti bisogni immediati.",
    speaking: "È in grado di usare una serie di espressioni e frasi per descrivere con parole semplici la propria famiglia, altre persone, condizioni di vita."
  },
  B1: {
    name: "Livello B1 - Soglia",
    description: "Comprende i punti chiave di argomenti familiari che riguardano la scuola, il tempo libero ecc. Sa muoversi con disinvoltura in situazioni che possono verificarsi mentre viaggia nel paese di cui parla la lingua. È in grado di produrre un testo semplice relativo ad argomenti che siano familiari o di interesse personale. È in grado di esprimere esperienze ed avvenimenti, sogni, speranze e ambizioni e di spiegare brevemente le ragioni delle sue opinioni e dei suoi progetti.",
    listening: "Comprende i punti principali di un discorso chiaro in lingua standard su argomenti familiari.",
    reading: "Comprende testi scritti di uso corrente legati alla sfera quotidiana o al lavoro.",
    writing: "È in grado di scrivere testi semplici e coerenti su argomenti noti o di suo interesse.",
    speaking: "È in grado di descrivere esperienze e avvenimenti, sogni, speranze, ambizioni, di esporre brevemente ragioni e dare spiegazioni su opinioni e progetti."
  },
  B2: {
    name: "Livello B2 - Progresso",
    description: "Comprende le idee principali di testi complessi su argomenti sia concreti che astratti, comprese le discussioni tecniche sul suo campo di specializzazione. È in grado di interagire con una certa scioltezza e spontaneità che rendono possibile una interazione naturale con i parlanti nativi senza sforzo per l'interlocutore. Sa produrre un testo chiaro e dettagliato su un'ampia gamma di argomenti e spiegare un punto di vista su un argomento fornendo i pro e i contro delle varie opzioni.",
    listening: "Comprende discorsi di una certa lunghezza e conferenze e segue argomentazioni anche complesse purché il tema sia relativamente familiare.",
    reading: "Legge articoli e relazioni su questioni d'attualità in cui l'autore prende posizione ed esprime un punto di vista determinato.",
    writing: "È in grado di scrivere testi chiari e articolati su un'ampia gamma di argomenti che lo interessano.",
    speaking: "È in grado di fornire descrizioni chiare e articolate su un'ampia gamma di argomenti che rientrano nel suo campo d'interesse."
  },
  C1: {
    name: "Livello C1 - Efficacia",
    description: "Comprende un'ampia gamma di testi complessi e lunghi e ne sa riconoscere il significato implicito. Si esprime con scioltezza e naturalezza. Usa la lingua in modo flessibile ed efficace per scopi sociali, professionali e accademici. Riesce a produrre testi chiari, ben costruiti, dettagliati su argomenti complessi, mostrando un sicuro controllo della struttura testuale, dei connettori e degli elementi di coesione.",
    listening: "Comprende un discorso lungo anche se non è chiaramente strutturato e le relazioni rimangono implicite.",
    reading: "Comprende testi letterari e informativi lunghi e complessi e sa apprezzare le differenze di stile.",
    writing: "È in grado di scrivere testi chiari e ben strutturati su argomenti complessi, evidenziando le questioni salienti.",
    speaking: "È in grado di presentare descrizioni chiare e articolate di argomenti complessi, integrandovi temi secondari."
  },
  C2: {
    name: "Livello C2 - Padronanza",
    description: "Comprende con facilità praticamente tutto ciò che sente e legge. Sa riassumere informazioni provenienti da diverse fonti sia parlate che scritte, ristrutturando gli argomenti in una presentazione coerente. Sa esprimersi spontaneamente, in modo molto scorrevole e preciso, individuando le più sottili sfumature di significato in situazioni complesse.",
    listening: "Non ha alcuna difficoltà a comprendere qualsiasi tipo di lingua parlata, sia dal vivo sia trasmessa.",
    reading: "Legge con facilità praticamente tutte le forme di lingua scritta inclusi i testi astratti, strutturalmente o linguisticamente complessi.",
    writing: "È in grado di scrivere testi chiari, scorrevoli e stilisticamente appropriati.",
    speaking: "È in grado di presentare descrizioni o argomentazioni chiare e scorrevoli, in uno stile adeguato al contesto."
  }
};

// Generate unique certificate number
export function generateCertificateNumber(): string {
  const year = new Date().getFullYear();
  const random = nanoid(8).toUpperCase();
  return `CL-${year}-${random}`;
}

// Generate verification code
export function generateVerificationCode(): string {
  return nanoid(16).toUpperCase();
}

// Format date in Italian
function formatDateIT(date: Date): string {
  return date.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

// Get score description
function getScoreDescription(score: number): string {
  if (score >= 90) return "Eccellente";
  if (score >= 80) return "Ottimo";
  if (score >= 70) return "Buono";
  if (score >= 60) return "Sufficiente";
  return "Insufficiente";
}

// Generate certificate HTML (for PDF conversion)
export function generateCertificateHTML(
  data: CertificateData,
  entity: EntityInfo,
  certificateNumber: string,
  verificationCode: string
): string {
  const qcerInfo = QCER_DESCRIPTIONS[data.qcerLevel as keyof typeof QCER_DESCRIPTIONS];
  
  return `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Attestato di Certificazione Linguistica</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #1a1a1a;
    }
    
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 15mm 20mm;
      background: white;
      position: relative;
    }
    
    .page-front {
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #f0f4f8 100%);
    }
    
    .border-frame {
      border: 3px double #1e3a5f;
      padding: 10mm;
      min-height: 267mm;
      position: relative;
    }
    
    .header {
      text-align: center;
      margin-bottom: 8mm;
      padding-bottom: 5mm;
      border-bottom: 2px solid #1e3a5f;
    }
    
    .logo {
      max-height: 20mm;
      max-width: 60mm;
      margin-bottom: 3mm;
    }
    
    .entity-name {
      font-size: 16pt;
      font-weight: bold;
      color: #1e3a5f;
      margin-bottom: 2mm;
    }
    
    .entity-info {
      font-size: 9pt;
      color: #666;
    }
    
    .title {
      text-align: center;
      margin: 8mm 0;
    }
    
    .title h1 {
      font-size: 22pt;
      color: #1e3a5f;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 2mm;
    }
    
    .title h2 {
      font-size: 14pt;
      color: #4a6fa5;
      font-weight: normal;
    }
    
    .dm-reference {
      text-align: center;
      font-size: 9pt;
      color: #666;
      margin-bottom: 8mm;
      font-style: italic;
    }
    
    .certification-text {
      text-align: center;
      font-size: 11pt;
      margin-bottom: 5mm;
    }
    
    .candidate-name {
      text-align: center;
      font-size: 18pt;
      font-weight: bold;
      color: #1e3a5f;
      margin: 5mm 0;
      padding: 3mm;
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
    }
    
    .candidate-info {
      text-align: center;
      font-size: 10pt;
      margin-bottom: 8mm;
    }
    
    .level-box {
      background: #1e3a5f;
      color: white;
      text-align: center;
      padding: 5mm;
      margin: 8mm auto;
      max-width: 120mm;
      border-radius: 3mm;
    }
    
    .level-box h3 {
      font-size: 14pt;
      margin-bottom: 2mm;
    }
    
    .level-box .level {
      font-size: 28pt;
      font-weight: bold;
      letter-spacing: 3px;
    }
    
    .language-name {
      font-size: 12pt;
      margin-top: 2mm;
    }
    
    .scores-section {
      margin: 8mm 0;
    }
    
    .scores-title {
      font-size: 12pt;
      font-weight: bold;
      color: #1e3a5f;
      margin-bottom: 3mm;
      text-align: center;
    }
    
    .scores-table {
      width: 100%;
      border-collapse: collapse;
      margin: 0 auto;
      max-width: 150mm;
    }
    
    .scores-table th,
    .scores-table td {
      padding: 2mm 3mm;
      text-align: center;
      border: 1px solid #ccc;
    }
    
    .scores-table th {
      background: #f0f4f8;
      font-weight: bold;
      color: #1e3a5f;
    }
    
    .scores-table .total-row {
      background: #1e3a5f;
      color: white;
      font-weight: bold;
    }
    
    .exam-info {
      margin: 8mm 0;
      text-align: center;
      font-size: 10pt;
    }
    
    .verification {
      margin-top: 8mm;
      padding: 3mm;
      background: #f8f9fa;
      border: 1px solid #ddd;
      text-align: center;
      font-size: 9pt;
    }
    
    .verification-code {
      font-family: 'Courier New', monospace;
      font-size: 12pt;
      font-weight: bold;
      letter-spacing: 1px;
      color: #1e3a5f;
    }
    
    .signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 10mm;
      padding-top: 5mm;
    }
    
    .signature-box {
      width: 45%;
      text-align: center;
    }
    
    .signature-line {
      border-top: 1px solid #333;
      margin-top: 15mm;
      padding-top: 2mm;
      font-size: 9pt;
    }
    
    .footer {
      position: absolute;
      bottom: 5mm;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 8pt;
      color: #999;
    }
    
    /* Page 2 - QCER Table */
    .page-back {
      background: white;
    }
    
    .qcer-header {
      text-align: center;
      margin-bottom: 5mm;
      padding-bottom: 3mm;
      border-bottom: 2px solid #1e3a5f;
    }
    
    .qcer-header h2 {
      font-size: 14pt;
      color: #1e3a5f;
    }
    
    .qcer-intro {
      font-size: 9pt;
      text-align: justify;
      margin-bottom: 5mm;
      color: #444;
    }
    
    .qcer-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8pt;
    }
    
    .qcer-table th,
    .qcer-table td {
      border: 1px solid #ccc;
      padding: 2mm;
      vertical-align: top;
    }
    
    .qcer-table th {
      background: #1e3a5f;
      color: white;
      font-weight: bold;
      text-align: center;
    }
    
    .qcer-table .level-header {
      background: #4a6fa5;
      color: white;
      font-weight: bold;
      text-align: center;
      font-size: 10pt;
    }
    
    .qcer-table .highlight {
      background: #fff3cd;
    }
    
    .qcer-footer {
      margin-top: 5mm;
      font-size: 8pt;
      color: #666;
      text-align: center;
    }
    
    @media print {
      .page {
        page-break-after: always;
      }
    }
  </style>
</head>
<body>
  <!-- Page 1: Certificate Front -->
  <div class="page page-front">
    <div class="border-frame">
      <div class="header">
        ${entity.logoUrl ? `<img src="${entity.logoUrl}" alt="Logo" class="logo">` : ''}
        <div class="entity-name">${entity.name}</div>
        <div class="entity-info">
          ${entity.address} - ${entity.city}<br>
          Tel: ${entity.phone} | Email: ${entity.email}<br>
          ${entity.website}
          ${entity.accreditationNumber ? `<br>Accreditamento MIM n. ${entity.accreditationNumber}` : ''}
        </div>
      </div>
      
      <div class="title">
        <h1>Attestato di Certificazione</h1>
        <h2>Competenze Linguistiche - ${data.language}</h2>
      </div>
      
      <div class="dm-reference">
        Rilasciato ai sensi del D.M. n. 62 del 10 marzo 2022<br>
        Quadro Comune Europeo di Riferimento per le Lingue (QCER)
      </div>
      
      <div class="certification-text">
        Si certifica che
      </div>
      
      <div class="candidate-name">
        ${data.candidate.firstName.toUpperCase()} ${data.candidate.lastName.toUpperCase()}
      </div>
      
      <div class="candidate-info">
        Codice Fiscale: ${data.candidate.fiscalCode}<br>
        Nato/a a ${data.candidate.birthPlace} il ${formatDateIT(data.candidate.birthDate)}
      </div>
      
      <div class="certification-text">
        ha conseguito la certificazione di competenza linguistica
      </div>
      
      <div class="level-box">
        <h3>Livello QCER</h3>
        <div class="level">${data.qcerLevel}</div>
        <div class="language-name">${data.language} (${data.languageNative})</div>
      </div>
      
      <div class="scores-section">
        <div class="scores-title">Punteggi per Abilità Linguistica</div>
        <table class="scores-table">
          <thead>
            <tr>
              <th>Abilità</th>
              <th>Punteggio</th>
              <th>Valutazione</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Comprensione Orale (Ascolto)</td>
              <td>${data.scores.listening}/100</td>
              <td>${getScoreDescription(data.scores.listening)}</td>
            </tr>
            <tr>
              <td>Comprensione Scritta (Lettura)</td>
              <td>${data.scores.reading}/100</td>
              <td>${getScoreDescription(data.scores.reading)}</td>
            </tr>
            <tr>
              <td>Produzione Scritta</td>
              <td>${data.scores.writing}/100</td>
              <td>${getScoreDescription(data.scores.writing)}</td>
            </tr>
            <tr>
              <td>Produzione/Interazione Orale</td>
              <td>${data.scores.speaking}/100</td>
              <td>${getScoreDescription(data.scores.speaking)}</td>
            </tr>
            <tr class="total-row">
              <td>PUNTEGGIO TOTALE</td>
              <td colspan="2">${data.scores.total}/100</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="exam-info">
        Esame sostenuto il <strong>${formatDateIT(data.examDate)}</strong><br>
        presso <strong>${data.examCenter}</strong> - ${data.examCenterCity}
      </div>
      
      <div class="verification">
        <strong>Codice Verifica Attestato</strong><br>
        <span class="verification-code">${verificationCode}</span><br>
        <small>Verifica online: ${entity.website}/verifica-attestato</small>
      </div>
      
      <div class="signatures">
        <div class="signature-box">
          <div class="signature-line">
            Il Presidente della Commissione
          </div>
        </div>
        <div class="signature-box">
          <div class="signature-line">
            Il Direttore dell'Ente
          </div>
        </div>
      </div>
      
      <div class="footer">
        Attestato n. ${certificateNumber} | Data di emissione: ${formatDateIT(new Date())}
      </div>
    </div>
  </div>
  
  <!-- Page 2: QCER Conversion Table -->
  <div class="page page-back">
    <div class="border-frame">
      <div class="qcer-header">
        <h2>Quadro Comune Europeo di Riferimento per le Lingue (QCER)</h2>
        <p style="font-size: 10pt; color: #666; margin-top: 2mm;">Tabella di Conversione e Descrittori dei Livelli</p>
      </div>
      
      <div class="qcer-intro">
        Il Quadro Comune Europeo di Riferimento per le Lingue (QCER) è un sistema descrittivo impiegato per valutare 
        le abilità conseguite da chi studia una lingua straniera europea, nonché allo scopo di indicare il livello 
        di un insegnamento linguistico. È stato messo a punto dal Consiglio d'Europa come parte principale del 
        progetto "Apprendimento delle lingue per la cittadinanza europea" tra il 1989 e il 1996.
      </div>
      
      <table class="qcer-table">
        <thead>
          <tr>
            <th style="width: 10%;">Livello</th>
            <th style="width: 22%;">Comprensione Orale</th>
            <th style="width: 22%;">Comprensione Scritta</th>
            <th style="width: 23%;">Produzione Scritta</th>
            <th style="width: 23%;">Produzione Orale</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(QCER_DESCRIPTIONS).map(([level, info]) => `
            <tr class="${level === data.qcerLevel ? 'highlight' : ''}">
              <td class="level-header">${level}</td>
              <td>${info.listening}</td>
              <td>${info.reading}</td>
              <td>${info.writing}</td>
              <td>${info.speaking}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="qcer-footer">
        <p><strong>Livello conseguito dal candidato: ${data.qcerLevel}</strong> - ${qcerInfo?.name}</p>
        <p style="margin-top: 3mm;">${qcerInfo?.description}</p>
        <p style="margin-top: 5mm; font-style: italic;">
          Questo attestato è conforme al D.M. n. 62 del 10 marzo 2022 del Ministero dell'Istruzione e del Merito
          e certifica le competenze linguistiche secondo i descrittori del Quadro Comune Europeo di Riferimento per le Lingue.
        </p>
      </div>
      
      <div class="footer">
        ${entity.name} | ${entity.website} | Attestato n. ${certificateNumber}
      </div>
    </div>
  </div>
</body>
</html>
`;
}

// Generate certificate data for database
export function prepareCertificateData(
  examId: number,
  userId: number,
  languageId: number,
  qcerLevelId: number,
  scores: ExamScores,
  examDate: Date,
  examCenterName: string
) {
  const certificateNumber = generateCertificateNumber();
  const verificationCode = generateVerificationCode();
  
  return {
    examId,
    userId,
    certificateNumber,
    verificationCode,
    languageId,
    qcerLevelId,
    listeningScore: scores.listening,
    readingScore: scores.reading,
    writingScore: scores.writing,
    speakingScore: scores.speaking,
    totalScore: scores.total,
    issueDate: new Date(),
    examDate,
    examCenterName,
    status: "active" as const,
  };
}
