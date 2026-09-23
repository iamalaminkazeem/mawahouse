import { prisma } from "@/lib/db/prisma";
import MenuAdminTable from "@/components/admin/MenuAdminTable";

export default async function AdminMenuPage() {
  const [items, categories] = await Promise.all([
    prisma.menuItem.findMany({
      orderBy: [{ categoryId: "asc" }, { sortOrder: "asc" }],
      include: { category: true, addOns: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-serif text-3xl font-bold mb-8">Menu Items</h1>
      <MenuAdminTable
        initialItems={JSON.parse(JSON.stringify(items))}
        categories={JSON.parse(JSON.stringify(categories))}
      />
    </div>
  );
}
