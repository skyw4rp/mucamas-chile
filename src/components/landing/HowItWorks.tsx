import { HOW_STEPS } from "@/content/landing";

export function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-20 bg-mucamas-surface py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-mucamas-ink sm:text-4xl">Cómo funciona</h2>
          <p className="mt-4 text-pretty text-base text-mucamas-muted sm:text-lg">
            Flujo simple inspirado en las mejores experiencias de reserva: claridad primero, ejecución después.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 lg:grid-cols-3 lg:gap-8">
          {HOW_STEPS.map((item, i) => (
            <li
              key={item.step}
              className="relative rounded-2xl border border-mucamas-border bg-white p-6 shadow-sm"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-mucamas-gold-dark">{item.step}</span>
              <h3 className="mt-3 text-lg font-semibold text-mucamas-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mucamas-muted">{item.body}</p>
              {i < HOW_STEPS.length - 1 ? (
                <span
                  className="pointer-events-none absolute -right-4 top-1/2 hidden h-px w-8 -translate-y-1/2 bg-gradient-to-r from-mucamas-border to-transparent lg:block"
                  aria-hidden
                />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
