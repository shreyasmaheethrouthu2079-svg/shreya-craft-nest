"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, PRODUCTS } from "@/data/products";
import { Product3DModal } from "@/components/Product3DModal";
import {
  Sparkles,
  Rotate3d,
  Layers,
  ArrowRight,
  ShieldCheck,
  Tag,
} from "lucide-react";

export function ArtisanalCollectiveShowcase() {
  const [active3DProduct, setActive3DProduct] = useState<Product | null>(null);
  const [cardTransform, setCardTransform] = useState<string>(
    "perspective(1000px) rotateX(0deg) rotateY(0deg)"
  );
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number }>({
    x: 50,
    y: 50,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setCardTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
    );
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setCardTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#FAF8F5] via-white to-[#FAF8F5] border-t border-[#EDE6DD] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: 3D Tilt Flat-Lay Showcase */}
          <div className="lg:col-span-6 relative flex justify-center">
            {/* Glowing background halo */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-amber-200/40 via-emerald-100/30 to-amber-100/40 rounded-3xl blur-2xl -z-10" />

            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-lg aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white transition-transform duration-200 ease-out cursor-pointer group select-none"
              style={{
                transform: cardTransform,
                transformStyle: "preserve-3d",
              }}
              onClick={() => setActive3DProduct(PRODUCTS[0])}
            >
              <Image
                src="/products/artisanal-collective.jpg"
                alt="Artisanal Fabrics Collective by Shreya Crafts Nest"
                fill
                sizes="(max-width: 640px) 100vw, 500px"
                className="object-cover"
                priority
              />

              {/* Dynamic light reflection glare effect */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-300 mix-blend-overlay"
                style={{
                  background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.8) 0%, transparent 60%)`,
                }}
              />

              {/* Interactive 3D Pill Overlay */}
              <div className="absolute top-4 left-4 bg-stone-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-400/40 text-amber-300 text-xs font-semibold shadow-lg flex items-center gap-2">
                <Rotate3d className="w-3.5 h-3.5 text-amber-400" />
                <span>Interactive 3D Studio Showcase</span>
              </div>

              {/* Click to inspect prompt */}
              <div className="absolute bottom-4 inset-x-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-stone-200 shadow-xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                    Full Studio Set
                  </p>
                  <p className="text-xs font-bold text-stone-900">
                    Click to Inspect Any Bag in 360° 3D
                  </p>
                </div>
                <span className="w-8 h-8 rounded-xl bg-amber-800 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Rotate3d className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial & Bag Selectors */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-100/90 text-amber-900 text-xs font-semibold px-3 py-1 rounded-full border border-amber-300/70">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Artisanal Fabrics Collective</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-tight">
              3D Interactive Inspection Studio
            </h2>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Every fold, stitch, and zipper is crafted with pride. Use our real-time 3D Studio to rotate each handmade bag 360°, inspect the cotton weave grain, view exact dimensions, and see how it looks from every angle before ordering.
            </p>

            {/* Quick 3D Launcher list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {PRODUCTS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActive3DProduct(item)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white border border-stone-200/90 hover:border-amber-400 hover:shadow-md transition-all text-left group/item cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900 line-clamp-1 group-hover/item:text-amber-800 transition-colors">
                        {item.name}
                      </p>
                      <p className="text-[11px] font-semibold text-emerald-700">
                        ₹{item.price}
                      </p>
                    </div>
                  </div>

                  <span className="p-1.5 rounded-lg bg-stone-100 text-stone-600 group-hover/item:bg-amber-100 group-hover/item:text-amber-800 transition-colors">
                    <Rotate3d className="w-4 h-4" />
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => setActive3DProduct(PRODUCTS[0])}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <Rotate3d className="w-4 h-4 text-amber-400" />
                <span>Open 3D Studio Modal</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <Link
                href="/#catalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-stone-700 hover:text-amber-800 text-sm font-semibold px-4 py-3 rounded-xl border border-stone-300 hover:border-amber-300 transition-colors"
              >
                <span>Browse Full Catalog</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Modal Instance */}
      {active3DProduct && (
        <Product3DModal
          isOpen={!!active3DProduct}
          onClose={() => setActive3DProduct(null)}
          product={active3DProduct}
          onSelectProduct={(p) => setActive3DProduct(p)}
        />
      )}
    </section>
  );
}
