import type { Metadata } from "next";
import { AdminBookingsPanel } from "@/components/admin/AdminBookingsPanel";

export const metadata: Metadata = {
  title: "Admin · Reservas",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminBookingsPanel />;
}
