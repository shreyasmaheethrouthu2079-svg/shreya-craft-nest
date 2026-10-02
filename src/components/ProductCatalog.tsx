"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PRODUCTS, CATEGORIES, CategoryType } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import { Filter, ShoppingBag, Sparkles, X, Search } from "lucide-react";

export function ProductCatalog() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const querySearch = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("All");

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat =
        selectedCategory === "All" || p.category === selectedCategory;
      const q = querySearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      return matchCat && matchSearch;
    });
  }, [selectedCategory, querySearch]);

  const clearSearch = () => {
    router.push("/#catalog");
  };

  const { t } = useLanguage();

  return (
    <section id="catalog" className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300/60 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Curated Artisan Collection</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            {t("catalog.title")}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-xl">
            {t("catalog.subtitle")}
          </p>
        </div>

        {/* Category count indicator */}
        <div className="text-xs text-stone-500 font-medium">
          {t("catalog.showing")}{" "}
          <span className="font-bold text-stone-800">
            {filteredProducts.length}
          </span>{" "}
          {t("catalog.designs")}
        </div>
      </div>

      {/* Active Search Filter Badge if search query present */}
      {querySearch && (
        <div className="mb-6 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-stone-800">
            <Search className="w-4 h-4 text-amber-800" />
            <span>
              Search results for: <strong className="font-semibold text-amber-900">"{querySearch}"</strong>
            </span>
          </div>
          <button
            onClick={clearSearch}
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 hover:text-amber-950 bg-white border border-amber-300 px-3 py-1 rounded-lg shadow-2xs hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <span>Clear Search</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
        <div className="flex items-center gap-1.5 text-xs text-stone-500 mr-2 font-medium">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <span>Filter:</span>
        </div>
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          const categoryLabel =
            category === "All"
              ? t("catalog.catAll")
              : category === "Handbags"
              ? t("catalog.catHandbags")
              : category === "Pouches"
              ? t("catalog.catPouches")
              : category === "Accessories"
              ? t("catalog.catAccessories")
              : category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-amber-800 text-white shadow-md shadow-amber-800/20"
                  : "bg-white text-stone-600 hover:text-stone-900 border border-[#EDE6DD] hover:border-amber-300"
              }`}
            >
              {categoryLabel}
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300 p-8">
          <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <p className="text-base font-medium text-stone-700">
            No products found matching "{querySearch || selectedCategory}".
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              clearSearch();
            }}
            className="mt-4 text-xs font-semibold text-amber-700 underline underline-offset-4 cursor-pointer"
          >
            Reset all filters
          </button>
        </div>
      )}
    </section>
  );
}
