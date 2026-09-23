"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/catering", label: "Catering Events" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation({ settings }: { settings: any }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Ordering is now a custom cart built into the menu page — no external platform link
  const orderHref = "/menu";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-mawa-cream/95 backdrop-blur shadow-md" : "bg-mawa-cream/80 backdrop-blur"
      }`}
    >
      <div className="container-mawa flex items-center justify-between h-20">
        <Link href="/" className="font-serif text-2xl font-bold text-mawa-red">
          MaWa House
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium tracking-wide hover:text-mawa-red transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link href="/catering" className="btn-secondary !py-2 !px-4 text-sm">
            {settings.cateringButtonText || "Catering"}
          </Link>
          <Link href={orderHref} className="btn-primary !py-2 !px-4 text-sm">
            {settings.orderOnlineButtonText || "Order Online"}
          </Link>
        </div>

        <button
          className="lg:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-mawa-cream border-t border-mawa-gold/30 px-5 pb-6 pt-2 space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-base font-medium border-b border-black/5"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-4">
            <Link href="/catering" className="btn-secondary" onClick={() => setOpen(false)}>
              {settings.cateringButtonText || "Catering"}
            </Link>
            <Link href={orderHref} className="btn-primary" onClick={() => setOpen(false)}>
              {settings.orderOnlineButtonText || "Order Online"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}