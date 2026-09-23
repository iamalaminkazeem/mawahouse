"use client";

import { useState } from "react";
import { Plus, Trash2, X, Save } from "lucide-react";

type BuffetEntry = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  days: string[];
  startTime: string | null;
  endTime: string | null;
  available: boolean;
};

const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function BuffetAdminTable({ initialEntries }: { initialEntries: BuffetEntry[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    days: [] as string[],
    startTime: "",
    endTime: "",
  });

  function toggleDay(day: string) {
    setForm((f) => ({
      ...f,
      days: f.days.includes(day) ? f.days.filter((d) => d !== day) : [...f.days, day],
    }));
  }

  async function createEntry(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/buffet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      const entry = await res.json();
      setEntries((prev) => [...prev, entry]);
      setForm({ name: "", description: "", price: "", days: [], startTime: "", endTime: "" });
      setShowForm(false);
    }
  }

  async function deleteEntry(id: string) {
    if (!confirm("Delete this buffet entry?")) return;
    setEntries((prev) => prev.filter((e) => e.id !== id));
    await fetch(`/api/buffet/${id}`, { method: "DELETE" });
  }

  return (
    <div>
      <p className="text-sm text-mawa-black/60 mb-4 max-w-xl">
        No buffet schedule was listed on your original flyer, so this section starts empty. Add
        entries here whenever your buffet offering is ready — it won't show publicly until you do.
      </p>

      <button onClick={() => setShowForm(!showForm)} className="btn-primary !rounded-lg mb-6 text-sm">
        {showForm ? <X size={16} /> : <Plus size={16} />}
        {showForm ? "Cancel" : "Add Buffet Entry"}
      </button>

      {showForm && (
        <form onSubmit={createEntry} className="bg-white rounded-2xl p-6 border border-black/5 mb-8 grid sm:grid-cols-2 gap-4">
          <input
            required
            placeholder="Buffet name, e.g. Sunday Buffet"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg border border-black/10 px-3 py-2 sm:col-span-2"
          />
          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="rounded-lg border border-black/10 px-3 py-2 sm:col-span-2"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price (optional)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="rounded-lg border border-black/10 px-3 py-2"
          />
          <div className="flex gap-2">
            <input
              placeholder="Start (e.g. 12:00 PM)"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              className="rounded-lg border border-black/10 px-3 py-2 w-full"
            />
            <input
              placeholder="End (e.g. 3:00 PM)"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              className="rounded-lg border border-black/10 px-3 py-2 w-full"
            />
          </div>
          <div className="sm:col-span-2 flex gap-2 flex-wrap">
            {dayOptions.map((d) => (
              <button
                type="button"
                key={d}
                onClick={() => toggleDay(d)}
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  form.days.includes(d) ? "bg-mawa-red text-white border-mawa-red" : "border-black/10"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <button disabled={saving} className="btn-primary !rounded-lg sm:col-span-2 justify-self-start text-sm">
            <Save size={16} /> {saving ? "Saving..." : "Save Entry"}
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5">
        {entries.map((e) => (
          <div key={e.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="font-medium">{e.name}</p>
              <p className="text-xs text-mawa-black/50">
                {e.days.join(", ") || "No days set"} · {e.startTime || "—"} to {e.endTime || "—"}
                {e.price ? ` · $${e.price.toFixed(2)}` : ""}
              </p>
            </div>
            <button onClick={() => deleteEntry(e.id)} className="text-red-500 hover:text-red-700">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {entries.length === 0 && (
          <p className="text-center text-mawa-black/50 py-10">No buffet entries yet.</p>
        )}
      </div>
    </div>
  );
}
