"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";

export default function CartView() {
  const { lines, updateQuantity, removeLine, subtotal } = useCart();

  if (lines.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag size={40} className="mx-auto text-mawa-gold mb-5" />
        <p className="text-mawa-black/60 mb-6">Your cart is empty.</p>
        <Link href="/menu" className="btn-primary">
          Browse the Menu
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {lines.map((line) => {
          const addOnTotal = line.addOns.reduce((sum, a) => sum + a.price, 0);
          const lineTotal = (line.price + addOnTotal) * line.quantity;
          return (
            <div
              key={line.lineId}
              className="flex gap-4 p-4 rounded-xl border border-black/5 bg-white"
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-mawa-brown/10">
                {line.imageUrl ? (
                  <Image src={line.imageUrl} alt={line.name} fill className="object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-[9px] text-mawa-black/30 text-center px-1">
                    No photo
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <h3 className="font-medium">{line.name}</h3>
                  <span className="text-mawa-red font-semibold shrink-0">
                    ${lineTotal.toFixed(2)}
                  </span>
                </div>
                {line.addOns.length > 0 && (
                  <p className="text-xs text-mawa-black/50 mt-0.5">
                    + {line.addOns.map((a) => a.name).join(", ")}
                  </p>
                )}
                {line.specialInstructions && (
                  <p className="text-xs text-mawa-black/50 italic mt-0.5">
                    "{line.specialInstructions}"
                  </p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 border border-black/10 rounded-full px-2.5 py-1">
                    <button
                      onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-5 text-center text-sm">{line.quantity}</span>
                    <button
                      onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeLine(line.lineId)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 border-t border-black/10 pt-5 flex items-center justify-between">
        <span className="font-medium">Subtotal</span>
        <span className="font-serif text-xl font-semibold text-mawa-red">
          ${subtotal.toFixed(2)}
        </span>
      </div>
      <p className="text-xs text-mawa-black/50 mt-1">
        Delivery fee and tax (if applicable) are calculated at checkout.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Link href="/menu" className="btn-secondary flex-1 text-center">
          Continue Ordering
        </Link>
        <Link href="/checkout" className="btn-primary flex-1 text-center">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
