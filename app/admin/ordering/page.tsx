import { getSettings } from "@/lib/utils/settings";
import OrderingSettingsForm from "@/components/admin/OrderingSettingsForm";

export default async function AdminOrderingPage() {
  const settings = await getSettings();
  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <h1 className="font-serif text-3xl font-bold mb-2">Online Ordering</h1>
      <p className="text-sm text-mawa-black/60 mb-8">
        Ordering happens directly on your Menu page — customers add items to a cart and check out
        on the site. No external platform (Toast/Square/etc.) is used. Configure delivery and tax
        below; leave delivery off if you're pickup-only for now.
      </p>
      <OrderingSettingsForm initialValues={JSON.parse(JSON.stringify(settings))} />
    </div>
  );
}
