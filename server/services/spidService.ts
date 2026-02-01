/**
 * SPID (Sistema Pubblico di Identità Digitale) Service
 * 
 * Questo servizio gestisce l'autenticazione SPID per la piattaforma CertificaLingua.
 * SPID è obbligatorio per la verifica dell'identità dei candidati secondo il DM 62/2022.
 * 
 * Requisiti per l'accreditamento SPID:
 * 1. Certificato digitale valido
 * 2. Metadata XML del Service Provider
 * 3. Registrazione presso AgID
 */

// Tipi per i dati SPID
export interface SpidUserProfile {
  spidCode: string;           // Codice identificativo SPID
  fiscalNumber: string;       // Codice Fiscale
  name: string;               // Nome
  familyName: string;         // Cognome
  email?: string;             // Email (opzionale)
  dateOfBirth?: string;       // Data di nascita (YYYY-MM-DD)
  placeOfBirth?: string;      // Luogo di nascita
  gender?: 'M' | 'F';         // Sesso
  idCard?: string;            // Documento di identità
  mobilePhone?: string;       // Telefono cellulare
  address?: string;           // Indirizzo
  digitalAddress?: string;    // Domicilio digitale (PEC)
}

export interface SpidConfig {
  entityId: string;           // ID del Service Provider
  assertionConsumerServiceUrl: string;
  singleLogoutServiceUrl: string;
  privateKey: string;
  certificate: string;
  attributeConsumingServiceIndex: number;
  authnContext: 1 | 2 | 3;    // Livello SPID (1, 2, o 3)
  organization: {
    name: string;
    displayName: string;
    url: string;
  };
  contactPerson: {
    company: string;
    emailAddress: string;
    telephoneNumber?: string;
  };
}

// Lista degli Identity Provider SPID ufficiali
export const SPID_IDP_LIST = [
  {
    id: 'aruba',
    name: 'Aruba ID',
    entityId: 'https://loginspid.aruba.it',
    ssoUrl: 'https://loginspid.aruba.it/ServiceLoginWelcome',
    logoUrl: '/images/spid/aruba.svg',
  },
  {
    id: 'infocert',
    name: 'InfoCert ID',
    entityId: 'https://identity.infocert.it',
    ssoUrl: 'https://identity.infocert.it/spid/samlsso',
    logoUrl: '/images/spid/infocert.svg',
  },
  {
    id: 'intesa',
    name: 'Intesa ID',
    entityId: 'https://spid.intesa.it',
    ssoUrl: 'https://spid.intesa.it/Time4UserServices/services/idp/AuthnRequest',
    logoUrl: '/images/spid/intesa.svg',
  },
  {
    id: 'lepida',
    name: 'Lepida ID',
    entityId: 'https://id.lepida.it/idp/shibboleth',
    ssoUrl: 'https://id.lepida.it/idp/profile/SAML2/POST/SSO',
    logoUrl: '/images/spid/lepida.svg',
  },
  {
    id: 'namirial',
    name: 'Namirial ID',
    entityId: 'https://idp.namirialtsp.com/idp',
    ssoUrl: 'https://idp.namirialtsp.com/idp/profile/SAML2/POST/SSO',
    logoUrl: '/images/spid/namirial.svg',
  },
  {
    id: 'poste',
    name: 'Poste ID',
    entityId: 'https://posteid.poste.it',
    ssoUrl: 'https://posteid.poste.it/jod-fs/ssoservicepost',
    logoUrl: '/images/spid/poste.svg',
  },
  {
    id: 'sielte',
    name: 'Sielte ID',
    entityId: 'https://identity.sieltecloud.it',
    ssoUrl: 'https://identity.sieltecloud.it/simplesaml/saml2/idp/SSOService.php',
    logoUrl: '/images/spid/sielte.svg',
  },
  {
    id: 'register',
    name: 'SpidItalia (Register)',
    entityId: 'https://spid.register.it',
    ssoUrl: 'https://spid.register.it/login/sso',
    logoUrl: '/images/spid/register.svg',
  },
  {
    id: 'tim',
    name: 'TIM ID',
    entityId: 'https://login.id.tim.it/affwebservices/public/saml2sso',
    ssoUrl: 'https://login.id.tim.it/affwebservices/public/saml2sso',
    logoUrl: '/images/spid/tim.svg',
  },
];

// Attributi SPID richiesti per la certificazione linguistica
export const REQUIRED_SPID_ATTRIBUTES = [
  'spidCode',
  'name',
  'familyName',
  'fiscalNumber',
  'dateOfBirth',
  'placeOfBirth',
];

