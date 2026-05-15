import { SERVICES } from "@/content/landing";
import type { BookingFieldErrors, BookingPayload } from "./types";

const ALLOWED_SERVICE_TYPES = new Set(SERVICES.map((s) => s.title));

function pickString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function readBody(body: unknown): BookingPayload {
  const raw =
    body !== null && typeof body === "object" && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : {};

  return {
    serviceType: pickString(raw.serviceType),
    date: pickString(raw.date),
    time: pickString(raw.time),
    comuna: pickString(raw.comuna),
    address: pickString(raw.address),
    duration: pickString(raw.duration),
    fullName: pickString(raw.fullName),
    phone: pickString(raw.phone),
    email: pickString(raw.email),
    comments: pickString(raw.comments),
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return email.length > 0 && EMAIL_RE.test(email);
}

export type ValidateBookingResult =
  | { ok: true; booking: BookingPayload }
  | { ok: false; errors: BookingFieldErrors };

/**
 * Validaciones mínimas solicitadas + tipo de servicio contra catálogo actual.
 */
export function validateBookingPayload(booking: BookingPayload): ValidateBookingResult {
  const errors: BookingFieldErrors = {};

  if (!booking.fullName) {
    errors.fullName = [...(errors.fullName ?? []), "El nombre es obligatorio."];
  }

  if (!booking.phone) {
    errors.phone = [...(errors.phone ?? []), "El teléfono es obligatorio."];
  }

  if (!booking.email) {
    errors.email = [...(errors.email ?? []), "El email es obligatorio."];
  } else if (!isValidEmail(booking.email)) {
    errors.email = [...(errors.email ?? []), "Ingresa un email válido."];
  }

  if (!booking.serviceType) {
    errors.serviceType = [...(errors.serviceType ?? []), "Selecciona un tipo de servicio."];
  } else if (!ALLOWED_SERVICE_TYPES.has(booking.serviceType)) {
    errors.serviceType = [...(errors.serviceType ?? []), "Tipo de servicio no válido."];
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, booking };
}

export function validateBookingRequest(body: unknown): ValidateBookingResult {
  return validateBookingPayload(readBody(body));
}
