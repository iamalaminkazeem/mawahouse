"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";
import { MapPin, Truck } from "lucide-react";

type Props = {
  deliveryEnabled: boolean;
  deliveryFee: number | null;
  deliveryMinimum: number | null;
  deliveryNote: string | null;
  taxEnabled: boolean;
  taxMode: string;
  taxRate: number | null;
  taxFlatAmount: number | null;
  restaurantAddress: string;
  restaurantPhone: string;
};

export default function CheckoutForm(props: Props) {
  const router = useRouter();
  const { lines, subtotal, clearCart } = useCart();

  const [orderType, setOrderType] = useState<"PICKUP" | "DELIVERY">("PICKUP");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("GA");
  const [zip, setZip] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const deliveryFee =
    orderType === "DELIVERY" && props.deliveryEnabled && props.deliveryFee != null
      ? props.deliveryFee
      : 0;
  const tax = !props.taxEnabled
    ? 0
    : props.taxMode === "flat"
    ? props.taxFlatAmount ?? 0
    : props.taxRate
    ? subtotal * props.taxRate
    : 0;
  const total = subtotal + deliveryFee + tax;

  const belowMinimum =
    orderType === "DELIVERY" &&
    props.deliveryMinimum != null &&
    subtotal < props.deliveryMinimum;

  const canSubmit = useMemo(() => {
    if (lines.length === 0) return false;
    if (!name.trim() || !phone.trim()) return false;
    if (orderType === "DELIVERY" && (!address.trim() || !city.trim() || !zip.trim())) return false;
    if (belowMinimum) return false;
    return true;
  }, [lines, name, phone, orderType, address, city, zip, belowMinimum]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: name,
        customerPhone: phone,
        customerEmail: email || null,
        orderType,
        deliveryAddress: orderType === "DELIVERY" ? address : null,
        deliveryCity: orderType === "DELIVERY" ? city : null,
        deliveryState: orderType === "DELIVERY" ? state : null,
        deliveryZip: orderType === "DELIVERY" ? zip : null,
        deliveryInstructions: orderType === "DELIVERY" ? deliveryInstructions : null,
        specialInstructions,
        items: lines.map((l) => ({
          menuItemId: l.menuItemId,
          itemNameSnapshot: l.name,
          priceSnapshot: l.price,
          quantity: l.quantity,
          specialInstructions: l.specialInstructions,
          addOns: l.addOns.map((a) => ({ nameSnapshot: a.name, priceSnapshot: a.price })),
        })),
        subtotal,
        deliveryFee,
        tax,
        total,
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      setError("Something went wrong submitting your order. Please try again or call us directly.");
      return;
    }

    const order = await res.json();
    clearCart();
    router.push(`/order-confirmation/${order.orderNumber}`);
  }

  if (lines.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-mawa-black/60 mb-6">Your cart is empty.</p>
        <Link href="/menu" className="btn-primary">Browse the Menu</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Order type */}
      <div>
        <h2 className="font-semibold mb-3">Order Type</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setOrderType("PICKUP")}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 py-5 transition-colors ${
              orderType === "PICKUP" ? "border-mawa-red bg-mawa-red/5" : "border-black/10"
            }`}
          >
            <MapPin size={22} className={orderType === "PICKUP" ? "text-mawa-red" : "text-black/40"} />
            <span className="text-sm font-medium">Pickup</span>
          </button>
          <button
            type="button"
            disabled={!props.deliveryEnabled}
            onClick={() => setOrderType("DELIVERY")}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 py-5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              orderType === "DELIVERY" ? "border-mawa-red bg-mawa-red/5" : "border-black/10"
            }`}
          >
            <Truck size={22} className={orderType === "DELIVERY" ? "text-mawa-red" : "text-black/40"} />
            <span className="text-sm font-medium">Delivery</span>
          </button>
        </div>
        {orderType === "PICKUP" && (
          <p className="text-sm text-mawa-black/60 mt-3">Pickup at {props.restaurantAddress}</p>
        )}
        {orderType === "DELIVERY" && !props.deliveryFee && (
          <p className="text-sm text-mawa-black/50 mt-3">
            {props.deliveryNote || "Delivery fee will be confirmed by MaWa House."}
          </p>
        )}
      </div>

      {/* Customer info */}
      <div>
        <h2 className="font-semibold mb-3">Your Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            required
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-black/10 px-3 py-2 sm:col-span-2"
          />
          <input
            required
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-lg border border-black/10 px-3 py-2"
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-black/10 px-3 py-2"
          />
        </div>
      </div>

      {/* Delivery address */}
      {orderType === "DELIVERY" && (
        <div>
          <h2 className="font-semibold mb-3">Delivery Address</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              required
              placeholder="Street address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="rounded-lg border border-black/10 px-3 py-2 sm:col-span-2"
            />
            <input
              required
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-lg border border-black/10 px-3 py-2"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                required
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="rounded-lg border border-black/10 px-3 py-2"
              />
              <input
                required
                placeholder="ZIP"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="rounded-lg border border-black/10 px-3 py-2"
              />
            </div>
            <textarea
              placeholder="Delivery instructions (optional)"
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              className="rounded-lg border border-black/10 px-3 py-2 sm:col-span-2"
            />
          </div>
          {belowMinimum && (
            <p className="text-sm text-red-600 mt-2">
              Minimum order for delivery is ${props.deliveryMinimum?.toFixed(2)}.
            </p>
          )}
        </div>
      )}

      {/* Notes */}
      <div>
        <h2 className="font-semibold mb-3">Order Notes (optional)</h2>
        <textarea
          maxLength={300}
          placeholder="Anything else we should know about your order?"
          value={specialInstructions}
          onChange={(e) => setSpecialInstructions(e.target.value)}
          className="w-full rounded-lg border border-black/10 px-3 py-2"
        />
      </div>

      {/* Review */}
      <div className="bg-white rounded-2xl border border-black/5 p-5">
        <h2 className="font-semibold mb-3">Order Summary</h2>
        <div className="space-y-1.5 text-sm">
          {lines.map((l) => (
            <div key={l.lineId} className="flex justify-between text-mawa-black/70">
              <span>{l.quantity}× {l.name}</span>
              <span>
                ${((l.price + l.addOns.reduce((s, a) => s + a.price, 0)) * l.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-black/10 mt-3 pt-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {deliveryFee > 0 && (
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
          )}
          {tax > 0 && (
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-base pt-1">
            <span>Total</span>
            <span className="text-mawa-red">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      <p className="text-xs text-mawa-black/50">
        No online payment is collected — {props.restaurantAddress ? "MaWa House" : "the restaurant"}{" "}
        will confirm your order and collect payment at {orderType === "PICKUP" ? "pickup" : "delivery"}.
      </p>

      <button type="submit" disabled={!canSubmit || submitting} className="btn-primary w-full !rounded-lg disabled:opacity-50">
        {submitting ? "Placing Order..." : "Place Order"}
      </button>
    </form>
  );
}