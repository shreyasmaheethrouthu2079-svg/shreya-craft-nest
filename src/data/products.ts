export interface Product {
  id: string;
  name: string;
  category: "Handbags" | "Pouches" | "Mini Bags";
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
    id: "botanical-stripe-bag",
    name: "Botanical Ivy Pinstripe Shoulder Handbag",
    category: "Handbags",
    price: 400,
    originalPrice: 599,
    description:
      "Charming sage-green and ivory pinstripe cotton handbag featuring dark green embroidered botanical vine and leafy branch artwork. Includes convenient front slip pocket and double shoulder handles.",
    features: [
      "Fine sage & ivory vertical stripes with leaf branch embroidery",
      "Deep exterior front slip pocket for phone and keys",
      "Comfortable reinforced top handles with cross-stitching",
      "Smooth top zipper with sturdy flat base",
    ],
    material: "Textured Cotton Slub & Botanical Embroidery",
    dimensions: "12\" H x 12.5\" W x 4\" Base (8.5\" Handle Drop)",
    image: "/products/botanical-stripe-bag.jpg",
    inStock: true,
    badge: "Bestseller ₹400",
    rating: 5.0,
    reviewsCount: 64,
  },
  {
    id: "floral-tote-handbag",
    name: "Artisan Floral Quilted Tote Handbag",
    category: "Handbags",
    price: 400,
    originalPrice: 599,
    description:
      "Delicately quilted cotton tote handbag adorned with matching botanical flower motifs in sage green, soft grey, and mustard yellow. Features sturdy double top handles and a secure top zipper.",
    features: [
      "Matching botanical floral print on pure natural cotton",
      "Dual reinforced comfortable top carry handles",
      "Smooth top zipper closure with roomy main interior",
      "Lightly padded quilted lining for structure and protection",
    ],
    material: "Quilted Cotton Canvas & Durable Lining",
    dimensions: "11\" H x 12\" W x 3.5\" Base (7\" Handle Drop)",
    image: "/products/floral-tote-handbag.jpg",
    inStock: true,
    badge: "Mom's Craft ₹400",
    rating: 5.0,
    reviewsCount: 56,
  },
  {
    id: "floral-dual-pouch",
    name: "Sage Floral Dual-Zip Canvas Pouch",
    category: "Pouches",
    price: 100,
    originalPrice: 150,
    description:
      "Handcrafted cream cotton canvas pouch featuring delicate sage green and grey floral motifs, dual vertical zipper compartments, and smooth metallic pulls for coins, cosmetics, and essentials.",
    features: [
      "Dual vertical zippered compartments for organized storage",
      "100% pure cotton canvas with delicate floral prints",
      "Neat reinforced French seam inner construction",
      "Compact portable design for everyday travel essentials",
    ],
    material: "Pure Cotton Canvas & Brass Hardware",
    dimensions: "7.5\" H x 4.5\" W x 1.5\" D",
    image: "/products/floral-dual-pouch.jpg",
    inStock: true,
    badge: "Special ₹100",
    rating: 4.9,
    reviewsCount: 48,
  },
  {
    id: "botanical-leaf-pouch",
    name: "Terracotta Botanical Leaf Dual-Zip Pouch",
    category: "Pouches",
    price: 100,
    originalPrice: 150,
    description:
      "Handmade upright travel pouch featuring modern abstract botanical leaves in earthy olive green, blush pink, and peach tones. Equipped with dual vertical zippers and cotton pull loop.",
    features: [
      "Artistic large leaf block print on warm cream cotton",
      "Dual vertical zippered openings with fabric puller loop",
      "Cushioned interior lining for pens, brushes, or accessories",
      "Hand-guided precision stitching by mom",
    ],
    material: "Pure Breathable Cotton & Nylon Coil Zips",
    dimensions: "8\" H x 4\" W x 1.5\" D",
    image: "/products/botanical-leaf-pouch.jpg",
    inStock: true,
    badge: "Artisan Pick ₹100",
    rating: 4.8,
    reviewsCount: 39,
  },
  {
    id: "heritage-tile-pouch",
    name: "Heritage Village Tile Motif Travel Pouch",
    category: "Pouches",
    price: 100,
    originalPrice: 150,
    description:
      "Traditional geometric diamond tile print pouch depicting rustic cottage and village scenes in terracotta rust, charcoal, and warm ivory. Sturdy central vertical zipper with sleek silver slider.",
    features: [
      "Geometric diamond grid with Indian village landscape motifs",
      "Heavy-duty center vertical zipper with silver slider",
      "Compact vertical profile fits easily into tote bags",
      "Reinforced seams designed for long-lasting daily use",
    ],
    material: "100% Cotton Canvas & Metal Slider",
    dimensions: "7.8\" H x 4.2\" W x 1.5\" D",
    image: "/products/heritage-tile-pouch.jpg",
    inStock: true,
    badge: "Popular ₹100",
    rating: 4.9,
    reviewsCount: 42,
  },
  {
    id: "terracotta-patchwork-tote",
    name: "Terracotta Kalamkari Patchwork Shoulder Tote",
    category: "Handbags",
    price: 400,
    originalPrice: 650,
    description:
      "Rich rustic red and earthen gold patchwork tote inspired by traditional Ajrakh & Kalamkari textile art. Includes heavy-duty top shoulder straps, front zipper compartment, and sturdy reinforced seams for daily elegance.",
    features: [
      "Traditional Kalamkari & Ajrakh geometric block print motifs",
      "Deep exterior front zip pocket with matching border trim",
      "Double-stitched stress points for everyday heavy carrying",
      "Roomy interior lined with durable natural cotton",
    ],
    material: "Authentic Ajrakh & Kalamkari Printed Cotton",
    dimensions: "15\" H x 14.5\" W x 4.5\" Base Gusset",
    image: "/products/terracotta-patchwork-tote.jpg",
    inStock: true,
    badge: "Heritage Pick ₹400",
    rating: 4.9,
    reviewsCount: 52,
  },
  {
    id: "indigo-fish-mini-tote",
    name: "Indigo Fish Quilted Mini Handbag",
    category: "Mini Bags",
    price: 140,
    originalPrice: 220,
    description:
      "Charming deep indigo blue mini handbag quilted with delightful white fish batik/block print artwork. Equipped with sturdy double top handles, an exterior zip pocket, and soft quilted padding.",
    features: [
      "Whimsical artisan fish wave block-print pattern",
      "Quilted padded lining offers light cushioning & structure",
      "Dual sturdy grab handles + smooth top zip closure",
      "Exterior zipper pouch for change and tokens",
    ],
    material: "Quilted Indigo Dabu/Batik Cotton",
    dimensions: "9\" H x 8.5\" W x 3\" Gusset",
    image: "/products/indigo-fish-mini-tote.jpg",
    inStock: true,
    badge: "Bestseller ₹140",
    rating: 5.0,
    reviewsCount: 61,
  },
  {
    id: "olive-bloom-wristlet-pouch",
    name: "Olive Floral Block-Print Wristlet Mini Bag",
    category: "Mini Bags",
    price: 120,
    originalPrice: 180,
    description:
      "Delicate handcrafted olive green and cream botanical floral wristlet mini bag. Features a comfortable wrist carry strap, secure top zipper, and soft inner lining for smartphone, keys, cards, and daily essentials.",
    features: [
      "Traditional olive green floral block-print on pure cotton",
      "Sturdy integrated wristlet strap for convenient hands-free carry",
      "Smooth glide metallic zipper with fabric puller",
      "Compact structured profile ideal for quick outings and gifting",
    ],
    material: "100% Block-Printed Cotton Canvas",
    dimensions: "8.5\" W x 5.5\" H x 1.5\" Gusset",
    image: "/products/olive-bloom-wristlet-pouch.jpg",
    inStock: true,
    badge: "New Arrival ₹120",
    rating: 4.9,
    reviewsCount: 38,
  },
];

export const CATEGORIES = [
  "All",
  "Handbags",
  "Mini Bags",
  "Pouches",
] as const;

export type CategoryType = (typeof CATEGORIES)[number];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
