import { REVIEWS } from "@/content/landing";
import { IconStar } from "./icons";

export function Reviews() {
  return (
    <section id="resenas" className="scroll-mt-20 border-t border-mucamas-border bg-mucamas-surface py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight text-mucamas-ink sm:text-4xl">Reseñas</h2>
            <p className="mt-4 text-pretty text-base text-mucamas-muted sm:text-lg">
              Historias reales de hosts y operadores que necesitaban fiabilidad en cada turno.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-mucamas-border bg-white px-4 py-3 shadow-sm">
            <div className="flex text-mucamas-gold-dark">
              {Array.from({ length: 5 }).map((_, i) => (
                <IconStar key={i} className="h-4 w-4" />
              ))}
            </div>
            <span className="text-sm font-semibold text-mucamas-ink">4.9</span>
            <span className="text-sm text-mucamas-muted">orientativo · datos mock</span>
          </div>
        </div>

        <ul className="mt-12 grid gap-5 lg:grid-cols-3">
          {REVIEWS.map((r) => (
            <li
              key={r.id}
              className="flex flex-col rounded-2xl border border-mucamas-border bg-white p-6 shadow-sm"
            >
              <div className="flex gap-1 text-mucamas-gold-dark" aria-label={`${r.rating} de 5 estrellas`}>
                {Array.from({ length: r.rating }).map((_, i) => (
                  <IconStar key={i} className="h-4 w-4" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-mucamas-muted">&ldquo;{r.quote}&rdquo;</blockquote>
              <figcaption className="mt-6 border-t border-mucamas-border pt-4">
                <p className="text-sm font-semibold text-mucamas-ink">{r.name}</p>
                <p className="text-xs text-mucamas-muted">{r.role}</p>
              </figcaption>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
