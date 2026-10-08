import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} font-sans bg-mawa-cream text-mawa-black`}>
        {children}
      </body>
    </html>
  );
}