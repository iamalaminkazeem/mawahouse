import Link from "next/link";
import { Instagram, MapPin, Phone } from "lucide-react";

export default function Footer({ settings }: { settings: any }) {
  return (
    <footer className="bg-mawa-black text-mawa-cream/90 mt-20">
      <div className="container-mawa py-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <h3 className="font-serif text-2xl text-mawa-gold mb-3">MaWa House</h3>
          <p className="text-sm text-mawa-cream/70">{settings.tagline}</p>
        </div>
        <div className="text-sm space-y-2">
          <p className="flex items-center gap-2">
            <MapPin size={16} className="text-mawa-gold shrink-0" /> {settings.address}
          </p>
          <p className="flex items-center gap-2">
            <Phone size={16} className="text-mawa-gold shrink-0" /> {settings.phone}
          </p>
          {settings.instagramUrl && (
            <a
              href={settings.instagramUrl}
              target="_blank"
              className="flex items-center gap-2 hover:text-mawa-gold"
            >
              <Instagram size={16} className="text-mawa-gold shrink-0" /> @mawahouse_1
            </a>
          )}
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link href="/menu" className="hover:text-mawa-gold">Menu</Link>
          <Link href="/reservations" className="hover:text-mawa-gold">Reservations</Link>
          <Link href="/order-online" className="hover:text-mawa-gold">Order Online</Link>
          <Link href="/contact" className="hover:text-mawa-gold">Contact</Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-mawa-cream/50">
        © {new Date().getFullYear()} MaWa House. All rights reserved.
      </div>
    </footer>
  );
}
