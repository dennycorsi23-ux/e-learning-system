#!/bin/bash
# Script per generare i certificati X.509 per SPID Service Provider
# Questi certificati sono necessari per la registrazione presso AgID

# Configurazione
CERT_DIR="./certs/spid"
DAYS_VALID=365
KEY_SIZE=2048

# Dati del Service Provider (da personalizzare)
COUNTRY="IT"
STATE="Italia"
LOCALITY="Roma"
ORGANIZATION="CertificaLingua S.r.l."
ORGANIZATIONAL_UNIT="IT Department"
COMMON_NAME="certificalingua.it"
EMAIL="spid@certificalingua.it"

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Generazione Certificati SPID X.509   ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Crea directory se non esiste
mkdir -p "$CERT_DIR"

# Genera chiave privata RSA
echo -e "${YELLOW}[1/4] Generazione chiave privata RSA...${NC}"
openssl genrsa -out "$CERT_DIR/sp-key.pem" $KEY_SIZE 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Chiave privata generata: $CERT_DIR/sp-key.pem${NC}"
else
    echo -e "${RED}✗ Errore nella generazione della chiave privata${NC}"
    exit 1
fi

# Genera Certificate Signing Request (CSR)
echo -e "${YELLOW}[2/4] Generazione CSR...${NC}"
openssl req -new \
    -key "$CERT_DIR/sp-key.pem" \
    -out "$CERT_DIR/sp-csr.pem" \
    -subj "/C=$COUNTRY/ST=$STATE/L=$LOCALITY/O=$ORGANIZATION/OU=$ORGANIZATIONAL_UNIT/CN=$COMMON_NAME/emailAddress=$EMAIL"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ CSR generato: $CERT_DIR/sp-csr.pem${NC}"
else
    echo -e "${RED}✗ Errore nella generazione del CSR${NC}"
    exit 1
fi

# Genera certificato self-signed (per ambiente di test)
echo -e "${YELLOW}[3/4] Generazione certificato self-signed...${NC}"
openssl x509 -req \
    -days $DAYS_VALID \
    -in "$CERT_DIR/sp-csr.pem" \
    -signkey "$CERT_DIR/sp-key.pem" \
    -out "$CERT_DIR/sp-cert.pem" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Certificato generato: $CERT_DIR/sp-cert.pem${NC}"
else
    echo -e "${RED}✗ Errore nella generazione del certificato${NC}"
    exit 1
fi

# Genera file .env con i percorsi dei certificati
echo -e "${YELLOW}[4/4] Creazione file configurazione...${NC}"
cat > "$CERT_DIR/spid-config.env" << EOF
# Configurazione SPID Service Provider
# Generato il: $(date)

# Percorsi certificati
SPID_SP_CERT_PATH=$CERT_DIR/sp-cert.pem
SPID_SP_KEY_PATH=$CERT_DIR/sp-key.pem

# Dati Service Provider
SPID_SP_ENTITY_ID=https://$COMMON_NAME
SPID_SP_ASSERTION_CONSUMER_SERVICE=https://$COMMON_NAME/api/spid/callback
SPID_SP_SINGLE_LOGOUT_SERVICE=https://$COMMON_NAME/api/spid/logout
SPID_SP_ORGANIZATION_NAME=$ORGANIZATION
SPID_SP_ORGANIZATION_DISPLAY_NAME=CertificaLingua
SPID_SP_ORGANIZATION_URL=https://$COMMON_NAME
SPID_SP_CONTACT_EMAIL=$EMAIL
EOF

echo -e "${GREEN}✓ File configurazione: $CERT_DIR/spid-config.env${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Certificati generati con successo!   ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "File generati:"
echo -e "  - Chiave privata: ${YELLOW}$CERT_DIR/sp-key.pem${NC}"
echo -e "  - CSR:            ${YELLOW}$CERT_DIR/sp-csr.pem${NC}"
echo -e "  - Certificato:    ${YELLOW}$CERT_DIR/sp-cert.pem${NC}"
echo -e "  - Configurazione: ${YELLOW}$CERT_DIR/spid-config.env${NC}"
echo ""
echo -e "${YELLOW}NOTA IMPORTANTE:${NC}"
echo -e "Questi certificati sono self-signed e validi solo per test."
echo -e "Per la produzione, è necessario:"
echo -e "  1. Acquistare un certificato da una CA accreditata AgID"
echo -e "  2. Registrare il Service Provider presso AgID"
echo -e "  3. Completare la procedura di accreditamento SPID"
echo ""
echo -e "Documentazione: https://www.agid.gov.it/it/piattaforme/spid"
