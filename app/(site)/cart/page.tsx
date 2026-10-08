import CartView from "@/components/cart/CartView";

export default function CartPage() {
  return (
    <div className="container-mawa py-16 max-w-2xl mx-auto">
      <h1 className="section-heading mb-8 text-center">Your Cart</h1>
      <CartView />
    </div>
  );
}
