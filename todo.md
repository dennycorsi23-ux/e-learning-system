# CertificaLingua - TODO

## Infrastruttura
- [x] Schema database completo (25 tabelle)
- [x] Connessione database MySQL Railway
- [x] API backend tRPC complete
- [x] Frontend React responsive
- [x] Sistema routing
- [x] Test automatizzati (30 test passati)

## Sistema Autenticazione e Utenti
- [x] Sistema autenticazione sicuro multi-ruolo (studenti, esaminatori, admin)
- [ ] Identificazione tramite SPID per verifica identità certificata
- [x] Gestione profili utente con dati anagrafici completi
- [x] Ruoli differenziati per accesso ai moduli
- [ ] Registrazione limitata solo ad admin

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

## Gestione Corsi QCER
- [x] Corsi per tutti i 6 livelli QCER (A1, A2, B1, B2, C1, C2)
- [x] Gestione materiali didattici per corso
- [ ] Tracciamento progressi studenti (UI)
- [x] Calendario sessioni d'esame
- [x] Iscrizione studenti ai corsi

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
- [x] Riconoscimento facciale (base con skin detection)
- [x] Verifica identità (struttura)
- [x] Eye-tracking (struttura)
- [x] Rilevamento tab switch e browser unfocus
- [x] Condivisione schermo obbligatoria
- [x] Screen recording sessione
- [x] Controllo audio ambiente
- [x] Log eventi sospetti (tabella proctoring_events)
- [x] Blocco scorciatoie tastiera (Ctrl+C, Alt+Tab, F12)
- [ ] Riconoscimento facciale avanzato con TensorFlow.js
- [ ] Verifica identità biometrica documento/volto

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
- [ ] Firma digitale

## Gestione Sedi Accreditate
- [x] Anagrafica sedi in Italia
- [x] Assegnazione esami a sedi
- [x] Monitoraggio capacità logistiche
- [x] Dotazioni tecnologiche per esami a distanza
- [ ] Reportistica per sede

## Reportistica e Analytics
- [x] Schema audit_log per tracciamento
- [ ] Log azioni utenti in tempo reale (UI)
- [ ] Monitoraggio presenze esami
- [ ] Esportazione report crediti formativi
- [x] Dashboard analytics admin (base)
- [ ] Tracciamento compliance normativa
- [ ] Report per Ministero (generazione)

