"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export function CartDrawer() {
  const {
    cart,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItems,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#EDE6DD] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 sm:p-6 bg-white border-b border-[#EDE6DD] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-stone-900">
                  Artisan Shopping Cart
                </h2>
                <p className="text-xs text-stone-500 font-medium">
                  {totalItems} {totalItems === 1 ? "handmade item" : "handmade items"}
                </p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Promo ribbon */}
          <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-2.5 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pan-India Free Express Shipping Applied!</span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-100/70 border border-amber-200/80 flex items-center justify-center mx-auto text-amber-800">
                  <ShoppingBag className="w-8 h-8 text-amber-700" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-800">
                  Your nest is empty
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 max-w-xs mx-auto leading-relaxed">
                  Discover bags, pouches, and handmade treasures stitched with care by mom.
                </p>
                <button
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <span>Explore Handcrafted Bags</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              cart.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-4 border border-[#EDE6DD] shadow-xs flex gap-4 items-center"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-grow min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      {product.category}
                    </span>
                    <h4 className="font-serif text-sm font-bold text-stone-900 truncate mt-1">
                      {product.name}
                    </h4>
                    <p className="text-xs text-stone-500 truncate">
                      {product.material}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100">
                      {/* Price */}
                      <span className="font-serif text-sm font-bold text-stone-900">
                        ₹{product.price * quantity}
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-stone-800 select-none">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-stone-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 bg-white border-t border-[#EDE6DD] space-y-4">
              <div className="space-y-1.5 text-xs sm:text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-stone-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Pan-India Delivery</span>
                  <span className="text-emerald-700 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-100">
                  <span>Total Amount Due</span>
                  <span className="font-serif text-xl text-amber-900">
                    ₹{subtotal}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full inline-flex items-center justify-center gap-2.5 bg-amber-800 hover:bg-amber-900 active:scale-[0.99] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <span>Proceed to Checkout</span>
                <span className="font-serif">(₹{subtotal})</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>UPI, Google Pay, PhonePe, Paytm & Cards Supported</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
