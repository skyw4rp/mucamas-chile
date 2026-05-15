/** Datos mock y copys — fácil de editar sin tocar JSX */

export const SITE = {
  name: "Mucamas Chile",
  tagline: "Limpieza profesional para tu hogar y hospedajes",
  /** Reemplaza por tu número en formato país sin + (Chile: 56 + 9 dígitos móvil) */
  whatsappE164: "56912345678",
} as const;

export function getWhatsAppHref(prefill?: string): string {
  const text =
    prefill ??
    "Hola Mucamas Chile, quiero cotizar / reservar un servicio de limpieza.";
  return `https://wa.me/${SITE.whatsappE164}?text=${encodeURIComponent(text)}`;
}

export const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#mucama-express", label: "Mucama Express" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#por-que-elegirnos", label: "Por qué elegirnos" },
  { href: "#resenas", label: "Reseñas" },
  { href: "#faq", label: "FAQ" },
  { href: "#reserva", label: "Reservar" },
] as const;

export type ServiceMock = {
  id: string;
  title: string;
  description: string;
  badge?: string;
};

export const SERVICES: ServiceMock[] = [
  {
    id: "hoteles",
    title: "Hoteles y lodging",
    description:
      "Turnos coordinados, estándares de camareras y reposición impecable para alta ocupación.",
    badge: "B2B",
  },
  {
    id: "airbnb",
    title: "Airbnb y renta corta",
    description:
      "Check-out express, preparación para huéspedes y limpieza profunda entre reservas.",
    badge: "Popular",
  },
  {
    id: "domicilio",
    title: "Domicilio particular",
    description:
      "Planificación flexible para hogares: mantención semanal o limpieza puntual antes de eventos.",
  },
  {
    id: "express",
    title: "Mucama Express",
    description:
      "Servicio rápido con cupos limitados el mismo día o en ventanas cortas (según disponibilidad).",
    badge: "MVP",
  },
];

export const REVIEWS: {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
}[] = [
  {
    id: "r1",
    name: "Valentina R.",
    role: "Host Airbnb · Providencia",
    quote:
      "Turnaround entre huéspedes sin estrés. La comunicación por WhatsApp es clarísima y el depto queda listo para fotos.",
    rating: 5,
  },
  {
    id: "r2",
    name: "Hotel boutique · RM",
    role: "Operaciones",
    quote:
      "Equipo prolijo con checklist y foco en detalle. Nos ayudaron a estandarizar salas en temporada alta.",
    rating: 5,
  },
  {
    id: "r3",
    name: "Diego M.",
    role: "Casa en Las Condes",
    quote:
      "Reservé limpieza profunda antes de mudanza. Puntualidad impecable y terminación fina.",
    rating: 5,
  },
];

export const FAQ_ITEMS: { id: string; q: string; a: string }[] = [
  {
    id: "f1",
    q: "¿Cubren todo Chile?",
    a: "Operamos principalmente en RM y ciudades con disponibilidad coordinada. Indica tu comuna al reservar y confirmamos cobertura.",
  },
  {
    id: "f2",
    q: "¿Qué incluye una limpieza estándar?",
    a: "Superficies, baños, cocina, polvo, piso y orden general. Profundizaciones (interior electrodomésticos, ventanas) se cotizan aparte.",
  },
  {
    id: "f3",
    q: "¿Puedo solicitar el mismo día?",
    a: "Sí, según cupos con Mucama Express. Es el canal más rápido para ventanas cortas — confirma por WhatsApp.",
  },
  {
    id: "f4",
    q: "¿Traen productos y equipo?",
    a: "Sí, con insumos profesionales. Si necesitas productos hipoalergénicos o específicos del hogar, indícalo en comentarios.",
  },
  {
    id: "f5",
    q: "¿Cómo se paga?",
    a: "Por ahora coordinamos método de pago al confirmar la reserva (transferencia o alternativa acordada). Integración de pagos online viene pronto.",
  },
];

export const HOW_STEPS = [
  {
    step: "01",
    title: "Reserva online o WhatsApp",
    body: "Cuéntanos tipo de propiedad, fecha y duración estimada. Respondemos con disponibilidad.",
  },
  {
    step: "02",
    title: "Confirmación clara",
    body: "Te enviamos ventana horaria, alcance y valor orientativo. Sin letras chicas.",
  },
  {
    step: "03",
    title: "Limpieza y checklist",
    body: "Equipo en terreno con estándar revisado. Priorizamos puntos críticos de bienvenida.",
  },
];

export const WHY_POINTS = [
  {
    title: "Estándar hospedaje",
    body: "Procesos pensados para reviews altas: baños, cocina y zonas de llegada impecables.",
  },
  {
    title: "Profesionales evaluados",
    body: "Selección y briefing uniforme. Enfoque en puntualidad y comunicación directa.",
  },
  {
    title: "Flexible para tu agenda",
    body: "Ventanas AM/PM y opciones express cuando hay cupo — ideal para rotación Airbnb.",
  },
];
