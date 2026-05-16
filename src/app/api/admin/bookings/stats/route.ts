import { NextResponse } from "next/server";
import type { AdminBookingStatsDto, AdminBookingStatsResponse } from "@/lib/admin/booking-stats";
import { BOOKING_STATUSES, type BookingStatus } from "@/lib/admin/booking-status";
import { unauthorizedUnlessAdmin } from "@/lib/admin/request-auth";
import { endOfSantiagoDayExclusiveIso, startOfSantiagoDayIso } from "@/lib/datetime/chile";
import { getSupabaseAdmin } from "@/lib/supabase/server";

function emptyByStatus(): Record<BookingStatus, number> {
  return {
    new: 0,
    confirmed: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
  };
}

export async function GET(request: Request): Promise<NextResponse<AdminBookingStatsResponse>> {
  const authError = unauthorizedUnlessAdmin(request);
  if (authError) return authError as NextResponse<AdminBookingStatsResponse>;

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (e) {
    console.error("[api/admin/bookings/stats] Supabase:", e);
    return NextResponse.json(
      { ok: false, message: "Error de configuración del servidor." },
      { status: 500 },
    );
  }

  const todayStart = startOfSantiagoDayIso();
  const todayEnd = endOfSantiagoDayExclusiveIso();
  const sevenDaysAgoIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const totalQuery = supabase.from("bookings").select("*", { count: "exact", head: true });
  const statusQueries = BOOKING_STATUSES.map((s) =>
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", s),
  );
  const todayQuery = supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .gte("created_at", todayStart)
    .lt("created_at", todayEnd);
  const weekQuery = supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .gte("created_at", sevenDaysAgoIso);

  const results = await Promise.all([totalQuery, ...statusQueries, todayQuery, weekQuery]);

  for (const r of results) {
    if (r.error) {
      console.error("[api/admin/bookings/stats] consulta:", r.error.message, r.error);
      return NextResponse.json(
        { ok: false, message: "No pudimos calcular las estadísticas." },
        { status: 500 },
      );
    }
  }

  const total = results[0]?.count ?? 0;
  const byStatus = emptyByStatus();
  BOOKING_STATUSES.forEach((s, i) => {
    byStatus[s] = results[i + 1]?.count ?? 0;
  });
  const createdToday = results[results.length - 2]?.count ?? 0;
  const createdLast7Days = results[results.length - 1]?.count ?? 0;

  const stats: AdminBookingStatsDto = {
    total,
    byStatus,
    createdToday,
    createdLast7Days,
  };

  return NextResponse.json({ ok: true, stats }, { status: 200 });
}
