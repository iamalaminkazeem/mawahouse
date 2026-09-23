import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [itemCount, categoryCount, galleryCount, specialCount, newOrderCount] = await Promise.all([
    prisma.menuItem.count(),
    prisma.category.count(),
    prisma.galleryImage.count(),
    prisma.special.count({ where: { active: true } }),
    prisma.order.count({ where: { status: "RECEIVED" } }),
  ]);

  const cards = [
    { label: "New Orders", value: newOrderCount, href: "/admin/orders" },
    { label: "Menu Items", value: itemCount, href: "/admin/menu" },
    { label: "Categories", value: categoryCount, href: "/admin/menu/categories" },
    { label: "Gallery Photos", value: galleryCount, href: "/admin/gallery" },
    { label: "Active Specials", value: specialCount, href: "/admin/specials" },
  ];

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-serif text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 hover:shadow-md transition-shadow"
          >
            <p className="text-3xl font-bold text-mawa-red">{c.value}</p>
            <p className="text-sm text-mawa-black/60 mt-1">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 bg-white rounded-2xl p-6 border border-black/5">
        <h2 className="font-semibold mb-3">Quick Tips</h2>
        <ul className="text-sm text-mawa-black/70 space-y-1.5 list-disc list-inside">
          <li>Add photos to menu items — items without photos still show, but photos boost appeal.</li>
          <li>Mark your best sellers as "Featured" so they appear on the homepage.</li>
          <li>Ordering happens right on the Menu page now (cart + checkout) — configure delivery fee/tax under Ordering, and check the Orders tab regularly for new orders.</li>
          <li>The "Our Dishes" items imported from your flyer have no listed price yet — set a price and mark them available before they'll show publicly.</li>
        </ul>
      </div>
    </div>
  );
}
