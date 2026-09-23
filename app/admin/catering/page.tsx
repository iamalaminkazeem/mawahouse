import { getSettings } from "@/lib/utils/settings";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminCateringPage() {
  const settings = await getSettings();
  return (
    <SettingsForm
      title="Catering Services"
      initialValues={JSON.parse(JSON.stringify(settings))}
      fields={[
        { key: "cateringUrl", label: "Catering Request Link (form or booking page)", type: "url" },
        { key: "cateringButtonText", label: "Catering Button Text", placeholder: "Inquire for Catering" },
      ]}
    />
  );
}