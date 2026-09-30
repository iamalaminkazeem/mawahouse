import Link from "next/link";
import { Instagram, MapPin, Phone, Facebook } from "lucide-react";

// lucide-react has no TikTok logo (trademark reasons), so it's a small inline SVG icon instead.
function TikTokIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M16.6 5.82a4.28 4.28 0 0 1-2.72-1.3A4.26 4.26 0 0 1 12.6 1.5h-2.9v14.1a2.6 2.6 0 1 1-1.86-2.5V9.9a5.5 5.5 0 1 0 4.76 5.45V9.06a7.16 7.16 0 0 0 4 1.22V7.3a4.26 4.26 0 0 1-.9-.09v-1.4z" />
    </svg>
  );
}

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
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-mawa-gold"
            >
              <Instagram size={16} className="text-mawa-gold shrink-0" /> @mawahouse_1
            </a>
          )}
          {settings.tiktokUrl && (
            <a
              href={settings.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-mawa-gold"
            >
              <TikTokIcon className="text-mawa-gold shrink-0" /> TikTok
            </a>
          )}
          {settings.facebookUrl && (
            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-mawa-gold"
            >
              <Facebook size={16} className="text-mawa-gold shrink-0" /> Facebook
            </a>
          )}
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link href="/menu" className="hover:text-mawa-gold">Menu</Link>
          <Link href="/catering" className="hover:text-mawa-gold">Catering Events</Link>
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