import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const faqCategories = [
  {
    title: "Certificazioni e QCER",
    faqs: [
      {
        question: "Cosa è il QCER?",
        answer: "Il Quadro Comune Europeo di Riferimento per le lingue (QCER) è uno standard internazionale che descrive le competenze linguistiche su una scala di sei livelli: A1, A2, B1, B2, C1 e C2. È riconosciuto in tutta Europa e a livello internazionale."
      },
      {
        question: "Le vostre certificazioni sono riconosciute dal MIM?",
        answer: "Sì, le nostre certificazioni sono conformi al Decreto Ministeriale n. 62 del 10 marzo 2022 e sono riconosciute dal Ministero dell'Istruzione e del Merito per l'attribuzione di punteggio nelle graduatorie e nei concorsi pubblici."
      },
      {
        question: "Quanto vale la certificazione nei concorsi?",
        answer: "Il punteggio attribuito varia in base al livello conseguito e al tipo di concorso. Generalmente, i livelli B2, C1 e C2 sono quelli più richiesti e con maggior punteggio. Consulta sempre il bando specifico per i dettagli."
      },
    ]
  },
  {
    title: "Esami e Iscrizioni",
    faqs: [
      {
        question: "Come posso iscrivermi a un esame?",
        answer: "Puoi iscriverti direttamente dalla nostra piattaforma. Crea un account, scegli la lingua e il livello desiderato, seleziona la sessione d'esame e completa il pagamento. Riceverai una conferma via email."
      },
      {
        question: "Posso sostenere l'esame a distanza?",
        answer: "Sì, offriamo la possibilità di sostenere l'esame a distanza tramite la nostra piattaforma con sistema di proctoring AI. Le prove orali vengono svolte in simultanea con un esaminatore certificato, come richiesto dalla normativa."
      },
      {
        question: "Quanto dura l'esame?",
        answer: "La durata varia in base al livello. Generalmente: A1-A2 circa 90 minuti, B1-B2 circa 2 ore, C1-C2 circa 2,5-3 ore. L'esame comprende prove di ascolto, lettura, scrittura e produzione orale."
      },
      {
        question: "Cosa succede se non supero l'esame?",
        answer: "Se non raggiungi il punteggio minimo, puoi ripetere l'esame in una sessione successiva. Non ci sono limiti al numero di tentativi, ma ogni iscrizione richiede il pagamento della quota prevista."
      },
    ]
  },
  {
    title: "Proctoring e Sicurezza",
    faqs: [
      {
        question: "Come funziona il sistema di proctoring?",
        answer: "Il nostro sistema di proctoring utilizza intelligenza artificiale per monitorare l'esame a distanza. Include riconoscimento facciale, eye-tracking, rilevamento di persone multiple e monitoraggio dell'ambiente. Tutto viene registrato per garantire l'integrità dell'esame."
      },
      {
        question: "Quali sono i requisiti tecnici per l'esame a distanza?",
        answer: "Hai bisogno di: computer con webcam e microfono funzionanti, connessione internet stabile (minimo 5 Mbps), browser Chrome o Firefox aggiornato, ambiente silenzioso e ben illuminato, documento d'identità valido."
      },
      {
        question: "I miei dati sono al sicuro?",
        answer: "Sì, trattiamo tutti i dati personali in conformità al GDPR. Le registrazioni degli esami sono conservate per il tempo strettamente necessario e poi eliminate. Non condividiamo i tuoi dati con terze parti."
      },
    ]
  },
  {
    title: "Attestati e Verifica",
    faqs: [
      {
        question: "Quando riceverò l'attestato?",
        answer: "L'attestato viene rilasciato entro 15 giorni lavorativi dalla data dell'esame. Riceverai una notifica via email quando sarà disponibile per il download nella tua area personale."
      },
      {
        question: "Come posso verificare l'autenticità di un attestato?",
        answer: "Ogni attestato ha un codice di verifica univoco. Puoi inserirlo nella sezione 'Verifica Attestato' del nostro sito per confermare l'autenticità e visualizzare i dettagli della certificazione."
      },
      {
        question: "L'attestato ha una scadenza?",
        answer: "No, l'attestato non ha scadenza. Tuttavia, alcuni enti o concorsi potrebbero richiedere certificazioni conseguite entro un certo periodo di tempo. Verifica sempre i requisiti specifici del bando."
      },
    ]
  },
];

export default function FAQ() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">CertificaLingua</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Torna alla Home</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container max-w-3xl">
          {/* Title */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Supporto</Badge>
            <h1 className="text-4xl font-bold mb-4">Domande Frequenti</h1>
            <p className="text-muted-foreground">
              Trova le risposte alle domande più comuni sulle nostre certificazioni linguistiche.
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {faqCategories.map((category, catIndex) => (
              <div key={catIndex}>
                <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`${catIndex}-${faqIndex}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center p-8 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2">Non hai trovato la risposta che cercavi?</h3>
            <p className="text-muted-foreground mb-4">
              Contattaci e ti risponderemo il prima possibile.
            </p>
            <Link href="/contatti">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Contattaci
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CertificaLingua. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  );
}
