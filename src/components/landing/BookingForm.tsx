"use client";

import Link from "next/link";
import { SERVICES, getWhatsAppHref } from "@/content/landing";
import { IconWhatsApp } from "./icons";

const DURATION_OPTIONS = ["2 horas", "3 horas", "4 horas", "6 horas", "Día completo / a cotizar"];

export function BookingForm() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <section id="reserva" className="scroll-mt-20 border-t border-mucamas-border bg-gradient-to-b from-mucamas-surface to-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-semibold tracking-tight text-mucamas-ink sm:text-4xl">
              Contacto / reserva
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-mucamas-muted sm:text-lg">
              Completa el formulario para iniciar tu solicitud.{" "}
              <strong className="font-semibold text-mucamas-ink">Versión visual MVP:</strong> no guardamos datos aún; te responderemos
              por WhatsApp cuando integremos backend.
            </p>
            <div className="mt-8 rounded-3xl border border-mucamas-border bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-mucamas-ink">¿Preferís respuesta inmediata?</p>
              <p className="mt-2 text-sm text-mucamas-muted">
                Usa WhatsApp con el detalle de comuna, metros aproximados y fecha deseada.
              </p>
              <Link
                href={getWhatsAppHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white shadow-md transition hover:brightness-95 sm:w-auto"
              >
                <IconWhatsApp className="h-5 w-5" />
                Contactar por WhatsApp
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-mucamas-border bg-white p-6 shadow-lg shadow-mucamas-petrol/5 sm:p-8"
              noValidate
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="tipo-servicio" className="block text-sm font-medium text-mucamas-ink">
                    Tipo de servicio
                  </label>
                  <select
                    id="tipo-servicio"
                    name="tipoServicio"
                    defaultValue=""
                    className="mt-2 w-full rounded-xl border border-mucamas-border bg-mucamas-surface/40 px-4 py-3 text-sm text-mucamas-ink outline-none ring-mucamas-petrol/30 transition focus:border-mucamas-petrol focus:bg-white focus:ring-2"
                    required
                  >
                    <option value="" disabled>
                      Selecciona una opción
                    </option>
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="fecha" className="block text-sm font-medium text-mucamas-ink">
                    Fecha
                  </label>
                  <input
                    id="fecha"
                    name="fecha"
                    type="date"
                    className="mt-2 w-full rounded-xl border border-mucamas-border bg-mucamas-surface/40 px-4 py-3 text-sm text-mucamas-ink outline-none ring-mucamas-petrol/30 transition focus:border-mucamas-petrol focus:bg-white focus:ring-2"
                  />
                </div>

                <div>
                  <label htmlFor="hora" className="block text-sm font-medium text-mucamas-ink">
                    Hora preferida
                  </label>
                  <input
                    id="hora"
                    name="hora"
                    type="time"
                    className="mt-2 w-full rounded-xl border border-mucamas-border bg-mucamas-surface/40 px-4 py-3 text-sm text-mucamas-ink outline-none ring-mucamas-petrol/30 transition focus:border-mucamas-petrol focus:bg-white focus:ring-2"
                  />
                </div>

                <div>
                  <label htmlFor="comuna" className="block text-sm font-medium text-mucamas-ink">
                    Comuna
                  </label>
                  <input
                    id="comuna"
                    name="comuna"
                    type="text"
                    placeholder="Ej: Las Condes"
                    autoComplete="address-level2"
                    className="mt-2 w-full rounded-xl border border-mucamas-border bg-mucamas-surface/40 px-4 py-3 text-sm text-mucamas-ink outline-none ring-mucamas-petrol/30 placeholder:text-mucamas-muted/70 transition focus:border-mucamas-petrol focus:bg-white focus:ring-2"
                  />
                </div>

                <div>
                  <label htmlFor="duracion" className="block text-sm font-medium text-mucamas-ink">
                    Duración estimada
                  </label>
                  <select
                    id="duracion"
                    name="duracion"
                    defaultValue=""
                    className="mt-2 w-full rounded-xl border border-mucamas-border bg-mucamas-surface/40 px-4 py-3 text-sm text-mucamas-ink outline-none ring-mucamas-petrol/30 transition focus:border-mucamas-petrol focus:bg-white focus:ring-2"
                  >
                    <option value="" disabled>
                      Selecciona duración
                    </option>
                    {DURATION_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="direccion" className="block text-sm font-medium text-mucamas-ink">
                    Dirección
                  </label>
                  <input
                    id="direccion"
                    name="direccion"
                    type="text"
                    placeholder="Calle, número, referencia de acceso"
                    autoComplete="street-address"
                    className="mt-2 w-full rounded-xl border border-mucamas-border bg-mucamas-surface/40 px-4 py-3 text-sm text-mucamas-ink outline-none ring-mucamas-petrol/30 placeholder:text-mucamas-muted/70 transition focus:border-mucamas-petrol focus:bg-white focus:ring-2"
                  />
                </div>

                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-mucamas-ink">
                    Nombre completo
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    autoComplete="name"
                    className="mt-2 w-full rounded-xl border border-mucamas-border bg-mucamas-surface/40 px-4 py-3 text-sm text-mucamas-ink outline-none ring-mucamas-petrol/30 transition focus:border-mucamas-petrol focus:bg-white focus:ring-2"
                  />
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-mucamas-ink">
                    Teléfono
                  </label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    inputMode="tel"
                    placeholder="+56 9 ..."
                    autoComplete="tel"
                    className="mt-2 w-full rounded-xl border border-mucamas-border bg-mucamas-surface/40 px-4 py-3 text-sm text-mucamas-ink outline-none ring-mucamas-petrol/30 placeholder:text-mucamas-muted/70 transition focus:border-mucamas-petrol focus:bg-white focus:ring-2"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-mucamas-ink">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="mt-2 w-full rounded-xl border border-mucamas-border bg-mucamas-surface/40 px-4 py-3 text-sm text-mucamas-ink outline-none ring-mucamas-petrol/30 transition focus:border-mucamas-petrol focus:bg-white focus:ring-2"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="comentarios" className="block text-sm font-medium text-mucamas-ink">
                    Comentarios
                  </label>
                  <textarea
                    id="comentarios"
                    name="comentarios"
                    rows={4}
                    placeholder="Metros aproximados, número de baños, mascotas, parking, etc."
                    className="mt-2 w-full resize-y rounded-xl border border-mucamas-border bg-mucamas-surface/40 px-4 py-3 text-sm text-mucamas-ink outline-none ring-mucamas-petrol/30 placeholder:text-mucamas-muted/70 transition focus:border-mucamas-petrol focus:bg-white focus:ring-2"
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-mucamas-petrol px-8 text-sm font-semibold text-white shadow-md transition hover:bg-mucamas-petrol-dark sm:flex-none"
                >
                  Enviar solicitud (demo visual)
                </button>
                <p className="text-center text-xs text-mucamas-muted sm:text-left">
                  Al integrar backend, este botón confirmará y enviará tu reserva.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
