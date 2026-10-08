import { prisma } from "@/lib/db/prisma";
import GalleryGrid from "@/components/gallery/GalleryGrid";

export const revalidate = 60;

export default async function GalleryPage() {
  let images: any[] = [];
  try {
    images = await prisma.galleryImage.findMany({
      where: { hidden: false },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    images = [];
  }

  return (
    <div className="container-mawa py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="uppercase tracking-[0.2em] text-mawa-gold text-xs font-semibold mb-4">
          Gallery
        </p>
        <h1 className="section-heading">A Taste of MaWa House</h1>
      </div>
      <GalleryGrid images={images} />
    </div>
  );
}
