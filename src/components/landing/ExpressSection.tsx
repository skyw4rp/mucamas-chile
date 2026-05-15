import Link from "next/link";
import { getWhatsAppHref } from "@/content/landing";
import { IconClock } from "./icons";

export function ExpressSection() {
  return (
    <section
      id="mucama-express"
      className="scroll-mt-20 border-y border-mucamas-border bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-mucamas-gold/35 bg-mucamas-gold-soft/25 px-3 py-1 text-xs font-semibold text-mucamas-petrol-dark">
              <IconClock className="h-4 w-4 text-mucamas-gold-dark" />
              Prioridad MVP · cupos limitados
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-mucamas-ink sm:text-4xl">
              Mucama Express
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-mucamas-muted sm:text-lg">
              Para checkout improvisado, llegada de huésped o emergencia operativa: coordinamos una ventana corta con equipo listo para
              ejecutar lo esencial con velocidad y estándar de hospedaje.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-mucamas-muted">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mucamas-gold-dark" aria-hidden />
                Ideal para Airbnb con rotación el mismo día (según disponibilidad).
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mucamas-gold-dark" aria-hidden />
                Confirmación más rápida vía WhatsApp con checklist reducido.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mucamas-gold-dark" aria-hidden />
                En formulario, selecciona tipo &quot;Mucama Express&quot; para priorizar tu solicitud.
              </li>
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#reserva"
                className="inline-flex h-12 items-center justify-center rounded-full bg-mucamas-petrol px-7 text-sm font-semibold text-white shadow-lg shadow-mucamas-petrol/15 transition hover:bg-mucamas-petrol-dark"
              >
                Reservar ahora
              </Link>
              <Link
                href={getWhatsAppHref("Hola, necesito Mucama Express. ¿Hay cupo hoy?")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full border border-mucamas-border bg-mucamas-surface px-7 text-sm font-semibold text-mucamas-ink transition hover:bg-white"
              >
                Contactar por WhatsApp
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[28px] bg-gradient-to-br from-mucamas-gold-soft/40 via-transparent to-mucamas-petrol/10 blur-2xl" aria-hidden />
            <div className="relative overflow-hidden rounded-3xl border border-mucamas-border bg-gradient-to-br from-white to-mucamas-surface p-6 shadow-xl sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-mucamas-muted">Ventana típica</p>
              <p className="mt-2 text-2xl font-semibold text-mucamas-ink">2–4 horas</p>
              <p className="mt-2 text-sm text-mucamas-muted">
                Enfoque en zonas de bienvenida, baños y cocina. Ampliaciones según tamaño de propiedad.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Airbnb same-day", ok: true },
                  { label: "Hotel housekeeping", ok: true },
                  { label: "Limpieza profunda", ok: false },
                  { label: "Express coordinado", ok: true },
                ].map((row) => (
                  <div
                    key={row.label}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                      row.ok
                        ? "border-mucamas-petrol/15 bg-white text-mucamas-ink"
                        : "border-dashed border-mucamas-border bg-mucamas-surface/60 text-mucamas-muted"
                    }`}
                  >
                    {row.label}
                    {!row.ok ? <span className="mt-1 block text-xs font-normal">Cotización aparte</span> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
