"use client";

import { useState } from "react";
import { Save } from "lucide-react";

type Values = {
  orderingEnabled: boolean;
  orderOnlineButtonText: string;
  deliveryEnabled: boolean;
  deliveryFee: number | null;
  deliveryMinimum: number | null;
  deliveryNote: string | null;
  taxEnabled: boolean;
  taxRate: number | null;
  orderReceivedNote: string;
};

export default function OrderingSettingsForm({ initialValues }: { initialValues: Values }) {
  const [v, setV] = useState<Values>(initialValues);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(v),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  return (
    <form onSubmit={save} className="bg-white rounded-2xl border border-black/5 p-6 space-y-6">
      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={v.orderingEnabled}
          onChange={(e) => setV({ ...v, orderingEnabled: e.target.checked })}
        />
        Online ordering enabled (turn off to hide "Add to Cart" and show "ordering paused" instead)
      </label>

      <div>
        <label className="block text-sm font-medium mb-1.5">Order Online Button Text</label>
        <input
          value={v.orderOnlineButtonText}
          onChange={(e) => setV({ ...v, orderOnlineButtonText: e.target.value })}
          className="w-full rounded-lg border border-black/10 px-3 py-2"
        />
      </div>

      <hr className="border-black/5" />

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={v.deliveryEnabled}
          onChange={(e) => setV({ ...v, deliveryEnabled: e.target.checked })}
        />
        Delivery available (uncheck to only offer Pickup)
      </label>

      {v.deliveryEnabled && (
        <div className="grid sm:grid-cols-2 gap-4 pl-6">
          <div>
            <label className="block text-sm font-medium mb-1.5">Delivery Fee ($)</label>
            <input
              type="number"
              step="0.01"
              value={v.deliveryFee ?? ""}
              onChange={(e) => setV({ ...v, deliveryFee: e.target.value ? parseFloat(e.target.value) : null })}
              placeholder="Leave blank to confirm fee by phone"
              className="w-full rounded-lg border border-black/10 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Minimum Delivery Order ($)</label>
            <input
              type="number"
              step="0.01"
              value={v.deliveryMinimum ?? ""}
              onChange={(e) => setV({ ...v, deliveryMinimum: e.target.value ? parseFloat(e.target.value) : null })}
              className="w-full rounded-lg border border-black/10 px-3 py-2"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Delivery Note (shown to customers)</label>
            <input
              value={v.deliveryNote ?? ""}
              onChange={(e) => setV({ ...v, deliveryNote: e.target.value })}
              placeholder="e.g. Delivery available within 5 miles"
              className="w-full rounded-lg border border-black/10 px-3 py-2"
            />
          </div>
        </div>
      )}

      <hr className="border-black/5" />

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={v.taxEnabled}
          onChange={(e) => setV({ ...v, taxEnabled: e.target.checked })}
        />
        Add tax to orders
      </label>

      {v.taxEnabled && (
        <div className="pl-6">
          <label className="block text-sm font-medium mb-1.5">Tax Rate (%)</label>
          <input
            type="number"
            step="0.01"
            value={v.taxRate ? v.taxRate * 100 : ""}
            onChange={(e) =>
              setV({ ...v, taxRate: e.target.value ? parseFloat(e.target.value) / 100 : null })
            }
            placeholder="e.g. 8 for 8%"
            className="w-40 rounded-lg border border-black/10 px-3 py-2"
          />
        </div>
      )}

      <hr className="border-black/5" />

      <div>
        <label className="block text-sm font-medium mb-1.5">Order Confirmation Message</label>
        <textarea
          rows={2}
          value={v.orderReceivedNote}
          onChange={(e) => setV({ ...v, orderReceivedNote: e.target.value })}
          className="w-full rounded-lg border border-black/10 px-3 py-2"
        />
        <p className="text-xs text-mawa-black/50 mt-1">
          No online payment is collected yet — this message tells the customer their order was
          received and will be confirmed by the restaurant (call, text, or in person).
        </p>
      </div>

      <button disabled={saving} className="btn-primary !rounded-lg text-sm">
        <Save size={16} /> {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
      </button>
    </form>
  );
}
