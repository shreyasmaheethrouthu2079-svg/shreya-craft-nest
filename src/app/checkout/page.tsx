"use client";

import { Suspense, useState, useEffect, useId } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductById, PRODUCTS, Product } from "@/data/products";
import { useCart, CartItem } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Sparkles,
  MessageCircle,
  Clock,
  HeartHandshake,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";

interface CustomerForm {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

interface ConfirmedOrder {
  orderId: string;
  paymentId: string;
  items: CartItem[];
  customer: CustomerForm;
  amount: number;
  whatsappConfirmationUrl?: string;
  isDemo?: boolean;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawProductId = searchParams.get("productId");
  const { cart, clearCart } = useCart();

  const [singleProduct, setSingleProduct] = useState<Product | undefined>(() => {
    if (rawProductId) {
      return getProductById(rawProductId);
    }
    return undefined;
  });

  useEffect(() => {
    if (rawProductId) {
      const found = getProductById(rawProductId);
      if (found) {
        setSingleProduct(found);
      }
    }
  }, [rawProductId]);

  const [form, setForm] = useState<CustomerForm>({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(
    null
  );

  const fullNameId = useId();
  const phoneId = useId();
  const addressId = useId();
  const cityId = useId();
  const pincodeId = useId();

  // Determine active checkout items (single direct buy vs full cart)
  const checkoutItems: CartItem[] = singleProduct
    ? [{ product: singleProduct, quantity: 1 }]
    : cart;

  const totalAmount = checkoutItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // If no single product and cart is empty
  if (checkoutItems.length === 0 && !confirmedOrder) {
    return (
      <div className="text-center py-24 max-w-md mx-auto px-4 space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center mx-auto text-amber-800">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-900">
          Your Cart is Empty
        </h2>
        <p className="text-sm text-stone-600">
          You don't have any handcrafted items queued for checkout yet. Browse our collection to add something special.
        </p>
        <div className="pt-2">
          <Link
            href="/#catalog"
            className="inline-flex items-center gap-2 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-md transition-all"
          >
            <span>Browse Handcrafted Collection</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductSwitch = (newProductId: string) => {
    const newProduct = getProductById(newProductId);
    if (newProduct) {
      setSingleProduct(newProduct);
      router.replace(`/checkout?productId=${newProductId}`, { scroll: false });
    }
  };

  const executeOrderRecording = async (paymentPayload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    isDemo?: boolean;
  }) => {
    try {
      const itemsPayload = checkoutItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      const recordRes = await fetch("/api/record-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...paymentPayload,
          items: itemsPayload,
          customer: form,
        }),
      });

      const recordData = await recordRes.json();

      if (!recordRes.ok) {
        throw new Error(recordData.error || "Failed to finalize order record");
      }

      setConfirmedOrder({
        orderId: paymentPayload.razorpay_order_id,
        paymentId: paymentPayload.razorpay_payment_id,
        items: checkoutItems,
        customer: form,
        amount: totalAmount,
        whatsappConfirmationUrl: recordData.whatsappConfirmationUrl,
        isDemo: paymentPayload.isDemo,
      });

      // Clear the cart upon successful order
      clearCart();

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setErrorMsg(err.message || "Order recording failed. Please contact us.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate phone number (10 digits)
    const phoneClean = form.phone.replace(/\D/g, "");
    if (phoneClean.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit Indian WhatsApp mobile number.");
      return;
    }

    // Validate pincode (6 digits)
    const pinClean = form.pincode.replace(/\D/g, "");
    if (pinClean.length !== 6) {
      setErrorMsg("Please enter a valid 6-digit Indian delivery PIN code.");
      return;
    }

    setIsProcessing(true);

    try {
      const itemsPayload = checkoutItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: itemsPayload }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to create payment order");
      }

      const isRazorpayLoaded = typeof window !== "undefined" && "Razorpay" in window;

      // Real Razorpay popup flow
      if (isRazorpayLoaded && !orderData.isDemo) {
        const orderSummaryText = checkoutItems
          .map((i) => `${i.product.name} (x${i.quantity})`)
          .join(", ");

        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: "INR",
          name: "Shreya Craft Nest",
          description: `Order: ${orderSummaryText.slice(0, 80)}`,
          image: checkoutItems[0]?.product.image,
          order_id: orderData.orderId,
          handler: function (response: any) {
            executeOrderRecording({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              isDemo: false,
            });
          },
          prefill: {
            name: form.fullName,
            contact: form.phone,
          },
          notes: {
            orderSummary: orderSummaryText,
            address: `${form.address}, ${form.city} - ${form.pincode}`,
          },
          theme: {
            color: "#92400e",
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      } else {
        // Simulated fallback for immediate testing without Razorpay live keys
        await executeOrderRecording({
          razorpay_order_id: orderData.orderId || `ord_demo_${Date.now()}`,
          razorpay_payment_id: `pay_simulated_${Date.now()}`,
          razorpay_signature: "simulated_valid_demo_sig",
          isDemo: true,
        });
      }
    } catch (err: any) {
      console.error("Checkout submission failed:", err);
      setErrorMsg(err.message || "Payment initialization failed. Please try again.");
      setIsProcessing(false);
    }
  };

  // ORDER CONFIRMED SCREEN
  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-20">
        <div className="bg-white rounded-3xl border border-emerald-200/90 shadow-xl overflow-hidden p-6 sm:p-10 text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-emerald-700" />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-900 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Order Placed & Payment Verified</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Thank You, {confirmedOrder.customer.fullName}!
          </h1>

          <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-lg mx-auto">
            Mom has received your order and is preparing to carefully inspect, wrap, and pack your handmade treasures.
          </p>

          {confirmedOrder.isDemo && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 max-w-md mx-auto">
              <strong>Demo Mode:</strong> Simulated checkout completed. Connect your real Razorpay keys in <code>.env.local</code> to accept live UPI payments.
            </div>
          )}

