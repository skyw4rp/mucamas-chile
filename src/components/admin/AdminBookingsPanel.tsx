"use client";

import Link from "next/link";
import { useCallback, useEffect, useSyncExternalStore, useState } from "react";
import { AdminStatsStrip } from "@/components/admin/AdminStatsStrip";
import { BookingStatusControl } from "@/components/admin/BookingStatusControl";
import type { AdminBookingStatsDto, AdminBookingStatsResponse } from "@/lib/admin/booking-stats";
import type { AdminBookingDto, AdminBookingsResponse } from "@/lib/admin/booking-map";
import {
  getAdminKeyServerSnapshot,
  getAdminKeySnapshot,
  persistAdminKey,
  subscribeAdminKey,
} from "@/lib/admin/admin-key-store";

function formatCreatedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat("es-CL", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function formatBookingDate(value: string | null): string {
  if (!value) return "—";
  const parts = value.split("-").map((p) => Number.parseInt(p, 10));
  if (parts.length === 3 && parts.every((n) => !Number.isNaN(n))) {
    const [y, m, d] = parts;
    return new Intl.DateTimeFormat("es-CL", { dateStyle: "medium" }).format(new Date(y, m - 1, d));
  }
  return value;
}

function formatBookingTime(value: string | null): string {
  if (!value) return "—";
  return value.length >= 5 ? value.slice(0, 5) : value;
}

export function AdminBookingsPanel() {
  const sessionKey = useSyncExternalStore(subscribeAdminKey, getAdminKeySnapshot, getAdminKeyServerSnapshot);
  const [inputKey, setInputKey] = useState("");
  const [bookings, setBookings] = useState<AdminBookingDto[]>([]);
  const [stats, setStats] = useState<AdminBookingStatsDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  const refreshStats = useCallback(async (key: string) => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const res = await fetch("/api/admin/bookings/stats", {
        headers: {
          Accept: "application/json",
          "x-admin-key": key,
        },
      });

      let data: AdminBookingStatsResponse;
      try {
        data = (await res.json()) as AdminBookingStatsResponse;
      } catch {
        setStatsError("Respuesta inválida del servidor.");
        return;
      }

      if (res.status === 401 || !data.ok) {
        persistAdminKey(null);
        setBookings([]);
        setStats(null);
        setError(data.ok === false ? data.message : "No autorizado.");
        return;
      }

      setStats(data.stats);
    } catch {
      setStatsError("Sin conexión al actualizar métricas.");
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadDashboard = useCallback(async (key: string, options?: { persistOnSuccess?: boolean }) => {
    setLoading(true);
    setStatsLoading(true);
    setError(null);
    setStatsError(null);

    try {
      const headers: HeadersInit = {
        Accept: "application/json",
        "x-admin-key": key,
      };

      const [bookRes, statRes] = await Promise.all([
        fetch("/api/admin/bookings", { headers }),
        fetch("/api/admin/bookings/stats", { headers }),
      ]);

      let bookData: AdminBookingsResponse;
      let statData: AdminBookingStatsResponse;

      try {
        bookData = (await bookRes.json()) as AdminBookingsResponse;
      } catch {
        setBookings([]);
        setError("Respuesta inválida del servidor (reservas).");
        bookData = { ok: false, message: "JSON inválido." };
      }

      try {
        statData = (await statRes.json()) as AdminBookingStatsResponse;
      } catch {
        setStats(null);
        setStatsError("Respuesta inválida del servidor (métricas).");
        statData = { ok: false, message: "JSON inválido." };
      }

      if (bookRes.status === 401 || statRes.status === 401) {
        persistAdminKey(null);
        setBookings([]);
        setStats(null);
        setError("No autorizado.");
        setStatsError(null);
        return;
      }

      if (!bookRes.ok || !bookData.ok) {
        setBookings([]);
        setError(bookData.ok === false ? bookData.message : `Error al cargar reservas (${bookRes.status}).`);
      } else {
        setBookings(bookData.bookings);
        if (options?.persistOnSuccess) persistAdminKey(key);
      }

      if (!statRes.ok || !statData.ok) {
        setStats(null);
        setStatsError(
          statData.ok === false ? statData.message : `Error al cargar métricas (${statRes.status}).`,
        );
      } else {
        setStats(statData.stats);
        setStatsError(null);
      }
    } catch {
      setBookings([]);
      setStats(null);
      setError("Sin conexión. Intenta nuevamente.");
      setStatsError("Sin conexión al cargar métricas.");
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  }, []);

  const mergeBooking = useCallback((updated: AdminBookingDto) => {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  }, []);

  const handlePatchUnauthorized = useCallback(() => {
    persistAdminKey(null);
    setBookings([]);
    setStats(null);
    setStatsError(null);
    setError("Sesión admin inválida o expirada.");
  }, []);

  useEffect(() => {
    const k = getAdminKeySnapshot();
    if (!k) return;
    queueMicrotask(() => {
      void loadDashboard(k);
    });
  }, [loadDashboard]);

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = inputKey.trim();
    if (!trimmed) {
      setError("Ingresa la clave de administración.");
      return;
    }
    setError(null);
    setInputKey("");
    void loadDashboard(trimmed, { persistOnSuccess: true });
  }

  function handleLogout() {
    persistAdminKey(null);
    setBookings([]);
    setStats(null);
    setStatsError(null);
    setError(null);
    setInputKey("");
  }

  const unlocked = Boolean(sessionKey);
  const dashboardBusy = loading || statsLoading;

  return (
    <div className="min-h-screen bg-mucamas-surface text-mucamas-ink">
      <header className="border-b border-mucamas-border bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-mucamas-petrol text-xs font-bold text-white shadow-sm">
              MC
            </span>
            <div>
              <p className="text-sm font-semibold tracking-tight">Panel admin</p>
              <p className="text-xs text-mucamas-muted">Mucamas Chile · reservas</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {unlocked ? (
              <>
                <button
                  type="button"
                  onClick={() => sessionKey && void loadDashboard(sessionKey)}
                  disabled={dashboardBusy}
                  className="rounded-full border border-mucamas-border bg-white px-4 py-2 text-sm font-medium text-mucamas-ink shadow-sm transition hover:border-mucamas-petrol/25 disabled:opacity-60"
                >
                  Actualizar
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-mucamas-ink px-4 py-2 text-sm font-medium text-mucamas-cream transition hover:bg-mucamas-petrol-dark"
                >
                  Salir
                </button>
              </>
            ) : null}
            <Link
              href="/"
              className="rounded-full bg-mucamas-petrol px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-mucamas-petrol-dark"
            >
              Ir al sitio
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {!unlocked ? (
          <section className="mx-auto max-w-md rounded-3xl border border-mucamas-border bg-white p-6 shadow-lg shadow-mucamas-petrol/5 sm:p-8">
            <h1 className="text-xl font-semibold tracking-tight text-mucamas-ink">Acceso admin</h1>
            <p className="mt-2 text-sm leading-relaxed text-mucamas-muted">
              Ingresa la clave configurada en el servidor (<code className="rounded bg-mucamas-surface px-1 py-0.5 text-xs">ADMIN_API_KEY</code>
              ). No se envía a Supabase; solo valida el acceso a esta vista.
            </p>
            <form onSubmit={handleUnlock} className="mt-6 space-y-4">
              <div>
                <label htmlFor="admin-key" className="block text-sm font-medium text-mucamas-ink">
                  Clave
                </label>
                <input
                  id="admin-key"
                  name="admin-key"
                  type="password"
                  autoComplete="off"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-mucamas-border bg-mucamas-surface/40 px-4 py-3 text-base text-mucamas-ink outline-none ring-mucamas-petrol/30 transition focus:border-mucamas-petrol focus:bg-white focus:ring-2 sm:text-sm"
                  placeholder="Tu clave admin"
                />
              </div>
              {error ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900" role="alert">
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={dashboardBusy}
                className="flex h-12 min-h-[44px] w-full items-center justify-center rounded-full bg-mucamas-petrol text-sm font-semibold text-white shadow-md transition hover:bg-mucamas-petrol-dark disabled:opacity-70"
              >
                {dashboardBusy ? "Cargando…" : "Ver reservas"}
              </button>
            </form>
          </section>
        ) : (
          <section className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-mucamas-ink">Reservas</h1>
                <p className="mt-1 text-sm text-mucamas-muted">
                  Ordenadas por fecha de creación (más recientes primero).
                </p>
              </div>
            </div>

            <AdminStatsStrip stats={stats} loading={statsLoading} error={statsError} />

            {error ? (
              <div
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
                role="alert"
              >
                {error}
              </div>
            ) : null}

            {loading && bookings.length === 0 ? (
              <p className="rounded-2xl border border-mucamas-border bg-white px-4 py-8 text-center text-sm text-mucamas-muted">
                Cargando reservas…
              </p>
            ) : null}

            {!loading && bookings.length === 0 && !error ? (
              <p className="rounded-2xl border border-mucamas-border bg-white px-4 py-10 text-center text-sm text-mucamas-muted">
                No hay reservas registradas todavía.
              </p>
            ) : null}

            {bookings.length > 0 ? (
              <>
                <div className="hidden overflow-hidden rounded-2xl border border-mucamas-border bg-white shadow-sm md:block">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1040px] border-collapse text-left text-sm">
                      <thead className="border-b border-mucamas-border bg-mucamas-surface/80">
                        <tr>
                          {[
                            "Creación",
                            "Servicio",
                            "Fecha reserva",
                            "Hora",
                            "Comuna",
                            "Nombre",
                            "Teléfono",
                            "Email",
                            "Estado",
                          ].map((h) => (
                            <th
                              key={h}
                              className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-mucamas-muted"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b, idx) => (
                          <tr
                            key={b.id ?? `${b.createdAt}-${idx}`}
                            className="border-b border-mucamas-border/80 last:border-0 hover:bg-mucamas-surface/40"
                          >
                            <td className="whitespace-nowrap px-4 py-3 text-mucamas-ink">{formatCreatedAt(b.createdAt)}</td>
                            <td className="max-w-[180px] px-4 py-3 text-mucamas-ink">{b.serviceType || "—"}</td>
                            <td className="whitespace-nowrap px-4 py-3">{formatBookingDate(b.bookingDate)}</td>
                            <td className="whitespace-nowrap px-4 py-3">{formatBookingTime(b.bookingTime)}</td>
                            <td className="max-w-[140px] px-4 py-3">{b.comuna || "—"}</td>
                            <td className="max-w-[160px] px-4 py-3 font-medium">{b.fullName || "—"}</td>
                            <td className="whitespace-nowrap px-4 py-3 tabular-nums">{b.phone || "—"}</td>
                            <td className="max-w-[200px] break-all px-4 py-3 text-mucamas-muted">{b.email || "—"}</td>
                            <td className="px-4 py-3 align-top">
                              {sessionKey ? (
                                <BookingStatusControl
                                  booking={b}
                                  adminKey={sessionKey}
                                  onApplied={mergeBooking}
                                  onUnauthorized={handlePatchUnauthorized}
                                  onStatsRefresh={() => sessionKey && void refreshStats(sessionKey)}
                                />
                              ) : (
                                <span className="text-mucamas-muted">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <ul className="flex flex-col gap-4 md:hidden">
                  {bookings.map((b, idx) => (
                    <li
                      key={b.id ?? `${b.createdAt}-${idx}`}
                      className="rounded-2xl border border-mucamas-border bg-white p-4 shadow-sm"
                    >
                      <dl className="grid gap-3 text-sm">
                        <div className="flex justify-between gap-2 border-b border-mucamas-border/80 pb-2">
                          <dt className="text-mucamas-muted">Creación</dt>
                          <dd className="text-right font-medium text-mucamas-ink">{formatCreatedAt(b.createdAt)}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wide text-mucamas-muted">Servicio</dt>
                          <dd className="mt-1 font-medium">{b.serviceType || "—"}</dd>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <dt className="text-xs font-semibold uppercase tracking-wide text-mucamas-muted">Fecha</dt>
                            <dd className="mt-1">{formatBookingDate(b.bookingDate)}</dd>
                          </div>
                          <div>
                            <dt className="text-xs font-semibold uppercase tracking-wide text-mucamas-muted">Hora</dt>
                            <dd className="mt-1">{formatBookingTime(b.bookingTime)}</dd>
                          </div>
                        </div>
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wide text-mucamas-muted">Comuna</dt>
                          <dd className="mt-1">{b.comuna || "—"}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wide text-mucamas-muted">Nombre</dt>
                          <dd className="mt-1 font-medium">{b.fullName || "—"}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wide text-mucamas-muted">Teléfono</dt>
                          <dd className="mt-1 tabular-nums">{b.phone || "—"}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wide text-mucamas-muted">Email</dt>
                          <dd className="mt-1 break-all text-mucamas-muted">{b.email || "—"}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wide text-mucamas-muted">Estado</dt>
                          <dd className="mt-2">
                            {sessionKey ? (
                              <BookingStatusControl
                                booking={b}
                                adminKey={sessionKey}
                                onApplied={mergeBooking}
                                onUnauthorized={handlePatchUnauthorized}
                                onStatsRefresh={() => sessionKey && void refreshStats(sessionKey)}
                              />
                            ) : (
                              <span className="text-mucamas-muted">—</span>
                            )}
                          </dd>
                        </div>
                      </dl>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </section>
        )}
      </main>
    </div>
  );
}
