import { PRODUCTS } from "@/data/products";

export function JsonLd() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://shreya-craft-nest.vercel.app");

  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${baseUrl}/#store`,
    name: "Shreya Craft Nest",
    alternateName: [
      "Shreya Crafts Nest",
      "Shreya Craft Nest Store",
      "Shreya's Craft Nest",
    ],
    url: baseUrl,
    logo: `${baseUrl}/logo-emblem.png`,
    image: `${baseUrl}/products/botanical-stripe-bag.jpg`,
    description:
      "Handcrafted cotton bags, pouches & accessories stitched with love by mom Sudha Rani. Small-batch artisan goods, premium cotton, direct UPI payment, and Pan-India delivery.",
    telephone: "+91-9491710704",
    priceRange: "₹100 - ₹400",
    currenciesAccepted: "INR",
    paymentAccepted:
      "Cash on Delivery, UPI, Google Pay, PhonePe, Paytm, Credit Card, Net Banking",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    founder: {
      "@type": "Person",
      name: "Sudha Rani",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "22:00",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Handcrafted Bags and Pouches Catalog",
      itemListElement: PRODUCTS.map((product, idx) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: `${baseUrl}${product.image}`,
          category: product.category,
          material: product.material,
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "INR",
            availability: product.inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            seller: {
              "@type": "Organization",
              name: "Shreya Craft Nest",
            },
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewsCount,
            bestRating: 5,
            worstRating: 1,
          },
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
    />
  );
}
