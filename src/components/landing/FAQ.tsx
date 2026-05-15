"use client";

import { useId, useState } from "react";
import { FAQ_ITEMS } from "@/content/landing";
import { IconChevronDown } from "./icons";

export function FAQ() {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  return (
    <section id="faq" className="scroll-mt-20 bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-mucamas-ink sm:text-4xl">
            Preguntas frecuentes
          </h2>
          <p className="mt-4 text-pretty text-base text-mucamas-muted sm:text-lg">
            Respuestas rápidas para decidir sin fricción. ¿Te falta algo? Escríbenos por WhatsApp.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-mucamas-border rounded-2xl border border-mucamas-border bg-mucamas-surface/40">
          {FAQ_ITEMS.map((item) => {
            const expanded = openId === item.id;
            const panelId = `${baseId}-${item.id}-panel`;
            const buttonId = `${baseId}-${item.id}-button`;
            return (
              <div key={item.id} className="bg-white px-4 first:rounded-t-2xl last:rounded-b-2xl sm:px-6">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold text-mucamas-ink transition hover:text-mucamas-petrol sm:text-lg"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setOpenId(expanded ? null : item.id)}
                  >
                    {item.q}
                    <IconChevronDown
                      className={`h-5 w-5 shrink-0 text-mucamas-muted transition-transform ${expanded ? "rotate-180" : ""}`}
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!expanded}
                  className="pb-5"
                >
                  <p className="text-sm leading-relaxed text-mucamas-muted sm:text-base">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
