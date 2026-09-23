"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search, Plus } from "lucide-react";
import AddToCartModal from "./AddToCartModal";

export default function MenuBrowser({ categories }: { categories: any[] }) {
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [modalItem, setModalItem] = useState<any | null>(null);

  const filtered = useMemo(() => {
    return categories
      .filter((c) => active === "all" || c.id === active)
      .map((c) => ({
        ...c,
        items: c.items.filter((item: any) => {
          if (!query.trim()) return true;
          const q = query.toLowerCase();
          return (
            item.name.toLowerCase().includes(q) ||
            (item.description || "").toLowerCase().includes(q) ||
            c.name.toLowerCase().includes(q)
          );
        }),
      }))
      .filter((c) => c.items.length > 0);
  }, [categories, active, query]);

  if (categories.length === 0) {
    return (
      <p className="text-center text-mawa-black/50 py-20">
        Menu items coming soon — check back shortly!
      </p>
    );
  }

  return (
    <div>
      {/* Search */}
      <div className="relative max-w-md mx-auto mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-mawa-black/40" />
        <input
          type="text"
          placeholder="Search the menu..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-full border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-mawa-gold"
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-3 overflow-x-auto pb-3 mb-10 scrollbar-hide">
        <button
          onClick={() => setActive("all")}
          className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
            active === "all"
              ? "bg-mawa-red text-mawa-cream border-mawa-red"
              : "border-black/10 hover:border-mawa-red"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
              active === c.id
                ? "bg-mawa-red text-mawa-cream border-mawa-red"
                : "border-black/10 hover:border-mawa-red"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-14">
        {filtered.map((c) => (
          <div key={c.id}>
            <h2 className="font-serif text-2xl font-semibold mb-6 text-mawa-red">{c.name}</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {c.items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-xl border border-black/5 bg-white hover:shadow-md transition-shadow"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-mawa-brown/10">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-[10px] text-mawa-black/30 text-center px-1">
                        No photo
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <h3 className="font-medium">{item.name}</h3>
                      <span className="text-mawa-red font-semibold shrink-0">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-mawa-black/60 mt-1">{item.description}</p>
                    )}
                    <button
                      onClick={() => setModalItem(item)}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-mawa-red border border-mawa-red rounded-full px-3 py-1 hover:bg-mawa-red hover:text-white transition-colors"
                    >
                      <Plus size={12} /> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-mawa-black/50 py-10">No dishes match your search.</p>
        )}
      </div>

      {modalItem && <AddToCartModal item={modalItem} onClose={() => setModalItem(null)} />}
    </div>
  );
}
