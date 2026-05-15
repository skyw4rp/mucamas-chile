import { WHY_POINTS } from "@/content/landing";
import { IconClock, IconShield, IconSparkles } from "./icons";

const icons = [IconSparkles, IconShield, IconClock] as const;

export function WhyChoose() {
  return (
    <section id="por-que-elegirnos" className="scroll-mt-20 bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-mucamas-ink sm:text-4xl">Por qué elegirnos</h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-mucamas-muted sm:text-lg">
              Diseñamos el servicio como si cada limpieza fuera la primera impresión de tu propiedad: orden, pulcritud y tiempos que cierran con tu operación.
            </p>
            <div className="mt-8 rounded-3xl border border-mucamas-border bg-mucamas-surface p-6 sm:p-8">
              <p className="text-sm font-semibold text-mucamas-ink">Compromiso operativo</p>
              <p className="mt-2 text-sm leading-relaxed text-mucamas-muted">
                Briefing único por cuenta, estándares visibles y seguimiento cercano en canales que ya usas (formulario + WhatsApp).
              </p>
            </div>
          </div>

          <ul className="space-y-4">
            {WHY_POINTS.map((item, idx) => {
              const Icon = icons[idx % icons.length];
              return (
                <li
                  key={item.title}
                  className="flex gap-4 rounded-2xl border border-mucamas-border bg-white p-5 shadow-sm"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-mucamas-petrol/10 text-mucamas-petrol">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-mucamas-ink">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-mucamas-muted">{item.body}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
