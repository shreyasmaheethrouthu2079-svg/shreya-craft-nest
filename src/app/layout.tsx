import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
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
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800 antialiased selection:bg-amber-200 selection:text-amber-900">
        {children}
      </body>
    </html>
  );
}
