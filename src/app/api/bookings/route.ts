import { NextResponse } from "next/server";
import { sendBookingNotification } from "@/lib/email/booking-notification";
import type { BookingApiResponse } from "@/lib/bookings/types";
import { mapBookingPayloadToRow } from "@/lib/bookings/db";
import { validateBookingRequest } from "@/lib/bookings/validate";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request): Promise<NextResponse<BookingApiResponse>> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "El cuerpo de la solicitud no es JSON válido." },
      { status: 400 },
    );
  }

  const result = validateBookingRequest(body);

  if (!result.ok) {
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  console.log("[api/bookings] Reserva recibida:", JSON.stringify(result.booking, null, 2));

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (envError) {
    console.error("[api/bookings] Config Supabase:", envError);
    return NextResponse.json(
      {
        ok: false,
        message: "Error de configuración del servidor. Intenta más tarde.",
      },
      { status: 500 },
    );
  }

  const row = mapBookingPayloadToRow(result.booking);
  const { error } = await supabase.from("bookings").insert(row);

  if (error) {
    console.error("[api/bookings] Supabase insert:", error.message, error);
    return NextResponse.json(
      {
        ok: false,
        message: "No pudimos guardar tu solicitud. Intenta nuevamente en unos minutos.",
      },
      { status: 500 },
    );
  }

  const createdAtIso = new Date().toISOString();
  await sendBookingNotification(result.booking, createdAtIso);

  return NextResponse.json(
    {
      ok: true,
      message: "Recibimos tu solicitud. Te contactaremos pronto.",
    },
    { status: 200 },
  );
}
