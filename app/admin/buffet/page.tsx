import { prisma } from "@/lib/db/prisma";
import BuffetAdminTable from "@/components/admin/BuffetAdminTable";

export default async function AdminBuffetPage() {
  const entries = await prisma.buffetEntry.findMany({ orderBy: { createdAt: "asc" } });
  return (
    <div className="p-6 md:p-10">
      <h1 className="font-serif text-3xl font-bold mb-8">Buffet</h1>
      <BuffetAdminTable initialEntries={JSON.parse(JSON.stringify(entries))} />
    </div>
  );
}
