"use client";

import { useState } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";

type Special = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  active: boolean;
  startDate: string | null;
  endDate: string | null;
};

export default function SpecialsAdminTable({ initialSpecials }: { initialSpecials: Special[] }) {
  const [specials, setSpecials] = useState<Special[]>(initialSpecials);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", startDate: "", endDate: "" });

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/specials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      const created = await res.json();
      setSpecials((prev) => [...prev, created]);
      setForm({ name: "", description: "", price: "", startDate: "", endDate: "" });
      setShowForm(false);
    }
  }

  async function update(id: string, data: Partial<Special>) {
    setSpecials((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    await fetch(`/api/specials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async function remove(id: string) {
    if (!confirm("Delete this special?")) return;
    setSpecials((prev) => prev.filter((s) => s.id !== id));
    await fetch(`/api/specials/${id}`, { method: "DELETE" });
  }

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)} className="btn-primary !rounded-lg mb-6 text-sm">
        {showForm ? <X size={16} /> : <Plus size={16} />}
        {showForm ? "Cancel" : "Add Special"}
      </button>

      {showForm && (
        <form onSubmit={create} className="bg-white rounded-2xl p-6 border border-black/5 mb-8 grid sm:grid-cols-2 gap-4">
          <input required placeholder="Special name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg border border-black/10 px-3 py-2 sm:col-span-2" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-lg border border-black/10 px-3 py-2 sm:col-span-2" />
          <input type="number" step="0.01" placeholder="Price (optional)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded-lg border border-black/10 px-3 py-2" />
          <div className="flex gap-2">
            <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="rounded-lg border border-black/10 px-3 py-2 flex-1" />
            <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="rounded-lg border border-black/10 px-3 py-2 flex-1" />
          </div>
          <button disabled={saving} className="btn-primary !rounded-lg sm:col-span-2 justify-self-start text-sm">
            <Save size={16} /> {saving ? "Saving..." : "Save Special"}
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5">
        {specials.map((s) => (
          <div key={s.id} className="flex items-center gap-4 px-5 py-3.5 flex-wrap">
            <span className="font-medium flex-1 min-w-[140px]">{s.name}</span>
            {s.price != null && <span className="text-mawa-red font-semibold">${s.price.toFixed(2)}</span>}
            <label className="flex items-center gap-1.5 text-sm">
              <input type="checkbox" checked={s.active} onChange={(e) => update(s.id, { active: e.target.checked })} /> Active
            </label>
            <button onClick={() => remove(s.id)} className="text-red-500 hover:text-red-700">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {specials.length === 0 && <p className="text-center text-mawa-black/50 py-10">No specials yet.</p>}
      </div>
    </div>
  );
}
