import { SERVICES } from "@/content/landing";

export function Services() {
  return (
    <section id="servicios" className="scroll-mt-20 bg-mucamas-surface py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-mucamas-ink sm:text-4xl">
            Servicios a tu medida
          </h2>
          <p className="mt-4 text-pretty text-base text-mucamas-muted sm:text-lg">
            Cobertura desde operación hotelera hasta preparación de unidades cortas y hogares particulares.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {SERVICES.map((s) => (
            <li
              key={s.id}
              className="flex flex-col rounded-2xl border border-mucamas-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-mucamas-petrol/20 hover:shadow-md"
            >
              {s.badge ? (
                <span className="mb-3 inline-flex w-fit rounded-full bg-mucamas-surface px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-mucamas-petrol">
                  {s.badge}
                </span>
              ) : (
                <span className="mb-3 block h-6" aria-hidden />
              )}
              <h3 className="text-lg font-semibold text-mucamas-ink">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-mucamas-muted">{s.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
