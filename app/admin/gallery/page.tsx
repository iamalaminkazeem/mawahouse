import { prisma } from "@/lib/db/prisma";
import GalleryAdminGrid from "@/components/admin/GalleryAdminGrid";

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div className="p-6 md:p-10">
      <h1 className="font-serif text-3xl font-bold mb-8">Gallery</h1>
      <GalleryAdminGrid initialImages={JSON.parse(JSON.stringify(images))} />
    </div>
  );
}
