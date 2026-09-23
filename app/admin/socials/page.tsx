import { getSettings } from "@/lib/utils/settings";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminSocialsPage() {
  const settings = await getSettings();
  return (
    <SettingsForm
      title="Social Media"
      initialValues={JSON.parse(JSON.stringify(settings))}
      fields={[
        { key: "instagramUrl", label: "Instagram URL", type: "url" },
        { key: "tiktokUrl", label: "TikTok URL", type: "url" },
        { key: "facebookUrl", label: "Facebook URL (optional)", type: "url" },
      ]}
    />
  );
}
