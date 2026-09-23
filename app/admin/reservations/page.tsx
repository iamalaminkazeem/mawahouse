import { getSettings } from "@/lib/utils/settings";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminReservationsPage() {
  const settings = await getSettings();
  return (
    <SettingsForm
      title="Reservations"
      initialValues={JSON.parse(JSON.stringify(settings))}
      fields={[
        { key: "reservationPlatform", label: "Platform Name", placeholder: "e.g. OpenTable, Resy" },
        { key: "reservationUrl", label: "Reservation URL", type: "url" },
        { key: "reservationButtonText", label: "Button Text" },
      ]}
    />
  );
}
