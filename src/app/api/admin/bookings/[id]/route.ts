import { NextResponse } from "next/server";
import { mapBookingRowToDto, type PatchBookingResponse } from "@/lib/admin/booking-map";
import { isBookingStatus } from "@/lib/admin/booking-status";
import { unauthorizedUnlessAdmin } from "@/lib/admin/request-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<NextResponse<PatchBookingResponse>> {
  const authError = unauthorizedUnlessAdmin(request);
  if (authError) return authError as NextResponse<PatchBookingResponse>;

  const { id } = await ctx.params;
  const trimmedId = id?.trim();
  if (!trimmedId) {
    return NextResponse.json({ ok: false, message: "ID inválido." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "JSON inválido." }, { status: 400 });
  }

  const rawStatus =
    typeof body === "object" && body !== null && "status" in body
      ? (body as { status: unknown }).status
      : undefined;
  const status = typeof rawStatus === "string" ? rawStatus.trim() : "";
  if (!isBookingStatus(status)) {
    return NextResponse.json({ ok: false, message: "Estado no permitido." }, { status: 400 });
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (e) {
    console.error("[api/admin/bookings/[id]] Supabase:", e);
    return NextResponse.json(
      { ok: false, message: "Error de configuración del servidor." },
      { status: 500 },
    );
  }

  const { data, error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", trimmedId)
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("[api/admin/bookings/[id]] update:", error.message, error);
    return NextResponse.json(
      { ok: false, message: "No pudimos actualizar la reserva." },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({ ok: false, message: "Reserva no encontrada." }, { status: 404 });
  }

  const dto = mapBookingRowToDto(data as Record<string, unknown>);
  if (!dto) {
    return NextResponse.json(
      { ok: false, message: "Respuesta inconsistente del servidor." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, booking: dto }, { status: 200 });
}
