"use client";

import { Fragment, useState } from "react";
import { Plus, Trash2, Save, Star, X, ChevronDown, ChevronUp, Tag } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

type AddOn = { id: string; name: string; price: number; available: boolean };

type Item = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  categoryId: string;
  available: boolean;
  featured: boolean;
  addOns: AddOn[];
};

export default function MenuAdminTable({
  initialItems,
  categories,
}: {
  initialItems: Item[];
  categories: { id: string; name: string }[];
}) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [addOnForm, setAddOnForm] = useState({ name: "", price: "" });
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    categoryId: categories[0]?.id || "",
  });

  async function createItem(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/menu-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price),
        imageUrl: form.imageUrl || null,
        categoryId: form.categoryId,
      }),
    });
    setSaving(false);
    if (res.ok) {
      const newItem = await res.json();
      setItems((prev) => [...prev, { ...newItem, addOns: [] }]);
      setForm({ name: "", description: "", price: "", imageUrl: "", categoryId: categories[0]?.id || "" });
      setShowForm(false);
    }
  }

  async function updateItem(id: string, data: Partial<Item>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...data } : i)));
    await fetch(`/api/menu-items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this menu item? This cannot be undone.")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/menu-items/${id}`, { method: "DELETE" });
  }

  async function createAddOn(itemId: string) {
    if (!addOnForm.name.trim() || !addOnForm.price) return;
    const res = await fetch("/api/addons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: addOnForm.name, price: parseFloat(addOnForm.price), menuItemId: itemId }),
    });
    if (res.ok) {
      const addOn = await res.json();
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, addOns: [...i.addOns, addOn] } : i))
      );
      setAddOnForm({ name: "", price: "" });
    }
  }

  async function deleteAddOn(itemId: string, addOnId: string) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId ? { ...i, addOns: i.addOns.filter((a) => a.id !== addOnId) } : i
      )
    );
    await fetch(`/api/addons/${addOnId}`, { method: "DELETE" });
  }

  return (
    <div>
      <button
        onClick={() => setShowForm(!showForm)}
        className="btn-primary !rounded-lg mb-6 text-sm"
      >
        {showForm ? <X size={16} /> : <Plus size={16} />}
        {showForm ? "Cancel" : "Add Menu Item"}
      </button>

      {showForm && (
        <form
          onSubmit={createItem}
          className="bg-white rounded-2xl p-6 border border-black/5 mb-8 grid sm:grid-cols-2 gap-4"
        >
          <input
            required
            placeholder="Item name"
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
            required
            type="number"
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="rounded-lg border border-black/10 px-3 py-2"
          />
          <select
            required
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="rounded-lg border border-black/10 px-3 py-2"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="sm:col-span-2 flex items-center gap-3">
            <ImageUploader
              label={form.imageUrl ? "Change Photo" : "Upload Photo"}
              onUploaded={(url) => setForm({ ...form, imageUrl: url })}
            />
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="Preview"
                className="h-12 w-12 rounded-lg object-cover border border-black/10"
              />
            )}
          </div>

          <button disabled={saving} className="btn-primary !rounded-lg sm:col-span-2 justify-self-start text-sm">
            <Save size={16} /> {saving ? "Saving..." : "Save Item"}
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-black/5 overflow-x-auto">
        <table className="w-full text-sm min-w-[780px]">
          <thead className="bg-mawa-cream text-left">
            <tr>
              <th className="px-4 py-3">Photo</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3 text-center">Available</th>
              <th className="px-4 py-3 text-center">Featured</th>
              <th className="px-4 py-3 text-center">Add-ons</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {items.map((item) => (
              <Fragment key={item.id}>
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-10 w-10 rounded-lg object-cover border border-black/10"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-mawa-brown/10 flex items-center justify-center text-[9px] text-mawa-black/30 text-center">
                          No photo
                        </div>
                      )}
                      <ImageUploader
                        label={item.imageUrl ? "Change" : "Upload"}
                        onUploaded={(url) => updateItem(item.id, { imageUrl: url })}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-mawa-black/60">
                    {categories.find((c) => c.id === item.categoryId)?.name || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={item.price}
                      onBlur={(e) => updateItem(item.id, { price: parseFloat(e.target.value) })}
                      className="w-20 rounded border border-black/10 px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={item.available}
                      onChange={(e) => updateItem(item.id, { available: e.target.checked })}
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => updateItem(item.id, { featured: !item.featured })}>
                      <Star
                        size={18}
                        className={item.featured ? "fill-mawa-gold text-mawa-gold" : "text-black/20"}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                      className="inline-flex items-center gap-1 text-mawa-black/60 hover:text-mawa-red"
                    >
                      <Tag size={14} /> {item.addOns.length}
                      {expanded === item.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => deleteItem(item.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
                {expanded === item.id && (
                  <tr key={`${item.id}-addons`}>
                    <td colSpan={8} className="bg-mawa-cream/50 px-6 py-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-mawa-black/50 mb-3">
                        Add-ons for {item.name} (e.g. "Add Shrimp +$3")
                      </p>
                      <div className="space-y-2 mb-3">
                        {item.addOns.map((a) => (
                          <div key={a.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 text-sm max-w-sm">
                            <span>{a.name} — ${a.price.toFixed(2)}</span>
                            <button onClick={() => deleteAddOn(item.id, a.id)} className="text-red-500">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        {item.addOns.length === 0 && (
                          <p className="text-sm text-mawa-black/40">No add-ons yet.</p>
                        )}
                      </div>
                      <div className="flex gap-2 max-w-sm">
                        <input
                          placeholder="Add-on name"
                          value={addOnForm.name}
                          onChange={(e) => setAddOnForm({ ...addOnForm, name: e.target.value })}
                          className="rounded-lg border border-black/10 px-3 py-1.5 text-sm flex-1"
                        />
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Price"
                          value={addOnForm.price}
                          onChange={(e) => setAddOnForm({ ...addOnForm, price: e.target.value })}
                          className="rounded-lg border border-black/10 px-3 py-1.5 text-sm w-24"
                        />
                        <button
                          onClick={() => createAddOn(item.id)}
                          className="btn-secondary !py-1.5 !px-3 text-sm"
                        >
                          Add
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <p className="text-center text-mawa-black/50 py-10">No menu items yet — add your first one above.</p>
        )}
      </div>
    </div>
  );
}