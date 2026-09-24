import { prisma } from "@/lib/db/prisma";

export async function getSettings() {
  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: "main" },
      update: {},
      create: { id: "main" },
    });
    return settings;
  } catch {
    // DB not reachable at build time — return safe defaults so the site still renders
    return {
      id: "main",
      restaurantName: "MaWa House",
      tagline: "Taste Africa. Feel at Home.",
      address: "524 Main St, Suite B, Atlanta, GA 30011",
      phone: "470-815-6319",
      whatsappNumber: null,
      email: null,
      hours: {},
      heroHeadline: "Where African Flavor Meets Modern Hospitality",
      heroSubtext:
        "Discover a warm and welcoming dining experience inspired by African flavors, culture, and community.",
      heroImageUrl: null,
      heroBadge: null,
      welcomeHeadline: "Good Food. Great People. Stronger Community.",
      welcomeBody: null,
      aboutHeadline: null,
      aboutBody: null,
      aboutImageUrl: null,
      orderOnlineButtonText: "Order Online",
      orderingEnabled: true,
      deliveryEnabled: false,
      deliveryFee: null,
      deliveryMinimum: null,
      deliveryNote: null,
      taxEnabled: false,
      taxMode: "percentage",
      taxRate: null,
      taxFlatAmount: null,
      orderReceivedNote: "Your order has been received and will be reviewed by our team.",
      cateringUrl: null,
      cateringPlatform: null,
      cateringButtonText: "Inquire for Catering",
      googleMapsUrl: null,
      googleMapsEmbedUrl: null,
      instagramUrl: "https://instagram.com/mawahouse_1",
      tiktokUrl: "https://tiktok.com/@mawa.house4",
      facebookUrl: null,
      announcementEnabled: false,
      announcementText: null,
      updatedAt: new Date(),
    };
  }
}