import { getSettings } from "@/lib/utils/settings";
import { CalendarCheck } from "lucide-react";

export default async function ReservationsPage() {
  const settings = await getSettings();
  return (
    <div className="container-mawa py-20 max-w-xl mx-auto text-center">
      <CalendarCheck size={40} className="mx-auto text-mawa-gold mb-6" />
      <h1 className="section-heading mb-4">Reserve a Table</h1>
      <p className="text-mawa-black/70 mb-10">
        Join us for a warm, welcoming dining experience. Reserve your table below.
      </p>
      {settings.reservationUrl ? (
        <a href={settings.reservationUrl} target="_blank" className="btn-primary">
          {settings.reservationButtonText || "Reserve a Table"}
        </a>
      ) : (
        <div className="rounded-2xl border border-dashed border-mawa-gold/50 bg-white py-10 px-6 text-mawa-black/50">
          Reservations Coming Soon
        </div>
      )}
    </div>
  );
}
