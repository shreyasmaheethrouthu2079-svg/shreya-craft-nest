import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartDrawer } from "@/components/CartDrawer";
import { AmazonCartToast } from "@/components/AmazonCartToast";
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

export const metadata: Metadata = {
  title: "Shreya Crafts Nest | Handcrafted Bags, Pouches & Hair Accessories",
  description:
    "Handcrafted bags, pouches & hair accessories stitched with love by mom. Small-batch artisan goods, premium cotton, direct UPI payment, and Pan-India delivery.",
  keywords: [
    "Shreya Crafts Nest",
    "Handmade Bags",
    "Embroidered Shoulder Bag",
    "Cotton Canvas Tote",
    "Quilted Travel Pouch",
    "Cotton Scrunchies",
    "Satin Silk Scrunchies",
    "Artisan Textile India",
    "Handmade with Love",
  ],
  authors: [{ name: "Shreya Crafts Nest" }],
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
        {/* Load Razorpay Standard Checkout SDK */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
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
