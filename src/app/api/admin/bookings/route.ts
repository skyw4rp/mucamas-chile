import { NextResponse } from "next/server";
import { mapBookingRowToDto, type AdminBookingsResponse } from "@/lib/admin/booking-map";
import { unauthorizedUnlessAdmin } from "@/lib/admin/request-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function GET(request: Request): Promise<NextResponse<AdminBookingsResponse>> {
  const authError = unauthorizedUnlessAdmin(request);
  if (authError) return authError;

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (e) {
    console.error("[api/admin/bookings] Supabase:", e);
    return NextResponse.json(
      { ok: false, message: "Error de configuración del servidor." },
      { status: 500 },
    );
  }

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[api/admin/bookings] Consulta:", error.message, error);
    return NextResponse.json(
      { ok: false, message: "No pudimos cargar las reservas." },
      { status: 500 },
    );
  }

  const rows = Array.isArray(data) ? data : [];
  const bookings = rows
    .map((row) => mapBookingRowToDto(row as Record<string, unknown>))
    .filter((b): b is NonNullable<typeof b> => b !== null);

  return NextResponse.json({ ok: true, bookings }, { status: 200 });
}
