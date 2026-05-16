"use client";

import { useState } from "react";
import type { AdminBookingDto, PatchBookingResponse } from "@/lib/admin/booking-map";
import {
  BOOKING_STATUSES,
  BOOKING_STATUS_LABELS,
  isBookingStatus,
  parseBookingStatus,
  type BookingStatus,
} from "@/lib/admin/booking-status";

function badgeClasses(status: BookingStatus | null): string {
  const base =
    "inline-flex max-w-full items-center truncate rounded-full px-2.5 py-0.5 text-xs font-semibold";
  if (!status) {
    return `${base} border border-mucamas-border bg-mucamas-surface text-mucamas-muted`;
  }
  const map: Record<BookingStatus, string> = {
    new: `${base} bg-sky-100 text-sky-950 ring-1 ring-sky-200/90`,
    confirmed: `${base} bg-emerald-100 text-emerald-950 ring-1 ring-emerald-200/90`,
    in_progress: `${base} bg-amber-100 text-amber-950 ring-1 ring-amber-200/90`,
    completed: `${base} bg-mucamas-petrol/15 text-mucamas-petrol-dark ring-1 ring-mucamas-petrol/25`,
    cancelled: `${base} bg-red-100 text-red-950 ring-1 ring-red-200/90`,
  };
  return map[status];
}

type Props = {
  booking: AdminBookingDto;
  adminKey: string;
  onApplied: (next: AdminBookingDto) => void;
  onUnauthorized: () => void;
};

export function BookingStatusControl({ booking, adminKey, onApplied, onUnauthorized }: Props) {
  const rowId = booking.id;
  const [pending, setPending] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!rowId) {
    return <span className="text-mucamas-muted">—</span>;
  }

  const bookingPk: string = rowId;

  const parsed = parseBookingStatus(booking.estado);
  const selectValue: BookingStatus | "" = parsed ?? "";

  const badgeLabel =
    parsed != null
      ? BOOKING_STATUS_LABELS[parsed]
      : booking.estado?.trim()
        ? booking.estado.trim()
        : "Sin estado";

  async function patchStatus(next: BookingStatus) {
    if (parsed === next) return;

    setLocalError(null);
    setPending(true);
    const snapshot = booking;

    onApplied({ ...booking, estado: next });

    try {
      const res = await fetch(`/api/admin/bookings/${encodeURIComponent(bookingPk)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ status: next }),
      });

      let data: PatchBookingResponse;
      try {
        data = (await res.json()) as PatchBookingResponse;
      } catch {
        onApplied(snapshot);
        setLocalError("Respuesta inválida.");
        return;
      }

      if (res.status === 401 || !data.ok) {
        onApplied(snapshot);
        if (res.status === 401) onUnauthorized();
        setLocalError(data.ok === false ? data.message : "No autorizado.");
        return;
      }

      onApplied(data.booking);
    } catch {
      onApplied(snapshot);
      setLocalError("Sin conexión.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-w-[10rem] flex-col gap-1.5">
      <span className={badgeClasses(parsed)} title={booking.estado ?? undefined}>
        {badgeLabel}
      </span>
      <select
        aria-label={`Estado de la reserva ${bookingPk}`}
        value={selectValue === "" ? "" : selectValue}
        disabled={pending}
        onChange={(e) => {
          const v = e.target.value;
          if (!isBookingStatus(v)) return;
          void patchStatus(v);
        }}
        className="w-full max-w-[13rem] rounded-lg border border-mucamas-border bg-white px-2 py-2 text-xs font-medium text-mucamas-ink shadow-sm outline-none ring-mucamas-petrol/20 focus:border-mucamas-petrol focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {selectValue === "" ? (
          <option value="" disabled>
            {booking.estado?.trim() ? `Valor legacy (${booking.estado.trim()})` : "Elegir estado"}
          </option>
        ) : null}
        {BOOKING_STATUSES.map((s) => (
          <option key={s} value={s}>
            {BOOKING_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {pending ? <span className="text-[11px] font-medium text-mucamas-muted">Guardando…</span> : null}
      {localError ? (
        <span className="text-[11px] font-medium leading-snug text-red-700">{localError}</span>
      ) : null}
    </div>
  );
}
