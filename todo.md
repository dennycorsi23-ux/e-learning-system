# CertificaLingua - TODO

## Infrastruttura
- [x] Schema database completo (25 tabelle)
- [x] Connessione database MySQL Railway
- [x] API backend tRPC complete
- [x] Frontend React responsive
- [x] Sistema routing
- [x] Test automatizzati (57 test passati)

## Sistema Autenticazione e Utenti
- [x] Sistema autenticazione sicuro multi-ruolo (studenti, esaminatori, admin)
- [x] Autenticazione email/password con bcrypt
- [x] Integrazione SPID (Service Provider configurato)
- [x] Gestione profili utente con dati anagrafici completi
- [x] Ruoli differenziati per accesso ai moduli
- [x] Registrazione limitata solo ad admin

## Pagine Pubbliche
- [x] Homepage istituzionale con hero section
- [x] Pagina Certificazioni (livelli QCER A1-C2)
- [x] Pagina Sessioni d'Esame
- [x] Pagina Sedi d'esame accreditate
- [x] Pagina Prezzi trasparente
- [x] Pagina FAQ
- [x] Pagina Contatti
- [x] Pagina Verifica Attestato
- [x] Pagina Esempi di Prove per ogni livello e abilità

## Dashboard Utente
- [x] Dashboard personale con overview
- [x] Sezione I Miei Corsi con progressi
- [x] Sezione I Miei Esami (prenotazioni, risultati)
- [x] Sezione Certificati ottenuti
- [x] Gestione Profilo con predisposizione SPID

## Pannello Amministrazione
- [x] Dashboard admin con statistiche
- [x] Gestione Utenti (CRUD, ruoli)
- [x] Gestione Corsi
- [x] Gestione Esami e Sessioni
- [x] Gestione Sedi accreditate
- [x] Gestione Certificati (emissione, revoca)
- [x] Banca Domande d'esame
- [x] Report e Statistiche
- [x] Impostazioni sito

## Dashboard Centro Esami
- [x] Pagina dashboard centro esami (/centro)
- [x] Panoramica capacità e dotazioni
- [x] Lista sessioni d'esame della sede
- [x] Monitoraggio esami in corso (tempo reale)
- [x] Tab Sessioni con gestione completa
- [x] Tab Monitoraggio con card candidati
- [x] Tab Report con statistiche per livello
- [ ] Reportistica avanzata per sede

## API Backend
- [x] API Lingue
- [x] API Livelli QCER
- [x] API Sedi d'esame
- [x] API Sessioni d'esame
- [x] API Iscrizioni esami
- [x] API Certificati (con generazione PDF)
- [x] API Corsi
- [x] API Prezzi
- [x] API FAQ
- [x] API Esempi prove
- [x] API Admin (utenti, stats, certificati)
- [x] API SPID (idpList, getAuthUrl, validateProfile)

## Sistema Esami 4 Abilità Linguistiche
- [x] Struttura esame con 4 abilità (ascolto, lettura, scrittura, parlato)
- [x] ExamRoom per sostenere esami
- [x] ExamInterface completo per tutte le abilità
- [x] Comprensione orale (ascolto) con audio player
- [x] Comprensione scritta (lettura) con testi
- [x] Produzione/interazione orale con registrazione audio
- [x] Produzione scritta con editor
- [x] Timer e gestione tempo esame
- [x] Navigazione domande con indicatore progresso
- [ ] Valutazione automatica secondo descrittori QCER

## Sistema Proctoring AI e Anti-Frode
- [x] ProctoringSystem componente completo
- [x] Riconoscimento facciale con TensorFlow.js
- [x] Face detection in tempo reale
- [x] Eye-tracking con landmarks facciali
- [x] Rilevamento tab switch e browser unfocus
- [x] Condivisione schermo obbligatoria
- [x] Screen recording sessione
- [x] Controllo audio ambiente
- [x] Log eventi sospetti (tabella proctoring_events)
- [x] Blocco scorciatoie tastiera (Ctrl+C, Alt+Tab, F12)
- [x] Alert automatici per anomalie (volto non rilevato, più volti)
- [x] Confronto biometrico documento/volto (struttura)
- [x] Salvataggio snapshot volto per audit

