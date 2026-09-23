"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";

type AddOn = { id: string; name: string; price: number; available: boolean };
type Item = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  addOns: AddOn[];
};

export default function AddToCartModal({ item, onClose }: { item: Item; onClose: () => void }) {
  const { addLine } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [notes, setNotes] = useState("");
  const [added, setAdded] = useState(false);

  const availableAddOns = item.addOns.filter((a) => a.available);
  const addOnTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const lineTotal = (item.price + addOnTotal) * quantity;

  function toggleAddOn(addOn: AddOn) {
    setSelectedAddOns((prev) =>
      prev.some((a) => a.id === addOn.id) ? prev.filter((a) => a.id !== addOn.id) : [...prev, addOn]
    );
  }

  function handleAdd() {
    addLine({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      quantity,
      addOns: selectedAddOns.map((a) => ({ id: a.id, name: a.name, price: a.price })),
      specialInstructions: notes.slice(0, 200),
    });
    setAdded(true);
    setTimeout(onClose, 700);
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {item.imageUrl && (
            <div className="relative h-44 w-full">
              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/90 rounded-full p-1.5"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start gap-3">
            <h2 className="font-serif text-xl font-semibold">{item.name}</h2>
            <span className="text-mawa-red font-semibold shrink-0">${item.price.toFixed(2)}</span>
          </div>
          {item.description && (
            <p className="text-sm text-mawa-black/60 mt-1.5">{item.description}</p>
          )}

          {availableAddOns.length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-semibold mb-2">Add-ons</h3>
              <div className="space-y-2">
                {availableAddOns.map((a) => (
                  <label
                    key={a.id}
                    className="flex items-center justify-between text-sm border border-black/10 rounded-lg px-3 py-2 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedAddOns.some((s) => s.id === a.id)}
                        onChange={() => toggleAddOn(a)}
                      />
                      {a.name}
                    </span>
                    <span className="text-mawa-black/60">+${a.price.toFixed(2)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5">
            <h3 className="text-sm font-semibold mb-2">Special Instructions</h3>
            <textarea
              maxLength={200}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. extra spicy, no onions..."
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-3 border border-black/10 rounded-full px-3 py-1.5">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                <Minus size={16} />
              </button>
              <span className="w-6 text-center">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity">
                <Plus size={16} />
              </button>
            </div>
            <button onClick={handleAdd} className="btn-primary !rounded-full text-sm">
              {added ? "Added ✓" : `Add to Cart · $${lineTotal.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
