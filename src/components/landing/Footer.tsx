import Link from "next/link";
import { NAV_LINKS, SITE, getWhatsAppHref } from "@/content/landing";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-mucamas-border bg-mucamas-ink text-mucamas-cream">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sm font-bold text-white">
                MC
              </span>
              <span className="text-lg font-semibold tracking-tight">{SITE.name}</span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
              Equipo de mucamas para hoteles, Airbnb y hogares en Chile. Cotización clara, ejecución impecable y foco en conversión para tu operación.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Navegación</p>
              <ul className="mt-4 space-y-2">
                {NAV_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-white/80 transition hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Contacto</p>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href={getWhatsAppHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/80 transition hover:text-white"
                  >
                    WhatsApp
                  </Link>
                </li>
                <li>
                  <Link href="#reserva" className="text-sm text-white/80 transition hover:text-white">
                    Formulario de reserva
                  </Link>
                </li>
              </ul>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Legal (placeholder)</p>
              <ul className="mt-4 space-y-2">
                <li>
                  <span className="cursor-not-allowed text-sm text-white/45">Política de privacidad</span>
                </li>
                <li>
                  <span className="cursor-not-allowed text-sm text-white/45">Términos del servicio</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name}. Todos los derechos reservados.
          </p>
          <p>Landing estática · Sin backend en esta versión.</p>
        </div>
      </div>
    </footer>
  );
}
