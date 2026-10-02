"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, ChevronDown } from "lucide-react";

export function Navbar() {
  const { totalItems } = useCart();
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full text-white font-sans select-none shadow-md">
      {/* ======================================================== */}
      {/* MAIN AMAZON.IN PRIMARY NAVBAR (#131921) */}
      {/* ======================================================== */}
      <div className="bg-[#131921] px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-4 h-[60px]">
        {/* BRAND LOGO (Amazon.in style with artisan emblem & smile curve) */}
        <Link
          href="/"
          className="flex items-center gap-2 p-1.5 rounded-xs border border-transparent hover:border-white transition-all flex-shrink-0 group"
          aria-label="Shreya Craft Nest Home"
        >
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-amber-400 bg-[#FAF7F2] flex-shrink-0">
            <Image
              src="/logo-emblem.png"
              alt="Shreya Craft Nest Logo"
              fill
              sizes="36px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col leading-none">
            <div className="flex items-baseline font-bold tracking-tight text-white text-base sm:text-lg">
              <span>ShreyaCraftNest</span>
              <span className="text-[#febd69] text-xs font-semibold">.in</span>
            </div>
            {/* Amazon-style subtle smile arc accent */}
            <div className="relative h-1 w-full overflow-hidden mt-0.5">
              <div className="w-full h-2 rounded-full border-b-2 border-[#febd69]"></div>
            </div>
          </div>
        </Link>

        {/* RIGHT ACTION ITEMS */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* 1. Language Flag (India EN) */}
          <div className="hidden lg:flex items-center gap-1 p-1.5 rounded-xs border border-transparent hover:border-white transition-all cursor-pointer">
            <span className="text-base">🇮🇳</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              EN
            </span>
            <ChevronDown className="w-3 h-3 text-stone-400" />
          </div>

          {/* 2. Account & Lists */}
          <div
            className="relative hidden sm:block"
            onMouseEnter={() => setShowAccountDropdown(true)}
            onMouseLeave={() => setShowAccountDropdown(false)}
          >
            <div className="p-1.5 rounded-xs border border-transparent hover:border-white transition-all cursor-pointer flex flex-col leading-tight">
              <span className="text-[11px] text-stone-300 font-normal">
                Hello, Mom's Studio
              </span>
              <div className="flex items-center gap-0.5 text-xs font-bold text-white">
                <span>Account & Lists</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </div>
            </div>

            {/* Dropdown Menu */}
            {showAccountDropdown && (
              <div className="absolute right-0 top-11 w-56 bg-white text-stone-800 rounded-md shadow-2xl border border-stone-200 p-4 z-50 animate-in fade-in duration-150">
                <p className="text-xs font-bold text-stone-900 pb-2 border-b border-stone-100">
                  Your Artisan Nest
                </p>
                <div className="py-2 space-y-2 text-xs">
                  <Link
                    href="/track-order"
                    className="block hover:text-amber-800 hover:underline"
                  >
                    Your Orders & Tracking
                  </Link>
                  <Link
                    href="/cart"
                    className="block hover:text-amber-800 hover:underline"
                  >
                    Your Shopping Cart
                  </Link>
                  <Link
                    href="/#catalog"
                    className="block hover:text-amber-800 hover:underline"
                  >
                    All Handcrafted Bags
                  </Link>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-emerald-700 font-semibold hover:underline"
                  >
                    Customer Care WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* 3. AMAZON CART ICON (Signature Trolley with Orange Number) */}
          <Link
            href="/cart"
            className="relative flex items-center p-1.5 rounded-xs border border-transparent hover:border-white transition-all cursor-pointer group"
            aria-label={`Shopping Cart with ${totalItems} items`}
          >
            <div className="relative flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-white group-hover:text-[#febd69] transition-colors" />
              {/* Amazon Signature Orange Count Badge directly inside trolley basket */}
              <span className="absolute left-[13px] top-[-2px] text-[#f08804] font-black text-sm font-sans select-none">
                {totalItems}
              </span>
            </div>
            <span className="hidden sm:inline-block text-xs font-bold text-white self-end pb-0.5 ml-1">
              Cart
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
