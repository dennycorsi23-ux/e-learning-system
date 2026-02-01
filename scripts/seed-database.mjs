/**
 * Script per popolare il database con dati di test
 * Eseguire con: node scripts/seed-database.mjs
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.RAILWAY_DATABASE_URL || process.env.DATABASE_URL;

async function seed() {
  console.log('🌱 Inizializzazione seed database...');
  
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    // 1. LINGUE
    console.log('📚 Inserimento lingue...');
    await connection.execute(`
      INSERT INTO languages (code, name, nativeName, isActive) VALUES
      ('en', 'Inglese', 'English', true),
      ('fr', 'Francese', 'Français', true),
      ('de', 'Tedesco', 'Deutsch', true),
      ('es', 'Spagnolo', 'Español', true),
      ('it', 'Italiano', 'Italiano', true)
      ON DUPLICATE KEY UPDATE name=VALUES(name)
    `);

    // 2. LIVELLI QCER
    console.log('📊 Inserimento livelli QCER...');
    await connection.execute(`
      INSERT INTO qcer_levels (code, name, description, displayOrder) VALUES
      ('A1', 'Livello Base - Contatto', 'Comprende e usa espressioni di uso quotidiano e frasi basilari.', 1),
      ('A2', 'Livello Base - Sopravvivenza', 'Comprende frasi ed espressioni usate frequentemente.', 2),
      ('B1', 'Livello Autonomo - Soglia', 'Comprende i punti chiave di argomenti familiari.', 3),
      ('B2', 'Livello Autonomo - Progresso', 'Comprende le idee principali di testi complessi.', 4),
      ('C1', 'Livello Padronanza - Efficacia', 'Comprende una ampia gamma di testi complessi.', 5),
      ('C2', 'Livello Padronanza - Maestria', 'Comprende con facilita praticamente tutto.', 6)
      ON DUPLICATE KEY UPDATE name=VALUES(name)
    `);

    // 3. SEDI ESAME
    console.log('🏢 Inserimento sedi esame...');
    await connection.execute(`
      INSERT INTO exam_centers (code, name, address, city, province, region, postalCode, phone, email, maxCapacity, isActive, supportsRemoteExams, notes) VALUES
      ('ROMA01', 'Centro Esami Roma Termini', 'Via Marsala 95', 'Roma', 'RM', 'Lazio', '00185', '+39 06 1234567', 'roma@certificalingua.it', 50, true, true, 'Postazioni PC con webcam HD'),
      ('MILA01', 'Centro Esami Milano Centrale', 'Piazza Duca Aosta 12', 'Milano', 'MI', 'Lombardia', '20124', '+39 02 9876543', 'milano@certificalingua.it', 40, true, true, 'Aula informatica 40 postazioni'),
      ('NAPO01', 'Centro Esami Napoli Centro', 'Via Toledo 156', 'Napoli', 'NA', 'Campania', '80132', '+39 081 5551234', 'napoli@certificalingua.it', 30, true, true, 'Laboratorio linguistico')
      ON DUPLICATE KEY UPDATE name=VALUES(name)
    `);

    // 4. UTENTI
    console.log('👥 Inserimento utenti...');
    await connection.execute(`
      INSERT INTO users (openId, name, email, role, fiscalCode, birthDate, birthPlace, phone, address, city, province, postalCode, spidVerified) VALUES
      ('admin-owner-001', 'Amministratore Sistema', 'admin@certificalingua.it', 'admin', 'DMNSST80A01H501Z', '1980-01-01', 'Roma', '+39 333 1234567', 'Via Roma 1', 'Roma', 'RM', '00100', true),
      ('examiner-001', 'Prof. Marco Rossi', 'marco.rossi@certificalingua.it', 'examiner', 'RSSMRC75B15F205X', '1975-02-15', 'Milano', '+39 333 2345678', 'Via Milano 25', 'Milano', 'MI', '20100', true),
      ('student-001', 'Mario Verdi', 'mario.verdi@email.com', 'student', 'VRDMRA95D20F205Z', '1995-04-20', 'Napoli', '+39 333 4567890', 'Via Napoli 50', 'Napoli', 'NA', '80100', true),
      ('student-002', 'Giulia Neri', 'giulia.neri@email.com', 'student', 'NREGLI98E25H501W', '1998-05-25', 'Roma', '+39 333 5678901', 'Via Tuscolana 200', 'Roma', 'RM', '00100', true)
      ON DUPLICATE KEY UPDATE name=VALUES(name)
    `);

    // 5. ESAMINATORI
    console.log('👨‍🏫 Inserimento esaminatori...');
    const [users] = await connection.execute(`SELECT id FROM users WHERE role = 'examiner'`);
    for (const user of users) {
      await connection.execute(`
        INSERT INTO examiners (userId, specializations, isActive, canGradeWriting, canGradeSpeaking) VALUES
        (?, '["en", "fr"]', true, true, true)
        ON DUPLICATE KEY UPDATE isActive=true
      `, [user.id]);
    }

    // 6. CORSI
    console.log('📖 Inserimento corsi...');
    await connection.execute(`
      INSERT INTO courses (languageId, qcerLevelId, title, description, duration, price, isActive) VALUES
      (1, 1, 'Inglese A1 - Principianti', 'Corso di inglese per principianti assoluti.', 40, 299.00, true),
      (1, 2, 'Inglese A2 - Elementare', 'Corso di inglese elementare.', 50, 349.00, true),
      (1, 3, 'Inglese B1 - Intermedio', 'Corso di inglese intermedio.', 60, 449.00, true),
      (1, 4, 'Inglese B2 - Intermedio Superiore', 'Corso di inglese intermedio superiore.', 70, 549.00, true),
      (1, 5, 'Inglese C1 - Avanzato', 'Corso di inglese avanzato.', 80, 699.00, true),
      (1, 6, 'Inglese C2 - Maestria', 'Corso di inglese per la massima competenza.', 100, 899.00, true),
      (2, 1, 'Francese A1 - Debutant', 'Corso di francese per principianti.', 40, 299.00, true),
      (2, 2, 'Francese A2 - Elementaire', 'Corso di francese elementare.', 50, 349.00, true)
      ON DUPLICATE KEY UPDATE title=VALUES(title)
    `);

    // 7. SESSIONI ESAME
    console.log('📅 Inserimento sessioni esame...');
    await connection.execute(`
      INSERT INTO exam_sessions (languageId, qcerLevelId, examCenterId, title, examDate, startTime, endTime, maxParticipants, currentParticipants, status, isRemote, price) VALUES
      (1, 3, 1, 'Sessione Inglese B1 - Febbraio 2026', '2026-02-15 09:00:00', '09:00', '13:00', 20, 15, 'scheduled', false, 150.00),
      (1, 3, 1, 'Sessione Inglese B1 Online - Febbraio 2026', '2026-02-15 14:00:00', '14:00', '18:00', 20, 12, 'scheduled', true, 150.00),
      (1, 4, 2, 'Sessione Inglese B2 - Febbraio 2026', '2026-02-20 09:00:00', '09:00', '13:00', 15, 10, 'scheduled', false, 180.00),
      (1, 3, 1, 'Sessione Inglese B1 - Gennaio 2026 (Completata)', '2026-01-20 09:00:00', '09:00', '13:00', 20, 20, 'completed', false, 150.00)
      ON DUPLICATE KEY UPDATE status=VALUES(status)
    `);

    // 8. ISCRIZIONI ESAMI
    console.log('📝 Inserimento iscrizioni esami...');
    const [students] = await connection.execute(`SELECT id FROM users WHERE openId = 'student-001'`);
    const studentId = students[0]?.id;
    
    if (studentId) {
      await connection.execute(`
        INSERT INTO exam_registrations (userId, examSessionId, status, paymentStatus) VALUES
        (?, 4, 'completed', 'paid'),
        (?, 1, 'confirmed', 'paid')
        ON DUPLICATE KEY UPDATE status=VALUES(status)
      `, [studentId, studentId]);
    }

    // 9. ESAME COMPLETATO
    console.log('✅ Inserimento esame completato...');
    if (studentId) {
      await connection.execute(`
        INSERT INTO exams (registrationId, userId, examSessionId, status, startedAt, completedAt, 
          listeningScore, readingScore, writingScore, speakingScore, totalScore, passed, examinerNotes) VALUES
        (1, ?, 4, 'completed', '2026-01-20 09:00:00', '2026-01-20 12:30:00',
          85, 88, 82, 90, 86, true, 'Candidato preparato, competenze solide per il livello B1.')
        ON DUPLICATE KEY UPDATE status=VALUES(status)
      `, [studentId]);
    }

    // 10. CERTIFICATO
    console.log('🎓 Inserimento certificato...');
    if (studentId) {
      const certNum = 'CERT-2026-EN-B1-' + String(Math.floor(Math.random() * 100000)).padStart(5, '0');
      const verCode = 'VER-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      await connection.execute(`
        INSERT INTO certificates (examId, userId, certificateNumber, verificationCode, languageId, qcerLevelId, 
          listeningScore, readingScore, writingScore, speakingScore, totalScore, examDate, examCenterName, status) VALUES
        (1, ?, ?, ?, 1, 3, 85, 88, 82, 90, 86, '2026-01-20 09:00:00', 'Centro Esami Roma Termini', 'active')
        ON DUPLICATE KEY UPDATE status=VALUES(status)
      `, [studentId, certNum, verCode]);
    }

    // 11. DOMANDE ESAME
    console.log('❓ Inserimento domande esame...');
    await connection.execute(`
      INSERT INTO exam_questions (languageId, qcerLevelId, skill, questionType, questionText, options, correctAnswer, points, isActive) VALUES
      (1, 3, 'listening', 'multiple_choice', 'What is the woman planning to do this weekend?', '["Go shopping", "Visit her parents", "Stay at home", "Travel abroad"]', 'Visit her parents', 1, true),
      (1, 3, 'listening', 'multiple_choice', 'What time does the train to London depart?', '["10:15", "10:30", "10:45", "11:00"]', '10:30', 1, true),
      (1, 3, 'reading', 'multiple_choice', 'What is the main purpose of the article?', '["To advertise", "To inform about climate change", "To describe a holiday", "To review"]', 'To inform about climate change', 1, true),
      (1, 3, 'writing', 'essay', 'Write an email to a friend describing your last holiday. (120-150 words)', NULL, NULL, 10, true),
      (1, 3, 'speaking', 'oral_response', 'Describe a memorable trip you have taken.', NULL, NULL, 10, true)
      ON DUPLICATE KEY UPDATE questionText=VALUES(questionText)
    `);

    // 12. PREZZI
    console.log('💰 Inserimento prezzi...');
    await connection.execute(`
      INSERT INTO pricing (languageId, qcerLevelId, examType, price, description, isActive) VALUES
      (1, 1, 'standard', 120.00, 'Esame standard Inglese A1', true),
      (1, 2, 'standard', 130.00, 'Esame standard Inglese A2', true),
      (1, 3, 'standard', 150.00, 'Esame standard Inglese B1', true),
      (1, 4, 'standard', 180.00, 'Esame standard Inglese B2', true),
      (1, 5, 'standard', 220.00, 'Esame standard Inglese C1', true),
      (1, 6, 'standard', 280.00, 'Esame standard Inglese C2', true),
      (NULL, NULL, 'remote', 20.00, 'Supplemento esame da remoto', true)
      ON DUPLICATE KEY UPDATE price=VALUES(price)
    `);

    // 13. FAQ
    console.log('❔ Inserimento FAQ...');
    await connection.execute(`
      INSERT INTO faqs (question, answer, category, displayOrder, isPublished) VALUES
      ('Come posso iscrivermi a un esame?', 'Per iscriverti a un esame devi creare un account, verificare la tua identita tramite SPID, e selezionare la sessione desiderata.', 'iscrizione', 1, true),
      ('Quali documenti devo portare il giorno dell esame?', 'Devi presentarti con un documento di identita valido e il codice fiscale.', 'esame', 2, true),
      ('Come funziona l esame da remoto?', 'L esame da remoto si svolge tramite la nostra piattaforma con sistema di proctoring AI.', 'esame', 3, true),
      ('Quanto tempo ci vuole per ricevere il certificato?', 'I risultati sono disponibili entro 15 giorni lavorativi.', 'certificato', 4, true),
      ('Il certificato ha una scadenza?', 'I certificati hanno validita di 5 anni dalla data di emissione.', 'certificato', 5, true),
      ('Le certificazioni sono riconosciute dal MIM?', 'Si, le nostre certificazioni sono conformi al DM 62/2022 e riconosciute dal Ministero.', 'certificato', 6, true)
      ON DUPLICATE KEY UPDATE answer=VALUES(answer)
    `);

    // 14. ESEMPI PROVE
    console.log('📄 Inserimento esempi prove...');
    await connection.execute(`
      INSERT INTO sample_exams (languageId, qcerLevelId, skill, title, description, content, isActive) VALUES
      (1, 3, 'listening', 'Esempio Ascolto B1', 'Prova di comprensione orale livello B1', '{"instructions": "Ascolterai 3 conversazioni.", "questions": 10}', true),
      (1, 3, 'reading', 'Esempio Lettura B1', 'Prova di comprensione scritta livello B1', '{"instructions": "Leggi i seguenti testi.", "questions": 15}', true),
      (1, 3, 'writing', 'Esempio Scrittura B1', 'Prova di produzione scritta livello B1', '{"instructions": "Scrivi un testo di 120-150 parole.", "tasks": 2}', true),
      (1, 3, 'speaking', 'Esempio Orale B1', 'Prova di produzione orale livello B1', '{"instructions": "La prova orale si svolge in 3 parti.", "parts": 3}', true)
      ON DUPLICATE KEY UPDATE title=VALUES(title)
    `);

    // 15. IMPOSTAZIONI SITO
    console.log('⚙️ Inserimento impostazioni sito...');
    await connection.execute(`
      INSERT INTO site_settings (settingKey, settingValue, settingType, category, description) VALUES
      ('site_name', 'CertificaLingua', 'text', 'general', 'Nome del sito'),
      ('site_description', 'Piattaforma di Certificazione Linguistica QCER', 'text', 'general', 'Descrizione del sito'),
      ('contact_email', 'info@certificalingua.it', 'text', 'contact', 'Email di contatto'),
      ('contact_phone', '+39 06 1234567', 'text', 'contact', 'Telefono di contatto'),
      ('address', 'Via Roma 100, 00100 Roma (RM)', 'text', 'contact', 'Indirizzo sede legale'),
      ('registration_enabled', 'false', 'boolean', 'auth', 'Abilita registrazione pubblica'),
      ('spid_required', 'true', 'boolean', 'auth', 'Richiedi verifica SPID'),
      ('proctoring_enabled', 'true', 'boolean', 'exam', 'Abilita sistema proctoring'),
      ('certificate_validity_years', '5', 'number', 'certificate', 'Anni validita certificati')
      ON DUPLICATE KEY UPDATE settingValue=VALUES(settingValue)
    `);

    // 16. LOG AUDIT
    console.log('📋 Inserimento log audit...');
    if (studentId) {
      await connection.execute(`
        INSERT INTO audit_log (userId, action, entityType, entityId, ipAddress, userAgent) VALUES
        (?, 'login', 'user', ?, '192.168.1.100', 'Mozilla/5.0'),
        (?, 'exam_registration', 'exam_registration', 1, '192.168.1.100', 'Mozilla/5.0'),
        (?, 'exam_complete', 'exam', 1, '192.168.1.100', 'Mozilla/5.0'),
        (?, 'certificate_issued', 'certificate', 1, '192.168.1.100', 'Mozilla/5.0')
      `, [studentId, studentId, studentId, studentId, studentId]);
    }

    console.log('');
    console.log('✅ Seed completato con successo!');
    console.log('');
    console.log('📊 Riepilogo dati inseriti:');
    console.log('   - 5 Lingue');
    console.log('   - 6 Livelli QCER');
    console.log('   - 3 Sedi esame');
    console.log('   - 4 Utenti (1 admin, 1 esaminatore, 2 studenti)');
    console.log('   - 8 Corsi');
    console.log('   - 4 Sessioni esame');
    console.log('   - 5 Domande esame');
    console.log('   - 7 Prezzi');
    console.log('   - 6 FAQ');
    console.log('   - 4 Esempi di prove');
    console.log('   - 1 Esame completato con certificato');
    console.log('');
    console.log('🔑 Utenti di test:');
    console.log('   Admin: admin@certificalingua.it');
    console.log('   Studente con certificato: mario.verdi@email.com');
    
  } catch (error) {
    console.error('❌ Errore durante il seed:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

seed().catch(console.error);
