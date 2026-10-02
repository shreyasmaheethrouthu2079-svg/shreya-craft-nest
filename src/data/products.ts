export interface Product {
  id: string;
  name: string;
  category: "Handbags" | "Pouches";
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
    id: "olive-bloom-wristlet-pouch",
    name: "Olive Floral Block-Print Wristlet Pouch",
    category: "Pouches",
    price: 100,
    originalPrice: 150,
    description:
      "Handcrafted olive green printed cotton pouch featuring floral star motifs, a smooth-glide main zipper, convenient front zip compartment, and a matching fabric wristlet strap for effortless carrying.",
    features: [
      "Dual-zipper design (main pouch + exterior front compartment)",
      "Attached matching fabric wristlet loop for easy carry",
      "Soft breathable cotton with neat reinforced inner stitching",
      "Perfect for makeup essentials, coins, keys, cards, or jewelry",
    ],
    material: "100% Handloom Block-Printed Cotton",
    dimensions: "7.5\" W x 6\" H with 5\" Wrist Loop",
    image: "/products/olive-bloom-wristlet-pouch.jpg",
    inStock: true,
    badge: "Special ₹100",
    rating: 4.9,
    reviewsCount: 45,
  },
  {
    id: "botanical-ivy-shoulder-bag",
    name: "Botanical Ivy Branch Shoulder Bag",
    category: "Handbags",
    price: 400,
    originalPrice: 599,
    description:
      "Subtle textured slub fabric adorned with delicate handloom botanical vine and leaf motifs. Features comfortable wide shoulder straps, a roomy main compartment, and an exterior quick-access zip pocket.",
    features: [
      "Nature-inspired leafy branch and vine print",
      "Full-width front zippered pocket for quick phone/keys access",
      "Comfortable long shoulder straps with reinforced cross-stitching",
      "Flat boxed bottom for sturdy upright standing",
    ],
    material: "Textured Cotton Slub & Botanical Print",
    dimensions: "14\" H x 13\" W x 4\" Base Gusset (11\" strap drop)",
    image: "/products/botanical-ivy-shoulder-bag.jpg",
    inStock: true,
    badge: "Mom's Craft",
    rating: 5.0,
    reviewsCount: 38,
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
    badge: "Heritage Pick",
    rating: 4.9,
    reviewsCount: 52,
  },
  {
    id: "indigo-fish-mini-tote",
    name: "Indigo Fish Quilted Mini Handbag",
    category: "Handbags",
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
];

export const CATEGORIES = [
  "All",
  "Handbags",
  "Pouches",
] as const;

export type CategoryType = (typeof CATEGORIES)[number];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
