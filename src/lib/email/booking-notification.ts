import type { BookingPayload } from "@/lib/bookings/types";
import { getResendClient } from "@/lib/email/resend";

/** Remitente por defecto para sandbox Resend; sustituir con dominio verificado en producción. */
const DEFAULT_FROM = "Mucamas Chile <onboarding@resend.dev>";

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function display(value: string): string {
  const t = value.trim();
  return t.length ? t : "—";
}

function formatCreatedAtForEmail(iso: string): string {
  try {
    return new Intl.DateTimeFormat("es-CL", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function buildHtml(payload: BookingPayload, createdAtIso: string): string {
  const rows: [string, string][] = [
    ["Tipo de servicio", display(payload.serviceType)],
    ["Fecha", display(payload.date)],
    ["Hora", display(payload.time)],
    ["Comuna", display(payload.comuna)],
    ["Dirección", display(payload.address)],
    ["Duración", display(payload.duration)],
    ["Nombre", display(payload.fullName)],
    ["Teléfono", display(payload.phone)],
    ["Email", display(payload.email)],
    ["Comentarios", display(payload.comments)],
    ["Fecha de creación (servidor)", formatCreatedAtForEmail(createdAtIso)],
  ];

  const bodyRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e8e6e1;font-weight:600;color:#123e48">${escapeHtml(k)}</td><td style="padding:8px 12px;border:1px solid #e8e6e1">${escapeHtml(v)}</td></tr>`,
    )
    .join("");

  return `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;background:#f7f6f3;padding:24px;">
<p style="margin:0 0 16px;font-size:16px;font-weight:600;color:#0c1222">Nueva solicitud de reserva</p>
<table style="border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;max-width:560px">${bodyRows}</table>
<p style="margin-top:16px;font-size:12px;color:#5c6578">Notificación automática · Mucamas Chile</p>
</body></html>`;
}

function buildText(payload: BookingPayload, createdAtIso: string): string {
  const lines = [
    "Nueva solicitud de reserva",
    "",
    `Tipo de servicio: ${display(payload.serviceType)}`,
    `Fecha: ${display(payload.date)}`,
    `Hora: ${display(payload.time)}`,
    `Comuna: ${display(payload.comuna)}`,
    `Dirección: ${display(payload.address)}`,
    `Duración: ${display(payload.duration)}`,
    `Nombre: ${display(payload.fullName)}`,
    `Teléfono: ${display(payload.phone)}`,
    `Email: ${display(payload.email)}`,
    `Comentarios: ${display(payload.comments)}`,
    `Fecha de creación: ${formatCreatedAtForEmail(createdAtIso)}`,
  ];
  return lines.join("\n");
}

/**
 * Envía notificación al equipo por Resend. No lanza: errores solo en consola del servidor.
 * Requiere `RESEND_API_KEY` y `BOOKING_NOTIFICATION_EMAIL`; si faltan, solo registra aviso.
 */
export async function sendBookingNotification(
  payload: BookingPayload,
  createdAtIso: string,
): Promise<void> {
  const to = process.env.BOOKING_NOTIFICATION_EMAIL?.trim();
  const client = getResendClient();

  if (!to || !client) {
    console.warn(
      "[email/booking-notification] Omitido: configure RESEND_API_KEY y BOOKING_NOTIFICATION_EMAIL.",
    );
    return;
  }

  const from = process.env.RESEND_FROM?.trim() ?? DEFAULT_FROM;
  const subject = `Nueva reserva · ${display(payload.serviceType)}`;

  try {
    const { error } = await client.emails.send({
      from,
      to: [to],
      subject,
      html: buildHtml(payload, createdAtIso),
      text: buildText(payload, createdAtIso),
    });

    if (error) {
      console.error("[email/booking-notification] Resend:", error);
    }
  } catch (e) {
    console.error("[email/booking-notification]", e);
  }
}
