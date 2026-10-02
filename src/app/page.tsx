import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TrustBanner } from "@/components/TrustBanner";
import { ProductCatalog } from "@/components/ProductCatalog";
import {
  Heart,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Scissors,
  Feather,
  ShoppingBag,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-[#EDE6DD]/80">
          {/* Subtle background warm pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#92400e_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Story Copy & CTAs */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                {/* High Trust Badge */}
                <div className="inline-flex items-center gap-2 bg-amber-100/90 text-amber-900 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-amber-300/70 shadow-xs">
                  <Heart className="w-4 h-4 fill-amber-700 text-amber-700" />
                  <span>100% Hand-Stitched by Mom</span>
                  <span className="w-1 h-1 rounded-full bg-amber-400"></span>
                  <span className="text-amber-800 font-medium">Small Batch Goods</span>
                </div>

                {/* Main Headline */}
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
                  Handcrafted Bags, Pouches & Hair Accessories{" "}
                  <span className="italic font-normal text-amber-800 block sm:inline">
                    Stitched with Love
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Welcome to <strong className="text-stone-900 font-semibold">Shreya Crafts Nest</strong>. Every stitch is thoughtfully placed at our home studio using durable cotton canvas, natural threads, and pure mulberry satin. No factory shortcuts—just genuine love, sturdy seams, and timeless warmth.
                </p>

                {/* Value bullets */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs sm:text-sm text-stone-700 font-medium">
                  <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-stone-200/80">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <span>Durable French Seams</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-stone-200/80">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <span>Zero Plastic Packaging</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-stone-200/80">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <span>Instant UPI Checkout</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    href="#catalog"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-base px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <ShoppingBag className="w-5 h-5 text-amber-200" />
                    <span>Shop Collection</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>

                  <Link
                    href="#story"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-base px-6 py-3.5 rounded-xl border border-stone-300 shadow-xs hover:border-amber-400 transition-all"
                  >
                    <span>Read Our Story</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Hero Visual Showcase */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Decorative backdrop shapes */}
                  <div className="absolute -top-6 -right-6 w-64 h-64 bg-amber-200/40 rounded-full blur-2xl -z-10" />
                  <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-emerald-200/30 rounded-full blur-2xl -z-10" />

                  {/* Main framed photo */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#FAF7F2] aspect-square">
                    <Image
                      src="/products/hero-collection.jpg"
                      alt="Artisanal Fabrics Collective - Handcrafted bags & pouches by Shreya Crafts Nest"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                      className="object-contain p-2"
                    />
                  </div>

                  {/* Badges placed neatly beneath the image so nothing covers the bags */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-sm border border-amber-200/80 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
                        <Scissors className="w-3 h-3" />
                      </div>
                      <span className="font-bold text-stone-900">Hand-Guided Stitching</span>
                    </div>

                    <div className="bg-stone-900 text-white px-3.5 py-2 rounded-xl shadow-sm flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-medium">Pan-India Express Dispatch</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BANNER: 3-STEP PROCESS */}
        <TrustBanner />

        {/* PRODUCT CATALOG WITH FILTER TABS */}
        <ProductCatalog />

        {/* THE MAKER'S STORY SECTION */}
        <section id="story" className="py-20 bg-white border-t border-[#EDE6DD]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-[#FAF8F5] aspect-square">
                  <Image
                    src="/products/terracotta-patchwork-tote.jpg"
                    alt="Terracotta Kalamkari patchwork tote stitched with care"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-6">
                    <p className="text-white text-sm font-medium italic">
                      "When you stitch for someone with your own hands, you give them a piece of your peace."
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 order-1 lg:order-2 space-y-5">
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-900 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
                  <Feather className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Our Heart & Heritage</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
                  From Mom's Sewing Table to Your Everyday Life
                </h2>

                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                  For over two decades, mom's old sewing machine has been the heart of our household. From mending favorite dresses to crafting custom travel pouches for relatives, her stitches have always been known for their neatness and unbreakable durability.
                </p>

                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                  <strong className="text-stone-900">Shreya Crafts Nest</strong> was born out of a simple idea: why settle for synthetic, mass-produced accessories when you can carry a piece of slow-crafted art? Every item you purchase directly supports an artisan mother's passion and helps us keep traditional textile stitching alive.
                </p>

                <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-stone-100">
                  <div>
                    <div className="font-serif text-2xl font-bold text-amber-800">
                      500+
                    </div>
                    <div className="text-xs text-stone-500">Bags & Pouches Stitched</div>
                  </div>
                  <div>
                    <div className="font-serif text-2xl font-bold text-amber-800">
                      100%
                    </div>
                    <div className="text-xs text-stone-500">Plastic-Free Fabrics</div>
                  </div>
                  <div>
                    <div className="font-serif text-2xl font-bold text-amber-800">
                      4.9 ★
                    </div>
                    <div className="text-xs text-stone-500">Average Customer Love</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
