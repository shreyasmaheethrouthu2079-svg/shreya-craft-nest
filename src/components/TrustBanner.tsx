"use client";

import { Scissors, QrCode, Truck, HeartHandshake } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function TrustBanner() {
  const { t } = useLanguage();

  const steps = [
    {
      number: "01",
      icon: Scissors,
      title: t("trust.step1Title"),
      badge: t("trust.step1Badge"),
      description: t("trust.step1Desc"),
    },
    {
      number: "02",
      icon: QrCode,
      title: t("trust.step2Title"),
      badge: t("trust.step2Badge"),
      description: t("trust.step2Desc"),
    },
    {
      number: "03",
      icon: Truck,
      title: t("trust.step3Title"),
      badge: t("trust.step3Badge"),
      description: t("trust.step3Desc"),
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-[#FAF8F5] via-[#F4EFE8]/70 to-[#FAF8F5] border-y border-[#EDE6DD]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100/90 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-amber-300/60">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-700" />
            <span>{t("trust.promise")}</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {t("trust.title")}
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            {t("trust.subtitle")}
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

                <div className="inline-block self-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60">
                    {step.badge}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
                  {step.title}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
