"use client";

import Link from "next/link";
import { useState } from "react";
import { SERVICES, getWhatsAppHref } from "@/content/landing";
import type { BookingApiResponse, BookingFieldErrors, BookingFieldKey } from "@/lib/bookings/types";
import { IconWhatsApp } from "./icons";

const DURATION_OPTIONS = ["2 horas", "3 horas", "4 horas", "6 horas", "Día completo / a cotizar"];

const BOOKING_FIELDS: BookingFieldKey[] = [
  "serviceType",
  "date",
  "time",
  "comuna",
  "address",
  "duration",
  "fullName",
  "phone",
  "email",
  "comments",
];

function buildPayload(formData: FormData): Record<BookingFieldKey, string> {
  const next = {} as Record<BookingFieldKey, string>;
  for (const key of BOOKING_FIELDS) {
    next[key] = String(formData.get(key) ?? "").trim();
  }
  return next;
}

function inputRingClass(hasError: boolean): string {
  return hasError
    ? "border-red-400 ring-red-200 focus:border-red-500 focus:ring-red-200"
    : "border-mucamas-border ring-mucamas-petrol/30 focus:border-mucamas-petrol focus:ring-mucamas-petrol/30";
}

export function BookingForm() {
  const [formKey, setFormKey] = useState(0);
  const [pending, setPending] = useState(false);
  const [banner, setBanner] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<BookingFieldErrors>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    setBanner(null);
    setFieldErrors({});
    setPending(true);

    try {
      const payload = buildPayload(new FormData(form));

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      let data: BookingApiResponse;
      try {
        data = (await res.json()) as BookingApiResponse;
      } catch {
        setBanner({
          kind: "error",
          text: "Respuesta inválida del servidor. Intenta de nuevo en unos minutos.",
        });
        return;
      }

      if (data.ok === true) {
        setBanner({ kind: "success", text: data.message });
        setFormKey((k) => k + 1);
        return;
      }

      if (data.errors) {
        setFieldErrors(data.errors);
      }

      const message =
        typeof data.message === "string" && data.message.trim().length > 0
          ? data.message
          : data.errors
            ? "Revisa los campos indicados e intenta nuevamente."
            : `No pudimos enviar tu solicitud (${res.status}). Intenta nuevamente.`;

      setBanner({ kind: "error", text: message });
    } catch {
      setBanner({
        kind: "error",
        text: "Sin conexión o error de red. Verifica tu internet e intenta otra vez.",
      });
    } finally {
      setPending(false);
    }
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
              Completa el formulario para iniciar tu solicitud. Los datos se envían de forma segura a nuestro equipo (aún sin base de datos);{" "}
              <strong className="font-semibold text-mucamas-ink">te contactaremos por WhatsApp o email</strong>.
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
                className="mt-5 inline-flex h-12 min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white shadow-md transition hover:brightness-95 sm:w-auto"
              >
                <IconWhatsApp className="h-5 w-5 shrink-0" />
                Contactar por WhatsApp
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            {banner ? (
              <div
                role="alert"
                aria-live={banner.kind === "error" ? "assertive" : "polite"}
                className={`mb-6 rounded-2xl border px-4 py-3 text-sm leading-relaxed sm:px-5 sm:py-4 ${
                  banner.kind === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                    : "border-red-200 bg-red-50 text-red-950"
                }`}
              >
                {banner.text}
              </div>
            ) : null}

            <form
              key={formKey}
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
                    name="serviceType"
                    defaultValue=""
                    disabled={pending}
                    aria-invalid={Boolean(fieldErrors.serviceType?.length)}
                    aria-describedby={fieldErrors.serviceType ? "err-serviceType" : undefined}
                    className={`mt-2 w-full rounded-xl border bg-mucamas-surface/40 px-4 py-3 text-base text-mucamas-ink outline-none transition focus:bg-white focus:ring-2 disabled:opacity-60 sm:text-sm ${inputRingClass(Boolean(fieldErrors.serviceType?.length))}`}
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
                  {fieldErrors.serviceType ? (
                    <p id="err-serviceType" className="mt-1.5 text-xs text-red-700">
                      {fieldErrors.serviceType.join(" ")}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="fecha" className="block text-sm font-medium text-mucamas-ink">
                    Fecha
                  </label>
                  <input
                    id="fecha"
                    name="date"
                    type="date"
                    disabled={pending}
                    className={`mt-2 w-full rounded-xl border bg-mucamas-surface/40 px-4 py-3 text-base text-mucamas-ink outline-none transition focus:bg-white focus:ring-2 disabled:opacity-60 sm:text-sm ${inputRingClass(false)}`}
                  />
                </div>

                <div>
                  <label htmlFor="hora" className="block text-sm font-medium text-mucamas-ink">
                    Hora preferida
                  </label>
                  <input
                    id="hora"
                    name="time"
                    type="time"
                    disabled={pending}
                    className={`mt-2 w-full rounded-xl border bg-mucamas-surface/40 px-4 py-3 text-base text-mucamas-ink outline-none transition focus:bg-white focus:ring-2 disabled:opacity-60 sm:text-sm ${inputRingClass(false)}`}
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
                    disabled={pending}
                    className={`mt-2 w-full rounded-xl border bg-mucamas-surface/40 px-4 py-3 text-base text-mucamas-ink outline-none transition placeholder:text-mucamas-muted/70 focus:bg-white focus:ring-2 disabled:opacity-60 sm:text-sm ${inputRingClass(false)}`}
                  />
                </div>

                <div>
                  <label htmlFor="duracion" className="block text-sm font-medium text-mucamas-ink">
                    Duración estimada
                  </label>
                  <select
                    id="duracion"
                    name="duration"
                    defaultValue=""
                    disabled={pending}
                    className={`mt-2 w-full rounded-xl border bg-mucamas-surface/40 px-4 py-3 text-base text-mucamas-ink outline-none transition focus:bg-white focus:ring-2 disabled:opacity-60 sm:text-sm ${inputRingClass(false)}`}
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
                    name="address"
                    type="text"
                    placeholder="Calle, número, referencia de acceso"
                    autoComplete="street-address"
                    disabled={pending}
                    className={`mt-2 w-full rounded-xl border bg-mucamas-surface/40 px-4 py-3 text-base text-mucamas-ink outline-none transition placeholder:text-mucamas-muted/70 focus:bg-white focus:ring-2 disabled:opacity-60 sm:text-sm ${inputRingClass(false)}`}
                  />
                </div>

                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-mucamas-ink">
                    Nombre completo
                  </label>
                  <input
                    id="nombre"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    disabled={pending}
                    aria-invalid={Boolean(fieldErrors.fullName?.length)}
                    aria-describedby={fieldErrors.fullName ? "err-fullName" : undefined}
                    className={`mt-2 w-full rounded-xl border bg-mucamas-surface/40 px-4 py-3 text-base text-mucamas-ink outline-none transition focus:bg-white focus:ring-2 disabled:opacity-60 sm:text-sm ${inputRingClass(Boolean(fieldErrors.fullName?.length))}`}
                  />
                  {fieldErrors.fullName ? (
                    <p id="err-fullName" className="mt-1.5 text-xs text-red-700">
                      {fieldErrors.fullName.join(" ")}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-mucamas-ink">
                    Teléfono
                  </label>
                  <input
                    id="telefono"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    placeholder="+56 9 ..."
                    autoComplete="tel"
                    disabled={pending}
                    aria-invalid={Boolean(fieldErrors.phone?.length)}
                    aria-describedby={fieldErrors.phone ? "err-phone" : undefined}
                    className={`mt-2 w-full rounded-xl border bg-mucamas-surface/40 px-4 py-3 text-base text-mucamas-ink outline-none transition placeholder:text-mucamas-muted/70 focus:bg-white focus:ring-2 disabled:opacity-60 sm:text-sm ${inputRingClass(Boolean(fieldErrors.phone?.length))}`}
                  />
                  {fieldErrors.phone ? (
                    <p id="err-phone" className="mt-1.5 text-xs text-red-700">
                      {fieldErrors.phone.join(" ")}
                    </p>
                  ) : null}
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
                    disabled={pending}
                    aria-invalid={Boolean(fieldErrors.email?.length)}
                    aria-describedby={fieldErrors.email ? "err-email" : undefined}
                    className={`mt-2 w-full rounded-xl border bg-mucamas-surface/40 px-4 py-3 text-base text-mucamas-ink outline-none transition focus:bg-white focus:ring-2 disabled:opacity-60 sm:text-sm ${inputRingClass(Boolean(fieldErrors.email?.length))}`}
                  />
                  {fieldErrors.email ? (
                    <p id="err-email" className="mt-1.5 text-xs text-red-700">
                      {fieldErrors.email.join(" ")}
                    </p>
                  ) : null}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="comentarios" className="block text-sm font-medium text-mucamas-ink">
                    Comentarios
                  </label>
                  <textarea
                    id="comentarios"
                    name="comments"
                    rows={4}
                    placeholder="Metros aproximados, número de baños, mascotas, parking, etc."
                    disabled={pending}
                    className={`mt-2 w-full resize-y rounded-xl border bg-mucamas-surface/40 px-4 py-3 text-base text-mucamas-ink outline-none transition placeholder:text-mucamas-muted/70 focus:bg-white focus:ring-2 disabled:opacity-60 sm:text-sm ${inputRingClass(false)}`}
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={pending}
                  aria-busy={pending}
                  className="inline-flex h-12 min-h-[44px] flex-1 items-center justify-center rounded-full bg-mucamas-petrol px-8 text-sm font-semibold text-white shadow-md transition hover:bg-mucamas-petrol-dark disabled:cursor-not-allowed disabled:opacity-70 sm:flex-none"
                >
                  {pending ? "Enviando…" : "Enviar solicitud"}
                </button>
                <p className="text-center text-xs text-mucamas-muted sm:max-w-xs sm:text-left">
                  Al enviar, aceptas que usemos estos datos solo para coordinar tu servicio.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
