import { NextResponse } from "next/server";
import type { AdminBookingsError } from "@/lib/admin/booking-map";

/**
 * Valida `x-admin-key` contra `ADMIN_API_KEY`. Solo para Route Handlers (servidor).
 * @returns respuesta de error si falla; `null` si la petición puede continuar.
 */
export function unauthorizedUnlessAdmin(request: Request): NextResponse<AdminBookingsError> | null {
  const expected = process.env.ADMIN_API_KEY?.trim();
  if (!expected) {
    console.error("[admin] ADMIN_API_KEY no está definida.");
    return NextResponse.json<AdminBookingsError>(
      { ok: false, message: "Error de configuración del servidor." },
      { status: 500 },
    );
  }

  const provided = request.headers.get("x-admin-key")?.trim();
  if (!provided || provided !== expected) {
    return NextResponse.json<AdminBookingsError>({ ok: false, message: "No autorizado." }, { status: 401 });
  }

  return null;
}
