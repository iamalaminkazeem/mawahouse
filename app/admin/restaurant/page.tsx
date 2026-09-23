import { getSettings } from "@/lib/utils/settings";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminRestaurantPage() {
  const settings = await getSettings();
  return (
    <SettingsForm
      title="Restaurant Info"
      initialValues={JSON.parse(JSON.stringify(settings))}
      fields={[
        { key: "restaurantName", label: "Restaurant Name" },
        { key: "tagline", label: "Tagline" },
        { key: "address", label: "Address" },
        { key: "phone", label: "Phone Number" },
        { key: "whatsappNumber", label: "WhatsApp Number (digits only, with country code)", placeholder: "14708156319" },
        { key: "email", label: "Contact Email" },
        { key: "googleMapsUrl", label: "Google Maps Link (for 'Get Directions')", type: "url" },
        { key: "googleMapsEmbedUrl", label: "Google Maps Embed URL (for map on homepage)", type: "url" },
      ]}
    />
  );
}
