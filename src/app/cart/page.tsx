"use client";

import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
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
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    totalItems,
    totalOriginalPrice,
    totalSavings,
  } = useCart();

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
          <span className="text-stone-800 font-semibold">Shopping Cart</span>
        </div>

        {cart.length === 0 ? (
          /* EMPTY CART VIEW (Amazon & Flipkart Style) */
          <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-16 text-center max-w-2xl mx-auto shadow-sm my-6">
            <div className="w-20 h-20 rounded-full bg-amber-100/80 border border-amber-200 flex items-center justify-center mx-auto text-amber-800 mb-5">
              <ShoppingBag className="w-10 h-10 text-amber-700" />
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
              Your Shopping Cart is Empty
            </h1>
            <p className="text-sm sm:text-base text-stone-600 max-w-md mx-auto mb-8 leading-relaxed">
              Explore our handmade tote bags, quilted pouches, and artisanal accessories lovingly stitched by mom.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/#catalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <span>Shop Today's Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/track-order"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-sm px-6 py-3.5 rounded-xl transition-colors"
              >
                <Truck className="w-4 h-4 text-stone-600" />
                <span>Track Existing Order</span>
              </Link>
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
              </div>

              {/* RIGHT COLUMN: FLIPKART & AMAZON SIGNATURE PRICE DETAILS (4 cols) */}
              <div className="lg:col-span-4 space-y-5 sticky top-28">
                <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-7 shadow-sm">
                  {/* Header */}
                  <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 pb-3 border-b border-stone-100">
                    Price Details
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
                      <span>Delivery Charges</span>
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
                        Total Amount
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
                    <span>Place Order</span>
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
