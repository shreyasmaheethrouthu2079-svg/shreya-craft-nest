"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, PRODUCTS } from "@/data/products";
import {
  X,
  Rotate3d,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Ruler,
  Play,
  Pause,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  Layers,
} from "lucide-react";

interface Product3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export function Product3DModal({
  isOpen,
  onClose,
  product,
  onSelectProduct,
}: Product3DModalProps) {
  const [rotX, setRotX] = useState<number>(-5);
  const [rotY, setRotY] = useState<number>(15);
  const [zoom, setZoom] = useState<number>(1);
  const [isAutoSpin, setIsAutoSpin] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const stageRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Smooth Auto-spin animation
  useEffect(() => {
    if (!isOpen || !isAutoSpin || isDragging) return;

    let lastTime = performance.now();
    const spin = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      setRotY((prev) => (prev + delta * 22) % 360);
      animFrameRef.current = requestAnimationFrame(spin);
    };

    animFrameRef.current = requestAnimationFrame(spin);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, isAutoSpin, isDragging]);

  // Drag to rotate handlers (Mouse & Touch)
  const handlePointerDown = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setIsAutoSpin(false);
    setDragStart({ x: clientX, y: clientY });
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const dx = clientX - dragStart.x;
    const dy = clientY - dragStart.y;

    setRotY((prev) => prev + dx * 0.55);
    setRotX((prev) => Math.max(-45, Math.min(45, prev - dy * 0.35)));

    setDragStart({ x: clientX, y: clientY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setRotX(0);
    setRotY(0);
    setZoom(1);
    setIsAutoSpin(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md transition-all animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[820px] bg-[#FAF8F5] rounded-3xl border border-stone-200/90 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200/70 bg-white/70 backdrop-blur-sm z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Rotate3d className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="modal-title"
                className="font-serif text-base sm:text-lg font-bold text-stone-900 leading-tight flex items-center gap-2"
              >
                <span>3D Artisan Studio Inspection</span>
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full">
                  Interactive
                </span>
              </h2>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Drag or swipe to rotate 360° in 3D space • Zoom in for stitch details
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close 3D Studio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content: Split 3D Stage & Details Sidebar */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* LEFT: 3D INTERACTIVE VIEWPORT (7 Cols) */}
          <div
            ref={stageRef}
            className="lg:col-span-7 relative bg-gradient-to-b from-[#F4EFE8] via-[#FAF8F5] to-[#EAE3D6] flex items-center justify-center overflow-hidden select-none cursor-grab active:cursor-grabbing p-6"
            onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
            onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={(e) =>
              handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)
            }
            onTouchMove={(e) =>
              handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)
            }
            onTouchEnd={handlePointerUp}
          >
            {/* Soft Ambient Radial Floor Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(180,83,9,0.06)_0%,transparent_70%)] pointer-events-none" />

            {/* Instruction Floating Hint */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-stone-200/80 text-[11px] font-medium text-stone-600 shadow-xs flex items-center gap-1.5 pointer-events-none z-10">
              <Rotate3d className="w-3.5 h-3.5 text-amber-700" />
              <span>Drag to rotate • Pinch to zoom</span>
            </div>

            {/* 3D Model Stage Container with 3D Perspective */}
            <div
              className="relative w-64 sm:w-80 aspect-square transition-transform duration-75 ease-out"
              style={{
                perspective: "1200px",
                transform: `scale(${zoom})`,
              }}
            >
              {/* Dynamic Moving Shadow underneath */}
              <div
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 sm:w-60 h-10 bg-stone-900/25 rounded-full blur-xl pointer-events-none transition-transform"
                style={{
                  transform: `translateX(-50%) scale(${1 + Math.sin((rotY * Math.PI) / 180) * 0.15})`,
                  opacity: Math.max(0.2, 0.45 - Math.abs(rotX) * 0.005),
                }}
              />

              {/* 3D Bag Card with Real Thickness and Specular Lighting */}
              <div
                className="w-full h-full relative rounded-2xl shadow-2xl transition-transform duration-75"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
                }}
              >
                {/* Front Face with Genuine Bag Photo */}
                <div
                  className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-white/80 bg-stone-100 shadow-xl"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "translateZ(14px)",
                  }}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 256px, 320px"
                    className="object-cover"
                    priority
                  />

                  {/* Dynamic lighting reflection / specular glare overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity"
                    style={{
                      background: `linear-gradient(${rotY + 45}deg, rgba(255,255,255,0.45) 0%, transparent 60%)`,
                      opacity: Math.max(0.15, 0.7 - Math.abs(rotY % 180 - 90) / 100),
                    }}
                  />

                  {/* 3D Dimensions Caliper Overlay */}
                  {showDimensions && (
                    <div className="absolute inset-0 border-2 border-dashed border-amber-600/60 rounded-xl pointer-events-none flex flex-col justify-between p-2 animate-in fade-in">
                      <div className="flex justify-between items-center text-[10px] font-mono font-bold bg-amber-950/80 text-amber-200 px-2 py-0.5 rounded backdrop-blur-xs">
                        <span>W: {product.dimensions.split("x")[1] || "13\""}</span>
                        <span>TOP ZIP</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono font-bold bg-amber-950/80 text-amber-200 px-2 py-0.5 rounded backdrop-blur-xs">
                        <span>H: {product.dimensions.split("x")[0] || "14\""}</span>
                        <span>BASE GUSSET</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Back Face (Authentic artisan textile reverse) */}
                <div
                  className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-white/80 bg-stone-800 shadow-xl"
                  style={{
                    transform: "rotateY(180deg) translateZ(14px)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <Image
                    src={product.image}
                    alt={`${product.name} reverse`}
                    fill
                    className="object-cover scale-x-[-1] brightness-95"
                  />
                  <div className="absolute inset-0 bg-stone-900/25 flex flex-col items-center justify-center p-4 text-center">
                    <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-widest bg-stone-950/80 px-2.5 py-1 rounded-full">
                      Back & Gusset View
                    </span>
                    <p className="text-white text-xs font-serif font-bold mt-2">
                      Reinforced Back Seam
                    </p>
                  </div>
                </div>

                {/* 3D Side Thickness Edges */}
                <div
                  className="absolute inset-y-0 -left-3 w-6 bg-gradient-to-r from-stone-400 to-amber-900/60 origin-right rounded-sm"
                  style={{
                    transform: "rotateY(-90deg) translateZ(0px)",
                  }}
                />
                <div
                  className="absolute inset-y-0 -right-3 w-6 bg-gradient-to-l from-stone-400 to-amber-900/60 origin-left rounded-sm"
                  style={{
                    transform: "rotateY(90deg) translateZ(0px)",
                  }}
                />
              </div>
            </div>

            {/* Bottom 3D Studio Toolbar */}
            <div className="absolute bottom-4 inset-x-4 flex items-center justify-between bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-stone-200/90 shadow-md z-10 text-xs">
              {/* Auto-spin toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAutoSpin(!isAutoSpin)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                    isAutoSpin
                      ? "bg-amber-800 text-white shadow-xs"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                  title="Toggle 360° Auto Spin"
                >
                  {isAutoSpin ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause Spin</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>360° Auto Spin</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowDimensions(!showDimensions)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                    showDimensions
                      ? "bg-emerald-800 text-white shadow-xs"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                  title="Toggle 3D Dimensions Caliper"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Dimensions</span>
                </button>
              </div>

              {/* Zoom controls */}
              <div className="flex items-center gap-1 text-stone-600">
                <button
                  onClick={() => setZoom((z) => Math.max(0.8, z - 0.2))}
                  className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="font-mono text-[11px] font-bold px-1 select-none">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom((z) => Math.min(2.0, z + 0.2))}
                  className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={resetView}
                  className="ml-2 p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 transition-colors cursor-pointer"
                  title="Reset 3D View"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: PRODUCT DETAILS & BUY SIDEBAR (5 Cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-7 flex flex-col justify-between overflow-y-auto border-t lg:border-t-0 lg:border-l border-stone-200/80">
            <div className="space-y-4">
              {/* Bag switcher pills inside 3D studio */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-2">
                  Select Bag to Inspect in 3D:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRODUCTS.map((item) => {
                    const isSelected = item.id === product.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectProduct(item);
                          resetView();
                        }}
                        className={`text-left p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? "border-amber-700 bg-amber-50 text-amber-900 shadow-xs"
                            : "border-stone-200 bg-stone-50/50 text-stone-600 hover:border-amber-300"
                        }`}
                      >
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-stone-200">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="line-clamp-1 leading-snug">
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title & Badge */}
              <div className="border-t border-stone-100 pt-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {product.category}
                  </span>
                  {product.badge && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300/60">
                      <Sparkles className="w-3 h-3 text-amber-700" />
                      {product.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  {product.name}
                </h3>

                <div className="flex items-baseline gap-2.5 mt-2">
                  <span className="font-serif text-3xl font-extrabold text-stone-900">
                    ₹{product.price}
                  </span>
                  <span className="text-sm text-stone-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                    Pan-India Free Shipping
                  </span>
                </div>
              </div>

              {/* Craftsmanship Specs */}
              <div className="space-y-2 bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200/70 text-xs">
                <div>
                  <span className="font-bold text-stone-900">Fabric Composition:</span>{" "}
                  <span className="text-stone-700">{product.material}</span>
                </div>
                <div>
                  <span className="font-bold text-stone-900">Dimensions:</span>{" "}
                  <span className="text-stone-700 font-mono">{product.dimensions}</span>
                </div>
                <div className="text-stone-600 text-[11px] leading-relaxed pt-1 border-t border-stone-200/60">
                  {product.description}
                </div>
              </div>

              {/* Highlight bullet points */}
              <ul className="space-y-1.5 pt-1 text-xs text-stone-600">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 mt-0.5 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Purchase CTAs */}
            <div className="pt-4 border-t border-stone-100 space-y-2.5">
              <Link
                href={`/checkout?productId=${product.id}`}
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-900 active:scale-[0.99] text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-amber-200" />
                <span>Order Now — Pay ₹{product.price} via UPI</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`https://wa.me/919876543210?text=Hi%20Shreya%20Crafts%20Nest!%20I%20am%20interested%20in%20inspecting%20the%20${encodeURIComponent(product.name)}%20(₹${product.price})`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Ask Maker a Question on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
