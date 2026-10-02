# 🧵 Shreya Crafts Nest — E-Commerce Web Store

A modern, mobile-responsive e-commerce website for **Shreya Crafts Nest**, a brand specializing in handmade textile goods stitched with love and care by mom.

Built with **Next.js (App Router, TypeScript)**, **Tailwind CSS**, **Lucide Icons**, and integrated with **Razorpay UPI & Cards checkout** + a **Google Sheets / Webhook-ready order recording API**.

---

## 🌟 Brand & Aesthetics
- **Brand:** Shreya Crafts Nest
- **Tagline:** *"Handcrafted Bags, Pouches & Hair Accessories Stitched with Love"*
- **Tone:** Warm earthy/artisan palette (soft cream backgrounds `#FAF8F5`, warm amber/emerald accents, serif typography, clean card borders).
- **Core Pillars:**
  1. *Handmade in Small Batches* (Individually cut & stitched with durable French seams)
  2. *Direct UPI & Card Payment* (Google Pay, PhonePe, Paytm, QR & Cards via Razorpay)
  3. *Pan-India Shipping* (Zero plastic, eco-friendly packaging)

---

## 📁 Project Architecture & File Structure

```text
shreya-crafts-nest/
├── .env.local                     # Environment variables (Razorpay keys, Webhooks)
├── .env.local.example             # Environment configuration template
├── google-sheets-script.js        # Google Apps Script for instant Google Sheet sync
├── next.config.ts                 # Next.js config with Unsplash remote images
├── package.json                   # Dependencies (Next.js 16, React 19, Lucide, Razorpay)
├── tsconfig.json                  # Strict TypeScript configuration
└── src/
    ├── app/
    │   ├── api/
    │   │   ├── create-order/
    │   │   │   └── route.ts       # Secure server-side Razorpay order initializer
    │   │   └── record-order/
    │   │       └── route.ts       # Cryptographic HMAC verification & Google Sheets sync
    │   ├── checkout/
    │   │   └── page.tsx           # Order summary, shipping form & Razorpay UPI checkout
    │   ├── globals.css            # Earthy artisan color theme & custom scrollbars
    │   ├── layout.tsx             # Root layout with Google Fonts & Razorpay script
    │   └── page.tsx               # Homepage: Hero, Category filter tabs, Story, Catalog
    ├── components/
    │   ├── Footer.tsx             # Artisan footer with WhatsApp inquiry & payment badges
    │   ├── Navbar.tsx             # Sticky navbar with announcement bar & brand logo
    │   ├── ProductCard.tsx        # Responsive product card with badges, pricing & Order Now
    │   ├── ProductCatalog.tsx     # Client-side category filtering tabs & product grid
    │   └── TrustBanner.tsx        # Warm 3-step artisan guarantee banner
    ├── data/
    │   └── products.ts            # Local TypeScript product catalog (No external DB needed)
    └── types/
        └── razorpay.d.ts          # Window.Razorpay TypeScript interface declarations
```

---

## 🚀 Quick Start Guide

### 1. Open the project in VS Code
```powershell
code "C:\Users\shrey\.gemini\antigravity\scratch\shreya-crafts-nest"
```

### 2. Install dependencies (if not already installed)
```powershell
cd "C:\Users\shrey\.gemini\antigravity\scratch\shreya-crafts-nest"
npm install
```

### 3. Configure `.env.local`
Copy the template or edit `.env.local`:
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET

# Optional: Google Sheets Webhook URL
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# WhatsApp contact for customer inquiries
NEXT_PUBLIC_STORE_WHATSAPP_NUMBER=919876543210
```

> **Note on Demo/Test Mode:** If Razorpay keys are not provided yet, the store automatically enables an interactive **Demo Fallback** so you can preview, fill shipping details, and simulate verified orders without any error!

### 4. Run the development server
```powershell
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Build for production
```powershell
npm run build
npm run start
```

---

## 💳 Razorpay Payments Integration

- **Client flow (`src/app/checkout/page.tsx`):**
  Loads Razorpay script via `next/script` in `layout.tsx`. When customer clicks *"Pay ₹XXX with UPI / Cards"*, it initializes a secure server order via `/api/create-order` and opens Razorpay's modal with UPI (GPay, PhonePe, Paytm), QR code, and Debit/Credit card options.
- **Verification (`src/app/api/record-order/route.ts`):**
  Uses Node's `crypto.createHmac('sha256', secret)` to strictly verify `razorpay_signature` against `razorpay_order_id|razorpay_payment_id`.
- **Confirmation:**
  Displays a celebratory confirmation screen with order reference, payment ID, estimated dispatch timeline (24-48 hours), and a 1-click WhatsApp button to message the maker.

---

## 📊 Google Sheets Order Recording (Optional Setup)

You can record every verified order automatically into a Google Sheet with zero database maintenance:
1. Create a Google Spreadsheet.
2. Go to **Extensions > Apps Script**.
3. Paste the contents of `google-sheets-script.js`.
4. Click **Deploy > New deployment** -> Select **Web app**.
5. Set *Execute as* to **Me** and *Who has access* to **Anyone**.
6. Copy the URL and add to `.env.local` as `GOOGLE_SHEETS_WEBHOOK_URL`.
