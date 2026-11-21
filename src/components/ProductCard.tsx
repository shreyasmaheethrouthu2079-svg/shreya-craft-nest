"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, CheckCircle2, ArrowRight, Sparkles, ShoppingBag, Plus, Minus, MessageCircle } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, updateQuantity, getItemQuantity, openCart } = useCart();
  const { t } = useLanguage();
  const cartQuantity = getItemQuantity(product.id);

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <article className="group bg-white rounded-2xl border border-[#EDE6DD] overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Product image container with badge */}
        <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Badge overlays */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.badge && (
              <span className="inline-flex items-center gap-1 bg-amber-700/95 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md backdrop-blur-sm">
                <Sparkles className="w-3 h-3 text-amber-200" />
                {product.badge}
              </span>
            )}
            <span className="inline-flex items-center bg-white/90 text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider backdrop-blur-sm">
              {product.category}
            </span>
          </div>

          {/* Discount badge */}
          {discountPercent > 0 && (
            <div className="absolute top-3 right-3 bg-emerald-700 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-md">
              {t("catalog.save")} {discountPercent}%
            </div>
          )}
        </div>

        {/* Content details */}
        <div className="p-5 sm:p-6 space-y-3">
          {/* Rating & reviews */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-stone-400 font-normal">
                ({product.reviewsCount} reviews)
              </span>
            </div>
            <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium">
              {t("catalog.inStock")}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Material & Dimensions */}
          <div className="bg-[#FAF8F5] p-3 rounded-xl border border-stone-200/60 text-xs space-y-1">
            <div className="text-stone-700">
              <span className="font-semibold text-stone-900">{t("catalog.fabric")}</span>{" "}
              {product.material}
            </div>
            <div className="text-stone-600">
              <span className="font-semibold text-stone-900">{t("catalog.dimensions")}</span>{" "}
              {product.dimensions}
            </div>
          </div>

          {/* Highlights checklist */}
          <ul className="space-y-1 pt-1">
            {product.features.slice(0, 2).map((feat, idx) => (
              <li
                key={idx}
                className="flex items-start gap-1.5 text-xs text-stone-600"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Card Footer with Price, Add to Cart & Buy Now */}
      <div className="p-4 sm:p-5 pt-0 border-t border-stone-100 mt-2">
        <div className="pt-3.5 space-y-3">
          {/* Price & Cart Status */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                {t("catalog.price")}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl font-bold text-stone-900">
                  ₹{product.price}
                </span>
              </div>
            </div>

            {cartQuantity > 0 && (
              <button
                type="button"
                onClick={openCart}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title="Open Shopping Cart"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-800" />
                <span>{cartQuantity} in Cart</span>
                <span className="text-[10px] text-amber-700 underline font-semibold ml-0.5">View ▸</span>
              </button>
            )}
          </div>

          {/* Action Buttons: Add to Cart + Buy Now */}
          <div className="grid grid-cols-2 gap-2">
            {cartQuantity === 0 ? (
              <button
                type="button"
                onClick={() => addToCart(product, 1, { openDrawer: true })}
                className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl border-2 border-amber-400 bg-amber-50 hover:bg-amber-100 active:scale-95 text-amber-950 font-bold text-xs sm:text-sm transition-all shadow-2xs cursor-pointer group/btn"
                title={`Add ${product.name} to Shopping Cart`}
                aria-label={`Add ${product.name} to Cart`}
              >
                <ShoppingBag className="w-4 h-4 text-amber-800 group-hover/btn:scale-110 transition-transform flex-shrink-0" />
                <span>{t("catalog.addToCart")}</span>
              </button>
            ) : (
              <div className="inline-flex items-center justify-between border-2 border-emerald-600 bg-emerald-50 rounded-xl overflow-hidden shadow-2xs py-1 px-1.5">
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, cartQuantity - 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-emerald-100 text-emerald-800 transition-colors cursor-pointer"
                  title="Decrease quantity"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={openCart}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-950 hover:underline cursor-pointer px-1"
                  title="Open Cart"
                >
                  <span>{cartQuantity} in Cart</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateQuantity(product.id, cartQuantity + 1);
                    openCart();
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-emerald-100 text-emerald-800 transition-colors cursor-pointer"
                  title="Increase quantity"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <Link
              href={`/checkout?productId=${product.id}`}
              className="inline-flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white font-bold text-xs sm:text-sm px-2.5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer text-center"
              title={`Order ${product.name} with delivery address via WhatsApp`}
            >
              <MessageCircle className="w-4 h-4 fill-white flex-shrink-0" />
              <span>Order Now</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
