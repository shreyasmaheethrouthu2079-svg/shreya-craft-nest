"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Truck,
  Lock,
  Tag,
  CheckCircle2,
} from "lucide-react";

export default function CartPage() {
  const [selectedCat, setSelectedCat] = useState<"All" | "Handbags" | "Mini Bags" | "Pouches">("All");
  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    totalItems,
    totalOriginalPrice,
    totalSavings,
  } = useCart();
  const { t } = useLanguage();

  const displayedProducts = useMemo(() => {
    if (selectedCat === "All") return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === selectedCat);
  }, [selectedCat]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 mb-6">
          <Link
            href="/"
            className="hover:text-amber-800 transition-colors inline-flex items-center gap-1.5 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="text-stone-800 font-semibold">{t("cart.title")}</span>
        </div>

        {cart.length === 0 ? (
          /* EMPTY CART VIEW WITH DIRECT ADD TO CART SHOWCASE */
          <div className="space-y-10 my-4">
            {/* Helpful Top Banner */}
            <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="w-16 h-16 rounded-2xl bg-amber-100/80 border border-amber-200 flex items-center justify-center mx-auto md:mx-0 text-amber-800 flex-shrink-0">
                  <ShoppingBag className="w-8 h-8 text-amber-700" />
                </div>
                <div>
                  <h1 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                    Your Shopping Cart is Empty (0 Items)
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
                    Select any authentic handcrafted bag or pouch below and click <strong className="text-amber-900 font-bold">"Add to Cart"</strong> to start your order with flat ₹40 Pan-India delivery:
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-shrink-0">
                <Link
                  href="/track-order"
                  className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
                >
                  <Truck className="w-3.5 h-3.5 text-stone-600" />
                  <span>Track Order</span>
                </Link>
                <Link
                  href="/signin"
                  className="inline-flex items-center gap-1.5 bg-amber-100/80 hover:bg-amber-200 text-amber-900 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
                >
                  <span>Sign In</span>
                </Link>
              </div>
            </div>

            {/* DIRECT ADD TO CART PRODUCT SHOWCASE */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200/80">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300/60 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>Choose an Item & Click "Add to Cart"</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                    Handmade Bags & Pouches — Add to Cart
                  </h2>
                </div>

                {/* Category Filter Tabs */}
                <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-stone-200 shadow-2xs">
                  {(["All", "Handbags", "Mini Bags", "Pouches"] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCat(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        selectedCat === cat
                          ? "bg-amber-800 text-white shadow-xs"
                          : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                      }`}
                    >
                      {cat === "All"
                        ? "All Designs"
                        : cat === "Handbags"
                        ? "Handbags (₹400)"
                        : cat === "Mini Bags"
                        ? "Mini Bags (₹140)"
                        : "Pouches (₹100)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* PRODUCTS GRID WITH ADD TO CART BUTTONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ACTIVE CART WITH FLIPKART & AMAZON DUAL COLUMN LAYOUT */
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-stone-200/80 gap-3">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  Shopping Cart
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  {totalItems} {totalItems === 1 ? "handmade item" : "handmade items"} in your nest • Ships directly from our artisan studio
                </p>
              </div>

              <button
                onClick={clearCart}
                className="text-xs font-semibold text-stone-500 hover:text-red-700 transition-colors self-start sm:self-auto cursor-pointer"
              >
                Clear all items
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: CART ITEMS LIST (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                {/* Express Courier Banner */}
                <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5 text-amber-900 font-semibold">
                    <Truck className="w-4 h-4 text-amber-800 flex-shrink-0" />
                    <span>Pan-India Express Delivery via Courier (₹40 standard delivery applied)</span>
                  </div>
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs uppercase tracking-wider">
                    Express
                  </span>
                </div>

                {/* Items */}
                <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm divide-y divide-stone-100 overflow-hidden">
                  {cart.map(({ product, quantity }) => {
                    const discount = Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    );

                    return (
                      <div
                        key={product.id}
                        className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center transition-colors hover:bg-stone-50/50"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0 space-y-1.5 w-full">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80">
                              {product.category}
                            </span>
                            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              In Stock
                            </span>
                          </div>

                          <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900">
                            {product.name}
                          </h3>

                          <p className="text-xs text-stone-500">
                            Material: {product.material} • Dimensions: {product.dimensions}
                          </p>

                          {/* Price & Savings row */}
                          <div className="flex items-baseline gap-2 pt-1">
                            <span className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                              ₹{product.price}
                            </span>
                            <span className="text-xs text-stone-400 line-through">
                              ₹{product.originalPrice}
                            </span>
                            {discount > 0 && (
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                {discount}% Off
                              </span>
                            )}
                          </div>

                          {/* Stepper & Actions */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 mt-2">
                            {/* Flipkart / Amazon Quantity Stepper */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-stone-500 font-medium">
                                Qty:
                              </span>
                              <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 overflow-hidden shadow-2xs">
                                <button
                                  onClick={() =>
                                    updateQuantity(product.id, quantity - 1)
                                  }
                                  className="p-1.5 sm:px-2.5 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                                  title="Decrease quantity"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="px-3 text-xs font-bold text-stone-900 select-none">
                                  {quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(product.id, quantity + 1)
                                  }
                                  className="p-1.5 sm:px-2.5 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                                  title="Increase quantity"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Actions: Remove & Buy This Only */}
                            <div className="flex items-center gap-4 text-xs font-semibold">
                              <Link
                                href={`/checkout?productId=${product.id}`}
                                className="text-amber-800 hover:text-amber-950 underline underline-offset-2"
                              >
                                Buy This Now
                              </Link>
                              <span className="text-stone-300">|</span>
                              <button
                                onClick={() => removeFromCart(product.id)}
                                className="text-stone-400 hover:text-red-700 flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Subtotal summary footer beneath items */}
                <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 flex items-center justify-between shadow-2xs">
                  <Link
                    href="/#catalog"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-700 hover:text-amber-800 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Continue Shopping</span>
                  </Link>

                  <div className="text-right">
                    <span className="text-xs text-stone-500">
                      Subtotal ({totalItems} items):{" "}
                    </span>
                    <span className="font-serif text-lg font-bold text-stone-900">
                      ₹{subtotal}
                    </span>
                  </div>
                </div>

                {/* QUICK ADD MORE ITEMS TO CART */}
                <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-700" />
                        <span>Add More Handcrafted Items to Your Cart</span>
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Add matching bags & pouches directly with 1 click
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {PRODUCTS.filter((p) => !cart.some((c) => c.product.id === p.id)).slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl border border-stone-200/80 bg-[#FAF8F5] flex items-center justify-between gap-3.5 hover:border-amber-300 transition-colors"
                      >
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-stone-200 flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-xs sm:text-sm font-bold text-stone-900 truncate">{item.name}</h4>
                          <span className="text-[10px] text-amber-800 font-semibold">{item.category}</span>
                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="font-serif text-sm font-bold text-stone-900">₹{item.price}</span>
                            <span className="text-[11px] text-stone-400 line-through">₹{item.originalPrice}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => addToCart(item)}
                          className="inline-flex items-center gap-1 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer flex-shrink-0"
                          title={`Add ${item.name} to Cart`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: FLIPKART & AMAZON SIGNATURE PRICE DETAILS (4 cols) */}
              <div className="lg:col-span-4 space-y-5 sticky top-28">
                <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-7 shadow-sm">
                  {/* Header */}
                  <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 pb-3 border-b border-stone-100">
                    {t("cart.priceDetails")}
                  </h2>

                  {/* Financial Breakdown */}
                  <div className="space-y-3 py-4 text-xs sm:text-sm">
                    <div className="flex justify-between text-stone-600">
                      <span>Price ({totalItems} items)</span>
                      <span className="font-semibold text-stone-800">
                        ₹{totalOriginalPrice}
                      </span>
                    </div>

                    <div className="flex justify-between text-stone-600">
                      <span>Discount</span>
                      <span className="font-semibold text-emerald-700">
                        − ₹{totalSavings}
                      </span>
                    </div>

                    <div className="flex justify-between text-stone-600">
                      <span>{t("cart.deliveryFee")}</span>
                      <span className="font-semibold text-stone-800">
                        ₹40
                      </span>
                    </div>

                    <div className="flex justify-between text-stone-600">
                      <span>Secured Packaging</span>
                      <span className="text-stone-500">
                        Included
                      </span>
                    </div>

                    {/* Total Amount Due */}
                    <div className="flex justify-between items-baseline pt-3 border-t border-dashed border-stone-200 text-stone-900">
                      <span className="font-bold text-sm sm:text-base">
                        {t("cart.total")}
                      </span>
                      <span className="font-serif text-2xl font-bold text-amber-900">
                        ₹{subtotal + 40}
                      </span>
                    </div>
                  </div>

                  {/* Flipkart Green Savings Banner */}
                  {totalSavings > 0 && (
                    <div className="py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold text-center flex items-center justify-center gap-1.5 mb-5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>You will save ₹{totalSavings} on this order</span>
                    </div>
                  )}

                  {/* Primary Checkout CTA Button */}
                  <Link
                    href="/checkout"
                    className="w-full inline-flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-900 active:scale-[0.98] text-white font-bold text-sm sm:text-base py-3.5 sm:py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all uppercase tracking-wide cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-amber-200" />
                    <span>{t("cart.proceed")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {/* Trust guarantees */}
                  <div className="mt-5 pt-4 border-t border-stone-100 space-y-2 text-[11px] text-stone-500">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                      <span>100% Safe & Secure Payments (UPI, Cards & COD)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-700 flex-shrink-0" />
                      <span>Slow-Crafted Authentic Stitches by Mom</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
