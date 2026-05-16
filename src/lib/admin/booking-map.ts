/** Respuesta JSON para el panel admin (camelCase estable para el cliente). */
export type AdminBookingDto = {
  id: string | null;
  createdAt: string;
  serviceType: string;
  bookingDate: string | null;
  bookingTime: string | null;
  comuna: string;
  fullName: string;
  phone: string;
  email: string;
  estado: string | null;
};

export type AdminBookingsSuccess = {
  ok: true;
  bookings: AdminBookingDto[];
};

export type AdminBookingsError = {
  ok: false;
  message: string;
};

export type AdminBookingsResponse = AdminBookingsSuccess | AdminBookingsError;

function str(v: unknown): string {
  return typeof v === "string" ? v : v != null ? String(v) : "";
}

function nullableStr(v: unknown): string | null {
  if (v == null) return null;
  const s = typeof v === "string" ? v.trim() : String(v).trim();
  return s.length ? s : null;
}

/** Normaliza fila Supabase (`status` o `estado` en DB). */
export function mapBookingRowToDto(row: Record<string, unknown>): AdminBookingDto | null {
  const createdRaw = row.created_at;
  if (typeof createdRaw !== "string" || !createdRaw) return null;

  const estadoRaw = row.estado ?? row.status;

  return {
    id: nullableStr(row.id),
    createdAt: createdRaw,
    serviceType: str(row.service_type),
    bookingDate: nullableStr(row.booking_date),
    bookingTime: nullableStr(row.booking_time),
    comuna: str(row.comuna),
    fullName: str(row.full_name),
    phone: str(row.phone),
    email: str(row.email),
    estado: nullableStr(estadoRaw),
  };
}
