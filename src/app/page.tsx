"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TrustBanner } from "@/components/TrustBanner";
import { ProductCatalog } from "@/components/ProductCatalog";
import { useLanguage } from "@/context/LanguageContext";
import {
  ArrowRight,
  CheckCircle,
  Scissors,
  ShoppingBag,
} from "lucide-react";

export default function HomePage() {
  const { t } = useLanguage();

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
                {/* Main Headline */}
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
                  {t("hero.headlineStart")}{" "}
                  <span className="italic font-normal text-amber-800 block sm:inline">
                    {t("hero.headlineItalic")}
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  {t("hero.welcome")}{" "}
                  <strong className="text-stone-900 font-semibold">{t("hero.brand")}</strong>.{" "}
                  {t("hero.desc")}
                </p>

                {/* Value bullets */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs sm:text-sm text-stone-700 font-medium">
                  <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-stone-200/80">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <span>{t("hero.bullet1")}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-stone-200/80">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <span>{t("hero.bullet2")}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-stone-200/80">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <span>{t("hero.bullet3")}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-4 flex items-center justify-center lg:justify-start">
                  <Link
                    href="#catalog"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-base px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <ShoppingBag className="w-5 h-5 text-amber-200" />
                    <span>{t("hero.cta")}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
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

                  {/* Badges placed neatly beneath the image */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-sm border border-amber-200/80 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
                        <Scissors className="w-3 h-3" />
                      </div>
                      <span className="font-bold text-stone-900">{t("hero.badge1")}</span>
                    </div>

                    <div className="bg-stone-900 text-white px-3.5 py-2 rounded-xl shadow-sm flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-medium">{t("hero.badge2")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT CATALOG WITH FILTER TABS */}
        <Suspense fallback={<div className="py-20 text-center text-stone-400">Loading catalog...</div>}>
          <ProductCatalog />
        </Suspense>

        {/* THE ARTISAN PROMISE / TRUST BANNER */}
        <TrustBanner />
      </main>

      <Footer />
    </div>
  );
}
