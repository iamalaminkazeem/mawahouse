import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db/prisma";
import { getSettings } from "@/lib/utils/settings";

export default async function HomePage() {
  const settings = await getSettings();

  let featured: any[] = [];
  try {
    featured = await prisma.menuItem.findMany({
      where: { featured: true, available: true },
      take: 6,
      orderBy: { sortOrder: "asc" },
      include: { category: true },
    });
    if (featured.length === 0) {
      featured = await prisma.menuItem.findMany({
        where: { available: true },
        take: 6,
        orderBy: { sortOrder: "asc" },
        include: { category: true },
      });
    }
  } catch {
    featured = [];
  }

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {settings.heroImageUrl ? (
            <Image
              src={settings.heroImageUrl}
              alt="MaWa House"
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-mawa-red via-mawa-red-dark to-mawa-black" />
          )}
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <div className="container-mawa relative z-10 text-mawa-cream fade-up">
          {settings.heroBadge && (
            <span className="inline-block bg-mawa-gold text-mawa-black text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
              {settings.heroBadge}
            </span>
          )}
          <h1 className="font-serif text-4xl sm:text-6xl font-bold leading-tight max-w-3xl">
            {settings.heroHeadline}
          </h1>
          <p className="mt-6 text-lg text-mawa-cream/85 max-w-xl">{settings.heroSubtext}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/menu" className="btn-primary">View Menu</Link>
            <Link href="/catering" className="btn-secondary !border-mawa-gold-light !text-mawa-cream hover:!text-mawa-black">
              {settings.cateringButtonText || "Catering"}
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="container-mawa py-20 text-center max-w-2xl mx-auto fade-up">
        <p className="uppercase tracking-[0.2em] text-mawa-gold text-xs font-semibold mb-4">
          Welcome to MaWa House
        </p>
        <h2 className="section-heading mb-5">{settings.welcomeHeadline}</h2>
        <p className="text-mawa-black/70 leading-relaxed">
          {settings.welcomeBody ||
            "MaWa House brings the flavors, warmth, and community of African cuisine to Atlanta — a place to gather, share a meal, and feel at home."}
        </p>
      </section>

      {/* FEATURED DISHES */}
      {featured.length > 0 && (
        <section className="bg-white py-20">
          <div className="container-mawa">
            <div className="flex items-end justify-between mb-10">
              <h2 className="section-heading">Featured Dishes</h2>
              <Link href="/menu" className="text-mawa-red font-medium hover:underline">
                View Full Menu →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-2xl overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-mawa-cream"
                >
                  <div className="relative h-48 bg-mawa-brown/10">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-mawa-black/30 text-sm">
                        Photo coming soon
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-serif text-lg font-semibold">{item.name}</h3>
                      <span className="text-mawa-red font-semibold">${item.price.toFixed(2)}</span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-mawa-black/60 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ORDER + CATERING CTA STRIP */}
      <section className="py-20 bg-mawa-black text-mawa-cream text-center">
        <div className="container-mawa">
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4">
            Hungry? Let's fix that.
          </h2>
          <p className="text-mawa-cream/70 mb-8 max-w-xl mx-auto">
            Order online for pickup or delivery, or book MaWa House catering for your next event.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/menu" className="btn-primary">
              {settings.orderOnlineButtonText || "Order Online"}
            </Link>
            <Link href="/catering" className="btn-secondary !text-mawa-cream hover:!text-mawa-black">
              {settings.cateringButtonText || "Catering"}
            </Link>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="container-mawa py-20 grid sm:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="section-heading mb-4">Visit Us</h2>
          <p className="text-mawa-black/70 mb-2">{settings.address}</p>
          <p className="text-mawa-black/70 mb-6">{settings.phone}</p>
          {settings.googleMapsUrl && (
            <a href={settings.googleMapsUrl} target="_blank" className="btn-secondary">
              Get Directions
            </a>
          )}
        </div>
        <div className="rounded-2xl overflow-hidden aspect-video bg-mawa-brown/10 flex items-center justify-center text-mawa-black/40 text-sm">
          {settings.googleMapsEmbedUrl ? (
            <iframe src={settings.googleMapsEmbedUrl} className="w-full h-full border-0" loading="lazy" />
          ) : (
            "Map coming soon"
          )}
        </div>
      </section>
    </>
  );
}