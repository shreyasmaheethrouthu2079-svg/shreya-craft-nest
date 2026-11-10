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
  Clock,
  HeartHandshake,
  AlertCircle,
  ShoppingBag,
  MessageCircle,
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
  paymentMethod: string;
  items: CartItem[];
  customer: CustomerForm;
  amount: number;
  whatsappUrl: string;
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

  // Pre-fill previously entered address for faster 1-tap checkout
  useEffect(() => {
    try {
      const saved = localStorage.getItem("scn_customer_address");
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm((prev) => ({
          fullName: parsed.fullName || prev.fullName,
          phone: parsed.phone || prev.phone,
          address: parsed.address || prev.address,
          city: parsed.city || prev.city,
          pincode: parsed.pincode || prev.pincode,
        }));
      }
    } catch (e) {
      // ignore
    }
  }, []);

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

  const itemsSubtotal = checkoutItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const deliveryCharge = itemsSubtotal > 0 ? 40 : 0;
  const totalAmount = itemsSubtotal + deliveryCharge;

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

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate phone number (10 digits)
    const phoneClean = form.phone.replace(/\D/g, "");
    if (phoneClean.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    // Validate pincode (6 digits)
    const pinClean = form.pincode.replace(/\D/g, "");
    if (pinClean.length !== 6) {
      setErrorMsg("Please enter a valid 6-digit Indian delivery PIN code.");
      return;
    }

    if (checkoutItems.length === 0) {
      setErrorMsg("Your cart is empty. Please select an item to buy.");
      return;
    }

    setIsProcessing(true);

    try {
      const itemsPayload = checkoutItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      // Record order in studio database so tracking and admin works
      let generatedOrderId = `SCN-${Date.now().toString().slice(-6)}`;
      try {
        const recordRes = await fetch("/api/record-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentMethod: "WhatsApp UPI QR",
            items: itemsPayload,
            customer: form,
          }),
        });
        const recordData = await recordRes.json();
        if (recordData?.order?.orderId) {
          generatedOrderId = recordData.order.orderId;
        }
      } catch (err) {
        console.warn("Could not save to local store, fallback ID used:", err);
      }

      // Build WhatsApp order message for maker Sudha Rani
      const whatsappNumber =
        process.env.NEXT_PUBLIC_STORE_WHATSAPP_NUMBER || "919491710704";

      const itemsSummary = checkoutItems
        .map(
          (item) =>
            `• ${item.product.name} × ${item.quantity} (₹${item.product.price * item.quantity})`
        )
        .join("\n");

      const message =
        `🌸 *New Order from Shreya Craft Nest!* 🌸\n\n` +
        `🆔 *Order ID:* #${generatedOrderId}\n\n` +
        `🛍️ *Items Ordered:*\n${itemsSummary}\n\n` +
        `📦 *Delivery Fee:* ₹40 (Pan-India Express)\n` +
        `💰 *Total Amount:* ₹${totalAmount}\n\n` +
        `📍 *Delivery Address:*\n` +
        `• *Name:* ${form.fullName}\n` +
        `• *Mobile:* +91 ${form.phone}\n` +
        `• *Address:* ${form.address}\n` +
        `• *City:* ${form.city} - ${form.pincode}\n\n` +
        `🙏 *Hello Sudha Rani ji,* please send your UPI QR code (Google Pay / PhonePe / Paytm) so I can make the payment and confirm my order!`;

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        message
      )}`;

      // Open WhatsApp automatically
      if (typeof window !== "undefined") {
        window.open(whatsappUrl, "_blank");
      }

      setConfirmedOrder({
        orderId: generatedOrderId,
        paymentId: `WA-QR-${generatedOrderId}`,
        paymentMethod: "WhatsApp UPI QR",
        items: checkoutItems,
        customer: form,
        amount: totalAmount,
        whatsappUrl: whatsappUrl,
      });

      // Save address locally so subsequent orders are prefilled
      try {
        localStorage.setItem("scn_customer_address", JSON.stringify(form));
      } catch (e) {
        // ignore
      }

      // Clear the cart upon successful order
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setErrorMsg(
        err.message || "Failed to start WhatsApp order. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // ========================================================
  // ORDER CONFIRMED SCREEN (DIRECT WHATSAPP & UPI QR)
  // ========================================================
  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-20">
        <div className="bg-white rounded-3xl border border-emerald-200 shadow-xl overflow-hidden p-6 sm:p-10 text-center">
          {/* Confirmed checkmark */}
          <div className="w-20 h-20 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-emerald-700" />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-900 text-xs font-semibold px-3.5 py-1 rounded-full border border-emerald-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Order Sent to Maker Sudha Rani on WhatsApp!</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Thank You, {confirmedOrder.customer.fullName}!
          </h1>

          <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-lg mx-auto">
            Your order details have been forwarded to maker <strong>Sudha Rani (+91 9491710704)</strong> on WhatsApp. She will share her UPI QR code so you can make the payment and get your tracking number!
          </p>

          {/* Prominent WhatsApp action button */}
          <div className="my-6">
            <a
              href={confirmedOrder.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm sm:text-base px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Open WhatsApp Chat with Sudha Rani</span>
            </a>
            <p className="text-xs text-stone-500 mt-2">
              If WhatsApp didn't open automatically, click the green button above.
            </p>
          </div>

          {/* Dispatch Notice Card */}
          <div className="my-6 bg-[#FAF8F5] border border-amber-200/80 rounded-2xl p-5 sm:p-6 text-left space-y-4">
            <div className="flex items-center gap-3 text-amber-900 font-semibold text-sm border-b border-amber-200/60 pb-3">
              <Clock className="w-5 h-5 text-amber-700" />
              <span>Estimated Dispatch: Within 24-48 Hours</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <p className="text-stone-500 font-medium">Order Number:</p>
                <p className="font-mono font-bold text-stone-900 text-base">
                  #{confirmedOrder.orderId}
                </p>
              </div>
              <div>
                <p className="text-stone-500 font-medium">Payment Mode:</p>
                <p className="font-semibold text-emerald-800">
                  {confirmedOrder.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-stone-500 font-medium">Delivery Address:</p>
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
                <p className="text-stone-800 font-bold mt-2 pt-1 border-t border-amber-200/60">
                  Total: <span className="text-emerald-800 text-base">₹{confirmedOrder.amount}</span> (Includes ₹40 Delivery)
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs: Track Order, Continue Shopping, Print Receipt */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={`/track-order?orderId=${confirmedOrder.orderId}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm px-7 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Truck className="w-4 h-4 text-emerald-100" />
              <span>Track Your Order Live</span>
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>Continue Shopping</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>

            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-700 font-semibold text-sm px-5 py-3.5 rounded-xl border border-stone-300 shadow-xs transition-all cursor-pointer"
            >
              <span>Print Receipt</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // CHECKOUT FORM WITH DIRECT WHATSAPP & UPI QR PAYMENT
  // ========================================================
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
                  Shipping & WhatsApp Order
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Enter delivery address & connect directly with maker Sudha Rani on WhatsApp.
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCheckoutSubmit} className="space-y-6">
              {/* SECTION 1: SHIPPING ADDRESS */}
              <div className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-3 py-1.5 rounded-lg inline-block">
                  Step 1: Delivery Address
                </h2>

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
                    Mobile Phone Number (WhatsApp) <span className="text-red-500">*</span>
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
                  <p className="text-[11px] text-stone-500 mt-1">
                    Maker Sudha Rani will send tracking details and UPI QR code to this number.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor={addressId}
                    className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5"
                  >
                    Complete Street Address (House No, Building, Area) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id={addressId}
                    name="address"
                    autoComplete="street-address"
                    required
                    rows={2}
                    placeholder="e.g. Flat 301, Rosewood Heights, 2nd Cross Road"
                    value={form.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700/50 focus:border-amber-700 text-sm bg-stone-50/40"
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
                      placeholder="e.g. Visakhapatnam"
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
                      6-Digit Delivery PIN Code <span className="text-red-500">*</span>
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
              </div>

              {/* SECTION 2: PAYMENT METHOD (DIRECT WHATSAPP & UPI QR) */}
              <div className="space-y-4 pt-4 border-t border-stone-100">
                <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg inline-block">
                  Step 2: Payment Method (Direct WhatsApp & UPI QR)
                </h2>

                <div className="p-5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/30 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-xs flex-shrink-0">
                      <MessageCircle className="w-5 h-5 fill-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                        Direct Order with Maker Sudha Rani
                      </h3>
                      <p className="text-xs text-emerald-800 font-semibold">
                        WhatsApp: +91 9491710704 • Zero Payment Gateway Surcharge
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-emerald-200/80 text-xs text-stone-700 space-y-2 leading-relaxed">
                    <p className="font-semibold text-stone-900">
                      How your payment works in 3 easy steps:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-stone-600">
                      <li>Enter your delivery address above and click the green button below.</li>
                      <li>Your order & address details will open directly in WhatsApp with maker <strong>Sudha Rani</strong>.</li>
                      <li>Sudha Rani will reply with her <strong>Google Pay / PhonePe / Paytm UPI QR code</strong> for instant payment!</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* DIRECT ORDER SUBMIT BUTTON */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.99] text-white font-bold text-base shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  {isProcessing ? (
                    <span>Opening WhatsApp...</span>
                  ) : (
                    <span>Order via WhatsApp & Pay ₹{totalAmount} with QR</span>
                  )}
                </button>

                <p className="text-center text-[11px] text-stone-500 mt-2 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Order is directly confirmed with maker Sudha Rani on WhatsApp. 100% genuine cotton.</span>
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
                <span>₹{itemsSubtotal}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Pan-India Courier Shipping</span>
                <span className="font-semibold text-stone-800">₹{deliveryCharge}</span>
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
                <span>Pan-India Courier tracking shared upon dispatch</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-600">
                <HeartHandshake className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span>Individually stitched by mom with love & care</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-600">
                <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>Zero gateway fee: Pay directly to mom via UPI QR</span>
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
