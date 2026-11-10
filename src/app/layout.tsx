import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartDrawer } from "@/components/CartDrawer";
import { AmazonCartToast } from "@/components/AmazonCartToast";
import { JsonLd } from "@/components/JsonLd";
import "./globals.css";

const serifFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://shreya-craft-nest.vercel.app");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Shreya's Craft Nest | Handcrafted Bags, Pouches & Hair Accessories",
    template: "%s | Shreya's Craft Nest",
  },
  description:
    "Handcrafted cotton bags, pouches & accessories lovingly stitched by mom Sudha Rani. Small-batch artisan goods, premium cotton, direct UPI payment, and Pan-India delivery.",
  keywords: [
    "Shreya's Craft Nest",
    "Shreya Craft Nest",
    "Shreya Crafts Nest",
    "Handmade Bags India",
    "Handcrafted Cotton Bags",
    "Embroidered Shoulder Bag",
    "Quilted Travel Pouch",
    "Kalamkari Tote Bag",
    "Indigo Fish Mini Bag",
    "Artisan Textile India",
    "Handmade with Love by Mom",
    "Sudha Rani Bags",
    "Bags under 500",
  ],
  authors: [{ name: "Shreya's Craft Nest", url: baseUrl }],
  creator: "Sudha Rani & Shreya",
  publisher: "Shreya's Craft Nest",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: baseUrl,
    siteName: "Shreya's Craft Nest",
    title: "Shreya's Craft Nest | Handcrafted Bags & Pouches by Mom",
    description:
      "Handcrafted cotton bags, pouches & accessories stitched with love by mom Sudha Rani. Handbags ₹400, Mini Bags ₹140, Pouches ₹100. Pan-India delivery.",
    images: [
      {
        url: "/products/botanical-stripe-bag.jpg",
        width: 1200,
        height: 630,
        alt: "Shreya's Craft Nest Handcrafted Bags",
      },
      {
        url: "/logo-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Shreya's Craft Nest Artisan Goods",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shreya's Craft Nest | Handcrafted Bags & Pouches by Mom",
    description:
      "Handcrafted cotton bags, pouches & accessories stitched with love by mom Sudha Rani. Handbags ₹400, Mini Bags ₹140, Pouches ₹100.",
    images: ["/products/botanical-stripe-bag.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo-emblem.png",
    shortcut: "/logo-emblem.png",
    apple: "/logo-emblem.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#faf8f5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serifFont.variable} ${sansFont.variable}`}>
      <head>
        {/* Google Translate Integration for Complete Page Translation */}
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              if (window.google && window.google.translate) {
                new window.google.translate.TranslateElement({
                  pageLanguage: 'en',
                  includedLanguages: 'en,hi,mr,bn,ta,te,kn,ml',
                  autoDisplay: false,
                }, 'google_translate_element');
              }
            }
          `}
        </Script>
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800 antialiased selection:bg-amber-200 selection:text-amber-900">
        <JsonLd />
        <div id="google_translate_element" style={{ display: "none" }} />
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <CartDrawer />
              <AmazonCartToast />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
