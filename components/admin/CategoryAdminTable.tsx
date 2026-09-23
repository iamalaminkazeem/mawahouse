"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Eye, EyeOff, X } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  section: string;
  sortOrder: number;
  visible: boolean;
  _count: { items: number };
};

const sections = [
  "breakfast",
  "lunch",
  "dinner",
  "drinks",
  "starters",
  "main",
  "specials",
  "buffet",
  "other",
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CategoryAdminTable({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [section, setSection] = useState("other");

  async function createCategory(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug: slugify(name),
        section,
        sortOrder: categories.length,
      }),
    });
    setSaving(false);
    if (res.ok) {
      const created = await res.json();
      setCategories((prev) => [...prev, { ...created, _count: { items: 0 } }]);
      setName("");
      setShowForm(false);
    }
  }

  async function toggleVisible(id: string, visible: boolean) {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, visible } : c)));
    await fetch(`/api/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible }),
    });
  }

  async function renameCategory(id: string, newName: string) {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name: newName } : c)));
    await fetch(`/api/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
  }

  async function deleteCategory(id: string, itemCount: number) {
    if (itemCount > 0) {
      if (
        !confirm(
          `This category has ${itemCount} menu item(s) — deleting it will delete those items too. Continue?`
        )
      )
        return;
    } else if (!confirm("Delete this category?")) return;

    setCategories((prev) => prev.filter((c) => c.id !== id));
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
  }

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)} className="btn-primary !rounded-lg mb-6 text-sm">
        {showForm ? <X size={16} /> : <Plus size={16} />}
        {showForm ? "Cancel" : "Add Category"}
      </button>

      {showForm && (
        <form
          onSubmit={createCategory}
          className="bg-white rounded-2xl p-6 border border-black/5 mb-8 flex flex-wrap gap-3 items-end"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Category Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Breakfast Specials"
              className="rounded-lg border border-black/10 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Section</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="rounded-lg border border-black/10 px-3 py-2 capitalize"
            >
              {sections.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <button disabled={saving} className="btn-primary !rounded-lg text-sm">
            <Save size={16} /> {saving ? "Saving..." : "Save"}
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center gap-4 px-5 py-3.5 flex-wrap">
            <input
              defaultValue={c.name}
              onBlur={(e) => e.target.value !== c.name && renameCategory(c.id, e.target.value)}
              className="font-medium flex-1 min-w-[160px] rounded border border-transparent hover:border-black/10 focus:border-mawa-gold px-2 py-1 -mx-2"
            />
            <span className="text-xs text-mawa-black/50 capitalize">{c.section}</span>
            <span className="text-xs text-mawa-black/40">{c._count.items} item(s)</span>
            <button
              onClick={() => toggleVisible(c.id, !c.visible)}
              className="text-mawa-black/60 hover:text-mawa-black"
              title={c.visible ? "Visible on site" : "Hidden from site"}
            >
              {c.visible ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <button
              onClick={() => deleteCategory(c.id, c._count.items)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-center text-mawa-black/50 py-10">No categories yet.</p>
        )}
      </div>
    </div>
  );
}
