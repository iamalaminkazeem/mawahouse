"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

const categories = ["all", "food", "interior", "drinks", "buffet", "atmosphere", "events", "culture", "other"];

export default function GalleryGrid({ images }: { images: any[] }) {
  const [active, setActive] = useState("all");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered = useMemo(
    () => (active === "all" ? images : images.filter((i) => i.category === active)),
    [images, active]
  );

  if (images.length === 0) {
    return (
      <p className="text-center text-mawa-black/50 py-20">
        Gallery photos coming soon — check back shortly!
      </p>
    );
  }

  return (
    <div>
      <div className="flex gap-3 overflow-x-auto pb-3 mb-10 justify-center flex-wrap">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border capitalize transition-colors ${
              active === c
                ? "bg-mawa-red text-mawa-cream border-mawa-red"
                : "border-black/10 hover:border-mawa-red"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="columns-2 sm:columns-3 gap-4 space-y-4">
        {filtered.map((img) => (
          <button
            key={img.id}
            onClick={() => setLightbox(img.url)}
            className="block w-full break-inside-avoid rounded-xl overflow-hidden relative group"
          >
            <Image
              src={img.url}
              alt={img.caption || "MaWa House"}
              width={500}
              height={500}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute top-6 right-6 text-white"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X size={32} />
          </button>
          <Image
            src={lightbox}
            alt="MaWa House"
            width={1000}
            height={1000}
            className="max-h-[85vh] w-auto object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
