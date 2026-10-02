"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PRODUCTS, Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import {
  Search,
  ShoppingCart,
  ChevronDown,
  X,
} from "lucide-react";

export function Navbar() {
  const { totalItems } = useCart();
  const router = useRouter();

  const [searchCategory, setSearchCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter products based on search query and category
  const searchResults: Product[] =
    searchQuery.trim().length > 0
      ? PRODUCTS.filter((p) => {
          const matchCategory =
            searchCategory === "All" || p.category === searchCategory;
          const q = searchQuery.toLowerCase().trim();
          const matchQuery =
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.material.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q);
          return matchCategory && matchQuery;
        })
      : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
    if (searchQuery.trim().length > 0) {
      router.push(`/#catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/#catalog");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full text-white font-sans select-none shadow-md">
      {/* ======================================================== */}
      {/* 1. MAIN AMAZON.IN PRIMARY NAVBAR (#131921) */}
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

        {/* AMAZON SEARCH BAR (Center) */}
        <div
          ref={searchContainerRef}
          className="flex-1 max-w-3xl relative mx-1 sm:mx-2 hidden md:block"
        >
          <form
            onSubmit={handleSearchSubmit}
            className={`flex items-center rounded-md bg-white overflow-hidden transition-all ${
              isSearchFocused
                ? "ring-3 ring-[#f3a847] shadow-lg"
                : "hover:ring-1 hover:ring-[#febd69]"
            }`}
          >
            {/* Left Category Dropdown ("All ▼") */}
            <div className="relative bg-[#e6e6e6] hover:bg-[#d4d4d4] text-stone-800 text-xs font-medium border-r border-stone-300 transition-colors flex items-center px-2.5 h-10 cursor-pointer">
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="bg-transparent appearance-none pr-4 py-2 text-stone-800 font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="All">All Categories</option>
                <option value="Handbags">Handbags</option>
                <option value="Pouches">Pouches</option>
              </select>
              <ChevronDown className="w-3 h-3 text-stone-600 absolute right-1 pointer-events-none" />
            </div>

            {/* Middle Search Input */}
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search Shreya Craft Nest (e.g. olive pouch, ivy bag, fish tote)..."
                className="w-full px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none bg-white h-10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1 text-stone-400 hover:text-stone-700 mr-2 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Right Magnifying Search Button */}
            <button
              type="submit"
              className="bg-[#febd69] hover:bg-[#f3a847] text-stone-900 w-11 h-10 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
              aria-label="Search items"
            >
              <Search className="w-5 h-5 text-stone-800" />
            </button>
          </form>

          {/* Live Search Suggestions Dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-11 bg-white text-stone-900 rounded-lg shadow-2xl border border-stone-200 overflow-hidden z-50 divide-y divide-stone-100 animate-in fade-in duration-150">
              <div className="p-2 bg-stone-50 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Matching Handcrafted Items ({searchResults.length})
              </div>
              {searchResults.map((prod) => (
                <Link
                  key={prod.id}
                  href={`/checkout?productId=${prod.id}`}
                  onClick={() => setIsSearchFocused(false)}
                  className="p-2.5 hover:bg-amber-50/70 flex items-center justify-between gap-3 transition-colors group/item"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                      <Image
                        src={prod.image}
                        alt={prod.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate group-hover/item:text-amber-800">
                        {prod.name}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {prod.category} • {prod.material}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-bold text-stone-900 text-xs">
                      ₹{prod.price}
                    </span>
                    <span className="block text-[10px] text-emerald-700 font-semibold">
                      In Stock
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT ACTION ITEMS (Exact Amazon.in layout) */}
        <div className="flex items-center gap-1 sm:gap-2">
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

          {/* 3. Returns & Orders (Links to /track-order) */}
          <Link
            href="/track-order"
            className="p-1.5 rounded-xs border border-transparent hover:border-white transition-all flex flex-col leading-tight cursor-pointer"
            title="Track Returns & Orders"
          >
            <span className="text-[11px] text-stone-300 font-normal">
              Returns
            </span>
            <span className="text-xs font-bold text-white">
              & Orders
            </span>
          </Link>

          {/* 4. AMAZON CART ICON (Signature Trolley with Orange Number) */}
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

      {/* ======================================================== */}
      {/* MOBILE FULL-WIDTH SEARCH BAR (Visible only on small screens) */}
      {/* ======================================================== */}
      <div className="bg-[#131921] px-3 pb-2 pt-0.5 md:hidden">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center rounded-md bg-white overflow-hidden shadow-inner h-9"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Shreya Craft Nest..."
            className="w-full px-3 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none bg-white h-full"
          />
          <button
            type="submit"
            className="bg-[#febd69] text-stone-900 px-3.5 h-full flex items-center justify-center cursor-pointer"
          >
            <Search className="w-4 h-4 text-stone-900" />
          </button>
        </form>
      </div>
    </header>
  );
}
