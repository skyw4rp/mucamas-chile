import { Resend } from "resend";

let cached: Resend | null = null;

/** Cliente Resend singleton (solo servidor). Retorna `null` si falta `RESEND_API_KEY`. */
export function getResendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  if (!cached) cached = new Resend(key);
  return cached;
}