// Attributi SPID opzionali
export const OPTIONAL_SPID_ATTRIBUTES = [
  'email',
  'gender',
  'idCard',
  'mobilePhone',
  'address',
  'digitalAddress',
];

/**
 * Genera il metadata XML del Service Provider per SPID
 */
export function generateSpidMetadata(config: SpidConfig): string {
  const entityId = config.entityId;
  const acsUrl = config.assertionConsumerServiceUrl;
  const sloUrl = config.singleLogoutServiceUrl;
  const cert = config.certificate.replace(/-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----|\n/g, '');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor 
  xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" 
  xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
  xmlns:spid="https://spid.gov.it/saml-extensions"
  entityID="${entityId}">
  
  <md:SPSSODescriptor 
    AuthnRequestsSigned="true" 
    WantAssertionsSigned="true" 
    protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    
    <md:KeyDescriptor use="signing">
      <ds:KeyInfo>
        <ds:X509Data>
          <ds:X509Certificate>${cert}</ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </md:KeyDescriptor>
    
    <md:KeyDescriptor use="encryption">
      <ds:KeyInfo>
        <ds:X509Data>
          <ds:X509Certificate>${cert}</ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </md:KeyDescriptor>
    
    <md:SingleLogoutService 
      Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" 
      Location="${sloUrl}"/>
    
    <md:NameIDFormat>urn:oasis:names:tc:SAML:2.0:nameid-format:transient</md:NameIDFormat>
    
    <md:AssertionConsumerService 
      Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" 
      Location="${acsUrl}" 
      index="0" 
      isDefault="true"/>
    
    <md:AttributeConsumingService index="${config.attributeConsumingServiceIndex}">
      <md:ServiceName xml:lang="it">CertificaLingua - Certificazioni Linguistiche</md:ServiceName>
      <md:ServiceDescription xml:lang="it">
        Piattaforma per certificazioni linguistiche QCER conforme al DM 62/2022
      </md:ServiceDescription>
      
      <!-- Attributi obbligatori -->
      <md:RequestedAttribute Name="spidCode" isRequired="true"/>
      <md:RequestedAttribute Name="name" isRequired="true"/>
      <md:RequestedAttribute Name="familyName" isRequired="true"/>
      <md:RequestedAttribute Name="fiscalNumber" isRequired="true"/>
      <md:RequestedAttribute Name="dateOfBirth" isRequired="true"/>
      <md:RequestedAttribute Name="placeOfBirth" isRequired="true"/>
      
      <!-- Attributi opzionali -->
      <md:RequestedAttribute Name="email" isRequired="false"/>
      <md:RequestedAttribute Name="gender" isRequired="false"/>
    </md:AttributeConsumingService>
    
  </md:SPSSODescriptor>
  
  <md:Organization>
    <md:OrganizationName xml:lang="it">${config.organization.name}</md:OrganizationName>
    <md:OrganizationDisplayName xml:lang="it">${config.organization.displayName}</md:OrganizationDisplayName>
    <md:OrganizationURL xml:lang="it">${config.organization.url}</md:OrganizationURL>
  </md:Organization>
  
  <md:ContactPerson contactType="other">
    <md:Extensions>
      <spid:VATNumber>IT00000000000</spid:VATNumber>
      <spid:FiscalCode>00000000000</spid:FiscalCode>
      <spid:Private/>
    </md:Extensions>
    <md:Company>${config.contactPerson.company}</md:Company>
    <md:EmailAddress>${config.contactPerson.emailAddress}</md:EmailAddress>
    ${config.contactPerson.telephoneNumber ? `<md:TelephoneNumber>${config.contactPerson.telephoneNumber}</md:TelephoneNumber>` : ''}
  </md:ContactPerson>
  
</md:EntityDescriptor>`;
}

/**
 * Valida il codice fiscale italiano
 */
export function validateFiscalCode(fiscalCode: string): boolean {
  if (!fiscalCode || fiscalCode.length !== 16) {
    return false;
  }
  
  const pattern = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i;
  return pattern.test(fiscalCode);
}

/**
 * Estrae la data di nascita dal codice fiscale
 */
export function extractBirthDateFromFiscalCode(fiscalCode: string): Date | null {
  if (!validateFiscalCode(fiscalCode)) {
    return null;
  }
  
  const yearCode = fiscalCode.substring(6, 8);
  const monthCode = fiscalCode.substring(8, 9).toUpperCase();
  const dayCode = parseInt(fiscalCode.substring(9, 11));
  
  // Mappa mesi
  const monthMap: Record<string, number> = {
    'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'H': 5,
    'L': 6, 'M': 7, 'P': 8, 'R': 9, 'S': 10, 'T': 11
  };
  
  const month = monthMap[monthCode];
  if (month === undefined) {
    return null;
  }
  
  // Il giorno per le donne è +40
  const day = dayCode > 40 ? dayCode - 40 : dayCode;
  
  // Anno: assumiamo che 00-30 sia 2000-2030, 31-99 sia 1931-1999
  const yearNum = parseInt(yearCode);
  const year = yearNum <= 30 ? 2000 + yearNum : 1900 + yearNum;
  
  return new Date(year, month, day);
}

/**
 * Estrae il genere dal codice fiscale
 */
export function extractGenderFromFiscalCode(fiscalCode: string): 'M' | 'F' | null {
  if (!validateFiscalCode(fiscalCode)) {
    return null;
  }
  
  const dayCode = parseInt(fiscalCode.substring(9, 11));
  return dayCode > 40 ? 'F' : 'M';
}

/**
 * Verifica se un profilo SPID è valido per sostenere un esame
 */
export function validateSpidProfileForExam(profile: SpidUserProfile): {
  valid: boolean;
  missingFields: string[];
  errors: string[];
} {
  const missingFields: string[] = [];
  const errors: string[] = [];
  
  // Verifica campi obbligatori
  if (!profile.spidCode) missingFields.push('spidCode');
  if (!profile.name) missingFields.push('name');
  if (!profile.familyName) missingFields.push('familyName');
  if (!profile.fiscalNumber) missingFields.push('fiscalNumber');
  if (!profile.dateOfBirth) missingFields.push('dateOfBirth');
  if (!profile.placeOfBirth) missingFields.push('placeOfBirth');
  
  // Valida codice fiscale
  if (profile.fiscalNumber && !validateFiscalCode(profile.fiscalNumber)) {
    errors.push('Codice fiscale non valido');
  }
  
  // Verifica coerenza data di nascita con CF
  if (profile.fiscalNumber && profile.dateOfBirth) {
    const cfBirthDate = extractBirthDateFromFiscalCode(profile.fiscalNumber);
    if (cfBirthDate) {
      const profileDate = new Date(profile.dateOfBirth);
      if (cfBirthDate.toDateString() !== profileDate.toDateString()) {
        errors.push('La data di nascita non corrisponde al codice fiscale');
      }
    }
  }
  
  return {
    valid: missingFields.length === 0 && errors.length === 0,
    missingFields,
    errors,
  };
}

/**
 * Genera un AuthnRequest SAML per SPID
 */
export function generateSpidAuthnRequest(
  idpEntityId: string,
  spEntityId: string,
  acsUrl: string,
  authnContext: 1 | 2 | 3 = 1
): string {
  const id = '_' + generateRandomId();
  const issueInstant = new Date().toISOString();
  
  const authnContextClassRef = `https://www.spid.gov.it/SpidL${authnContext}`;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<samlp:AuthnRequest 
  xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
  xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
  ID="${id}"
  Version="2.0"
  IssueInstant="${issueInstant}"
  Destination="${idpEntityId}"
  ForceAuthn="true"
  AssertionConsumerServiceURL="${acsUrl}"
  ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
  AttributeConsumingServiceIndex="0">
  
  <saml:Issuer 
    Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity"
    NameQualifier="${spEntityId}">${spEntityId}</saml:Issuer>
  
  <samlp:NameIDPolicy 
    Format="urn:oasis:names:tc:SAML:2.0:nameid-format:transient"/>
  
  <samlp:RequestedAuthnContext Comparison="exact">
    <saml:AuthnContextClassRef>${authnContextClassRef}</saml:AuthnContextClassRef>
  </samlp:RequestedAuthnContext>
  
</samlp:AuthnRequest>`;
}

/**
 * Genera un ID casuale per le richieste SAML
 */
function generateRandomId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Stato della sessione SPID per l'utente
 */
export interface SpidSession {
  authenticated: boolean;
  profile?: SpidUserProfile;
  idpEntityId?: string;
  sessionIndex?: string;
  authenticatedAt?: Date;
  expiresAt?: Date;
}

/**
 * Crea una sessione SPID vuota
 */
export function createEmptySpidSession(): SpidSession {
  return {
    authenticated: false,
  };
}

/**
 * Verifica se la sessione SPID è ancora valida
 */
export function isSpidSessionValid(session: SpidSession): boolean {
  if (!session.authenticated) {
    return false;
  }
  
  if (session.expiresAt && new Date() > session.expiresAt) {
    return false;
  }
  
  return true;
}
