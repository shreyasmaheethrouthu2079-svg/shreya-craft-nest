import Link from "next/link";
import Image from "next/image";
import { Sparkles, MessageCircle, ShoppingBag } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EDE6DD] transition-all">
      {/* Top announcement bar */}
      <div className="bg-[#14532D] text-[#ECFDF5] text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        <span>Festive Season: Free Handcrafted Gift with orders above ₹500 • Pan-India Delivery</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand identity with official logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-300/80 shadow-sm group-hover:scale-105 transition-transform bg-[#F5EFE6] flex-shrink-0">
            <Image
              src="/logo-emblem.png"
              alt="Shreya Craft Nest Official Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 group-hover:text-amber-800 transition-colors">
              Shreya Craft Nest
            </span>
            <p className="text-xs text-stone-500 font-medium tracking-wide flex items-center gap-1.5">
              <span>Handcrafted by Mom</span>
              <span className="inline-block w-1 h-1 rounded-full bg-stone-300"></span>
              <span className="text-emerald-700 font-semibold">Artisanal Creations</span>
            </p>
          </div>
        </Link>

        {/* Navigation links & WhatsApp contact */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/#catalog"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-stone-700 hover:text-amber-800 px-3 py-2 rounded-lg hover:bg-stone-100/60 transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-amber-700" />
            <span>Shop Collection</span>
          </Link>

          <a
            href="https://wa.me/919876543210?text=Hi%20Shreya%2C%20I%20am%20interested%20in%20your%20handmade%20crafts%20collection!"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-medium px-3.5 py-2 rounded-full shadow-sm hover:shadow transition-all"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span className="hidden xs:inline">WhatsApp Inquiries</span>
            <span className="xs:hidden">Chat</span>
          </a>
        </div>
      </div>
    </header>
  );
}
