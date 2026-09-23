import { prisma } from "@/lib/db/prisma";
import OrdersAdminTable from "@/components/admin/OrdersAdminTable";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { addOns: true } } },
    take: 200,
  });

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-serif text-3xl font-bold mb-8">Orders</h1>
      <OrdersAdminTable initialOrders={JSON.parse(JSON.stringify(orders))} />
    </div>
  );
}
