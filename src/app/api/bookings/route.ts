import { NextResponse } from "next/server";
import type { BookingApiResponse } from "@/lib/bookings/types";
import { validateBookingRequest } from "@/lib/bookings/validate";

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

  return NextResponse.json(
    {
      ok: true,
      message: "Recibimos tu solicitud. Te contactaremos pronto.",
    },
    { status: 200 },
  );
}
