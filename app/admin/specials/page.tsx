import { prisma } from "@/lib/db/prisma";
import SpecialsAdminTable from "@/components/admin/SpecialsAdminTable";

export default async function AdminSpecialsPage() {
  const specials = await prisma.special.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div className="p-6 md:p-10">
      <h1 className="font-serif text-3xl font-bold mb-8">Specials</h1>
      <SpecialsAdminTable initialSpecials={JSON.parse(JSON.stringify(specials))} />
    </div>
  );
}
