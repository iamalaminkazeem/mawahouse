"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";

export default function FloatingCartButton() {
  const { itemCount, subtotal } = useCart();

  if (itemCount === 0) return null;

  return (
    <Link
      href="/cart"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-mawa-red text-mawa-cream px-6 py-3.5 rounded-full shadow-xl hover:bg-mawa-red-dark transition-colors"
    >
      <span className="relative">
        <ShoppingCart size={20} />
        <span className="absolute -top-2 -right-2 bg-mawa-gold text-mawa-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {itemCount}
        </span>
      </span>
      <span className="text-sm font-medium">View Cart · ${subtotal.toFixed(2)}</span>
    </Link>
  );
}
