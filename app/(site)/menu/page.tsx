import { prisma } from "@/lib/db/prisma";
import MenuBrowser from "@/components/menu/MenuBrowser";
import { getSettings } from "@/lib/utils/settings";

export const revalidate = 60;

export default async function MenuPage() {
  const settings = await getSettings();
  let categories: any[] = [];
  try {
    categories = await prisma.category.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
      include: {
        items: {
          where: { available: true },
          orderBy: { sortOrder: "asc" },
          include: { addOns: true },
        },
      },
    });
    categories = categories.filter((c) => c.items.length > 0);
  } catch {
    categories = [];
  }

  return (
    <div className="container-mawa py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="uppercase tracking-[0.2em] text-mawa-gold text-xs font-semibold mb-4">
          MaWa House Menu
        </p>
        <h1 className="section-heading mb-4">Taste Africa. Feel at Home.</h1>
        <p className="text-mawa-black/70">
          Every dish is made with care, using recipes rooted in West African tradition.
        </p>
      </div>
      <MenuBrowser categories={categories} />
    </div>
  );
}
