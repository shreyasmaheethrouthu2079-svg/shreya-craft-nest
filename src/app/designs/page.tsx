"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import {
  Scissors,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Ruler,
  Layers,
  Heart,
  MessageCircle,
  Eye,
  Check,
} from "lucide-react";
import { PRODUCTS, Product } from "@/data/products";

interface BagDesignSpec {
  id: string;
  productId: string;
  number: string;
  name: string;
  category: "Handbag" | "Mini Bag" | "Pouch";
  price: number;
  originalPrice: number;
  dimensions: string;
  capacity: string;
  strapDetails: string;
  seamCraft: string;
  closure: string;
  description: string;
  realImage: string;
  svgSilhouette: React.ReactNode;
}

export default function BagDesignsPage() {
  const { addToCart, getItemQuantity } = useCart();
  const [activeTab, setActiveTab] = useState<"all" | "handbags" | "mini" | "pouches">("all");
  const [viewModes, setViewModes] = useState<Record<string, "outline" | "real">>({});
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const toggleViewMode = (id: string) => {
    setViewModes((prev) => ({
      ...prev,
      [id]: prev[id] === "real" ? "outline" : "real",
    }));
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 1800);
  };

  const DESIGNS: BagDesignSpec[] = [
    {
      id: "shoulder-tote",
      productId: "terracotta-patchwork-tote",
      number: "01",
      name: "Kalamkari Trapeze Shoulder Tote",
      category: "Handbag",
      price: 400,
      originalPrice: 650,
      dimensions: '15" H x 14.5" W x 4.5" Base Gusset',
      capacity: 'Fits 14" Laptop, water bottle, diary, and everyday essentials',
      strapDetails: 'Double 8.5" shoulder drop reinforced with box-X stitches',
      seamCraft: "Double-folded French seams with zero fraying",
      closure: "Heavy-duty top zipper + exterior front zip compartment",
      description:
        "Designed with a generous trapeze flare that naturally widens towards the top opening. Flat rectangular bottom base allows the bag to stand upright when set down.",
      realImage: "/products/terracotta-patchwork-tote.jpg",
      svgSilhouette: (
        <svg viewBox="0 0 240 280" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Straps */}
          <path d="M 80,105 C 70,15 125,8 130,8 C 135,8 190,15 180,105" strokeWidth="2.8" />
          <path d="M 94,105 C 86,28 125,20 130,20 C 135,20 174,28 166,105" strokeWidth="1.8" strokeDasharray="4 3" opacity="0.6" />
          {/* Bag Body */}
          <path d="M 38,105 L 56,255 Q 60,270 78,270 L 178,270 Q 196,270 200,255 L 218,105 Q 218,100 205,100 L 52,100 Q 38,100 38,105 Z" strokeWidth="3" />
          {/* Top Zipper */}
          <line x1="48" y1="105" x2="208" y2="105" strokeWidth="2" />
          {/* Front Zip Pocket */}
          <line x1="50" y1="150" x2="206" y2="150" strokeWidth="2.5" />
          <circle cx="128" cy="150" r="3.5" fill="currentColor" />
          {/* Flat Base */}
          <line x1="68" y1="255" x2="188" y2="255" strokeDasharray="4 3" opacity="0.6" strokeWidth="1.8" />
        </svg>
      ),
    },
    {
      id: "structured-handbag",
      productId: "botanical-stripe-bag",
      number: "02",
      name: "Botanical Ivy Structured Handbag",
      category: "Handbag",
      price: 400,
      originalPrice: 599,
      dimensions: '12" H x 12.5" W x 4" Base (8.5" Handle Drop)',
      capacity: 'Fits iPad, book, umbrella, wallet, and sunglasses case',
      strapDetails: 'Dual contoured carry loop handles with cushioned core',
      seamCraft: "Padded structure with interior cotton slub lining",
      closure: "Smooth top zipper with deep exterior front slip pocket",
      description:
        "Engineered with a gently tapered rectangular silhouette. Features an easy-access front pocket with a center vertical divider seam for phone and sunglasses.",
      realImage: "/products/botanical-stripe-bag.jpg",
      svgSilhouette: (
        <svg viewBox="0 0 240 280" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Dual Arched Handles */}
          <path d="M 75,95 C 70,25 150,25 145,95" strokeWidth="2.8" />
          <path d="M 88,95 C 84,38 136,38 132,95" strokeWidth="2" />
          {/* Body */}
          <path d="M 45,95 Q 45,85 60,85 L 160,85 Q 175,85 175,95 L 170,230 Q 170,248 150,248 L 70,248 Q 50,248 50,230 Z" strokeWidth="3" />
          {/* Top Zip */}
          <line x1="60" y1="90" x2="160" y2="90" strokeWidth="2" />
          {/* Front Slip Pocket */}
          <path d="M 48,155 L 172,155" strokeWidth="2.5" />
          <line x1="110" y1="155" x2="110" y2="248" strokeWidth="1.8" strokeDasharray="4 3" opacity="0.6" />
        </svg>
      ),
    },
    {
      id: "quilted-mini-bag",
      productId: "indigo-fish-mini-tote",
      number: "03",
      name: "Indigo Quilted Mini Tote Bag",
      category: "Mini Bag",
      price: 140,
      originalPrice: 220,
      dimensions: '9" H x 8.5" W x 3" Gusset',
      capacity: 'Fits smartphone, keys, cardholder, sanitizer, and lip balm',
      strapDetails: 'Dual mini grab handles (3.5" drop) for hand carry',
      seamCraft: "Diamond quilted stitch padding for cushioned structure",
      closure: "Top zip closure + front zipper pocket for change",
      description:
        "A charming compact mini tote silhouette with individual quilted stitch channels. Light padding protects your phone and delicate valuables on quick outings.",
      realImage: "/products/indigo-fish-mini-tote.jpg",
      svgSilhouette: (
        <svg viewBox="0 0 200 240" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Short Carry Handles */}
          <path d="M 68,80 C 63,28 117,28 112,80" strokeWidth="2.8" />
          <path d="M 78,80 C 74,40 106,40 102,80" strokeWidth="2" />
          {/* Compact Body */}
          <path d="M 42,80 Q 42,72 54,72 L 126,72 Q 138,72 138,80 L 132,198 Q 132,212 118,212 L 62,212 Q 48,212 48,198 Z" strokeWidth="3" />
          {/* Top Zip */}
          <line x1="45" y1="108" x2="135" y2="108" strokeWidth="2.2" />
          {/* Diamond Quilt Stitching */}
          <g strokeDasharray="3 3" opacity="0.45" strokeWidth="1.3">
            <line x1="48" y1="125" x2="132" y2="185" />
            <line x1="48" y1="155" x2="115" y2="210" />
            <line x1="132" y1="125" x2="48" y2="185" />
            <line x1="132" y1="155" x2="65" y2="210" />
          </g>
        </svg>
      ),
    },
    {
      id: "wristlet-pouch",
      productId: "olive-bloom-wristlet-pouch",
      number: "04",
      name: "Floral Block-Print Wristlet Clutch Pouch",
      category: "Pouch",
      price: 100,
      originalPrice: 150,
      dimensions: '8.5" W x 5.5" H x 1.5" Gusset',
      capacity: 'Fits all large smartphones, passports, keys, and makeup essentials',
      strapDetails: 'Sturdy 6" integrated side wristlet strap for hands-free carry',
      seamCraft: "Fully enclosed inner lining with double-stitched corner anchors",
      closure: "Top zipper + front horizontal zipper compartment",
      description:
        "Horizontal clutch silhouette tailored with a right-hand wrist loop. Dual horizontal zipper channels keep coins and keys separated from your phone screen.",
      realImage: "/products/olive-bloom-wristlet-pouch.jpg",
      svgSilhouette: (
        <svg viewBox="0 0 280 200" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Wristlet Loop */}
          <path d="M 185,82 C 245,82 250,105 245,108 C 238,110 185,98 185,98" strokeWidth="2.8" />
          {/* Body */}
          <rect x="30" y="60" width="155" height="105" rx="14" strokeWidth="3" />
          {/* Top Zip */}
          <line x1="42" y1="68" x2="173" y2="68" strokeWidth="2" />
          {/* Front Zip */}
          <line x1="30" y1="102" x2="185" y2="102" strokeWidth="2.6" />
          <circle cx="168" cy="102" r="3.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "corner-zip-pouch",
      productId: "floral-dual-pouch",
      number: "05",
      name: "Artisan Vertical Corner-Zip Travel Pouch",
      category: "Pouch",
      price: 100,
      originalPrice: 150,
      dimensions: '7.8" H x 4.2" W x 1.5" D',
      capacity: 'Fits pens, paintbrushes, chargers, sunglasses, and toiletry bottles',
      strapDetails: 'Top centered cotton fabric hang/pull loop',
      seamCraft: "Narrow vertical French seam construction",
      closure: "Clean single vertical corner zipper with metallic pull slider",
      description:
        "A slender upright travel pouch designed to slide effortlessly into tote bags and backpacks. Features a single clean vertical zipper running right along the corner edge for smooth opening.",
      realImage: "/products/floral-dual-pouch.jpg",
      svgSilhouette: (
        <svg viewBox="0 0 200 260" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Top Pull Loop */}
          <path d="M 90,45 C 90,28 110,28 110,45" strokeWidth="2.5" />
          {/* Upright Slender Body */}
          <rect x="55" y="45" width="90" height="175" rx="12" strokeWidth="3" />
          {/* Single Vertical Corner Zipper */}
          <line x1="132" y1="45" x2="132" y2="220" strokeWidth="2.6" />
          {/* Zipper Pull Tab at Corner */}
          <rect x="129" y="70" width="6" height="16" rx="2" fill="currentColor" />
          <path d="M 132,86 L 132,96" strokeWidth="2" />
        </svg>
      ),
    },
  ];

  const filteredDesigns = DESIGNS.filter((d) => {
    if (activeTab === "all") return true;
    if (activeTab === "handbags") return d.category === "Handbag";
    if (activeTab === "mini") return d.category === "Mini Bag";
    if (activeTab === "pouches") return d.category === "Pouch";
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800 font-sans selection:bg-amber-200 selection:text-amber-900">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative py-12 sm:py-20 border-b border-[#EDE6DD] bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-4">
              <Link href="/" className="hover:text-amber-800">Home</Link>
              <span>/</span>
              <span className="font-semibold text-stone-900">Bag Designs & Blueprints</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100/90 px-3 py-1 rounded-full mb-3 border border-amber-300/60">
                  <Scissors className="w-3.5 h-3.5 text-amber-800" />
                  <span>Artisan Pattern Drafting Studio</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
                  Handcrafted Bag Outlines & Design Blueprints
                </h1>
                <p className="text-base text-stone-600 mt-3 leading-relaxed">
                  Every single bag, tote, and pouch starts on mom's craft table with hand-drawn architectural patterns, precision chalk lines, and reinforced seam planning. Explore the anatomy, silhouettes, and measurements of each creation.
                </p>
              </div>

              {/* Quick WhatsApp Inquiry */}
              <div className="flex-shrink-0">
                <a
                  href="https://wa.me/919491710704?text=Hi%20Sudha%20Rani%20ji%2C%20I%20love%20the%20bag%20design%20blueprints%20on%20your%20website!%20Can%20we%20discuss%20a%20custom%20order%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-200" />
                  <span>Discuss Custom Design with Sudha Rani</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FULL STUDIO PANORAMA: ALL 5 BAGS TO SCALE */}
        <section className="py-12 bg-[#FAF8F5] border-b border-[#EDE6DD]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-stone-100 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-amber-800" />
                    <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                      Studio Lineup Panorama — All 5 Silhouettes to Scale
                    </h2>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Comparative proportions of our handcrafted bags, from large shoulder carryalls to compact travel pouches.
                  </p>
                </div>
                <span className="text-[11px] font-mono bg-stone-100 text-stone-600 px-3 py-1 rounded-full w-fit">
                  Pure Vector Outlines
                </span>
              </div>

              {/* Responsive SVG Panorama */}
              <div className="w-full overflow-x-auto py-2">
                <svg
                  viewBox="0 0 1100 320"
                  className="w-full min-w-[750px] max-w-5xl mx-auto h-auto select-none"
                  fill="none"
                  stroke="#292524"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* 1. Large Shoulder Tote */}
                  <g transform="translate(10, 20)">
                    <path d="M 85,120 C 75,20 120,5 130,5 C 140,5 185,20 175,120" strokeWidth="2.6" />
                    <path d="M 98,120 C 90,35 125,18 130,18 C 135,18 170,35 162,120" strokeWidth="2" strokeDasharray="4 3" opacity="0.6" />
                    <path d="M 45,120 L 60,265 Q 63,280 80,280 L 180,280 Q 197,280 200,265 L 215,120 Q 215,115 205,115 L 55,115 Q 45,115 45,120 Z" strokeWidth="2.8" />
                    <line x1="55" y1="120" x2="205" y2="120" strokeWidth="2" />
                    <line x1="58" y1="160" x2="202" y2="160" strokeWidth="2.2" />
                    <circle cx="130" cy="160" r="3" fill="#292524" />
                    <line x1="75" y1="265" x2="185" y2="265" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
                    <text x="130" y="305" fontSize="12" textAnchor="middle" fontFamily="serif" fontWeight="bold" fill="#292524" stroke="none">1. Shoulder Tote</text>
                  </g>

                  {/* 2. Structured Handbag */}
                  <g transform="translate(240, 45)">
                    <path d="M 80,95 C 75,25 145,25 140,95" strokeWidth="2.6" />
                    <path d="M 92,95 C 88,38 132,38 128,95" strokeWidth="2" />
                    <path d="M 50,95 Q 50,85 65,85 L 155,85 Q 170,85 170,95 L 165,225 Q 165,242 148,242 L 72,242 Q 55,242 55,225 Z" strokeWidth="2.8" />
                    <line x1="65" y1="90" x2="155" y2="90" strokeWidth="1.8" />
                    <path d="M 54,150 L 166,150" strokeWidth="2" />
                    <line x1="110" y1="150" x2="110" y2="242" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
                    <text x="110" y="270" fontSize="12" textAnchor="middle" fontFamily="serif" fontWeight="bold" fill="#292524" stroke="none">2. Structured Handbag</text>
                  </g>

                  {/* 3. Quilted Mini Bag */}
                  <g transform="translate(440, 75)">
                    <path d="M 70,80 C 65,30 115,30 110,80" strokeWidth="2.6" />
                    <path d="M 80,80 C 76,42 104,42 100,80" strokeWidth="1.8" />
                    <path d="M 45,80 Q 45,72 56,72 L 124,72 Q 135,72 135,80 L 130,195 Q 130,208 118,208 L 62,208 Q 50,208 50,195 Z" strokeWidth="2.8" />
                    <line x1="48" y1="105" x2="132" y2="105" strokeWidth="2" />
                    <g strokeDasharray="3 3" opacity="0.4" strokeWidth="1.2">
                      <line x1="50" y1="120" x2="130" y2="180" />
                      <line x1="50" y1="150" x2="110" y2="205" />
                      <line x1="130" y1="120" x2="50" y2="180" />
                      <line x1="130" y1="150" x2="70" y2="205" />
                    </g>
                    <text x="90" y="235" fontSize="12" textAnchor="middle" fontFamily="serif" fontWeight="bold" fill="#292524" stroke="none">3. Quilted Mini Bag</text>
                  </g>

                  {/* 4. Wristlet Pouch */}
                  <g transform="translate(630, 110)">
                    <path d="M 175,85 C 235,85 240,105 235,108 C 228,110 175,100 175,100" strokeWidth="2.2" />
                    <rect x="35" y="65" width="140" height="100" rx="12" strokeWidth="2.8" />
                    <line x1="45" y1="73" x2="165" y2="73" strokeWidth="2" />
                    <line x1="35" y1="105" x2="175" y2="105" strokeWidth="2.4" />
                    <circle cx="160" cy="105" r="3" fill="#292524" />
                    <text x="105" y="195" fontSize="12" textAnchor="middle" fontFamily="serif" fontWeight="bold" fill="#292524" stroke="none">4. Wristlet Pouch</text>
                  </g>

                  {/* 5. Single Corner-Zip Pouch */}
                  <g transform="translate(860, 80)">
                    <path d="M 75,55 C 75,38 95,38 95,55" strokeWidth="2" />
                    <rect x="45" y="55" width="80" height="155" rx="10" strokeWidth="2.8" />
                    <line x1="112" y1="55" x2="112" y2="210" strokeWidth="2.4" />
                    <rect x="109" y="75" width="6" height="14" rx="2" fill="#292524" />
                    <path d="M 112,89 L 112,98" strokeWidth="1.8" />
                    <text x="85" y="240" fontSize="12" textAnchor="middle" fontFamily="serif" fontWeight="bold" fill="#292524" stroke="none">5. Corner-Zip Pouch</text>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* DETAILED BLUEPRINT CARDS SECTION */}
        <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
                Architectural Blueprints & Construction Notes
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Toggle between the <strong>pure outline sketch</strong> and the <strong>finished fabric photo</strong> for each design.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-stone-200 shadow-2xs self-start sm:self-auto text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === "all" ? "bg-amber-800 text-white shadow-2xs" : "text-stone-600 hover:text-stone-900"
                }`}
              >
                All 5 Designs
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("handbags")}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === "handbags" ? "bg-amber-800 text-white shadow-2xs" : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Handbags
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("mini")}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === "mini" ? "bg-amber-800 text-white shadow-2xs" : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Mini Bags
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("pouches")}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === "pouches" ? "bg-amber-800 text-white shadow-2xs" : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Pouches
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="space-y-8">
            {filteredDesigns.map((design) => {
              const matchedProduct = PRODUCTS.find((p) => p.id === design.productId);
              const isRealView = viewModes[design.id] === "real";
              const inCartCount = matchedProduct ? getItemQuantity(matchedProduct.id) : 0;

              return (
                <div
                  key={design.id}
                  className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Visual Column (Outline / Photo Toggle) */}
                    <div className="lg:col-span-5 flex flex-col items-center">
                      <div className="relative w-full aspect-square max-w-[340px] bg-[#FAF8F5] rounded-2xl border border-stone-200/90 overflow-hidden flex items-center justify-center p-6 shadow-inner group">
                        {isRealView ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={design.realImage}
                              alt={design.name}
                              fill
                              sizes="340px"
                              className="object-contain"
                            />
                            <span className="absolute bottom-2 right-2 bg-stone-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs">
                              Real Fabric Photo
                            </span>
                          </div>
                        ) : (
                          <div className="w-full h-full text-stone-900 flex items-center justify-center">
                            {design.svgSilhouette}
                            <span className="absolute bottom-2 right-2 bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-300">
                              Blueprint Outline
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Toggle Button */}
                      <button
                        type="button"
                        onClick={() => toggleViewMode(design.id)}
                        className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer border border-stone-200"
                      >
                        <Eye className="w-3.5 h-3.5 text-stone-600" />
                        <span>Switch to {isRealView ? "Blueprint Outline" : "Fabric Photo"}</span>
                      </button>
                    </div>

                    {/* Details Column */}
                    <div className="lg:col-span-7 space-y-4">
                      {/* Badge & Number */}
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md">
                            SPEC {design.number}
                          </span>
                          <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                            {design.category}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl sm:text-2xl font-extrabold text-stone-900">
                            ₹{design.price}
                          </span>
                          <span className="text-xs text-stone-400 line-through">
                            ₹{design.originalPrice}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
                        {design.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                        {design.description}
                      </p>

                      {/* Specifications Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                          <span className="text-stone-400 block font-medium">Dimensions:</span>
                          <span className="font-semibold text-stone-800">{design.dimensions}</span>
                        </div>
                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                          <span className="text-stone-400 block font-medium">Capacity:</span>
                          <span className="font-semibold text-stone-800">{design.capacity}</span>
                        </div>
                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                          <span className="text-stone-400 block font-medium">Strap & Handles:</span>
                          <span className="font-semibold text-stone-800">{design.strapDetails}</span>
                        </div>
                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                          <span className="text-stone-400 block font-medium">Closure & Hardware:</span>
                          <span className="font-semibold text-stone-800">{design.closure}</span>
                        </div>
                      </div>

                      {/* Seam Craft Note */}
                      <div className="flex items-center gap-2 text-xs text-amber-900 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/60 font-medium">
                        <Scissors className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                        <span><strong>Mom's Stitching:</strong> {design.seamCraft}</span>
                      </div>

                      {/* Action Buttons */}
                      {matchedProduct && (
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleAddToCart(matchedProduct)}
                            className="bg-[#ffd814] hover:bg-[#f7ca00] text-stone-900 font-bold text-xs sm:text-sm py-2.5 px-5 rounded-xl border border-[#fcd200] shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                          >
                            <ShoppingBag className="w-4 h-4 text-stone-900" />
                            <span>
                              {addedItem === matchedProduct.id
                                ? "Added to Cart ✓"
                                : inCartCount > 0
                                ? `Add Another (${inCartCount} in Cart)`
                                : "Add Design to Cart"}
                            </span>
                          </button>

                          <a
                            href={`https://wa.me/919491710704?text=Hi%20Sudha%20Rani%20ji%2C%20I%20want%20to%20order%20the%20${encodeURIComponent(
                              design.name
                            )}%20(₹${design.price})!`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2.5 rounded-xl transition-colors inline-flex items-center gap-1.5"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Order via WhatsApp</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ARTISAN COMMITMENT & SEWING WORKFLOW BANNER */}
        <section className="py-16 bg-white border-t border-[#EDE6DD]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full mb-2 border border-amber-300">
                <Heart className="w-3.5 h-3.5 text-amber-800" />
                <span>The Slow Craft Process</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">
                How Each Silhouette Comes to Life
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-2">
                We believe true durability comes from thoughtful cutting, premium thread tension, and honest handcrafting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-stone-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto text-amber-900 font-bold text-base">
                  1
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-lg">Chalk Drafting on Cotton Slub</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Before a single pair of scissors touches the cloth, mom lays out natural cotton canvas and hand-measures every seam allowance to maximize fabric durability.
                </p>
              </div>

              <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-stone-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto text-amber-900 font-bold text-base">
                  2
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-lg">Reinforced French Seam Stitching</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Every internal edge is folded inward and double-sewn so that no raw thread is ever exposed. Your bags remain clean, washable, and fray-free for years.
                </p>
              </div>

              <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-stone-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto text-amber-900 font-bold text-base">
                  3
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-lg">Eco Packaging & Hand-Written Note</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Each completed bag is ironed, wrapped in natural butter paper, tied with cotton twine, and accompanied by a warm handwritten greeting from our home studio.
                </p>
              </div>
            </div>

            {/* Bottom CTA to catalog */}
            <div className="mt-12 text-center">
              <Link
                href="/#catalog"
                className="inline-flex items-center gap-2 bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <span>Browse Full Store Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
