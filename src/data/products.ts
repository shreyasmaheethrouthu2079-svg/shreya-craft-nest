export interface Product {
  id: string;
  name: string;
  category: "Handbags" | "Pouches" | "Hair Accessories";
  price: number;
  originalPrice: number;
  description: string;
  features: string[];
  material: string;
  dimensions: string;
  image: string;
  inStock: boolean;
  badge?: string;
  rating: number;
  reviewsCount: number;
}

export const PRODUCTS: Product[] = [
  {
    id: "cotton-canvas-daily-tote",
    name: "Cotton Canvas Daily Tote",
    category: "Handbags",
    price: 549,
    originalPrice: 799,
    description:
      "Crafted with double-layered 12oz natural cotton canvas, this spacious daily tote features reinforced cross-stitched handles and a concealed interior zipper pocket. Ideal for books, laptop, farmer's market visits, or casual days out.",
    features: [
      "Double-layered heavy-duty 12oz cotton canvas",
      "Reinforced stress points with boxed corner stitching",
      "Secure interior zipper pocket for phone and keys",
      "Washable, reusable & 100% biodegradable",
    ],
    material: "100% Natural Cotton Canvas (Unbleached)",
    dimensions: "15\" H x 14\" W x 4\" Base Gusset (11\" handle drop)",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80",
    inStock: true,
    badge: "Bestseller",
    rating: 4.9,
    reviewsCount: 64,
  },
  {
    id: "floral-embroidered-shoulder-bag",
    name: "Floral Embroidered Shoulder Bag",
    category: "Handbags",
    price: 799,
    originalPrice: 1199,
    description:
      "Each piece features intricate, hand-stitched floral branch motifs embroidered by mom using vibrant anchor cotton threads. Fastened with a handcrafted wooden loop button and lined with soft block-printed floral inner fabric.",
    features: [
      "Hand-embroidered wildflower & botanical motifs",
      "Authentic hand-carved neem wood button closure",
      "Soft block-printed cotton inner lining",
      "Comfortable wide shoulder strap prevents shoulder strain",
    ],
    material: "Raw Slub Cotton & Anchor Thread Embroidery",
    dimensions: "13\" H x 11.5\" W x 3\" Gusset",
    image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=900&q=80",
    inStock: true,
    badge: "Mom's Special",
    rating: 5.0,
    reviewsCount: 38,
  },
  {
    id: "quilted-travel-makeup-pouch",
    name: "Quilted Travel Makeup Pouch",
    category: "Pouches",
    price: 299,
    originalPrice: 449,
    description:
      "Soft, cloud-like quilted cotton pouch with diamond stitch pattern. Fitted with an anti-spill wipeable inner lining and an antique brass zipper pull. Perfect for toiletries, makeup brushes, skincare bottles, or charging cables.",
    features: [
      "Plush 3-layer quilted cotton cushioning",
      "Waterproof, easy-wipe wipe-clean inner lining",
      "Heavy-duty antique brass smooth gliding zipper",
      "Side fabric pull loop for easy wrist carrying",
    ],
    material: "Quilted Pure Cotton + Waterproof Synthetic Core",
    dimensions: "8.5\" L x 5.5\" H x 4\" Wide Bottom",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80",
    inStock: true,
    badge: "Travel Essential",
    rating: 4.8,
    reviewsCount: 42,
  },
  {
    id: "coin-and-card-pocket-pouch",
    name: "Coin & Card Pocket Pouch",
    category: "Pouches",
    price: 149,
    originalPrice: 229,
    description:
      "Compact yet roomy, this adorable pocket pouch slips effortlessly into your pocket or clutch. Holds up to 10 cards, folded currency, coins, and lip balm with an antique brass snap button closure.",
    features: [
      "Holds 8-12 credit cards + folded cash & coins",
      "Secure snap-lock button closure",
      "Reinforced edge piping to maintain structural shape",
      "Upcycled zero-waste artisanal textile cut-pieces",
    ],
    material: "Handloom Ikat & Textured Cotton Blend",
    dimensions: "4.5\" W x 3.5\" H",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80",
    inStock: true,
    badge: "Budget Pick",
    rating: 4.9,
    reviewsCount: 51,
  },
  {
    id: "pure-cotton-scrunchie-duo-pack",
    name: "Pure Cotton Scrunchie Duo Pack",
    category: "Hair Accessories",
    price: 99,
    originalPrice: 159,
    description:
      "Set of 2 breathable, gentle-on-hair scrunchies made with pure handloom cotton. Designed with high-resilience braided elastic that secures hair comfortably without headaches, tugging, or crease marks.",
    features: [
      "Twin pack in complementary earthy pastel tones",
      "Gentle snag-free elastic core rated for 1000+ stretches",
      "Zero hair breakage or stubborn ponytail creases",
      "Machine washable with cold water",
    ],
    material: "100% Breathable Organic Cotton",
    dimensions: "4.5\" outer diameter (expands up to 8.5\")",
    image: "https://images.unsplash.com/photo-1620656798579-1984d9e87dfa?auto=format&fit=crop&w=900&q=80",
    inStock: true,
    badge: "Pack of 2",
    rating: 4.9,
    reviewsCount: 79,
  },
  {
    id: "satin-silk-premium-scrunchie-set",
    name: "Satin Silk Premium Scrunchie Set",
    category: "Hair Accessories",
    price: 149,
    originalPrice: 249,
    description:
      "Ultra-luxurious satin silk scrunchies in soothing blush and champagne tones. The ultra-smooth surface eliminates frizz, protects delicate hair cuticles during sleep, and adds a chic glossy touch to everyday hairstyles.",
    features: [
      "High-grade friction-free satin silk finish",
      "Dermatologist & hairstylist recommended for frizz reduction",
      "Delicate ruffled gather for maximum volume and shine",
      "Pack of 2 coordinated luxury shades",
    ],
    material: "Premium Mulberry Finish Satin Silk",
    dimensions: "5.0\" fluffy outer diameter",
    image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=900&q=80",
    inStock: true,
    badge: "Hair Care Must",
    rating: 5.0,
    reviewsCount: 92,
  },
];

export const CATEGORIES = [
  "All",
  "Handbags",
  "Pouches",
  "Hair Accessories",
] as const;

export type CategoryType = (typeof CATEGORIES)[number];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
