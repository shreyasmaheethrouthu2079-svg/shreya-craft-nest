"use client";

import { useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TrustBanner } from "@/components/TrustBanner";
import { ProductCatalog } from "@/components/ProductCatalog";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowRight,
  CheckCircle,
  ShoppingBag,
  MessageCircle,
} from "lucide-react";

export default function HomePage() {
  const { isLoggedIn, isLoaded } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    if (isLoaded && !isLoggedIn) {
      router.replace("/signin");
    }
  }, [isLoaded, isLoggedIn, router]);

  // While checking auth session or if not logged in, show clean transition
  if (!isLoaded || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-stone-800">
        <div className="flex flex-col items-center space-y-4 max-w-sm text-center">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-300 bg-white shadow-md">
            <Image
              src="/logo-emblem.png"
              alt="Shreya Craft Nest Logo"
              fill
              sizes="64px"
              className="object-cover"
              priority
            />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Shreya Craft Nest
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Opening Sign In page...
            </p>
          </div>
          <div className="w-6 h-6 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

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
              <div className="lg:col-span-5 relative -mt-4 lg:-mt-8">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Decorative backdrop shapes */}
                  <div className="absolute -top-6 -right-6 w-64 h-64 bg-amber-200/40 rounded-full blur-2xl -z-10" />
                  <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-emerald-200/30 rounded-full blur-2xl -z-10" />

                  {/* Main framed photo (moved somewhat up) */}
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

                  {/* Matter from Photo 1 placed beneath the photo */}
                  <div className="mt-3.5 sm:mt-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-amber-200/90 shadow-md">
                    <p className="text-xs sm:text-[13px] text-stone-700 font-medium leading-relaxed mb-3">
                      Have a custom color request, bulk gift requirement, or questions about fabric care? Chat directly with maker Sudha Rani!
                    </p>
                    <a
                      href="https://wa.me/919491710704?text=Hi%20Sudha%20Rani%20ji%2C%20I%20have%20an%20inquiry%20regarding%20bulk%20orders%20and%20handcrafted%20products!"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all w-full cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Chat directly with maker Sudha Rani</span>
                    </a>
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
