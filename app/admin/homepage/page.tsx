import { getSettings } from "@/lib/utils/settings";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminHomepagePage() {
  const settings = await getSettings();
  return (
    <SettingsForm
      title="Homepage / Hero"
      initialValues={JSON.parse(JSON.stringify(settings))}
      fields={[
        { key: "heroBadge", label: "Hero Badge Text (optional)", placeholder: "e.g. Now Open in Atlanta" },
        { key: "heroHeadline", label: "Hero Headline" },
        { key: "heroSubtext", label: "Hero Subtext", type: "textarea" },
        { key: "heroImageUrl", label: "Hero Background Image", type: "image" },
        { key: "welcomeHeadline", label: "Welcome Section Headline" },
        { key: "welcomeBody", label: "Welcome Section Body Text", type: "textarea" },
        { key: "announcementEnabled", label: "Show announcement bar at top of site", type: "checkbox" },
        { key: "announcementText", label: "Announcement Bar Text" },
      ]}
    />
  );
}