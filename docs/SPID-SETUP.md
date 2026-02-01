# Guida alla Configurazione SPID per CertificaLingua

Questa guida descrive i passaggi necessari per configurare l'autenticazione SPID nella piattaforma CertificaLingua e ottenere l'accreditamento presso AgID.

## Indice

1. [Panoramica SPID](#panoramica-spid)
2. [Requisiti Tecnici](#requisiti-tecnici)
3. [Generazione Certificati](#generazione-certificati)
4. [Configurazione Service Provider](#configurazione-service-provider)
5. [Registrazione presso AgID](#registrazione-presso-agid)
6. [Test con Ambiente di Validazione](#test-con-ambiente-di-validazione)
7. [Passaggio in Produzione](#passaggio-in-produzione)

## Panoramica SPID

SPID (Sistema Pubblico di Identità Digitale) è il sistema di autenticazione che permette ai cittadini italiani di accedere ai servizi online della Pubblica Amministrazione e dei privati aderenti con un'identità digitale unica.

### Livelli di Autenticazione SPID

| Livello | Descrizione | Uso Consigliato |
|---------|-------------|-----------------|
| **SpidL1** | Username e password | Accesso informativo |
| **SpidL2** | Username, password + OTP | Transazioni standard |
| **SpidL3** | Smart card o dispositivo sicuro | Transazioni sensibili |

Per CertificaLingua, si consiglia **SpidL2** per la verifica identità pre-esame.

## Requisiti Tecnici

### Software Necessario

- OpenSSL (per generazione certificati)
- Node.js 22+
- Server HTTPS con certificato SSL valido

### Attributi SPID Richiesti

La piattaforma richiede i seguenti attributi SPID:

| Attributo | Nome SAML | Obbligatorio |
|-----------|-----------|--------------|
| Codice Fiscale | `fiscalNumber` | Sì |
| Nome | `name` | Sì |
| Cognome | `familyName` | Sì |
| Data di Nascita | `dateOfBirth` | Sì |
| Luogo di Nascita | `placeOfBirth` | Sì |
| Email | `email` | No |
| Codice SPID | `spidCode` | Sì |

## Generazione Certificati

### Ambiente di Test (Self-Signed)

Per l'ambiente di sviluppo e test, eseguire lo script incluso:

```bash
cd /path/to/certifica-lingua
chmod +x scripts/generate-spid-certs.sh
./scripts/generate-spid-certs.sh
```

Questo genera:
- `certs/spid/sp-key.pem` - Chiave privata RSA 2048-bit
- `certs/spid/sp-cert.pem` - Certificato X.509 self-signed
- `certs/spid/sp-csr.pem` - Certificate Signing Request
- `certs/spid/spid-config.env` - File di configurazione

### Ambiente di Produzione

Per la produzione, è necessario un certificato rilasciato da una CA accreditata:

1. **Acquistare un certificato** da una CA accreditata AgID:
   - Actalis
   - Aruba PEC
   - InfoCert
   - Namirial
   - Poste Italiane

2. **Requisiti del certificato**:
   - Tipo: Certificato di firma per Service Provider SPID
   - Algoritmo: RSA 2048-bit o superiore
   - Validità: Minimo 1 anno

## Configurazione Service Provider

### Variabili d'Ambiente

Configurare le seguenti variabili nel file `.env`:

```env
# Percorsi certificati
SPID_SP_CERT_PATH=./certs/spid/sp-cert.pem
SPID_SP_KEY_PATH=./certs/spid/sp-key.pem

# Entity ID (URL univoco del Service Provider)
SPID_SP_ENTITY_ID=https://certificalingua.it

# URL callback per risposta SAML
SPID_SP_ASSERTION_CONSUMER_SERVICE=https://certificalingua.it/api/spid/callback

# URL per Single Logout
SPID_SP_SINGLE_LOGOUT_SERVICE=https://certificalingua.it/api/spid/logout

# Dati organizzazione
SPID_SP_ORGANIZATION_NAME=CertificaLingua S.r.l.
SPID_SP_ORGANIZATION_DISPLAY_NAME=CertificaLingua
SPID_SP_ORGANIZATION_URL=https://certificalingua.it
SPID_SP_CONTACT_EMAIL=spid@certificalingua.it
```

### Endpoint Metadata

Il metadata XML del Service Provider è disponibile all'endpoint:

```
GET /api/spid/metadata
```

Questo endpoint restituisce il metadata XML conforme alle specifiche SPID.

## Registrazione presso AgID

### Procedura di Accreditamento

1. **Registrazione su SPID.gov.it**
   - Accedere a https://registry.spid.gov.it
   - Creare un account per il Service Provider

2. **Caricamento Metadata**
   - Caricare il file metadata XML generato dall'endpoint `/api/spid/metadata`
   - Verificare la conformità con il validatore AgID

3. **Documentazione Richiesta**
   - Visura camerale dell'ente
   - Documento d'identità del legale rappresentante
   - Convenzione firmata con AgID

4. **Test di Conformità**
   - Eseguire i test con l'ambiente di validazione SPID
   - Correggere eventuali non conformità segnalate

5. **Approvazione e Pubblicazione**
   - Attendere l'approvazione da parte di AgID
   - Il Service Provider viene pubblicato nel registro SPID

### Tempistiche

| Fase | Durata Stimata |
|------|----------------|
| Preparazione documentazione | 1-2 settimane |
| Registrazione e caricamento | 1 giorno |
| Test di conformità | 1-2 settimane |
| Revisione AgID | 2-4 settimane |
| **Totale** | **4-8 settimane** |

## Test con Ambiente di Validazione

### SPID Validator

AgID fornisce un ambiente di validazione per testare l'integrazione:

1. **Accedere al validatore**: https://validator.spid.gov.it
2. **Configurare il Service Provider** con i dati di test
3. **Eseguire i test** automatici e manuali
4. **Correggere** eventuali errori segnalati

### Identity Provider di Test

Per i test, utilizzare l'IdP demo di SPID:

```
Entity ID: https://demo.spid.gov.it
SSO URL: https://demo.spid.gov.it/samlsso
```

## Passaggio in Produzione

### Checklist Pre-Produzione

- [ ] Certificato X.509 da CA accreditata
- [ ] Server HTTPS con certificato SSL valido
- [ ] Metadata XML validato da AgID
- [ ] Test superati con SPID Validator
- [ ] Approvazione ricevuta da AgID
- [ ] Backup dei certificati in luogo sicuro
- [ ] Procedura di rinnovo certificati documentata

### Monitoraggio

Una volta in produzione, monitorare:

- Log delle autenticazioni SPID
- Scadenza certificati (impostare alert 30 giorni prima)
- Aggiornamenti delle specifiche tecniche AgID

## Supporto

Per assistenza tecnica:

- **Documentazione AgID**: https://www.agid.gov.it/it/piattaforme/spid
- **Specifiche Tecniche**: https://docs.italia.it/italia/spid/spid-regole-tecniche
- **Supporto AgID**: spid.tech@agid.gov.it

## Riferimenti

- [Regole Tecniche SPID](https://docs.italia.it/italia/spid/spid-regole-tecniche)
- [Avvisi SPID](https://www.agid.gov.it/it/piattaforme/spid/avvisi-spid)
- [Registro SPID](https://registry.spid.gov.it)
- [SAML 2.0 Specification](https://docs.oasis-open.org/security/saml/v2.0/)
