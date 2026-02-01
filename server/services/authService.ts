/**
 * Servizio di autenticazione email/password
 * Gestisce login, registrazione e validazione credenziali
 */

import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { getDb } from '../db';
import { users } from '../../drizzle/schema';

const SALT_ROUNDS = 12;

/**
 * Hash di una password con bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verifica una password contro l'hash salvato
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Valida il formato della password
 * Requisiti: minimo 8 caratteri, almeno una maiuscola, una minuscola, un numero
 */
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'La password deve essere di almeno 8 caratteri' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'La password deve contenere almeno una lettera maiuscola' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'La password deve contenere almeno una lettera minuscola' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'La password deve contenere almeno un numero' };
  }
  return { valid: true };
}

/**
 * Valida il formato dell'email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Login con email e password
 */
export async function loginWithEmailPassword(email: string, password: string) {
  const db = await getDb();
  if (!db) {
    throw new Error('Database non disponibile');
  }

  // Trova l'utente per email
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  const user = result[0];

  if (!user) {
    return { success: false, error: 'Email o password non corretti' };
  }

  if (!user.passwordHash) {
    return { success: false, error: 'Account non configurato per login con password. Usa SPID o contatta l\'amministratore.' };
  }

  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    return { success: false, error: 'Email o password non corretti' };
  }

  // Aggiorna ultimo accesso
  await db
    .update(users)
    .set({ lastSignedIn: new Date(), loginMethod: 'email' })
    .where(eq(users.id, user.id));

  return { 
    success: true, 
    user: {
      id: user.id,
      openId: user.openId,
      email: user.email,
      name: user.name,
      role: user.role,
      fiscalCode: user.fiscalCode,
      spidVerified: user.spidVerified,
    }
  };
}

/**
 * Registra un nuovo utente (solo admin può farlo)
 */
export async function registerUser(data: {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin' | 'examiner' | 'student';
  fiscalCode?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error('Database non disponibile');
  }

  // Valida email
  if (!validateEmail(data.email)) {
    return { success: false, error: 'Formato email non valido' };
  }

  // Valida password
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.valid) {
    return { success: false, error: passwordValidation.message };
  }

  // Verifica che l'email non sia già in uso
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email.toLowerCase()))
    .limit(1);

  if (existing.length > 0) {
    return { success: false, error: 'Email già registrata' };
  }

  // Hash della password
  const passwordHash = await hashPassword(data.password);

  // Genera un openId unico
  const openId = `email-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

  // Inserisci l'utente
  await db.insert(users).values({
    openId,
    email: data.email.toLowerCase(),
    passwordHash,
    name: data.name,
    role: data.role,
    fiscalCode: data.fiscalCode,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    loginMethod: 'email',
  });

  return { success: true, message: 'Utente registrato con successo' };
}

/**
 * Cambia la password di un utente
 */
export async function changePassword(userId: number, oldPassword: string, newPassword: string) {
  const db = await getDb();
  if (!db) {
    throw new Error('Database non disponibile');
  }

  // Trova l'utente
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const user = result[0];

  if (!user || !user.passwordHash) {
    return { success: false, error: 'Utente non trovato o password non configurata' };
  }

  // Verifica la vecchia password
  const isValid = await verifyPassword(oldPassword, user.passwordHash);
  if (!isValid) {
    return { success: false, error: 'Password attuale non corretta' };
  }

  // Valida la nuova password
  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.valid) {
    return { success: false, error: passwordValidation.message };
  }

  // Hash della nuova password
  const newPasswordHash = await hashPassword(newPassword);

  // Aggiorna la password
  await db
    .update(users)
    .set({ passwordHash: newPasswordHash })
    .where(eq(users.id, userId));

  return { success: true, message: 'Password aggiornata con successo' };
}

/**
 * Imposta la password per un utente esistente (admin only)
 */
export async function setUserPassword(userId: number, newPassword: string) {
  const db = await getDb();
  if (!db) {
    throw new Error('Database non disponibile');
  }

  // Valida la nuova password
  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.valid) {
    return { success: false, error: passwordValidation.message };
  }

  // Hash della nuova password
  const newPasswordHash = await hashPassword(newPassword);

  // Aggiorna la password
  await db
    .update(users)
    .set({ passwordHash: newPasswordHash })
    .where(eq(users.id, userId));

  return { success: true, message: 'Password impostata con successo' };
}
