import Link from "next/link";
import Image from "next/image";
import { MessageCircle, ShieldCheck, Sparkles, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-20 border-t border-stone-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand & Story */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-amber-500/40 bg-[#FAF7F2] flex-shrink-0">
                <Image
                  src="/logo-emblem.png"
                  alt="Shreya Craft Nest Logo"
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-wide">
                Shreya Craft Nest
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-md">
              A heartwarming mother-daughter handmade studio. We create small-batch, sustainably stitched canvas tote bags, floral embroidered shoulder purses, travel pouches, and gentle cotton scrunchies made with love.
            </p>
            <div className="flex items-center gap-4 text-xs text-amber-300/90 pt-2 font-medium">
              <span className="flex items-center gap-1.5 bg-stone-800/80 px-3 py-1.5 rounded-full border border-stone-700/60">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Small Batch Handcrafted
              </span>
              <span className="flex items-center gap-1.5 bg-stone-800/80 px-3 py-1.5 rounded-full border border-stone-700/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Zero Synthetic Plastic
              </span>
            </div>
          </div>

          {/* Quick links & categories */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Explore Collections
            </h3>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <Link href="/#catalog" className="hover:text-amber-300 transition-colors">
                  Canvas Handbags & Totes
                </Link>
              </li>
              <li>
                <Link href="/#catalog" className="hover:text-amber-300 transition-colors">
                  Quilted Travel Pouches
                </Link>
              </li>
              <li>
                <Link href="/#catalog" className="hover:text-amber-300 transition-colors">
                  Artisan Quilted Mini Bags
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-amber-300 text-amber-400/90 font-medium transition-colors flex items-center gap-1.5">
                  <span>Track Your Order</span>
                  <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800/80">Live</span>
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-300 text-stone-400 hover:underline transition-colors flex items-center gap-1.5 pt-1">
                  <span>Maker Studio Admin</span>
                  <span className="text-[9px] bg-stone-800 text-stone-300 px-1.5 py-0.5 rounded border border-stone-700">PIN Protected</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care & WhatsApp */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Direct Maker Contact
            </h3>
            <p className="text-xs text-stone-400 leading-normal">
              Have a custom color request, bulk gift requirement, or questions about fabric care? Chat directly with maker Sudha Rani!
            </p>

            <a
              href="https://wa.me/919493786989?text=Hi%20Sudha%20Rani%20ji%2C%20I%20have%20an%20inquiry%20regarding%20Shreya%20Crafts%20Nest%20products!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all w-full justify-center"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chat with Sudha Rani on WhatsApp</span>
            </a>

            <div className="flex items-center gap-2 text-xs text-stone-400 pt-1">
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>Dispatched with love from India • +91 94937 86989</span>
            </div>
          </div>
        </div>

        {/* Bottom divider with UPI logos & copyright */}
        <div className="mt-14 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <p>© {new Date().getFullYear()} Shreya Crafts Nest. Hand-stitched with love & devotion.</p>
            <span className="hidden sm:inline text-stone-700">•</span>
            <Link href="/admin" className="text-stone-400 hover:text-amber-400 transition-colors underline decoration-dotted">
              Maker Admin Portal
            </Link>
          </div>
          <div className="flex items-center gap-3 text-stone-400">
            <span className="font-semibold text-stone-300">Accepted Payments:</span>
            <span className="bg-stone-800 px-2 py-1 rounded text-emerald-400 font-medium">UPI</span>
            <span className="bg-stone-800 px-2 py-1 rounded font-medium">Google Pay</span>
            <span className="bg-stone-800 px-2 py-1 rounded font-medium">PhonePe</span>
            <span className="bg-stone-800 px-2 py-1 rounded font-medium">Paytm</span>
            <span className="bg-stone-800 px-2 py-1 rounded font-medium">Debit/Credit Cards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
