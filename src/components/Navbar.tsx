"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLanguage, LANGUAGES } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { CategoryType } from "@/data/products";
import {
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  Check,
  LogOut,
  User,
  Home,
  ShoppingBag,
  Package,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";

export function Navbar() {
  const { totalItems, openCart } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and handle Escape key when side menu is open
  useEffect(() => {
    if (isSideMenuOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsSideMenuOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isSideMenuOpen]);

  const handleCategoryNavigation = (cat: CategoryType) => {
    setIsSideMenuOpen(false);

    if (typeof window !== "undefined") {
      if (window.location.pathname === "/") {
        // 1. Dispatch custom event so ProductCatalog updates category filter instantly
        window.dispatchEvent(
          new CustomEvent("catalog-filter-category", { detail: cat })
        );

        // 2. Update URL query without full page reload
        const url = new URL(window.location.href);
        if (cat === "All") {
          url.searchParams.delete("category");
        } else {
          url.searchParams.set("category", cat);
        }
        url.hash = "catalog";
        window.history.pushState({}, "", url.toString());

        // 3. Scroll smoothly to catalog section
        setTimeout(() => {
          const el = document.getElementById("catalog");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 60);
      } else {
        router.push(cat === "All" ? "/#catalog" : `/?category=${encodeURIComponent(cat)}#catalog`);
      }
    }
  };

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
    <>
      <header className="sticky top-0 z-40 w-full text-stone-800 font-sans select-none bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EDE6DD] shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 sm:gap-4 h-[64px]">
        {/* BRAND LOGO (Matches website cream tone with artisan emblem & smile accent) */}
        <Link
          href="/"
          className="flex items-center gap-2.5 p-1 rounded-lg hover:opacity-90 transition-all flex-shrink-0 group"
          aria-label="Shreya's Craft Nest Home"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-amber-300 bg-white shadow-xs flex-shrink-0">
            <Image
              src="/logo-emblem.png"
              alt="Shreya's Craft Nest Logo"
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col leading-none">
            <div className="flex items-baseline font-serif font-bold tracking-tight text-stone-900 text-lg sm:text-xl">
              <span>Shreya&apos;s Craft Nest</span>
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
                          {user.isGuest ? "Guest Customer" : (user.email || user.phone)}
                        </p>
                      </div>
                    </div>
                    {user.isGuest && (
                      <div className="pb-2 mb-2 border-b border-stone-100">
                        <Link
                          href="/signin"
                          onClick={() => setShowAccountDropdown(false)}
                          className="block w-full bg-[#ffd814] hover:bg-[#f7ca00] text-stone-900 text-xs font-bold py-1.5 rounded-lg border border-[#fcd200] shadow-xs text-center transition-all"
                        >
                          Sign In / Register
                        </Link>
                      </div>
                    )}
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
                    href="https://wa.me/919491710704?text=Hi%20Sudha%20Rani%20ji%2C%20I%20have%20an%20inquiry%20regarding%20Shreya%20Crafts%20Nest%20products!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-emerald-700 font-semibold hover:underline"
                  >
                    💬 WhatsApp: Sudha Rani
                  </a>

                  {isLoggedIn && (
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setShowAccountDropdown(false);
                        router.push("/signin");
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs border border-red-200/80 transition-colors flex items-center justify-between cursor-pointer group mt-2"
                    >
                      <div className="flex items-center gap-2">
                        <LogOut className="w-3.5 h-3.5 text-red-600 group-hover:scale-110 transition-transform" />
                        <span>Log Out</span>
                      </div>
                      <span className="text-[10px] text-red-500 font-normal">
                        {user?.isGuest ? "Exit Guest" : "Switch"}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. CART (Amazon Trolley with Live Number inside basket matching cream aesthetic) */}
          <button
            type="button"
            onClick={() => openCart()}
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
          </button>
        </div>
      </div>

      {/* MENU BAR (Clean Amazon-style bar with All Menu button holding all items) */}
      <nav
        aria-label="Store Menu Bar"
        className="bg-[#F5F0E8] border-t border-[#E8E1D5] px-3 sm:px-6 lg:px-8 py-2 shadow-2xs"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm font-medium text-stone-700 whitespace-nowrap">
          {/* The Main All Menu Button */}
          <button
            type="button"
            onClick={() => setIsSideMenuOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs shadow-2xs transition-all cursor-pointer group"
            aria-label="Open Store Menu"
          >
            <Menu className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
            <span>All Menu</span>
            <ChevronDown className="w-3 h-3 text-stone-400 group-hover:translate-y-0.5 transition-transform" />
          </button>

          <a
            href="https://wa.me/919491710704?text=Hi%20Sudha%20Rani%20ji%2C%20I%20have%20an%20inquiry%20regarding%20bulk%20orders%20and%20handcrafted%20products!"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold hover:underline px-2 py-0.5"
          >
            <span>💬 WhatsApp: Chat with Me</span>
          </a>
        </div>
      </nav>
    </header>

    {/* SLIDE-OVER SIDE DRAWER (Teleported to document.body via Portal to prevent any header clipping) */}
    {mounted && isSideMenuOpen && createPortal(
      <div className="fixed inset-0 z-[99999] flex overflow-hidden" role="dialog" aria-modal="true" aria-label="Store Menu">
        {/* Backdrop overlay */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={() => setIsSideMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Drawer Panel */}
        <aside
          className="relative w-full max-w-[320px] sm:max-w-[360px] bg-white h-[100dvh] max-h-[100dvh] shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200 overflow-hidden text-stone-800"
          aria-label="Navigation Drawer"
        >
          {/* 1. Drawer Header with User Profile */}
          <div className="bg-stone-900 text-white p-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-sm flex-shrink-0 shadow-xs border border-amber-300">
                {isLoggedIn && user ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {isLoggedIn && user ? `Hello, ${user.name}` : "Hello, Sign In"}
                </p>
                <p className="text-[11px] text-amber-300 truncate">
                  {isLoggedIn && user ? (user.isGuest ? "Guest Customer" : (user.email || user.phone)) : "Welcome to Shreya's Craft Nest"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSideMenuOpen(false)}
              className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Drawer Navigation Items (All items from screenshot) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm overscroll-contain">
            {/* Core Items from screenshot */}
            <div>
              <h3 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2 px-2">
                Navigation
              </h3>
              <div className="space-y-1">
                {/* Home */}
                <Link
                  href="/"
                  onClick={() => {
                    setIsSideMenuOpen(false);
                    if (window.location.pathname === "/") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-100 font-medium transition-colors"
                >
                  <Home className="w-4 h-4 text-amber-800" />
                  <span>Home</span>
                </Link>

                {/* All Bags */}
                <button
                  type="button"
                  onClick={() => handleCategoryNavigation("All")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-100 font-medium transition-colors text-left cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-800" />
                  <span>All Handcrafted Bags</span>
                </button>

                {/* Cart */}
                <button
                  type="button"
                  onClick={() => {
                    setIsSideMenuOpen(false);
                    openCart();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-100 font-medium transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-4 h-4 text-amber-800" />
                    <span>Shopping Cart</span>
                  </div>
                  <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-300">
                    {totalItems} items
                  </span>
                </button>

                {/* Track Order */}
                <Link
                  href="/track-order"
                  onClick={() => setIsSideMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-100 font-medium transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-amber-800" />
                    <span>Track Your Order</span>
                  </div>
                  <span className="bg-amber-200 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Live
                  </span>
                </Link>
              </div>
            </div>

            {/* Shop by Department */}
            <div className="border-t border-stone-100 pt-4">
              <h3 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2 px-2">
                Shop Handcrafted
              </h3>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleCategoryNavigation("Handbags")}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-medium cursor-pointer text-left"
                >
                  <span>👜 Handbags</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryNavigation("Mini Bags")}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-medium cursor-pointer text-left"
                >
                  <span>👛 Mini Bags</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryNavigation("Pouches")}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-medium cursor-pointer text-left"
                >
                  <span>👝 Pouches</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </button>
              </div>
            </div>

            {/* Customer Care WhatsApp */}
            <div className="border-t border-stone-100 pt-4">
              <h3 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2 px-2">
                Bulk Orders & Support
              </h3>
              <a
                href="https://wa.me/919491710704?text=Hi%20Sudha%20Rani%20ji%2C%20I%20have%20an%20inquiry%20regarding%20bulk%20orders%20and%20handcrafted%20products!"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>Chat with Me on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* 3. Drawer Bottom: Account & Log Out (from screenshot) */}
          <div className="p-4 bg-stone-50 border-t border-stone-200 shrink-0">
            {isLoggedIn ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-500 px-1">
                  <span>Account Active</span>
                  <span className="font-semibold text-stone-800">{user?.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsSideMenuOpen(false);
                    router.push("/signin");
                  }}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs py-2.5 px-4 rounded-xl border border-red-200/90 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-600" />
                  <span>Log Out of Account</span>
                </button>
              </div>
            ) : (
              <Link
                href="/signin"
                onClick={() => setIsSideMenuOpen(false)}
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-stone-900 font-bold text-xs py-2.5 px-4 rounded-xl border border-[#fcd200] shadow-2xs flex items-center justify-center gap-2 text-center"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Create Account</span>
              </Link>
            )}
          </div>
        </aside>
      </div>,
      document.body
    )}
  </>
  );
}
