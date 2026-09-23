import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/footer/Footer";
import { getSettings } from "@/lib/utils/settings";
import { CartProvider } from "@/lib/cart/CartContext";
import FloatingCartButton from "@/components/cart/FloatingCartButton";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "600", "700", "800"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "MaWa House | Authentic African Cuisine — Atlanta, GA",
  description:
    "MaWa House brings authentic African cuisine to Atlanta. Dine in, takeout, or order online. Taste Africa. Feel at Home.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} font-sans bg-mawa-cream text-mawa-black`}>
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
      </body>
    </html>
  );
}
