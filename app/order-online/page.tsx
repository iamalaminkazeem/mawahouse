import { redirect } from "next/navigation";

// Ordering now happens directly on the menu page (Add to Cart → checkout).
// This route is kept so any old links to /order-online still work.
export default function OrderOnlinePage() {
  redirect("/menu");
}
