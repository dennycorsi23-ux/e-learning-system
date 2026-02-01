import mysql from 'mysql2/promise';

const connection = await mysql.createConnection('mysql://root:CULhVjYBzwuuUSsFYzRPqWhkiaZkOtHQ@turntable.proxy.rlwy.net:32764/railway');

// Sample exams data for B2, C1, C2 levels
const sampleExams = [
  // B2 - Listening
  {
    languageId: 1,
    qcerLevelId: 4,
    skill: 'listening',
    title: 'Comprensione Orale B2 - Demo',
    description: 'Prova di ascolto livello B2 con dialoghi e monologhi su temi di attualità',
    content: JSON.stringify({
      instructions: "Ascolta attentamente i brani audio e rispondi alle domande. Ogni brano verrà riprodotto due volte.",
      duration: "25 min",
      parts: [
        {
          id: 1,
          title: "Parte 1 - Intervista",
          questions: [
            { id: 1, type: "multiple_choice", question: "Qual è l'argomento principale dell'intervista?", options: ["Il cambiamento climatico", "L'economia digitale", "La salute mentale", "L'istruzione online"], correct: 1 },
            { id: 2, type: "multiple_choice", question: "Secondo l'esperto, quale settore crescerà di più?", options: ["Turismo", "E-commerce", "Agricoltura", "Manifattura"], correct: 1 },
            { id: 3, type: "multiple_choice", question: "Quale sfida viene menzionata per le piccole imprese?", options: ["Mancanza di personale", "Digitalizzazione", "Costi energetici", "Concorrenza estera"], correct: 1 },
            { id: 4, type: "multiple_choice", question: "Cosa suggerisce l'esperto come soluzione?", options: ["Ridurre i costi", "Investire in formazione", "Chiudere i negozi fisici", "Aumentare i prezzi"], correct: 1 },
            { id: 5, type: "multiple_choice", question: "Quale previsione fa per il prossimo anno?", options: ["Recessione", "Crescita moderata", "Stagnazione", "Boom economico"], correct: 1 }
          ]
        },
        {
          id: 2,
          title: "Parte 2 - Notiziario",
          questions: [
            { id: 6, type: "multiple_choice", question: "Quale evento viene annunciato?", options: ["Un festival musicale", "Una conferenza internazionale", "Un'elezione", "Una fiera commerciale"], correct: 1 },
            { id: 7, type: "multiple_choice", question: "Dove si terrà l'evento?", options: ["Roma", "Milano", "Firenze", "Venezia"], correct: 1 },
            { id: 8, type: "multiple_choice", question: "Quanti partecipanti sono previsti?", options: ["500", "1000", "2000", "5000"], correct: 2 },
            { id: 9, type: "multiple_choice", question: "Qual è il tema principale?", options: ["Sostenibilità", "Innovazione", "Cultura", "Sport"], correct: 0 },
            { id: 10, type: "multiple_choice", question: "Quando si svolgerà?", options: ["Questa settimana", "Il mese prossimo", "In primavera", "In estate"], correct: 1 }
          ]
        }
      ]
    })
  },
  // B2 - Reading
  {
    languageId: 1,
    qcerLevelId: 4,
    skill: 'reading',
    title: 'Comprensione Scritta B2 - Demo',
    description: 'Prova di lettura livello B2 con testi di media complessità',
    content: JSON.stringify({
      instructions: "Leggi attentamente i testi e rispondi alle domande selezionando l'opzione corretta.",
      duration: "30 min",
      passages: [
        {
          id: 1,
          title: "Il futuro del lavoro",
          text: "Il mondo del lavoro sta attraversando una trasformazione epocale. La digitalizzazione e l'automazione stanno ridefinendo le competenze richieste, mentre il lavoro da remoto è diventato una realtà consolidata per milioni di lavoratori. Le aziende devono adattarsi rapidamente, investendo nella formazione continua dei dipendenti e ripensando gli spazi di lavoro tradizionali. Gli esperti prevedono che entro il 2030, il 40% delle professioni attuali subirà cambiamenti significativi, richiedendo nuove competenze digitali e soft skills come la creatività e il pensiero critico.",
          questions: [
            { id: 1, type: "multiple_choice", question: "Qual è il tema principale del testo?", options: ["La crisi economica", "La trasformazione del lavoro", "I problemi dell'istruzione", "La tecnologia obsoleta"], correct: 1 },
            { id: 2, type: "multiple_choice", question: "Cosa devono fare le aziende secondo il testo?", options: ["Licenziare personale", "Investire in formazione", "Chiudere gli uffici", "Ridurre i salari"], correct: 1 },
            { id: 3, type: "multiple_choice", question: "Quale percentuale di professioni cambierà entro il 2030?", options: ["20%", "30%", "40%", "50%"], correct: 2 },
            { id: 4, type: "multiple_choice", question: "Quali competenze saranno richieste?", options: ["Solo tecniche", "Solo manuali", "Digitali e soft skills", "Nessuna nuova competenza"], correct: 2 },
            { id: 5, type: "multiple_choice", question: "Il lavoro da remoto è descritto come:", options: ["Una moda passeggera", "Una realtà consolidata", "Un problema", "Un'eccezione"], correct: 1 }
          ]
        }
      ]
    })
  },
  // B2 - Writing
  {
    languageId: 1,
    qcerLevelId: 4,
    skill: 'writing',
    title: 'Produzione Scritta B2 - Demo',
    description: 'Prova di scrittura livello B2 con testi argomentativi',
    content: JSON.stringify({
      instructions: "Svolgi i seguenti compiti di scrittura. Presta attenzione alla struttura, alla coerenza e alla correttezza grammaticale.",
      duration: "45 min",
      tasks: [
        {
          id: 1,
          type: "essay",
          title: "Testo argomentativo",
          description: "Scrivi un testo argomentativo di 200-250 parole sul seguente tema: 'I social media hanno più effetti positivi o negativi sulla società?' Presenta la tua opinione con argomenti a supporto.",
          fields: ["Introduzione", "Argomenti a favore", "Argomenti contro", "Conclusione"]
        },
        {
          id: 2,
          type: "email",
          title: "Email formale",
          description: "Scrivi un'email formale di 120-150 parole al direttore di un'azienda per candidarti a una posizione lavorativa. Includi le tue qualifiche e motivazioni.",
          example_structure: ["Oggetto", "Saluto formale", "Presentazione", "Motivazioni", "Chiusura formale"]
        }
      ]
    })
  },
  // B2 - Speaking
  {
    languageId: 1,
    qcerLevelId: 4,
    skill: 'speaking',
    title: 'Produzione Orale B2 - Demo',
    description: 'Prova orale livello B2 con presentazioni e discussioni',
    content: JSON.stringify({
      instructions: "Questa prova valuta la tua capacità di esprimerti oralmente in italiano. Preparati a parlare sui seguenti argomenti.",
      duration: "15 min",
      parts: [
        {
          id: 1,
          title: "Presentazione personale",
          duration: "2-3 min",
          description: "Presentati brevemente parlando dei tuoi studi, lavoro, interessi e obiettivi futuri.",
          sample_topics: ["Formazione", "Esperienza lavorativa", "Hobby", "Progetti futuri"]
        },
        {
          id: 2,
          title: "Monologo su un tema",
          duration: "3-4 min",
          description: "Parla del seguente argomento: 'L'importanza dell'apprendimento delle lingue straniere nel mondo globalizzato'. Esprimi la tua opinione con esempi concreti.",
          sample_prompts: ["Vantaggi professionali", "Arricchimento culturale", "Opportunità di viaggio", "Comunicazione internazionale"]
        },
        {
          id: 3,
          title: "Discussione interattiva",
          duration: "5-6 min",
          description: "Discuti con l'esaminatore su un tema di attualità. Dovrai esprimere opinioni, fare confronti e rispondere a domande.",
          sample_questions: ["Quali sono i vantaggi e svantaggi del lavoro da remoto?", "Come pensi che la tecnologia cambierà l'istruzione?", "Qual è il ruolo dei giovani nella società?"]
        }
      ]
    })
  },
  // C1 - Listening
  {
    languageId: 1,
    qcerLevelId: 5,
    skill: 'listening',
    title: 'Comprensione Orale C1 - Demo',
    description: 'Prova di ascolto livello C1 con contenuti complessi',
    content: JSON.stringify({
      instructions: "Ascolta attentamente i brani audio e rispondi alle domande. I testi includono conferenze, dibattiti e interviste su temi specialistici.",
      duration: "30 min",
      parts: [
        {
          id: 1,
          title: "Conferenza accademica",
          questions: [
            { id: 1, type: "multiple_choice", question: "Qual è la tesi principale del relatore?", options: ["L'intelligenza artificiale sostituirà i medici", "L'IA supporterà ma non sostituirà i professionisti", "La tecnologia è pericolosa per la salute", "I robot sono già usati in chirurgia"], correct: 1 },
            { id: 2, type: "multiple_choice", question: "Quale esempio viene citato a supporto?", options: ["Diagnosi automatiche", "Robot chirurgici", "Telemedicina", "Cartelle cliniche digitali"], correct: 0 },
            { id: 3, type: "multiple_choice", question: "Quale preoccupazione etica viene sollevata?", options: ["Costo delle tecnologie", "Privacy dei dati", "Disoccupazione medica", "Errori diagnostici"], correct: 1 },
            { id: 4, type: "multiple_choice", question: "Cosa propone il relatore come soluzione?", options: ["Vietare l'IA in medicina", "Regolamentazione specifica", "Formazione obbligatoria", "Referendum popolare"], correct: 1 },
            { id: 5, type: "multiple_choice", question: "Quale conclusione viene tratta?", options: ["L'IA è inevitabile", "Bisogna procedere con cautela", "La tecnologia va fermata", "I medici devono adattarsi"], correct: 1 }
          ]
        },
        {
          id: 2,
          title: "Dibattito televisivo",
          questions: [
            { id: 6, type: "multiple_choice", question: "Su quale tema si confrontano gli ospiti?", options: ["Politica estera", "Riforma fiscale", "Transizione ecologica", "Sistema sanitario"], correct: 2 },
            { id: 7, type: "multiple_choice", question: "Quale posizione sostiene il primo ospite?", options: ["Approccio graduale", "Cambiamento radicale immediato", "Mantenere lo status quo", "Lasciare decidere al mercato"], correct: 1 },
            { id: 8, type: "multiple_choice", question: "Quale argomento usa il secondo ospite?", options: ["Costi economici", "Impatto occupazionale", "Fattibilità tecnica", "Tutti i precedenti"], correct: 3 },
            { id: 9, type: "multiple_choice", question: "Come interviene il moderatore?", options: ["Dà ragione al primo", "Cerca un compromesso", "Cambia argomento", "Interrompe il dibattito"], correct: 1 },
            { id: 10, type: "multiple_choice", question: "Quale conclusione emerge?", options: ["Accordo totale", "Disaccordo insanabile", "Necessità di ulteriori studi", "Rinvio della decisione"], correct: 2 }
          ]
        }
      ]
    })
  },
  // C1 - Reading
  {
    languageId: 1,
    qcerLevelId: 5,
    skill: 'reading',
    title: 'Comprensione Scritta C1 - Demo',
    description: 'Prova di lettura livello C1 con testi accademici e specialistici',
    content: JSON.stringify({
      instructions: "Leggi attentamente i testi e rispondi alle domande. I testi richiedono comprensione di sfumature, implicazioni e strutture argomentative complesse.",
      duration: "40 min",
      passages: [
        {
          id: 1,
          title: "Neuroplasticità e apprendimento linguistico",
          text: "La neuroplasticità, ovvero la capacità del cervello di modificare la propria struttura e funzione in risposta all'esperienza, ha rivoluzionato la nostra comprensione dell'apprendimento linguistico. Contrariamente alla teoria del 'periodo critico', secondo cui l'acquisizione di una seconda lingua sarebbe ottimale solo nell'infanzia, recenti studi dimostrano che il cervello adulto mantiene una notevole capacità di adattamento. Le ricerche condotte mediante risonanza magnetica funzionale hanno evidenziato come l'apprendimento intensivo di una nuova lingua produca modifiche strutturali nell'ippocampo e nella corteccia prefrontale, aree cruciali per la memoria e le funzioni esecutive. Tuttavia, i meccanismi neurali differiscono significativamente tra apprendenti precoci e tardivi, suggerendo che, sebbene l'apprendimento sia possibile a qualsiasi età, le strategie didattiche dovrebbero essere calibrate in base all'età del discente.",
          questions: [
            { id: 1, type: "multiple_choice", question: "Cosa si intende per neuroplasticità?", options: ["Una malattia neurologica", "La rigidità cerebrale", "La capacità del cervello di modificarsi", "Un tipo di chirurgia"], correct: 2 },
            { id: 2, type: "multiple_choice", question: "Cosa afferma la teoria del 'periodo critico'?", options: ["L'apprendimento è impossibile da adulti", "L'infanzia è il periodo ottimale", "Gli adulti imparano meglio", "Non esiste un'età ideale"], correct: 1 },
            { id: 3, type: "multiple_choice", question: "Quali aree cerebrali sono coinvolte?", options: ["Cervelletto e midollo", "Ippocampo e corteccia prefrontale", "Lobo occipitale", "Sistema limbico"], correct: 1 },
            { id: 4, type: "multiple_choice", question: "Cosa suggeriscono le ricerche recenti?", options: ["Il periodo critico è confermato", "Gli adulti non possono imparare", "L'apprendimento è possibile a ogni età", "Solo i bambini hanno neuroplasticità"], correct: 2 },
            { id: 5, type: "multiple_choice", question: "Quale implicazione didattica viene suggerita?", options: ["Usare lo stesso metodo per tutti", "Adattare le strategie all'età", "Insegnare solo ai bambini", "Evitare la tecnologia"], correct: 1 }
          ]
        }
      ]
    })
  },
  // C1 - Writing
  {
    languageId: 1,
    qcerLevelId: 5,
    skill: 'writing',
    title: 'Produzione Scritta C1 - Demo',
    description: 'Prova di scrittura livello C1 con testi complessi e formali',
    content: JSON.stringify({
      instructions: "Svolgi i seguenti compiti di scrittura dimostrando padronanza della lingua, capacità argomentativa e registro appropriato.",
      duration: "60 min",
      tasks: [
        {
          id: 1,
          type: "essay",
          title: "Saggio argomentativo",
          description: "Scrivi un saggio di 300-350 parole sul tema: 'L'automazione e l'intelligenza artificiale rappresentano una minaccia o un'opportunità per il mercato del lavoro?' Analizza diverse prospettive e presenta una conclusione argomentata.",
          fields: ["Introduzione con tesi", "Analisi delle opportunità", "Analisi dei rischi", "Sintesi e conclusione personale"]
        },
        {
          id: 2,
          type: "report",
          title: "Relazione formale",
          description: "Scrivi una relazione di 200-250 parole indirizzata al consiglio di amministrazione di un'azienda, proponendo l'implementazione di politiche di sostenibilità ambientale. Includi dati, benefici attesi e raccomandazioni.",
          example_structure: ["Intestazione", "Sommario esecutivo", "Analisi della situazione", "Proposte", "Conclusioni"]
        }
      ]
    })
  },
  // C1 - Speaking
  {
    languageId: 1,
    qcerLevelId: 5,
    skill: 'speaking',
    title: 'Produzione Orale C1 - Demo',
    description: 'Prova orale livello C1 con argomentazioni complesse',
    content: JSON.stringify({
      instructions: "Questa prova valuta la tua capacità di esprimerti in modo fluente e articolato su temi complessi.",
      duration: "20 min",
      parts: [
        {
          id: 1,
          title: "Presentazione strutturata",
          duration: "5-6 min",
          description: "Presenta un argomento a tua scelta tra i seguenti, strutturando il discorso con introduzione, sviluppo e conclusione.",
          sample_topics: ["L'impatto dei social media sulla democrazia", "Il ruolo dell'arte nella società contemporanea", "Etica e tecnologia: sfide del XXI secolo"]
        },
        {
          id: 2,
          title: "Analisi di un problema",
          duration: "5-6 min",
          description: "Analizza il seguente scenario e proponi soluzioni: 'Una città sta affrontando problemi di inquinamento, traffico e qualità della vita. Come affronteresti questi problemi in modo integrato?'",
          sample_prompts: ["Mobilità sostenibile", "Spazi verdi", "Politiche urbanistiche", "Coinvolgimento cittadini"]
        },
        {
          id: 3,
          title: "Dibattito con l'esaminatore",
          duration: "8-10 min",
          description: "Partecipa a un dibattito su temi controversi, difendendo una posizione assegnata e rispondendo alle obiezioni.",
          sample_situations: ["Difendi l'obbligo vaccinale", "Argomenta contro la globalizzazione economica", "Sostieni l'abolizione dei compiti a casa"]
        }
      ]
    })
  },
  // C2 - Listening
  {
    languageId: 1,
    qcerLevelId: 6,
    skill: 'listening',
    title: 'Comprensione Orale C2 - Demo',
    description: 'Prova di ascolto livello C2 con contenuti autentici e complessi',
    content: JSON.stringify({
      instructions: "Ascolta i brani audio autentici e rispondi alle domande. I testi includono varietà dialettali, registri formali e informali, ironia e sfumature culturali.",
      duration: "35 min",
      parts: [
        {
          id: 1,
          title: "Documentario culturale",
          questions: [
            { id: 1, type: "multiple_choice", question: "Qual è la tesi centrale del documentario?", options: ["La cultura italiana è in declino", "L'identità culturale si evolve costantemente", "La tradizione deve essere preservata immutata", "La globalizzazione distrugge le culture locali"], correct: 1 },
            { id: 2, type: "multiple_choice", question: "Quale esempio storico viene citato?", options: ["Il Rinascimento", "L'Unità d'Italia", "Il Fascismo", "Il boom economico"], correct: 3 },
            { id: 3, type: "multiple_choice", question: "Come viene descritta l'influenza americana?", options: ["Totalmente negativa", "Ambivalente e complessa", "Esclusivamente positiva", "Irrilevante"], correct: 1 },
            { id: 4, type: "multiple_choice", question: "Quale prospettiva emerge dalle interviste?", options: ["Nostalgia del passato", "Ottimismo per il futuro", "Visioni contrastanti", "Indifferenza generale"], correct: 2 },
            { id: 5, type: "multiple_choice", question: "Quale messaggio finale trasmette il documentario?", options: ["Resistere al cambiamento", "Abbracciare la diversità", "Isolarsi culturalmente", "Tornare alle origini"], correct: 1 }
          ]
        },
        {
          id: 2,
          title: "Conversazione spontanea",
          questions: [
            { id: 6, type: "multiple_choice", question: "Qual è il tono generale della conversazione?", options: ["Formale e distaccato", "Ironico e scherzoso", "Conflittuale", "Triste e malinconico"], correct: 1 },
            { id: 7, type: "multiple_choice", question: "Quale espressione idiomatica viene usata?", options: ["Acqua in bocca", "In bocca al lupo", "Prendere due piccioni con una fava", "Tutte le precedenti"], correct: 3 },
            { id: 8, type: "multiple_choice", question: "Quale sottinteso emerge dal dialogo?", options: ["Accordo totale", "Critica velata", "Ammirazione sincera", "Disinteresse"], correct: 1 },
            { id: 9, type: "multiple_choice", question: "Come si conclude la conversazione?", options: ["Con un litigio", "Con un accordo", "Con un malinteso", "Con una battuta"], correct: 3 },
            { id: 10, type: "multiple_choice", question: "Quale registro linguistico predomina?", options: ["Burocratico", "Colloquiale", "Letterario", "Tecnico"], correct: 1 }
          ]
        }
      ]
    })
  },
  // C2 - Reading
  {
    languageId: 1,
    qcerLevelId: 6,
    skill: 'reading',
    title: 'Comprensione Scritta C2 - Demo',
    description: 'Prova di lettura livello C2 con testi letterari e specialistici',
    content: JSON.stringify({
      instructions: "Leggi attentamente i testi e rispondi alle domande. La prova richiede comprensione di sfumature stilistiche, riferimenti culturali e strutture retoriche complesse.",
      duration: "50 min",
      passages: [
        {
          id: 1,
          title: "Estratto da un saggio filosofico contemporaneo",
          text: "La questione dell'identità nell'era digitale ci pone di fronte a un paradosso fondamentale: mai come oggi l'individuo ha avuto la possibilità di costruire e ricostruire la propria immagine pubblica, eppure mai come oggi questa immagine appare frammentata, contraddittoria, soggetta a forze che sfuggono al controllo del singolo. I social media, lungi dall'essere semplici strumenti neutrali di comunicazione, costituiscono veri e propri dispositivi di soggettivazione, nel senso foucaultiano del termine, che modellano non solo il modo in cui ci presentiamo agli altri, ma anche la percezione che abbiamo di noi stessi. L'algoritmo, questa entità invisibile ma onnipresente, seleziona, filtra, amplifica o silenzia le nostre espressioni secondo logiche che rimangono opache persino ai loro creatori. In questo scenario, la domanda 'chi sono io?' assume una complessità inedita, richiedendo una riflessione che attraversi i confini tradizionali tra filosofia, sociologia e scienze cognitive.",
          questions: [
            { id: 1, type: "multiple_choice", question: "Qual è il paradosso identificato dall'autore?", options: ["Più connessione, meno comunicazione", "Più libertà di costruzione identitaria, più frammentazione", "Più tecnologia, meno progresso", "Più informazione, meno conoscenza"], correct: 1 },
            { id: 2, type: "multiple_choice", question: "Cosa intende l'autore per 'dispositivi di soggettivazione'?", options: ["Strumenti tecnici", "Meccanismi che formano l'identità", "Apparecchi elettronici", "Metodi di controllo sociale"], correct: 1 },
            { id: 3, type: "multiple_choice", question: "Come viene descritto l'algoritmo?", options: ["Trasparente e controllabile", "Invisibile ma influente", "Irrilevante", "Puramente tecnico"], correct: 1 },
            { id: 4, type: "multiple_choice", question: "Quale approccio metodologico suggerisce l'autore?", options: ["Puramente filosofico", "Esclusivamente sociologico", "Interdisciplinare", "Tecnologico"], correct: 2 },
            { id: 5, type: "multiple_choice", question: "Qual è il riferimento teorico esplicito nel testo?", options: ["Marx", "Foucault", "Heidegger", "Derrida"], correct: 1 }
          ]
        }
      ]
    })
  },
  // C2 - Writing
  {
    languageId: 1,
    qcerLevelId: 6,
    skill: 'writing',
    title: 'Produzione Scritta C2 - Demo',
    description: 'Prova di scrittura livello C2 con testi sofisticati',
    content: JSON.stringify({
      instructions: "Svolgi i seguenti compiti dimostrando padronanza stilistica, precisione lessicale e capacità di adattare il registro al contesto.",
      duration: "75 min",
      tasks: [
        {
          id: 1,
          type: "essay",
          title: "Saggio critico",
          description: "Scrivi un saggio critico di 400-450 parole sul tema: 'La letteratura può ancora svolgere un ruolo trasformativo nella società contemporanea?' Fai riferimento a esempi concreti e sviluppa un'argomentazione originale.",
          fields: ["Premessa teorica", "Analisi di esempi", "Contro-argomentazioni", "Sintesi personale"]
        },
        {
          id: 2,
          type: "creative",
          title: "Riscrittura stilistica",
          description: "Riscrivi il seguente testo burocratico in uno stile letterario evocativo, mantenendo le informazioni essenziali: 'Si comunica che in data 15 marzo 2024 si terrà presso la sede centrale un incontro informativo riguardante le nuove disposizioni in materia di sicurezza sul lavoro. La partecipazione è obbligatoria per tutti i dipendenti.'",
          example: "Trasforma questo testo in una narrazione che evochi atmosfere, emozioni e dettagli sensoriali, pur comunicando le stesse informazioni."
        }
      ]
    })
  },
  // C2 - Speaking
  {
    languageId: 1,
    qcerLevelId: 6,
    skill: 'speaking',
    title: 'Produzione Orale C2 - Demo',
    description: 'Prova orale livello C2 con performance sofisticate',
    content: JSON.stringify({
      instructions: "Questa prova valuta la tua capacità di esprimerti con la stessa fluidità e precisione di un parlante nativo colto.",
      duration: "25 min",
      parts: [
        {
          id: 1,
          title: "Conferenza improvvisata",
          duration: "8-10 min",
          description: "Tieni una breve conferenza su uno dei seguenti temi, dimostrando capacità di strutturare un discorso articolato, usare un registro appropriato e coinvolgere l'uditorio.",
          sample_topics: ["L'eredità del Rinascimento italiano nella cultura mondiale", "Il rapporto tra memoria individuale e memoria collettiva", "L'etica della cura nell'era dell'automazione"]
        },
        {
          id: 2,
          title: "Analisi critica",
          duration: "7-8 min",
          description: "Analizza criticamente una citazione che ti verrà proposta, esplorandone le implicazioni filosofiche, storiche o culturali.",
          sample_prompts: ["'La tradizione è la democrazia dei morti' (G.K. Chesterton)", "'Il medium è il messaggio' (M. McLuhan)", "'L'inferno sono gli altri' (J.P. Sartre)"]
        },
        {
          id: 3,
          title: "Negoziazione complessa",
          duration: "8-10 min",
          description: "Partecipa a una simulazione di negoziazione su un tema controverso, dimostrando capacità di persuasione, gestione delle obiezioni e ricerca del compromesso.",
          sample_situations: ["Mediare tra posizioni opposte su una questione etica", "Convincere un interlocutore scettico", "Trovare una soluzione creativa a un conflitto apparentemente insanabile"]
        }
      ]
    })
  }
];

console.log('Inserting sample exams...');

for (const exam of sampleExams) {
  await connection.execute(
    `INSERT INTO sample_exams (languageId, qcerLevelId, skill, title, description, content, isActive, displayOrder) 
     VALUES (?, ?, ?, ?, ?, ?, 1, 0)`,
    [exam.languageId, exam.qcerLevelId, exam.skill, exam.title, exam.description, exam.content]
  );
  console.log(`Inserted: ${exam.title}`);
}

console.log('Done! Inserted', sampleExams.length, 'sample exams');

await connection.end();
