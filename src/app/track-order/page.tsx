"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getProductById } from "@/data/products";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Copy,
  Check,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Scissors,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface StoredOrder {
  orderId: string;
  paymentId: string;
  paymentMethod: string;
  paymentStatus: string;
  customer: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  items: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
  }>;
  totalAmountPaid: number;
  currency: string;
  status: "ORDER_CONFIRMED" | "IN_STITCHING" | "PACKED" | "DISPATCHED" | "DELIVERED";
  courierName?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
}

interface TimelineStep {
  step: number;
  title: string;
  description: string;
  timestamp: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

interface TrackResponse {
  success: boolean;
  order: StoredOrder;
  currentStageIndex: number;
  timeline: TimelineStep[];
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || searchParams.get("orderId") || "";

  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [trackData, setTrackData] = useState<TrackResponse | null>(null);
  const [copiedAWB, setCopiedAWB] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  // Auto-search if query param is present on mount or changed
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchTarget?: string) => {
    const q = (searchTarget !== undefined ? searchTarget : query).trim();
    if (!q) {
      setErrorMsg("Please enter an Order ID or 10-digit mobile number.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/track-order?q=${encodeURIComponent(q)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(
          data.error ||
            `No order found matching "${q}". Please check the Order ID or phone number.`
        );
        setTrackData(null);
      } else {
        setTrackData(data);
        setErrorMsg(null);
      }
    } catch (err: any) {
      setErrorMsg("Failed to connect to tracking server. Please try again.");
      setTrackData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: "awb" | "orderId") => {
    navigator.clipboard.writeText(text);
    if (type === "awb") {
      setCopiedAWB(true);
      setTimeout(() => setCopiedAWB(false), 2000);
    } else {
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
    }
  };

