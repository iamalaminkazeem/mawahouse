"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, EyeOff, Eye } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

type GalleryImg = {
  id: string;
  url: string;
  caption: string | null;
  category: string;
  hidden: boolean;
};

const categories = ["food", "interior", "drinks", "buffet", "atmosphere", "events", "culture", "other"];

export default function GalleryAdminGrid({ initialImages }: { initialImages: GalleryImg[] }) {
  const [images, setImages] = useState<GalleryImg[]>(initialImages);
  const [category, setCategory] = useState("food");

  async function handleUploaded(url: string) {
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, category }),
    });
    if (res.ok) {
      const img = await res.json();
      setImages((prev) => [...prev, img]);
    }
  }

  async function updateImage(id: string, data: Partial<GalleryImg>) {
    setImages((prev) => prev.map((i) => (i.id === id ? { ...i, ...data } : i)));
    await fetch(`/api/gallery/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async function deleteImage(id: string) {
    if (!confirm("Delete this photo?")) return;
    setImages((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
  }

  return (
    <div>
      <div className="bg-white rounded-2xl border border-black/5 p-6 mb-8 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Upload to category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-black/10 px-3 py-2 capitalize"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <ImageUploader onUploaded={handleUploaded} label="Upload Photo" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative rounded-xl overflow-hidden bg-white border border-black/5">
            <div className="relative aspect-square">
              <Image src={img.url} alt={img.caption || ""} fill className="object-cover" />
              {img.hidden && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-medium">
                  Hidden
                </div>
              )}
            </div>
            <div className="p-2 flex items-center justify-between">
              <select
                value={img.category}
                onChange={(e) => updateImage(img.id, { category: e.target.value })}
                className="text-xs rounded border border-black/10 px-1 py-0.5 capitalize"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button onClick={() => updateImage(img.id, { hidden: !img.hidden })}>
                  {img.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button onClick={() => deleteImage(img.id)} className="text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {images.length === 0 && (
        <p className="text-center text-mawa-black/50 py-10">No photos yet — upload your first one above.</p>
      )}
    </div>
  );
}
