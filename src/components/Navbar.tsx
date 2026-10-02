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
    <header className="sticky top-0 z-40 w-full text-stone-800 font-sans select-none bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EDE6DD] shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 sm:gap-4 h-[64px]">
        {/* BRAND LOGO (Matches website cream tone with artisan emblem & smile accent) */}
        <Link
          href="/"
          className="flex items-center gap-2.5 p-1 rounded-lg hover:opacity-90 transition-all flex-shrink-0 group"
          aria-label="Shreya Craft Nest Home"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-amber-300 bg-white shadow-xs flex-shrink-0">
            <Image
              src="/logo-emblem.png"
              alt="Shreya Craft Nest Logo"
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col leading-none">
            <div className="flex items-baseline font-serif font-bold tracking-tight text-stone-900 text-lg sm:text-xl">
              <span>Shreya Craft Nest</span>
              <span className="text-amber-800 text-xs font-sans font-bold ml-0.5">.in</span>
            </div>
            {/* Elegant warm golden arc accent */}
            <div className="relative h-1 w-full overflow-hidden mt-0.5">
              <div className="w-full h-2 rounded-full border-b-2 border-amber-500"></div>
            </div>
          </div>
        </Link>

        {/* RIGHT ACTION ITEMS */}
        <div className="flex items-center gap-2 sm:gap-3">
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-200/90 bg-white/80 hover:bg-white text-stone-800 hover:border-amber-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer select-none text-left"
              aria-label={`Current language: ${language}. Click to change language.`}
              aria-expanded={showLanguageDropdown}
            >
              <span className="text-base">🇮🇳</span>
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                {language}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
            </button>

            {/* Language Selection Modal/Dropdown */}
            {showLanguageDropdown && (
              <div className="absolute right-0 top-12 w-64 sm:w-72 bg-white text-stone-800 rounded-xl shadow-2xl border border-stone-200/90 p-4 z-50 animate-in fade-in duration-150">
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
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors cursor-pointer text-xs ${
                          isSelected
                            ? "bg-amber-50 font-bold text-stone-900 ring-1 ring-amber-300"
                            : "hover:bg-stone-50 text-stone-700"
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
                <div className="mt-3 pt-3 border-t border-stone-100">
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
              className="px-2.5 py-1.5 rounded-lg border border-stone-200/90 bg-white/80 hover:bg-white text-stone-800 hover:border-amber-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col leading-tight text-left"
              aria-expanded={showAccountDropdown}
            >
              <span className="text-[10px] text-stone-500 font-medium">
                {t("nav.greeting")}
              </span>
              <div className="flex items-center gap-0.5 text-xs font-bold text-stone-900">
                <span>{t("nav.account")}</span>
                <ChevronDown className="w-3 h-3 text-stone-500" />
              </div>
            </button>

            {/* Dropdown Menu */}
            {showAccountDropdown && (
              <div className="absolute right-0 top-12 w-56 bg-white text-stone-800 rounded-xl shadow-2xl border border-stone-200/90 p-4 z-50 animate-in fade-in duration-150">
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

          {/* 3. CART (Amazon Trolley with Live Number inside basket matching cream aesthetic) */}
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200/90 bg-white/80 hover:bg-white hover:border-amber-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
            aria-label={`Shopping Cart with ${totalItems} items`}
          >
            <div className="relative flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-stone-800 group-hover:text-amber-800 transition-colors" />
              <span className="absolute left-[9px] top-[-3px] text-amber-800 font-black text-xs font-sans select-none">
                {totalItems}
              </span>
            </div>
            <span className="hidden sm:inline-block text-xs font-bold text-stone-900">
              {t("nav.cart")}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
