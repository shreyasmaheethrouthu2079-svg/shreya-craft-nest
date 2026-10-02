"use client";

import { useState, useMemo } from "react";
import { PRODUCTS, CATEGORIES, CategoryType, Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Product3DModal } from "@/components/Product3DModal";
import { Filter, ShoppingBag, Sparkles, Rotate3d } from "lucide-react";

export function ProductCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("All");
  const [active3DProduct, setActive3DProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <section id="catalog" className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300/60 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Curated Artisan Collection</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Handcrafted Goods
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-xl">
            Each bag and pouch is individually cut and stitched by mom with fine French seams and reinforced stress points.
          </p>
        </div>

        {/* 3D Studio Launcher Button & Count */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActive3DProduct(filteredProducts[0] || PRODUCTS[0])}
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-amber-300 hover:text-amber-200 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full border border-amber-500/40 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Rotate3d className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>Open 3D Studio</span>
          </button>

          <div className="text-xs text-stone-500 font-medium hidden sm:block">
            Showing <span className="font-bold text-stone-800">{filteredProducts.length}</span> pieces
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
        <div className="flex items-center gap-1.5 text-xs text-stone-500 mr-2 font-medium">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <span>Filter:</span>
        </div>
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
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
              {category}
            </button>
          );
        })}
      </div>

      {/* Product Grid with 3D Inspection */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen3D={(p) => setActive3DProduct(p)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300 p-8">
          <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <p className="text-base font-medium text-stone-700">
            No products found in this category right now.
          </p>
          <button
            onClick={() => setSelectedCategory("All")}
            className="mt-4 text-xs font-semibold text-amber-700 underline underline-offset-4"
          >
            Reset filter to All
          </button>
        </div>
      )}

      {/* Interactive 3D Inspection Studio Modal */}
      {active3DProduct && (
        <Product3DModal
          isOpen={!!active3DProduct}
          onClose={() => setActive3DProduct(null)}
          product={active3DProduct}
          onSelectProduct={(p) => setActive3DProduct(p)}
        />
      )}
    </section>
  );
}
