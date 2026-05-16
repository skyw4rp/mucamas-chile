"use client";

import type { ReactNode } from "react";
import { BOOKING_STATUSES, BOOKING_STATUS_LABELS, type BookingStatus } from "@/lib/admin/booking-status";
import type { AdminBookingStatsDto } from "@/lib/admin/booking-stats";

function IconLayers({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCalendar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  );
}

function IconTrend({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M3 17l6-6 4 4 7-7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 8h7v7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconDot({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

const STATUS_CARD: Record<
  BookingStatus,
  { ring: string; iconWrap: string; icon: string }
> = {
  new: {
    ring: "ring-sky-200/90 border-sky-200/80 bg-gradient-to-br from-sky-50/90 to-white",
    iconWrap: "bg-sky-100 text-sky-800",
    icon: "text-sky-700",
  },
  confirmed: {
    ring: "ring-emerald-200/90 border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 to-white",
    iconWrap: "bg-emerald-100 text-emerald-900",
    icon: "text-emerald-800",
  },
  in_progress: {
    ring: "ring-amber-200/90 border-amber-200/80 bg-gradient-to-br from-amber-50/90 to-white",
    iconWrap: "bg-amber-100 text-amber-950",
    icon: "text-amber-900",
  },
  completed: {
    ring: "ring-mucamas-petrol/25 border-mucamas-petrol/20 bg-gradient-to-br from-mucamas-petrol/10 to-white",
    iconWrap: "bg-mucamas-petrol/15 text-mucamas-petrol-dark",
    icon: "text-mucamas-petrol",
  },
  cancelled: {
    ring: "ring-red-200/90 border-red-200/80 bg-gradient-to-br from-red-50/90 to-white",
    iconWrap: "bg-red-100 text-red-950",
    icon: "text-red-800",
  },
};

function StatCard({
  label,
  value,
  sublabel,
  className,
  icon,
}: {
  label: string;
  value: number | string;
  sublabel?: string;
  className: string;
  icon: ReactNode;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-4 shadow-sm transition-[box-shadow,transform,opacity] duration-300 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-mucamas-muted">{label}</p>
          <p className="mt-1.5 tabular-nums text-2xl font-semibold tracking-tight text-mucamas-ink">{value}</p>
          {sublabel ? <p className="mt-1 text-[11px] leading-snug text-mucamas-muted">{sublabel}</p> : null}
        </div>
        <div className="shrink-0 opacity-90 transition-opacity duration-300 group-hover:opacity-100">{icon}</div>
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid animate-pulse gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-[104px] rounded-2xl border border-mucamas-border bg-white/60" />
      ))}
    </div>
  );
}

type Props = {
  stats: AdminBookingStatsDto | null;
  loading: boolean;
  error: string | null;
};

export function AdminStatsStrip({ stats, loading, error }: Props) {
  if (loading && !stats) {
    return (
      <section aria-busy="true" aria-label="Cargando estadísticas" className="space-y-2">
        <p className="text-xs font-medium text-mucamas-muted">Resumen</p>
        <StatsSkeleton />
      </section>
    );
  }

  if (error && !stats) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950" role="status">
        No se pudieron cargar las estadísticas: {error}
      </div>
    );
  }

  if (!stats) return null;

  const dimmed = loading ? "opacity-75" : "opacity-100 transition-opacity duration-300";

  return (
    <section className={`space-y-3 ${dimmed}`} aria-label="Resumen de reservas">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-mucamas-muted">Resumen</p>
        {loading ? (
          <span className="text-[11px] font-medium text-mucamas-muted motion-safe:animate-pulse">Actualizando métricas…</span>
        ) : null}
      </div>

      {error ? (
        <p className="text-xs text-amber-800" role="status">
          Las métricas pueden estar desactualizadas: {error}
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <div className="sm:col-span-2 xl:col-span-2">
          <StatCard
            label="Total reservas"
            value={stats.total}
            sublabel="Registradas en Supabase"
            className="border-mucamas-border/90 bg-gradient-to-br from-white to-mucamas-surface ring-1 ring-mucamas-border/60"
            icon={
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mucamas-petrol/10 text-mucamas-petrol">
                <IconLayers className="h-5 w-5" />
              </span>
            }
          />
        </div>

        <StatCard
          label="Hoy (Chile)"
          value={stats.createdToday}
          sublabel="Por fecha de creación"
          className="border-mucamas-border/90 bg-white ring-1 ring-violet-200/70"
          icon={
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-800">
              <IconCalendar className="h-5 w-5" />
            </span>
          }
        />

        <StatCard
          label="Últimos 7 días"
          value={stats.createdLast7Days}
          sublabel="Ventana móvil"
          className="border-mucamas-border/90 bg-white ring-1 ring-indigo-200/70"
          icon={
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-900">
              <IconTrend className="h-5 w-5" />
            </span>
          }
        />

        {BOOKING_STATUSES.map((s) => {
          const style = STATUS_CARD[s];
          return (
            <StatCard
              key={s}
              label={BOOKING_STATUS_LABELS[s]}
              value={stats.byStatus[s]}
              className={`border ${style.ring}`}
              icon={
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${style.iconWrap}`}>
                  <IconDot className={`h-5 w-5 ${style.icon}`} />
                </span>
              }
            />
          );
        })}
      </div>
    </section>
  );
}
