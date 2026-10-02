import { Scissors, QrCode, Truck, ShieldCheck, HeartHandshake, Sparkles } from "lucide-react";

export function TrustBanner() {
  const steps = [
    {
      number: "01",
      icon: Scissors,
      title: "Handmade in Small Batches",
      badge: "Slow & Sustainable",
      description:
        "Every single tote, pouch, and scrunchie is precision-cut and stitched by hand with reinforced French seams. No anonymous factories or mass production.",
    },
    {
      number: "02",
      icon: QrCode,
      title: "Direct UPI & Card Payment",
      badge: "Instant & Secure",
      description:
        "Pay seamlessly via your favorite UPI app (Google Pay, PhonePe, Paytm, BHIM) or credit/debit card powered by Razorpay's trusted encryption.",
    },
    {
      number: "03",
      icon: Truck,
      title: "Pan-India Safe Shipping",
      badge: "Delivered to Your Door",
      description:
        "Carefully wrapped in eco-friendly butter paper with a handwritten thank-you note and dispatched reliably across 28,000+ Indian postal pincodes.",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-[#FAF8F5] via-[#F4EFE8]/70 to-[#FAF8F5] border-y border-[#EDE6DD]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100/90 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-amber-300/60">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-700" />
            <span>The Artisan Promise</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Crafted with Care, Delivered with Pride
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Experience the warmth and lasting durability of authentic Indian textile craftsmanship in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-white/80 backdrop-blur-sm p-6 sm:p-7 rounded-2xl border border-[#EDE6DD] shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex flex-col group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-800 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                  </div>
                  <span className="font-serif text-3xl font-bold text-amber-900/15 group-hover:text-amber-900/30 transition-colors">
                    {step.number}
                  </span>
                </div>

                <div className="inline-block self-start text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70 mb-2">
                  {step.badge}
                </div>

                <h3 className="font-serif text-lg font-bold text-stone-900 mb-2 group-hover:text-amber-900 transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed flex-grow">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Small Mom's pledge callout */}
        <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/70 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100/90 text-emerald-800 flex-shrink-0 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-stone-900">
                100% Quality & Stitch Guarantee
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                If you ever find a loose thread or seam defect, we will repair or exchange your item without fuss.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Hand-Sewn in India
            </span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
        </div>
      </div>
    </section>
  );
}
