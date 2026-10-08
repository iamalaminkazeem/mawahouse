import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/footer/Footer";
import { getSettings } from "@/lib/utils/settings";
import { CartProvider } from "@/lib/cart/CartContext";
import FloatingCartButton from "@/components/cart/FloatingCartButton";

export const revalidate = 60;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <>
      {settings.announcementEnabled && settings.announcementText && (
        <div className="bg-mawa-red text-mawa-cream text-center text-sm py-2 px-4">
          {settings.announcementText}
        </div>
      )}
      <CartProvider>
        <Navigation settings={settings} />
        <main>{children}</main>
        <Footer settings={settings} />
        <FloatingCartButton />
      </CartProvider>
    </>
  );
}