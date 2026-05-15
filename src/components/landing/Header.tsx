"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS, SITE, getWhatsAppHref } from "@/content/landing";
import { IconClose, IconMenu } from "./icons";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-mucamas-border/80 bg-mucamas-surface/85 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link
          href="#inicio"
          className="flex shrink-0 items-center gap-2 font-semibold tracking-tight text-mucamas-ink"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-mucamas-petrol text-xs font-bold text-white shadow-sm">
            MC
          </span>
          <span className="text-sm sm:text-base">{SITE.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm text-mucamas-muted transition-colors hover:bg-white hover:text-mucamas-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={getWhatsAppHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full border border-mucamas-border bg-white px-3 py-2 text-sm font-medium text-mucamas-ink shadow-sm transition hover:border-mucamas-petrol/25 hover:shadow md:inline-flex"
          >
            WhatsApp
          </Link>
          <Link
            href="#reserva"
            className="hidden rounded-full bg-mucamas-petrol px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-mucamas-petrol-dark sm:inline-flex"
          >
            Reservar ahora
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-mucamas-border bg-white text-mucamas-ink shadow-sm lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
            {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-mucamas-border bg-mucamas-surface px-4 pb-5 pt-2 lg:hidden"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-3 text-sm font-medium text-mucamas-ink hover:bg-white"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={getWhatsAppHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-xl border border-mucamas-border bg-white px-3 py-3 text-center text-sm font-semibold text-mucamas-ink"
              onClick={() => setOpen(false)}
            >
              Contactar por WhatsApp
            </Link>
            <Link
              href="#reserva"
              className="rounded-xl bg-mucamas-petrol px-3 py-3 text-center text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Reservar ahora
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
