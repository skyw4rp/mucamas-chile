import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mucamaschile.cl"),
  title: {
    default: "Mucamas Chile | Limpieza para hoteles, Airbnb y hogares",
    template: "%s | Mucamas Chile",
  },
  description:
    "Servicios de mucamas en Chile para hoteles, Airbnb y domicilios. Prioriza Mucama Express y cotiza en minutos por WhatsApp o formulario de reserva.",
  keywords: [
    "mucamas Chile",
    "limpieza Airbnb",
    "housekeeping hotel",
    "limpieza domicilio",
    "Mucama Express",
    "Santiago limpieza",
    "limpieza hogar Chile",
  ],
  alternates: {
    canonical: "https://www.mucamaschile.cl/",
  },
  openGraph: {
    title: "Mucamas Chile — Limpieza premium para hospedajes",
    description:
      "Reserva online y contacto por WhatsApp. Estándar hospedaje para tu propiedad en Chile.",
    url: "https://www.mucamaschile.cl/",
    siteName: "Mucamas Chile",
    locale: "es_CL",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-mucamas-surface text-mucamas-ink">{children}</body>
    </html>
  );
}
