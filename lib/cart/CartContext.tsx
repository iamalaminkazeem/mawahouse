"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CartAddOn = { id: string; name: string; price: number };

export type CartLine = {
  lineId: string; // unique per cart line (same item + different add-ons/notes = different line)
  menuItemId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  addOns: CartAddOn[];
  specialInstructions: string;
};

type CartContextType = {
  lines: CartLine[];
  addLine: (line: Omit<CartLine, "lineId">) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "mawa-house-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore corrupted cart data
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage unavailable — cart just won't persist across reloads
    }
  }, [lines, hydrated]);

  function addLine(line: Omit<CartLine, "lineId">) {
    const lineId = `${line.menuItemId}-${line.addOns.map((a) => a.id).sort().join(",")}-${line.specialInstructions}-${Date.now()}`;
    setLines((prev) => [...prev, { ...line, lineId }]);
  }

  function updateQuantity(lineId: string, quantity: number) {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.lineId !== lineId)
        : prev.map((l) => (l.lineId === lineId ? { ...l, quantity } : l))
    );
  }

  function removeLine(lineId: string) {
    setLines((prev) => prev.filter((l) => l.lineId !== lineId));
  }

  function clearCart() {
    setLines([]);
  }

  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => {
    const addOnTotal = l.addOns.reduce((a, ao) => a + ao.price, 0);
    return sum + (l.price + addOnTotal) * l.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ lines, addLine, updateQuantity, removeLine, clearCart, itemCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
