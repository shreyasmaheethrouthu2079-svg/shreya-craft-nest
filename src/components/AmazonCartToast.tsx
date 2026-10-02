"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { CheckCircle2, X, ShoppingBag, ArrowRight } from "lucide-react";

export function AmazonCartToast() {
  const {
    showAddedToast,
    lastAddedItem,
    dismissToast,
    totalItems,
    subtotal,
    totalSavings,
  } = useCart();

  if (!showAddedToast || !lastAddedItem) return null;

  return (
    <aside
      aria-label="Item added to cart notification"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:top-24 sm:bottom-auto z-50 max-w-md w-full sm:w-[410px] bg-white rounded-2xl border-2 border-emerald-600/30 shadow-2xl p-4 sm:p-5 transition-all animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-top-4 duration-300"
    >
      {/* Top row: Success indicator & dismiss */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
          <span>Added to Cart Successfully!</span>
        </div>
        <button
          onClick={dismissToast}
          className="text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Middle row: Item details & Cart Subtotal */}
      <div className="py-3 flex items-center gap-3">
        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
          <Image
            src={lastAddedItem.product.image}
            alt={lastAddedItem.product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-stone-900 truncate">
            {lastAddedItem.product.name}
          </h4>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Price: <span className="font-semibold text-stone-800">₹{lastAddedItem.product.price}</span> • Qty: {lastAddedItem.quantity}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs">
            <span className="text-stone-600">
              Cart Subtotal ({totalItems}):
            </span>
            <span className="font-bold text-emerald-800">
              ₹{subtotal}
            </span>
          </div>
        </div>
      </div>

      {/* Green Savings Pill (Flipkart & Amazon signature) */}
      {totalSavings > 0 && (
        <div className="mb-3 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-semibold flex items-center justify-between">
          <span>Total Savings on your cart:</span>
          <span className="font-bold">₹{totalSavings} saved</span>
        </div>
      )}

      {/* Action buttons: Amazon & Flipkart dual CTA */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <Link
          href="/cart"
          onClick={dismissToast}
          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs shadow-xs transition-all text-center"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-stone-600" />
          <span>View Cart ({totalItems})</span>
        </Link>

        <Link
          href="/checkout"
          onClick={dismissToast}
          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-sm hover:shadow transition-all text-center"
        >
          <span>Checkout</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
