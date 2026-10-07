"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useLanguage, LANGUAGES } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  ShoppingCart,
  ChevronDown,
  Check,
  LogOut,
  User,
  Home,
  ShoppingBag,
  Package,
  Menu,
  X,
  ChevronRight,
  Truck,
  MessageCircle,
  Sparkles,
} from "lucide-react";

export function Navbar() {
  const { totalItems } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const { user, isLoggedIn, logout } = useAuth();
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const langContainerRef = useRef<HTMLDivElement>(null);
  const accountContainerRef = useRef<HTMLDivElement>(null);

  // Lock background scrolling when side menu drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

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
        {/* BRAND LOGO + MOBILE HAMBURGER BUTTON */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="sm:hidden p-1.5 rounded-lg border border-stone-200/90 bg-white/80 hover:bg-white text-stone-800 hover:border-amber-400 shadow-2xs transition-all cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 text-stone-800" />
          </button>

          <Link
            href="/"
            className="flex items-center gap-2.5 p-1 rounded-lg hover:opacity-90 transition-all group"
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
        </div>

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

                  {isLoggedIn && (
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setShowAccountDropdown(false);
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

      {/* 2. THE SIGNATURE MENU BAR (Amazon-Style "☰ All" Strip) */}
      <nav className="bg-[#F5F0E8] border-t border-[#E8E1D5] text-stone-800 text-xs sm:text-sm font-medium shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none h-10">
          <div className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
            {/* ☰ ALL / MENU BUTTON */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-stone-200/80 active:bg-stone-300/80 transition-colors font-bold text-stone-900 border border-stone-300/70 bg-white/70 shadow-2xs hover:border-amber-400 cursor-pointer"
              aria-label="Open All Categories Menu"
            >
              <Menu className="w-4 h-4 text-stone-900" />
              <span>All Menu</span>
            </button>

            <span className="text-stone-300 select-none">|</span>

            {/* Quick Menu Links */}
            <Link
              href="/"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-stone-200/70 hover:text-stone-900 transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-stone-600" />
              <span>Home</span>
            </Link>

            <Link
              href="/#catalog"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-stone-200/70 hover:text-stone-900 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-stone-600" />
              <span>Handbags (₹400)</span>
            </Link>

            <Link
              href="/#catalog"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-stone-200/70 hover:text-stone-900 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-stone-600" />
              <span>Pouches (₹100)</span>
            </Link>

            <Link
              href="/cart"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-stone-200/70 hover:text-stone-900 transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-stone-600" />
              <span>Cart ({totalItems})</span>
            </Link>

            <Link
              href="/track-order"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-stone-200/70 hover:text-stone-900 transition-colors font-semibold text-amber-900 bg-amber-100/70"
            >
              <Package className="w-3.5 h-3.5 text-amber-800" />
              <span>Track Order</span>
              <span className="bg-amber-200 text-amber-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold">Live</span>
            </Link>

            <Link
              href="/signin"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-stone-200/70 hover:text-stone-900 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-stone-600" />
              <span>{isLoggedIn ? (user?.name ? user.name.split(" ")[0] : "Account") : "Sign In"}</span>
            </Link>
          </div>

          {/* Right side helper info */}
          <div className="flex items-center gap-3 whitespace-nowrap pl-2">
            <div className="hidden lg:flex items-center gap-1 text-[11px] text-stone-600 font-medium">
              <Truck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Courier ₹40</span>
            </div>

            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-emerald-800 font-semibold hover:underline bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1 rounded-md border border-emerald-200 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">WhatsApp Support</span>
              <span className="sm:hidden">Support</span>
            </a>
          </div>
        </div>
      </nav>

      {/* 3. SLIDE-OUT SIDE MENU DRAWER (Amazon "☰ All" Drawer) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300 cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container from Left */}
          <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
            <div className="w-screen max-w-xs sm:max-w-sm bg-[#FAF8F5] text-stone-800 shadow-2xl flex flex-col justify-between border-r border-[#EDE6DD] animate-in slide-in-from-left duration-300">
              {/* Drawer Top Header (Hello, Sign In / User Profile) */}
              <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
                <Link
                  href="/signin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 hover:opacity-90 transition-opacity"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-base border-2 border-amber-400">
                    {isLoggedIn && user ? (
                      user.name.charAt(0).toUpperCase()
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-stone-300 font-medium">Hello,</p>
                    <p className="text-base font-bold text-white leading-tight">
                      {isLoggedIn && user ? user.name : "Sign In or Register"}
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-full hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto divide-y divide-stone-200/80 text-sm">
                {/* Section 1: Trending & Artisan Highlights */}
                <div className="py-4 px-5 space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                    Trending & Highlights
                  </h3>
                  <Link
                    href="/#catalog"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-stone-800 hover:text-amber-900 hover:translate-x-1 transition-all"
                  >
                    <span className="font-semibold">Bestsellers & New Drops</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </Link>
                  <Link
                    href="/#catalog"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-stone-800 hover:text-amber-900 hover:translate-x-1 transition-all"
                  >
                    <span>Handbags & Shoulder Totes (₹400)</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </Link>
                  <Link
                    href="/#catalog"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-stone-800 hover:text-amber-900 hover:translate-x-1 transition-all"
                  >
                    <span>Quilted Travel Pouches (₹100)</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </Link>
                  <Link
                    href="/#catalog"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-stone-800 hover:text-amber-900 hover:translate-x-1 transition-all"
                  >
                    <span>Artisan Mini Bags (₹140)</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </Link>
                </div>

                {/* Section 2: Shop by Department */}
                <div className="py-4 px-5 space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                    Shop By Department
                  </h3>
                  <Link
                    href="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-stone-800 hover:text-amber-900 hover:translate-x-1 transition-all"
                  >
                    <span>Home & Handcrafted Showcase</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </Link>
                  <Link
                    href="/#catalog"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-stone-800 hover:text-amber-900 hover:translate-x-1 transition-all"
                  >
                    <span>All Handcrafted Bags & Pouches</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-stone-800 hover:text-amber-900 hover:translate-x-1 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <span>Shopping Cart</span>
                      {totalItems > 0 && (
                        <span className="bg-amber-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {totalItems}
                        </span>
                      )}
                    </span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </Link>
                  <Link
                    href="/track-order"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-amber-900 font-semibold hover:translate-x-1 transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>Track Your Order</span>
                      <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.5 rounded-full font-bold">Live</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </Link>
                </div>

                {/* Section 3: Programs & Delivery */}
                <div className="py-4 px-5 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                    Studio & Delivery Info
                  </h3>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 space-y-1 text-xs">
                    <p className="font-bold text-amber-900 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-amber-800" />
                      <span>Pan-India Courier (₹40 Flat)</span>
                    </p>
                    <p className="text-stone-600">
                      Dispatched with care & love directly from mom's workshop.
                    </p>
                  </div>
                </div>

                {/* Section 4: Help & Settings */}
                <div className="py-4 px-5 space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                    Help & Settings
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowLanguageDropdown(true);
                    }}
                    className="w-full flex items-center justify-between py-2 text-stone-800 hover:text-amber-900 text-left cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span>🇮🇳 Language:</span>
                      <strong className="text-amber-900 uppercase font-bold">{language}</strong>
                    </span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </button>

                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between py-2 text-emerald-800 font-semibold hover:underline"
                  >
                    <span className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>Chat on WhatsApp</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </a>

                  {isLoggedIn ? (
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 py-2 text-red-600 hover:text-red-800 font-semibold text-left pt-3 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  ) : (
                    <Link
                      href="/signin"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between py-2 text-stone-800 hover:text-amber-900 font-semibold"
                    >
                      <span>Sign In / Create Account</span>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
