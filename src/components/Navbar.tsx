"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLanguage, LANGUAGES } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, ChevronDown, Check, LogOut, User, Home, ShoppingBag, Package } from "lucide-react";

export function Navbar() {
  const { totalItems } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showMenuAccountDropdown, setShowMenuAccountDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const langContainerRef = useRef<HTMLDivElement>(null);
  const accountContainerRef = useRef<HTMLDivElement>(null);
  const menuAccountContainerRef = useRef<HTMLDivElement>(null);

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
      if (
        menuAccountContainerRef.current &&
        !menuAccountContainerRef.current.contains(event.target as Node)
      ) {
        setShowMenuAccountDropdown(false);
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
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => setShowAccountDropdown((prev) => !prev)}
                className="px-2.5 py-1.5 rounded-lg border border-stone-200/90 bg-white/80 hover:bg-white text-stone-800 hover:border-amber-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col leading-tight text-left"
                aria-expanded={showAccountDropdown}
              >
                <span className="text-[10px] text-stone-500 font-medium truncate max-w-[110px]">
                  Hello, {user?.name.split(" ")[0]}
                </span>
                <div className="flex items-center gap-0.5 text-xs font-bold text-stone-900">
                  <span>{t("nav.account")}</span>
                  <ChevronDown className="w-3 h-3 text-stone-500" />
                </div>
              </button>
            ) : (
              <Link
                href="/signin"
                className="px-2.5 py-1.5 rounded-lg border border-stone-200/90 bg-white/80 hover:bg-white text-stone-800 hover:border-amber-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col leading-tight text-left"
              >
                <span className="text-[10px] text-stone-500 font-medium">
                  Hello, sign in
                </span>
                <div className="flex items-center gap-0.5 text-xs font-bold text-stone-900">
                  <span>{t("nav.account")}</span>
                  <ChevronDown className="w-3 h-3 text-stone-500" />
                </div>
              </Link>
            )}

            {/* Dropdown Menu */}
            {showAccountDropdown && (
              <div className="absolute right-0 top-12 w-60 bg-white text-stone-800 rounded-xl shadow-2xl border border-stone-200/90 p-4 z-50 animate-in fade-in duration-150">
                {isLoggedIn && user ? (
                  <div className="pb-3 mb-2 border-b border-stone-100 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs border border-amber-200">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-stone-500 truncate">
                        {user.email || user.phone}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center pb-3 mb-2 border-b border-stone-100">
                    <Link
                      href="/signin"
                      onClick={() => setShowAccountDropdown(false)}
                      className="block w-full bg-[#ffd814] hover:bg-[#f7ca00] text-stone-900 text-xs font-bold py-2 rounded-lg border border-[#fcd200] shadow-xs text-center transition-all"
                    >
                      Sign in
                    </Link>
                    <p className="text-[10px] text-stone-500 mt-2">
                      New customer?{" "}
                      <Link
                        href="/signin"
                        onClick={() => setShowAccountDropdown(false)}
                        className="text-amber-800 font-semibold hover:underline"
                      >
                        Start here.
                      </Link>
                    </p>
                  </div>
                )}

                <div className="py-1 space-y-2 text-xs">
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

                  <div className="pt-1.5 mt-1 border-t border-stone-100">
                    <Link
                      href="/admin"
                      onClick={() => setShowAccountDropdown(false)}
                      className="flex items-center justify-between text-amber-950 font-semibold hover:underline bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg border border-amber-200/80 transition-colors"
                    >
                      <span>👩‍🎨 Seller Studio</span>
                      <span className="text-[10px] bg-amber-800 text-white px-1.5 py-0.5 rounded font-bold">Admin</span>
                    </Link>
                  </div>

                  {isLoggedIn && (
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setShowAccountDropdown(false);
                        router.push("/signin");
                      }}
                      className="w-full text-left text-xs font-semibold text-red-600 hover:text-red-800 pt-2 border-t border-stone-100 flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  )}
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

      {/* MENU BAR (Starts with Account (Customer), Home, All Bags, Cart, Track Order) */}
      <nav
        aria-label="Store Menu Bar"
        className="bg-[#F5F0E8] border-t border-[#E8E1D5] px-3 sm:px-6 lg:px-8 py-2 overflow-x-auto scrollbar-none shadow-2xs"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-1 sm:gap-4 text-xs sm:text-sm font-medium text-stone-700 whitespace-nowrap">
          <div className="flex items-center gap-1 sm:gap-2">
            {/* 1. Account (Customer) */}
            <div
              ref={menuAccountContainerRef}
              className="relative"
              onMouseEnter={() => setShowMenuAccountDropdown(true)}
              onMouseLeave={() => setShowMenuAccountDropdown(false)}
            >
              <Link
                href="/signin"
                onClick={() => setShowMenuAccountDropdown(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100/80 hover:bg-amber-200/90 text-amber-950 font-semibold border border-amber-300/80 shadow-2xs transition-all cursor-pointer group"
                aria-label="Account (Customer)"
              >
                <User className="w-3.5 h-3.5 text-amber-900 group-hover:scale-110 transition-transform" />
                <span>
                  {isLoggedIn && user
                    ? `Account (Customer): ${user.name.split(" ")[0]}`
                    : "Account (Customer)"}
                </span>
                <ChevronDown className="w-3 h-3 text-amber-800" />
              </Link>

              {/* Account Dropdown */}
              {showMenuAccountDropdown && (
                <div className="absolute left-0 top-10 w-64 bg-white text-stone-800 rounded-xl shadow-2xl border border-stone-200/90 p-4 z-50 animate-in fade-in duration-150">
                  {isLoggedIn && user ? (
                    <div>
                      <div className="pb-3 mb-2 border-b border-stone-100 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs border border-amber-200">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-[10px] text-stone-500 truncate">
                            {user.email || user.phone}
                          </p>
                        </div>
                      </div>
                      <div className="py-1 space-y-2 text-xs">
                        <Link
                          href="/track-order"
                          onClick={() => setShowMenuAccountDropdown(false)}
                          className="block hover:text-amber-800 hover:underline"
                        >
                          📦 {t("nav.orders")}
                        </Link>
                        <Link
                          href="/cart"
                          onClick={() => setShowMenuAccountDropdown(false)}
                          className="block hover:text-amber-800 hover:underline"
                        >
                          🛒 {t("nav.shoppingCart")}
                        </Link>
                        <div className="pt-1 mt-1 border-t border-stone-100">
                          <Link
                            href="/admin"
                            onClick={() => setShowMenuAccountDropdown(false)}
                            className="flex items-center justify-between text-amber-950 font-semibold hover:underline bg-amber-50 hover:bg-amber-100 px-2 py-1.5 rounded-lg border border-amber-200/80 transition-colors"
                          >
                            <span>👩‍🎨 Seller Studio</span>
                            <span className="text-[10px] bg-amber-800 text-white px-1.5 py-0.5 rounded font-bold">Admin</span>
                          </Link>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setShowMenuAccountDropdown(false);
                            router.push("/signin");
                          }}
                          className="w-full text-left text-xs font-semibold text-red-600 hover:text-red-800 pt-2 border-t border-stone-100 flex items-center gap-1.5 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-center pb-3 mb-2 border-b border-stone-100">
                        <Link
                          href="/signin"
                          onClick={() => setShowMenuAccountDropdown(false)}
                          className="block w-full bg-[#ffd814] hover:bg-[#f7ca00] text-stone-900 text-xs font-bold py-2 rounded-lg border border-[#fcd200] shadow-xs text-center transition-all"
                        >
                          Sign in
                        </Link>
                        <p className="text-[10px] text-stone-500 mt-2">
                          New customer?{" "}
                          <Link
                            href="/signin"
                            onClick={() => setShowMenuAccountDropdown(false)}
                            className="text-amber-800 font-semibold hover:underline"
                          >
                            Start here.
                          </Link>
                        </p>
                      </div>
                      <div className="py-1 space-y-2 text-xs">
                        <Link
                          href="/track-order"
                          onClick={() => setShowMenuAccountDropdown(false)}
                          className="block hover:text-amber-800 hover:underline"
                        >
                          📦 Track Existing Order
                        </Link>
                        <Link
                          href="/cart"
                          onClick={() => setShowMenuAccountDropdown(false)}
                          className="block hover:text-amber-800 hover:underline"
                        >
                          🛒 Shopping Cart
                        </Link>
                        <div className="pt-1 mt-1 border-t border-stone-100">
                          <Link
                            href="/admin"
                            onClick={() => setShowMenuAccountDropdown(false)}
                            className="flex items-center justify-between text-amber-950 font-semibold hover:underline bg-amber-50 hover:bg-amber-100 px-2 py-1.5 rounded-lg border border-amber-200/80 transition-colors"
                          >
                            <span>👩‍🎨 Seller Studio</span>
                            <span className="text-[10px] bg-amber-800 text-white px-1.5 py-0.5 rounded font-bold">Admin</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <span className="text-stone-300 mx-0.5">|</span>

            {/* 2. Home */}
            <Link
              href="/"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-stone-200/70 hover:text-stone-900 transition-colors font-medium"
            >
              <Home className="w-3.5 h-3.5 text-stone-600" />
              <span>Home</span>
            </Link>

            <span className="text-stone-300 mx-0.5">|</span>

            {/* 3. All Bags */}
            <Link
              href="/#catalog"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-stone-200/70 hover:text-stone-900 transition-colors font-medium"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-stone-600" />
              <span>All Bags</span>
            </Link>

            <span className="text-stone-300 mx-0.5">|</span>

            {/* 4. Cart */}
            <Link
              href="/cart"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-stone-200/70 hover:text-stone-900 transition-colors font-medium"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-stone-600" />
              <span>Cart ({totalItems})</span>
            </Link>

            <span className="text-stone-300 mx-0.5">|</span>

            {/* 5. Track Order */}
            <Link
              href="/track-order"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-stone-200/70 hover:text-stone-900 transition-colors font-semibold text-stone-900"
            >
              <Package className="w-3.5 h-3.5 text-amber-800" />
              <span>Track Order</span>
              <span className="bg-amber-200 text-amber-900 text-[10px] px-1.5 py-0.5 rounded-full font-bold">Live</span>
            </Link>

            <span className="text-stone-300 mx-0.5">|</span>

            {/* 6. Seller / Owner Studio */}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-amber-100 hover:text-amber-950 transition-colors font-semibold text-amber-950 border border-amber-300/90 bg-white/90 shadow-2xs group"
              title="Open Owner & Seller Admin Studio"
            >
              <span className="text-xs group-hover:scale-105 transition-transform">👩‍🎨 Seller Studio</span>
              <span className="bg-amber-800 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">PIN</span>
            </Link>
          </div>

          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1 text-[11px] text-emerald-800 font-semibold hover:underline px-2 py-0.5"
          >
            <span>💬 WhatsApp Support</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