          <div className="my-8 bg-[#FAF8F5] border border-amber-200/80 rounded-2xl p-5 sm:p-6 text-left space-y-4">
            <div className="flex items-center gap-3 text-amber-900 font-semibold text-sm border-b border-amber-200/60 pb-3">
              <Clock className="w-5 h-5 text-amber-700" />
              <span>Estimated Dispatch: Within 24-48 Hours</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <p className="text-stone-500 font-medium">Order Reference:</p>
                <p className="font-mono font-bold text-stone-800 break-all">
                  {confirmedOrder.orderId}
                </p>
              </div>
              <div>
                <p className="text-stone-500 font-medium">Payment ID:</p>
                <p className="font-mono font-bold text-stone-800 break-all">
                  {confirmedOrder.paymentId}
                </p>
              </div>
              <div>
                <p className="text-stone-500 font-medium">Delivering To:</p>
                <p className="font-semibold text-stone-800">
                  {confirmedOrder.customer.fullName} (+91 {confirmedOrder.customer.phone})
                </p>
                <p className="text-stone-600">
                  {confirmedOrder.customer.address}, {confirmedOrder.customer.city} - {confirmedOrder.customer.pincode}
                </p>
              </div>
              <div>
                <p className="text-stone-500 font-medium">Items Ordered ({confirmedOrder.items.length}):</p>
                <ul className="space-y-1 mt-1">
                  {confirmedOrder.items.map((item, idx) => (
                    <li key={idx} className="font-medium text-stone-800">
                      • {item.product.name} × {item.quantity} (₹{item.product.price * item.quantity})
                    </li>
                  ))}
                </ul>
                <p className="text-stone-700 font-semibold mt-2 pt-1 border-t border-amber-200/60">
                  Total Paid: <span className="font-bold text-emerald-800">₹{confirmedOrder.amount}</span> (Free Shipping)
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {confirmedOrder.whatsappConfirmationUrl && (
              <a
                href={confirmedOrder.whatsappConfirmationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Confirm Order on WhatsApp</span>
              </a>
            )}

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Crafts Nest</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // CHECKOUT INPUT FORM
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <Link
        href="/#catalog"
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-amber-800 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Return to Handcrafted Collection</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-[#EDE6DD] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
              <div>
                <h1 className="font-serif text-2xl font-bold text-stone-900">
                  Shipping & Delivery
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Enter your address for Pan-India doorstep delivery.
                </p>
              </div>
              <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">
                1
              </span>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor={fullNameId}
                  className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id={fullNameId}
                  name="fullName"
                  autoComplete="name"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={form.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700/50 focus:border-amber-700 text-sm bg-stone-50/40"
                />
              </div>

              <div>
                <label
                  htmlFor={phoneId}
                  className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5"
                >
                  WhatsApp Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-stone-500 text-sm font-semibold select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    id={phoneId}
                    name="phone"
                    autoComplete="tel"
                    inputMode="tel"
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                    placeholder="98765 43210 (10 digits)"
                    value={form.phone}
                    onChange={handleInputChange}
                    className="w-full pl-14 pr-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700/50 focus:border-amber-700 text-sm bg-stone-50/40 font-medium"
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 text-[#25D366]" />
                  <span>We send dispatch updates and courier tracking over WhatsApp.</span>
                </p>
              </div>

              <div>
                <label
                  htmlFor={addressId}
                  className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5"
                >
                  Detailed Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id={addressId}
                  name="address"
                  autoComplete="street-address"
                  required
                  rows={3}
                  placeholder="Flat/House No., Apartment name, Landmark, Colony, Street"
                  value={form.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700/50 focus:border-amber-700 text-sm bg-stone-50/40 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor={cityId}
                    className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5"
                  >
                    City / Town <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id={cityId}
                    name="city"
                    autoComplete="address-level2"
                    required
                    placeholder="e.g. Pune, Bangalore"
                    value={form.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700/50 focus:border-amber-700 text-sm bg-stone-50/40"
                  />
                </div>

                <div>
                  <label
                    htmlFor={pincodeId}
                    className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5"
                  >
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id={pincodeId}
                    name="pincode"
                    autoComplete="postal-code"
                    inputMode="numeric"
                    required
                    pattern="[0-9]{6}"
                    maxLength={6}
                    placeholder="6 digits PIN"
                    value={form.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700/50 focus:border-amber-700 text-sm bg-stone-50/40 font-mono"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 px-6 rounded-2xl bg-amber-800 hover:bg-amber-900 active:scale-[0.99] text-white font-bold text-base shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-amber-200" />
                  {isProcessing ? (
                    <span>Opening Razorpay UPI Gateway...</span>
                  ) : (
                    <span>Pay ₹{totalAmount} with UPI / Cards</span>
                  )}
                </button>

                <p className="text-center text-[11px] text-stone-500 mt-2 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>256-Bit SSL Encrypted Razorpay Checkout (GPay, PhonePe, Paytm, Cards)</span>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#EDE6DD] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Order Summary
              </h2>
              <span className="text-xs text-stone-500 font-medium">
                {checkoutItems.length} {checkoutItems.length === 1 ? "item" : "items"}
              </span>
            </div>

            {/* List of items in the order */}
            <div className="space-y-4 pb-6 border-b border-stone-100 max-h-80 overflow-y-auto pr-1">
              {checkoutItems.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-4 items-center">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-serif text-sm font-bold text-stone-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-stone-500 truncate">
                      {product.material}
                    </p>
                    <div className="flex items-center justify-between mt-1 text-xs">
                      <span className="text-stone-500 font-medium">
                        Qty: <strong className="text-stone-800">{quantity}</strong> × ₹{product.price}
                      </span>
                      <span className="font-serif font-bold text-stone-900">
                        ₹{product.price * quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick switcher if customer is buying single item and wants to switch */}
            {singleProduct && (
              <div className="py-4 border-b border-stone-100">
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  Switch or choose another handcrafted item:
                </label>
                <select
                  value={singleProduct.id}
                  onChange={(e) => handleProductSwitch(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-stone-300 bg-[#FAF8F5] text-stone-800 focus:outline-none focus:border-amber-700"
                >
                  {PRODUCTS.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.name} (₹{prod.price})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Price breakdown */}
            <div className="space-y-2 py-4 border-b border-stone-100 text-xs sm:text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Pan-India Courier Shipping</span>
                <span className="text-emerald-700 font-semibold">FREE (Special Offer)</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Taxes & Artisan Packaging</span>
                <span className="text-stone-500">Included</span>
              </div>
              <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-100">
                <span>Total Amount Due</span>
                <span className="text-amber-900 font-serif text-xl">
                  ₹{totalAmount}
                </span>
              </div>
            </div>

            {/* Trust highlights */}
            <div className="pt-4 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-stone-600">
                <Truck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>Pan-India Courier tracking shared on dispatch</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-600">
                <HeartHandshake className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span>Individually stitched by mom with love & care</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-600">
                <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>100% Cotton & biodegradable packaging</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />
      <main className="flex-grow">
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-semibold text-stone-600">
                  Loading Shreya Craft Nest Checkout...
                </p>
              </div>
            </div>
          }
        >
          <CheckoutContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