## Attestati Conformi DM 62/2022
- [x] Schema database certificati completo
- [x] Template attestato HTML con logo ente
- [x] Dati candidato completi su attestato
- [x] Livello QCER conseguito
- [x] Punteggi per singola abilità
- [x] Tabella conversione QCER sul retro
- [x] Codice univoco verifica
- [x] Generazione HTML attestato (per PDF client-side)
- [x] Verifica pubblica attestato (pagina + API)
- [x] CertificateViewer componente per anteprima e download
- [ ] Firma digitale PAdES

## Integrazione SPID
- [x] Configurazione SPID Service Provider
- [x] Generazione metadata SP
- [x] Implementazione flusso SAML 2.0
- [x] Pagina login SPID con selezione IdP (Poste, Aruba, InfoCert, ecc.)
- [x] API SPID complete
- [x] Validazione codice fiscale italiano
- [x] Estrazione dati da codice fiscale (data nascita, genere)
- [x] Script generazione certificati X.509
- [x] Documentazione registrazione AgID (docs/SPID-SETUP.md)
- [ ] Gestione callback SAML reale (richiede certificati CA)

## Gestione Sedi Accreditate
- [x] Anagrafica sedi in Italia
- [x] Assegnazione esami a sedi
- [x] Monitoraggio capacità logistiche
- [x] Dotazioni tecnologiche per esami a distanza
- [ ] Reportistica avanzata per sede

## Dati di Test (Database Railway)
- [x] Script seed database completo
- [x] 5 Lingue (Inglese, Francese, Tedesco, Spagnolo, Italiano)
- [x] 6 Livelli QCER (A1-C2)
- [x] 3 Sedi d'esame (Roma, Milano, Napoli)
- [x] 4 Utenti (admin, esaminatore, 2 studenti)
- [x] 8 Corsi
- [x] 4 Sessioni d'esame
- [x] 1 Esame completato con certificato (Mario Verdi - B1 Inglese)

## Export GitHub
- [x] Push codice su repository e-learning-system


## Fix Railway - OAuth Opzionale
- [x] Modificare server per rendere OAuth opzionale
- [x] Rimuovere errore OAUTH_SERVER_URL non configurato
- [x] Push correzioni su GitHub

## Funzionalità CRUD Admin (da implementare)
- [x] CRUD Sedi: form creazione nuova sede
- [x] CRUD Sedi: modifica sede esistente
- [x] CRUD Sedi: eliminazione sede
- [x] CRUD Corsi: form creazione nuovo corso
- [x] CRUD Corsi: modifica corso esistente
- [x] CRUD Corsi: eliminazione corso
- [x] CRUD Esami/Sessioni: form creazione nuova sessione
- [x] CRUD Esami/Sessioni: modifica sessione esistente
- [x] CRUD Utenti: form creazione nuovo utente
- [x] CRUD Utenti: modifica utente esistente

## Bug Fix Dashboard Admin (01/02/2026)
- [x] Creare tabella admin_menu nel database per gestione dinamica menu
- [x] Correggere sidebar: mostra "Page 1/Page 2" invece di Sedi, Corsi, Esami, Utenti
- [x] Correggere dashboard: mostra 0 Corsi Attivi, 0 Certificati, 0 Esaminatori invece dei dati reali
- [x] Creare pagina Gestione Menu per admin con CRUD e riordino

- [x] Popolare sample_exams con esempi per tutte le abilità (Ascolto, Lettura, Scrittura, Orale) per inglese A1-C2

## Contenuti Esempi Prove (01/02/2026)
- [x] Popolare sample_exams con contenuti reali (domande, testi) per inglese A1-C2
- [x] Implementare funzionalità Demo interattiva per ogni abilità
- [ ] Implementare download PDF con esempi di prova

## Contenuti Completi Esami B2, C1, C2 (01/02/2026)
- [x] 30 domande Listening B2 con trascrizioni audio realistiche
- [x] 30 domande Listening C1 con trascrizioni audio realistiche
- [x] 30 domande Listening C2 con trascrizioni audio realistiche
- [x] 30 domande Reading B2 con testi e passaggi
- [x] 30 domande Reading C1 con testi e passaggi
- [x] 30 domande Reading C2 con testi e passaggi
- [x] Compiti Writing B2 con testi da scrivere
- [x] Compiti Writing C1 con testi da scrivere
- [x] Compiti Writing C2 con testi da scrivere