  // Helper to get product photo
  const getItemImage = (itemId: string) => {
    const prod = getProductById(itemId);
    return prod ? prod.image : "/products/hero-collection.jpg";
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 mb-6">
          <Link
            href="/"
            className="hover:text-amber-800 transition-colors inline-flex items-center gap-1.5 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Shop</span>
          </Link>
          <span>/</span>
          <span className="text-stone-800 font-semibold">Online Order Tracking</span>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200 mb-3">
            <Truck className="w-3.5 h-3.5 text-amber-800" />
            Live Shipment & Studio Updates
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Track Your Handcrafted Order
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            Check the real-time stitching, quality inspection, and courier dispatch progress of your handmade bags.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="max-w-2xl mx-auto bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-sm mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. SCN-782190) or Mobile Number"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700/40 focus:border-amber-700 text-sm bg-stone-50/50"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm px-6 py-2.5 sm:py-3 rounded-xl shadow-xs transition-all disabled:opacity-60 cursor-pointer flex-shrink-0"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Order</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pill Links */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-stone-100 text-xs text-stone-500">
            <span className="font-medium text-stone-600">Quick Test:</span>
            <button
              type="button"
              onClick={() => {
                setQuery("SCN-782190");
                handleSearch("SCN-782190");
              }}
              className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 transition-colors font-mono cursor-pointer"
            >
              Order #SCN-782190
            </button>
            <button
              type="button"
              onClick={() => {
                setQuery("9876543210");
                handleSearch("9876543210");
              }}
              className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 transition-colors font-mono cursor-pointer"
            >
              Phone: 9876543210
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{errorMsg}</p>
              <p className="text-red-600 mt-1">
                Tip: Order IDs look like <span className="font-mono font-bold">SCN-XXXXXX</span>. You can also search using the 10-digit mobile number provided during checkout.
              </p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {trackData && (
          <div className="space-y-8 animate-fadeIn">
            {/* Order Header Summary Card */}
            <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-serif text-2xl font-bold text-stone-900">
                      Order #{trackData.order.orderId}
                    </h2>
                    <button
                      onClick={() => copyToClipboard(trackData.order.orderId, "orderId")}
                      className="text-stone-400 hover:text-stone-700 p-1 rounded transition-colors"
                      title="Copy Order ID"
                      aria-label="Copy Order ID"
                    >
                      {copiedOrderId ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Placed on{" "}
                    {new Date(trackData.order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      trackData.order.status === "DELIVERED"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : trackData.order.status === "DISPATCHED"
                        ? "bg-blue-100 text-blue-800 border border-blue-300"
                        : "bg-amber-100 text-amber-900 border border-amber-300"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                    {trackData.order.status === "DISPATCHED"
                      ? "In Transit / Dispatched"
                      : trackData.order.status === "IN_STITCHING"
                      ? "In Quality Stitching"
                      : trackData.order.status === "PACKED"
                      ? "Packed for Courier"
                      : trackData.order.status === "DELIVERED"
                      ? "Delivered"
                      : "Order Confirmed"}
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full bg-stone-100 text-stone-700">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    <span>Est: {trackData.order.estimatedDelivery || "2-4 Business Days"}</span>
                  </span>
                </div>
              </div>

              {/* Express Courier Banner if Dispatched */}
              {trackData.order.trackingNumber && (
                <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 flex-shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-800">
                        {trackData.order.courierName || "Delhivery Surface Express"}
                      </p>
                      <p className="text-stone-500 font-mono text-xs">
                        AWB: {trackData.order.trackingNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        copyToClipboard(trackData.order.trackingNumber || "", "awb")
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
                    >
                      {copiedAWB ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy AWB</span>
                        </>
                      )}
                    </button>
                    <a
                      href={`https://www.delhivery.com/tracking?awb=${trackData.order.trackingNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-800 text-white rounded-lg text-xs font-medium hover:bg-amber-900 transition-colors"
                    >
                      <span>Carrier Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* 5-Stage Visual Progress Timeline */}
              <div className="mt-8 pt-6 border-t border-stone-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-6">
                  Artisan Journey & Delivery Timeline
                </h3>

                <div className="relative">
                  <div className="space-y-6 sm:space-y-8">
                    {trackData.timeline.map((stepItem, index) => {
                      const isLast = index === trackData.timeline.length - 1;

                      return (
                        <div key={stepItem.step} className="relative flex items-start gap-4">
                          {/* Vertical Connector Line */}
                          {!isLast && (
                            <div
                              className={`absolute left-4 top-8 -bottom-6 w-0.5 ${
                                stepItem.isCompleted
                                  ? "bg-emerald-600"
                                  : "bg-stone-200"
                              }`}
                            />
                          )}

                          {/* Node icon */}
                          <div
                            className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                              stepItem.isCompleted
                                ? "bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-50"
                                : stepItem.isCurrent
                                ? "bg-amber-600 text-white ring-4 ring-amber-100 animate-pulse"
                                : "bg-stone-200 text-stone-400"
                            }`}
                          >
                            {stepItem.isCompleted ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : stepItem.step === 2 ? (
                              <Scissors className="w-4 h-4" />
                            ) : stepItem.step === 3 ? (
                              <Package className="w-4 h-4" />
                            ) : stepItem.step === 4 ? (
                              <Truck className="w-4 h-4" />
                            ) : (
                              <MapPin className="w-4 h-4" />
                            )}
                          </div>

                          {/* Text info */}
                          <div className="flex-1 pt-0.5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <h4
                                className={`text-sm sm:text-base font-bold ${
                                  stepItem.isCompleted || stepItem.isCurrent
                                    ? "text-stone-900"
                                    : "text-stone-400"
                                }`}
                              >
                                {stepItem.title}
                              </h4>
                              <span
                                className={`text-xs font-semibold ${
                                  stepItem.isCompleted
                                    ? "text-emerald-700"
                                    : stepItem.isCurrent
                                    ? "text-amber-700 font-bold"
                                    : "text-stone-400"
                                }`}
                              >
                                {stepItem.timestamp}
                              </span>
                            </div>
                            <p
                              className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                                stepItem.isCompleted || stepItem.isCurrent
                                  ? "text-stone-600"
                                  : "text-stone-400"
                              }`}
                            >
                              {stepItem.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Two-Column Details: Items and Shipping Info */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Items Card */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-7 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
                  <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-amber-800" />
                    <span>Items in this Package</span>
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-600">
                    {trackData.order.items.reduce((s, it) => s + it.quantity, 0)} {trackData.order.items.length === 1 ? "Bag" : "Bags"}
                  </span>
                </div>

                <div className="space-y-4">
                  {trackData.order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3.5 p-3 rounded-2xl bg-stone-50/60 border border-stone-100"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                        <Image
                          src={getItemImage(item.id)}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-stone-900 text-xs sm:text-sm truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Category: {item.category} • Qty: {item.quantity}
                        </p>
                        <p className="text-xs font-bold text-emerald-800 mt-1">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div className="mt-6 pt-4 border-t border-stone-100 space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>Payment Mode:</span>
                    <span className="font-semibold text-stone-800">
                      {trackData.order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Delivery Charge:</span>
                    <span className="font-semibold text-stone-800">₹40 (Standard Express)</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base font-bold text-stone-900 pt-2 border-t border-stone-100">
                    <span>Total Amount:</span>
                    <span className="text-emerald-800">₹{trackData.order.totalAmountPaid}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address & Customer Care Card */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-7 shadow-sm">
                  <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 pb-4 border-b border-stone-100 mb-4">
                    <MapPin className="w-4 h-4 text-amber-800" />
                    <span>Delivery Destination</span>
                  </h3>

                  <div className="space-y-2 text-xs sm:text-sm">
                    <p className="font-bold text-stone-900">
                      {trackData.order.customer.fullName}
                    </p>
                    <p className="text-stone-600 flex items-center gap-1.5 font-mono text-xs">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      +91 {trackData.order.customer.phone}
                    </p>
                    <p className="text-stone-600 leading-relaxed pt-1">
                      {trackData.order.customer.address}, {trackData.order.customer.city} -{" "}
                      <span className="font-semibold text-stone-800">
                        {trackData.order.customer.pincode}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Studio Help / WhatsApp CTA */}
                <div className="bg-emerald-900 text-emerald-50 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <h4 className="font-serif font-bold text-white text-base">
                      Need Help with your Order?
                    </h4>
                  </div>
                  <p className="text-xs text-emerald-200/90 leading-relaxed mb-4">
                    Have questions about address modification or urgent dispatch? You can directly contact Mom's studio.
                  </p>
                  <a
                    href={`https://wa.me/919876543210?text=Hi%20Shreya%2C%20I%20am%20inquiring%20about%20my%20Order%20%23${trackData.order.orderId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-all w-full"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Direct WhatsApp Inquiry</span>
                  </a>
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

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-amber-800 animate-spin mx-auto mb-3" />
            <p className="text-stone-600 font-medium text-sm">Loading Order Tracker...</p>
          </div>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
