import Link from "next/link";
import { getWhatsAppHref } from "@/content/landing";
import { IconSparkles } from "./icons";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden border-b border-mucamas-border/70 bg-gradient-to-b from-white via-mucamas-surface to-mucamas-surface"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(18,62,72,0.12),transparent_55%),radial-gradient(circle_at_80%_15%,rgba(197,165,114,0.18),transparent_45%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-mucamas-border bg-white/80 px-3 py-1 text-xs font-medium text-mucamas-muted shadow-sm backdrop-blur sm:text-sm">
            <IconSparkles className="h-4 w-4 text-mucamas-gold" />
            Limpieza premium · RM y disponibilidad nacional coordinada
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-mucamas-ink sm:text-4xl lg:text-5xl lg:leading-[1.1]">
            Tu espacio listo para{" "}
            <span className="bg-gradient-to-r from-mucamas-petrol to-mucamas-petrol-dark bg-clip-text text-transparent">
              huéspedes de cinco estrellas
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-mucamas-muted sm:text-lg">
            Servicios de mucamas para hoteles, Airbnb y hogares en Chile. Cotiza en minutos y prioriza{" "}
            <strong className="font-semibold text-mucamas-ink">Mucama Express</strong> cuando el tiempo apremia.
          </p>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="#reserva"
              className="inline-flex h-12 items-center justify-center rounded-full bg-mucamas-petrol px-8 text-sm font-semibold text-white shadow-lg shadow-mucamas-petrol/20 transition hover:bg-mucamas-petrol-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mucamas-petrol"
            >
              Reservar ahora
            </Link>
            <Link
              href={getWhatsAppHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full border border-mucamas-border bg-white px-8 text-sm font-semibold text-mucamas-ink shadow-sm transition hover:border-mucamas-petrol/30 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mucamas-petrol"
            >
              Contactar por WhatsApp
            </Link>
          </div>

          <dl className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            {[
              { k: "Respuesta", v: "< 24 h hábil", tip: "vía formulario o WhatsApp" },
              { k: "Checklists", v: "Estándar hospedaje", tip: "baños, cocina y llegada" },
              { k: "Flex", v: "Ventanas AM / PM", tip: "Express según cupos" },
            ].map((row) => (
              <div
                key={row.k}
                className="rounded-2xl border border-mucamas-border bg-white/90 px-4 py-4 text-left shadow-sm backdrop-blur sm:text-center"
              >
                <dt className="text-xs font-medium uppercase tracking-wide text-mucamas-muted">{row.k}</dt>
                <dd className="mt-1 text-lg font-semibold text-mucamas-ink">{row.v}</dd>
                <p className="mt-1 text-xs text-mucamas-muted">{row.tip}</p>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
