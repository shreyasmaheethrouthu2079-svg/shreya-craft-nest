"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useLanguage, LANGUAGES } from "@/context/LanguageContext";
import { ShoppingCart, ChevronDown, Check } from "lucide-react";

export function Navbar() {
  const { totalItems } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const langContainerRef = useRef<HTMLDivElement>(null);
  const accountContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        langContainerRef.current &&
        !langContainerRef.current.contains(event.target as Node)
      ) {
        setShowLanguageDropdown(false);
      }
      if (
        accountContainerRef.current &&
        !accountContainerRef.current.contains(event.target as Node)
      ) {
        setShowAccountDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* 1. Language Flag & Switcher (Interactive Amazon.in Flyout) */}
          <div
            ref={langContainerRef}
            className="relative"
            onMouseEnter={() => setShowLanguageDropdown(true)}
            onMouseLeave={() => setShowLanguageDropdown(false)}
          >
            <button
              type="button"
              onClick={() => setShowLanguageDropdown((prev) => !prev)}
              className="flex items-center gap-1 p-1.5 rounded-xs border border-transparent hover:border-white transition-all cursor-pointer select-none text-left"
              aria-label={`Current language: ${language}. Click to change language.`}
              aria-expanded={showLanguageDropdown}
            >
              <span className="text-base">🇮🇳</span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {language}
              </span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {/* Amazon Language Selection Modal/Dropdown */}
            {showLanguageDropdown && (
              <div className="absolute right-0 sm:right-auto sm:left-0 top-11 w-64 sm:w-72 bg-white text-stone-800 rounded-md shadow-2xl border border-stone-200 p-4 z-50 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
                  <span className="text-xs font-bold text-stone-900">
                    {t("nav.langTitle")}
                  </span>
                  <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold">
                    {language}
                  </span>
                </div>

                <p className="text-[11px] text-stone-500 mb-2.5">
                  {t("nav.langSelect")}
                </p>

                <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                  {LANGUAGES.map((lang) => {
                    const isSelected = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLanguageDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm text-left transition-colors cursor-pointer text-xs ${
                          isSelected
                            ? "bg-amber-50 font-bold text-stone-900 ring-1 ring-amber-300"
                            : "hover:bg-stone-100 text-stone-700"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {/* Radio Button Indicator */}
                          <div
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? "border-[#e77600] bg-white"
                                : "border-stone-400 bg-white"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-[#e77600]" />
                            )}
                          </div>
                          <span className="text-xs">{lang.nativeName}</span>
                          <span className="text-[11px] text-stone-400">
                            - {lang.code}
                          </span>
                        </div>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Country / Region */}
                <div className="mt-3 pt-3 border-t border-stone-200">
                  <div className="flex items-center gap-2 text-stone-600 text-[11px]">
                    <span className="text-sm">🇮🇳</span>
                    <span className="leading-tight">
                      {t("nav.shoppingRegion")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Account & Lists */}
          <div
            ref={accountContainerRef}
            className="relative hidden sm:block"
            onMouseEnter={() => setShowAccountDropdown(true)}
            onMouseLeave={() => setShowAccountDropdown(false)}
          >
            <button
              type="button"
              onClick={() => setShowAccountDropdown((prev) => !prev)}
              className="p-1.5 rounded-xs border border-transparent hover:border-white transition-all cursor-pointer flex flex-col leading-tight text-left"
              aria-expanded={showAccountDropdown}
            >
              <span className="text-[11px] text-stone-300 font-normal">
                {t("nav.greeting")}
              </span>
              <div className="flex items-center gap-0.5 text-xs font-bold text-white">
                <span>{t("nav.account")}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </div>
            </button>

            {/* Dropdown Menu */}
            {showAccountDropdown && (
              <div className="absolute right-0 top-11 w-56 bg-white text-stone-800 rounded-md shadow-2xl border border-stone-200 p-4 z-50 animate-in fade-in duration-150">
                <p className="text-xs font-bold text-stone-900 pb-2 border-b border-stone-100">
                  Your Artisan Nest
                </p>
                <div className="py-2 space-y-2 text-xs">
                  <Link
                    href="/track-order"
                    onClick={() => setShowAccountDropdown(false)}
                    className="block hover:text-amber-800 hover:underline"
                  >
                    {t("nav.orders")}
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setShowAccountDropdown(false)}
                    className="block hover:text-amber-800 hover:underline"
                  >
                    {t("nav.shoppingCart")}
                  </Link>
                  <Link
                    href="/#catalog"
                    onClick={() => setShowAccountDropdown(false)}
                    className="block hover:text-amber-800 hover:underline"
                  >
                    {t("nav.allBags")}
                  </Link>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-emerald-700 font-semibold hover:underline"
                  >
                    {t("nav.whatsapp")}
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
              {t("nav.cart")}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
