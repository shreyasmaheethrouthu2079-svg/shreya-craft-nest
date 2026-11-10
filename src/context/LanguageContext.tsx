"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type LanguageCode = "EN" | "HI" | "MR" | "BN" | "TA" | "TE" | "KN" | "ML";

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  googleCode: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "EN", name: "English", nativeName: "English", googleCode: "en" },
  { code: "HI", name: "Hindi", nativeName: "हिन्दी", googleCode: "hi" },
  { code: "MR", name: "Marathi", nativeName: "मराठी", googleCode: "mr" },
  { code: "BN", name: "Bengali", nativeName: "বাংলা", googleCode: "bn" },
  { code: "TA", name: "Tamil", nativeName: "தமிழ்", googleCode: "ta" },
  { code: "TE", name: "Telugu", nativeName: "తెలుగు", googleCode: "te" },
  { code: "KN", name: "Kannada", nativeName: "ಕನ್ನಡ", googleCode: "kn" },
  { code: "ML", name: "Malayalam", nativeName: "മലയാളം", googleCode: "ml" },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  EN: {
    // Navbar
    "nav.greeting": "Hello, Mom's Studio",
    "nav.account": "Account & Lists",
    "nav.cart": "Cart",
    "nav.orders": "Your Orders & Tracking",
    "nav.shoppingCart": "Your Shopping Cart",
    "nav.allBags": "All Handcrafted Bags",
    "nav.whatsapp": "Customer Care WhatsApp",
    "nav.langTitle": "Language Settings",
    "nav.langSelect": "Select your preferred language for shopping:",
    "nav.shoppingRegion": "You are shopping on ShreyaCraftNest.in",

    // Hero Section
    "hero.badge": "Curated Artisan Collection",
    "hero.headlineStart": "Handcrafted Bags, Pouches & Hair Accessories",
    "hero.headlineItalic": "Stitched with Love",
    "hero.welcome": "Welcome to",
    "hero.brand": "Shreya Crafts Nest",
    "hero.desc": "Every stitch is thoughtfully placed at our home studio using durable cotton canvas, natural threads, and pure mulberry satin. No factory shortcuts—just genuine love, sturdy seams, and timeless warmth.",
    "hero.bullet1": "Durable French Seams",
    "hero.bullet2": "Zero Plastic Packaging",
    "hero.bullet3": "Instant UPI Checkout",
    "hero.cta": "Shop Collection",
    "hero.badge1": "Hand-Guided Stitching",
    "hero.badge2": "Pan-India Express Dispatch",

    // Trust Banner
    "trust.promise": "The Artisan Promise",
    "trust.title": "Crafted with Care, Delivered with Pride",
    "trust.subtitle": "Experience the warmth and lasting durability of authentic Indian textile craftsmanship in three simple steps.",
    "trust.step1Title": "Handmade in Small Batches",
    "trust.step1Badge": "Slow & Sustainable",
    "trust.step1Desc": "Every single tote, pouch, and scrunchie is precision-cut and stitched by hand with reinforced French seams. No anonymous factories or mass production.",
    "trust.step2Title": "Direct UPI QR & WhatsApp",
    "trust.step2Badge": "Instant & Zero Commission",
    "trust.step2Desc": "Pay seamlessly via your favorite UPI app (Google Pay, PhonePe, Paytm, BHIM) directly to artisan maker Sudha Rani.",
    "trust.step3Title": "Pan-India Safe Shipping",
    "trust.step3Badge": "Delivered to Your Door",
    "trust.step3Desc": "Carefully wrapped in eco-friendly butter paper with a handwritten thank-you note and dispatched reliably across 28,000+ Indian postal pincodes.",

    // Catalog
    "catalog.badge": "Curated Artisan Collection",
    "catalog.title": "Handcrafted Goods",
    "catalog.subtitle": "Each bag, pouch, and hair accessory is individually cut and stitched by mom with fine French seams and reinforced stress points.",
    "catalog.showing": "Showing",
    "catalog.designs": "handcrafted designs",
    "catalog.catAll": "All Items",
    "catalog.catHandbags": "Handbags",
    "catalog.catMiniBags": "Mini Bags",
    "catalog.catPouches": "Pouches",
    "catalog.catAccessories": "Accessories",
    "catalog.addToCart": "Add to Cart",
    "catalog.inCart": "in Cart",
    "catalog.buyNow": "Buy Now",
    "catalog.inStock": "In Stock",
    "catalog.price": "Price (Inc. Taxes)",
    "catalog.save": "Save",
    "catalog.fabric": "Fabric:",
    "catalog.dimensions": "Dimensions:",
    "catalog.delivery": "Delivery ₹40 Pan-India",

    // Cart
    "cart.title": "Shopping Cart",
    "cart.priceDetails": "PRICE DETAILS",
    "cart.subtotal": "Subtotal",
    "cart.deliveryFee": "Delivery Charges",
    "cart.total": "Total Amount",
    "cart.proceed": "Proceed to Buy",
    "cart.empty": "Your shopping cart is currently empty",
    "cart.savings": "You are saving on this artisanal order",
  },
  HI: {
    // Navbar
    "nav.greeting": "नमस्ते, मॉम्स स्टूडियो",
    "nav.account": "खाता और सूचियाँ",
    "nav.cart": "कार्ट",
    "nav.orders": "आपके ऑर्डर और ट्रैकिंग",
    "nav.shoppingCart": "आपकी शॉपिंग कार्ट",
    "nav.allBags": "सभी हाथ से बने बैग",
    "nav.whatsapp": "ग्राहक सेवा व्हाट्सएप",
    "nav.langTitle": "भाषा प्राथमिकताएँ",
    "nav.langSelect": "खरीदारी के लिए अपनी पसंदीदा भाषा चुनें:",
    "nav.shoppingRegion": "आप ShreyaCraftNest.in पर खरीदारी कर रहे हैं",

    // Hero Section
    "hero.badge": "माँ का खास हस्तनिर्मित संग्रह",
    "hero.headlineStart": "हाथ से बने सुंदर बैग, पाउच व एक्सेसरीज",
    "hero.headlineItalic": "माँ के प्यार से सिला हुआ",
    "hero.welcome": "स्वागत है",
    "hero.brand": "श्रेया क्राफ्ट्स नेस्ट में",
    "hero.desc": "हमारे होम स्टूडियो में हर एक सिलाई शुद्ध सूती कपड़े और प्राकृतिक धागों से सावधानीपूर्वक की जाती है। कोई फैक्ट्री का काम नहीं—सिर्फ माँ का सच्चा प्यार, मजबूत सिलाई और सुंदर डिज़ाइन।",
    "hero.bullet1": "मजबूत फ्रेंच सिलाई",
    "hero.bullet2": "100% प्लास्टिक मुक्त पैकिंग",
    "hero.bullet3": "त्वरित व सुरक्षित यूपीआई",
    "hero.cta": "कलेक्शन देखें",
    "hero.badge1": "हाथ से बारीक सिलाई",
    "hero.badge2": "पूरे भारत में सुरक्षित डिलीवरी",

    // Trust Banner
    "trust.promise": "कारीगरी का पक्का वादा",
    "trust.title": "प्यार से बनाया, गर्व से पहुंचाया",
    "trust.subtitle": "तीन आसान चरणों में भारतीय हस्तशिल्प और पारंपरिक सूती सिलाई की गुणवत्ता का अनुभव करें।",
    "trust.step1Title": "सीमित संख्या में हस्तनिर्मित",
    "trust.step1Badge": "टिकाऊ व प्राकृतिक",
    "trust.step1Desc": "हर एक टोट बैग, पाउच और स्क्रंची को माँ स्वयं अपने हाथों से मजबूत फ्रेंच सीम के साथ तैयार करती हैं।",
    "trust.step2Title": "सीधा UPI QR व WhatsApp",
    "trust.step2Badge": "झटपट व सुरक्षित",
    "trust.step2Desc": "Google Pay, PhonePe, Paytm, BHIM द्वारा सीधे कारीगर सुधा रानी जी को सुरक्षित पेमेंट करें।",
    "trust.step3Title": "पूरे भारत में सुरक्षित डिलीवरी",
    "trust.step3Badge": "आपके घर तक",
    "trust.step3Desc": "पर्यावरण के अनुकूल बटर पेपर में सावधानी से पैक करके एक हस्तलिखित धन्यवाद पत्र के साथ भेजा जाता है।",

    // Catalog
    "catalog.badge": "कलात्मक संग्रह",
    "catalog.title": "माँ द्वारा हाथ से बनी वस्तुएं",
    "catalog.subtitle": "प्रत्येक बैग और पाउच को टिकाऊ सूती कपड़े और हाथ की सिलाई से मजबूती के साथ बनाया गया है।",
    "catalog.showing": "प्रदर्शित",
    "catalog.designs": "हस्तनिर्मित उत्पाद",
    "catalog.catAll": "सभी उत्पाद",
    "catalog.catHandbags": "हैंडबैग",
    "catalog.catMiniBags": "मिनी बैग्स",
    "catalog.catPouches": "पाउच",
    "catalog.catAccessories": "एक्सेसरीज",
    "catalog.addToCart": "कार्ट में जोड़ें",
    "catalog.inCart": "कार्ट में",
    "catalog.buyNow": "अभी खरीदें",
    "catalog.inStock": "स्टॉक में उपलब्ध",
    "catalog.price": "मूल्य (कर सहित)",
    "catalog.save": "बचत",
    "catalog.fabric": "कपड़ा:",
    "catalog.dimensions": "आकार:",
    "catalog.delivery": "डिलीवरी ₹40 पूरे भारत में",

    // Cart
    "cart.title": "शॉपिंग कार्ट",
    "cart.priceDetails": "मूल्य विवरण",
    "cart.subtotal": "उप-कुल",
    "cart.deliveryFee": "डिलीवरी शुल्क",
    "cart.total": "कुल राशि",
    "cart.proceed": "खरीदारी जारी रखें",
    "cart.empty": "आपकी शॉपिंग कार्ट वर्तमान में खाली है",
    "cart.savings": "आप इस हस्तनिर्मित ऑर्डर पर बचत कर रहे हैं",
  },
  MR: {
    // Navbar
    "nav.greeting": "नमस्कार, मॉम्स स्टुडिओ",
    "nav.account": "खाते आणि याद्या",
    "nav.cart": "कार्ट",
    "nav.orders": "तुमच्या ऑर्डर्स आणि ट्रॅकिंग",
    "nav.shoppingCart": "तुमची शॉपिंग कार्ट",
    "nav.allBags": "सर्व हाताने शिवलेल्या बॅगा",
    "nav.whatsapp": "ग्राहक सेवा व्हॉट्सॲप",
    "nav.langTitle": "भाषा पर्याय",
    "nav.langSelect": "खरेदीसाठी तुमची पसंतीची भाषा निवडा:",
    "nav.shoppingRegion": "तुम्ही ShreyaCraftNest.in वर खरेदी करत आहात",

    // Hero Section
    "hero.badge": "आईचे खास हस्तकला कलेक्शन",
    "hero.headlineStart": "हाताने शिवलेल्या सुंदर बॅगा, पाउच व ॲक्सेसरीज",
    "hero.headlineItalic": "आईच्या प्रेमाने साकारलेले",
    "hero.welcome": "स्वागत आहे",
    "hero.brand": "श्रेया क्राफ्ट्स नेस्ट मध्ये",
    "hero.desc": "आमच्या होम स्टुडिओमध्ये प्रत्येक शिलाई शुद्ध कॉटन फॅब्रिक आणि नैसर्गिक धाग्यांनी काळजीपूर्वक केली जाते. कोणतीही फॅक्टरी शॉर्टकट नाही—केवळ आईची माया आणि टिकाऊ शिलाई.",
    "hero.bullet1": "मजबूत फ्रेंच शिलाई",
    "hero.bullet2": "100% प्लास्टिक मुक्त पॅकेजिंग",
    "hero.bullet3": "झटपट व सुरक्षित UPI",
    "hero.cta": "कलेक्शन पाहा",
    "hero.badge1": "हाताने नाजूक शिलाई",
    "hero.badge2": "संपूर्ण भारतात एक्सप्रेस डिलिव्हरी",

    // Trust Banner
    "trust.promise": "हस्तकलानिर्मितीचे आश्वासन",
    "trust.title": "काळजीपूर्वक बनवले, आदराने पोहोचवले",
    "trust.subtitle": "तीन सोप्या टप्प्यांत पारंपरिक भारतीय कापड हस्तकलेची गुणवत्ता अनुभवा.",
    "trust.step1Title": "कमी प्रमाणात हाताने निर्मित",
    "trust.step1Badge": "शाश्वत व नैसर्गिक",
    "trust.step1Desc": "प्रत्येक टोट, पाउच आणि स्क्रंची आई स्वतः हाताने मजबूत फ्रेंच शिलाईसह तयार करते.",
    "trust.step2Title": "थेट UPI आणि कार्ड पेमेंट",
    "trust.step2Badge": "झटपट व सुरक्षित",
    "trust.step2Desc": "Google Pay, PhonePe, Paytm किंवा कार्डने सुरक्षित पेमेंट करा.",
    "trust.step3Title": "अखिल भारतीय सुरक्षित डिलिव्हरी",
    "trust.step3Badge": "तुमच्या दारापर्यंत",
    "trust.step3Desc": "इको-फ्रेंडली पॅकेजिंग आणि हस्तलिखित धन्यवाद पत्रासह सुरक्षितपणे पोहोचवले जाते.",

    // Catalog
    "catalog.badge": "कलात्मक संग्रह",
    "catalog.title": "आईने हाताने बनवलेल्या वस्तू",
    "catalog.subtitle": "प्रत्येक बॅग आणि पाउच शुद्ध कॉटन कपड्याने आणि मजबूत शिलाईने बनवले आहे.",
    "catalog.showing": "दाखवत आहे",
    "catalog.designs": "हस्तनिर्मित डिझाइन्स",
    "catalog.catAll": "सर्व वस्तू",
    "catalog.catHandbags": "हँडबॅग",
    "catalog.catMiniBags": "मिनी बॅग्स",
    "catalog.catPouches": "पाउच",
    "catalog.catAccessories": "ॲक्सेसरीज",
    "catalog.addToCart": "कार्टमध्ये जोडा",
    "catalog.inCart": "कार्टमध्ये",
    "catalog.buyNow": "आता खरेदी करा",
    "catalog.inStock": "स्टॉकमध्ये उपलब्ध",
    "catalog.price": "किंमत (करांसह)",
    "catalog.save": "बचत",
    "catalog.fabric": "कापड:",
    "catalog.dimensions": "आकारमान:",
    "catalog.delivery": "डिलिव्हरी शुल्क ₹40",

    // Cart
    "cart.title": "शॉपिंग कार्ट",
    "cart.priceDetails": "किंमत तपशील",
    "cart.subtotal": "उप-एकूण",
    "cart.deliveryFee": "डिलिव्हरी शुल्क",
    "cart.total": "एकूण रक्कम",
    "cart.proceed": "खरेदीसाठी पुढे जा",
    "cart.empty": "तुमची शॉपिंग कार्ट सध्या रिकामी आहे",
    "cart.savings": "तुम्ही या ऑर्डरवर बचत करत आहात",
  },
  BN: {
    "nav.greeting": "নমস্কার, মমস স্টুডিও",
    "nav.account": "অ্যাকাউন্ট ও তালিকা",
    "nav.cart": "কার্ট",
    "nav.orders": "আপনার অর্ডার ও ট্র্যাকিং",
    "nav.shoppingCart": "আপনার শপিং কার্ট",
    "nav.allBags": "হাতে তৈরি সমস্ত ব্যাগ",
    "nav.whatsapp": "কাস্টমার কেয়ার হোয়াটসঅ্যাপ",
    "nav.langTitle": "ভাষা পছন্দ",
    "nav.langSelect": "কেনাকাটার জন্য আপনার পছন্দের ভাষা নির্বাচন করুন:",
    "nav.shoppingRegion": "আপনি ShreyaCraftNest.in এ কেনাকাটা করছেন",
    "hero.badge": "মায়ের হাতে তৈরি কালেকশন",
    "hero.headlineStart": "হাতে তৈরি সুন্দর ব্যাগ, পাউচ ও চুলের সাজ",
    "hero.headlineItalic": "মায়ের ভালোবাসায় সেলাই করা",
    "hero.welcome": "স্বাগতম",
    "hero.brand": "শ্রেয়া ক্রাফটস নেস্টে",
    "hero.desc": "আমাদের হোম স্টুডিওতে প্রতিটি সেলাই খাঁটি সুতি ও প্রাকৃতিক সুতায় পরম যত্নে করা হয়। কোনো কৃত্রিমতা নয়—শুধুমাত্র অকৃত্রিম ভালোবাসা ও টেকসই সেলাই।",
    "hero.bullet1": "টেকসই ফ্রেঞ্চ সেলাই",
    "hero.bullet2": "প্লাস্টিক মুক্ত প্যাকেজিং",
    "hero.bullet3": "তাত্ক্ষণিক UPI পেমেন্ট",
    "hero.cta": "কালেকশন দেখুন",
    "hero.badge1": "হাতে বোনা সূক্ষ্ম কাজ",
    "hero.badge2": "সারা ভারতে দ্রুত ডেলিভারি",
    "trust.promise": "হস্তশিল্পের প্রতিশ্রুতি",
    "trust.title": "যত্নে তৈরি, সম্মানে পৌঁছে দেওয়া",
    "trust.subtitle": "তিনটি সহজ ধাপে খাঁটি ভারতীয় হস্তশিল্পের স্থায়িত্ব অনুভব করুন।",
    "trust.step1Title": "স্বল্প সংখ্যায় হাতে তৈরি",
    "trust.step1Badge": "পরিবেশবান্ধব ও টেকসই",
    "trust.step1Desc": "প্রতিটি টোট ব্যাগ, পাউচ ও স্ক্রাঞ্চি মা নিজে হাতে নিখুঁত ফ্রেঞ্চ সেলাইয়ে প্রস্তুত করেন।",
    "trust.step2Title": "সরাসরি UPI QR ও WhatsApp",
    "trust.step2Badge": "তাত্ক্ষণিক ও নিরাপদ",
    "trust.step2Desc": "Google Pay, PhonePe, Paytm দিয়ে সরাসরি নির্মাতা সুধা রানী জির সাথে সহজে লেনদেন করুন।",
    "trust.step3Title": "সারা ভারতে নিরাপদ শিপিং",
    "trust.step3Badge": "আপনার দোরগোড়ায়",
    "trust.step3Desc": "পরিবেশবান্ধব বাটার পেপারে যত্নসহকারে প্যাক করে একটি হস্তলিখিত ধন্যবাদ পত্রের সাথে পাঠানো হয়।",
    "catalog.badge": "শিল্পকলার সম্ভার",
    "catalog.title": "মায়ের হাতের তৈরি জিনিসপত্র",
    "catalog.subtitle": "খাঁটি সুতির বস্ত্র ও মজবুত সেলাইয়ে তৈরি প্রতিটি পণ্য।",
    "catalog.showing": "প্রদর্শিত",
    "catalog.designs": "হাতে তৈরি ডিজাইন",
    "catalog.catAll": "সব পণ্য",
    "catalog.catHandbags": "হ্যান্ডব্যাগ",
    "catalog.catMiniBags": "মিনি ব্যাগ",
    "catalog.catPouches": "পাউচ",
    "catalog.catAccessories": "অ্যাক্সেসরিজ",
    "catalog.addToCart": "কার্টে যোগ করুন",
    "catalog.inCart": "কার্টে আছে",
    "catalog.buyNow": "এখনই কিনুন",
    "catalog.inStock": "স্টকে আছে",
    "catalog.price": "মূল্য (করসহ)",
    "catalog.save": "সাশ্রয়",
    "catalog.fabric": "কাপড়:",
    "catalog.dimensions": "মাপ:",
    "catalog.delivery": "ডেলিভারি চার্জ ₹40",
    "cart.title": "শপিং কার্ট",
    "cart.priceDetails": "মূল্য বিবরণ",
    "cart.subtotal": "সাবটোটাল",
    "cart.deliveryFee": "ডেলিভারি চার্জ",
    "cart.total": "মোট মূল্য",
    "cart.proceed": "এগিয়ে যান",
    "cart.empty": "আপনার শপিং কার্ট খালি আছে",
    "cart.savings": "আপনি এই অর্ডারে সাশ্রয় করছেন",
  },
  TA: {
    "nav.greeting": "வணக்கம், அம்மாவின் ஸ்டுடியோ",
    "nav.account": "கணக்கு & பட்டியல்கள்",
    "nav.cart": "கார்ட்",
    "nav.orders": "உங்கள் ஆர்டர்கள் & கண்காணிப்பு",
    "nav.shoppingCart": "உங்கள் ஷாப்பிங் கார்ட்",
    "nav.allBags": "அனைத்து கைவினை பைகள்",
    "nav.whatsapp": "வாடிக்கையாளர் சேவை வாட்ஸ்அப்",
    "nav.langTitle": "மொழி அமைப்புகள்",
    "nav.langSelect": "ஷாப்பிங் செய்ய உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்:",
    "nav.shoppingRegion": "நீங்கள் ShreyaCraftNest.in இல் ஷாப்பிங் செய்கிறீர்கள்",
    "hero.badge": "அம்மாவின் கைவண்ணத் தொகுப்பு",
    "hero.headlineStart": "அழகிய கைவினை பைகள், பவுச்கள் & அணிகலன்கள்",
    "hero.headlineItalic": "அன்போடு தைக்கப்பட்டது",
    "hero.welcome": "வரவேற்கிறோம்",
    "hero.brand": "ஸ்ரேயா கிராஃப்ட்ஸ் நெஸ்ட்டிற்கு",
    "hero.desc": "எங்கள் வீட்டு ஸ்டுடியோவில் ஒவ்வொரு தையலும் தூய பருத்தி துணியால் அன்போடு தைக்கப்படுகிறது. இயந்திர குறுக்குவழிகள் இல்லை—அன்பும் தரமும் மட்டுமே.",
    "hero.bullet1": "நீடித்த பிரெஞ்சு தையல்",
    "hero.bullet2": "பிளாஸ்டிக் இல்லாத பேக்கிங்",
    "hero.bullet3": "உடனடி UPI பணம் செலுத்துதல்",
    "hero.cta": "தொகுப்பை வாங்குங்கள்",
    "hero.badge1": "கைவேலை தையல் கலை",
    "hero.badge2": "இந்தியா முழுவதும் விரைவு டெலிவரி",
    "trust.promise": "கைவினைக் கலை வாக்குறுதி",
    "trust.title": "அன்போடு செய்து, மரியாதையோடு சேர்த்தல்",
    "trust.subtitle": "பாரம்பரிய இந்திய கைவினைத் தையலின் சிறப்பை அனுபவியுங்கள்.",
    "trust.step1Title": "சிறிய அளவில் கையால் தைக்கப்பட்டது",
    "trust.step1Badge": "இயற்கையானது & நீடித்தது",
    "trust.step1Desc": "அனைத்து பைகளும் அம்மாவால் உறுதியான பிரெஞ்சு தையலுடன் கவனமாக தைக்கப்படுகின்றன.",
    "trust.step2Title": "நேரடி UPI மற்றும் கார்டு செலுத்துதல்",
    "trust.step2Badge": "பாதுகாப்பானது & விரைவானது",
    "trust.step2Desc": "Google Pay, PhonePe, Paytm அல்லது கார்டுகள் மூலம் பாதுகாப்பாக செலுத்தலாம்.",
    "trust.step3Title": "இந்தியா முழுவதும் பாதுகாப்பான டெலிவரி",
    "trust.step3Badge": "உங்கள் வீட்டு வாசல் வரை",
    "trust.step3Desc": "இயற்கை காகிதத்தில் கைப்பட எழுதிய நன்றி குறிப்புடன் உங்கள் வீட்டிற்கு பாதுகாப்பாக அனுப்பி வைக்கப்படுகிறது.",
    "catalog.badge": "கைவினை தொகுப்பு",
    "catalog.title": "அம்மா தைத்த கைவினைப் பொருட்கள்",
    "catalog.subtitle": "தூய பருத்தி மற்றும் உறுதியான தையலால் உருவான பைகள்.",
    "catalog.showing": "காட்டப்படுகிறது",
    "catalog.designs": "கைவினை வடிவமைப்புகள்",
    "catalog.catAll": "அனைத்தும்",
    "catalog.catHandbags": "கைப்பைகள்",
    "catalog.catMiniBags": "மினி பைகள்",
    "catalog.catPouches": "பவுச்கள்",
    "catalog.catAccessories": "அணிகலன்கள்",
    "catalog.addToCart": "கார்ட்டில் சேர்",
    "catalog.inCart": "கார்ட்டில் உள்ளது",
    "catalog.buyNow": "இப்போதே வாங்குக",
    "catalog.inStock": "இருப்பில் உள்ளது",
    "catalog.price": "விலை (வரிகள் உட்பட)",
    "catalog.save": "சேமிப்பு",
    "catalog.fabric": "துணி:",
    "catalog.dimensions": "அளவு:",
    "catalog.delivery": "டெலிவரி கட்டணம் ₹40",
    "cart.title": "ஷாப்பிங் கார்ட்",
    "cart.priceDetails": "விலை விவரங்கள்",
    "cart.subtotal": "துணை மொத்தம்",
    "cart.deliveryFee": "டெலிவரி கட்டணம்",
    "cart.total": "மொத்த தொகை",
    "cart.proceed": "தொடரவும்",
    "cart.empty": "உங்கள் ஷாப்பிங் கார்ட் காலியாக உள்ளது",
    "cart.savings": "இந்த ஆர்டரில் நீங்கள் சேமிக்கிறீர்கள்",
  },
  TE: {
    "nav.greeting": "నమస్కారం, మామ్స్ స్టూడియో",
    "nav.account": "ఖాతా & జాబితాలు",
    "nav.cart": "కార్ట్",
    "nav.orders": "మీ ఆర్డర్లు & ట్రాకింగ్",
    "nav.shoppingCart": "మీ షాపింగ్ కార్ట్",
    "nav.allBags": "అన్ని చేతితో కుట్టిన బ్యాగులు",
    "nav.whatsapp": "కస్టమర్ కేర్ వాట్సాప్",
    "nav.langTitle": "భాష అమరికలు",
    "nav.langSelect": "షాపింగ్ కోసం మీ భాషను ఎంచుకోండి:",
    "nav.shoppingRegion": "మీరు ShreyaCraftNest.in లో షాపింగ్ చేస్తున్నారు",
    "hero.badge": "అమ్మ చేతి క్రాఫ్ట్స్ కలెక్షన్",
    "hero.headlineStart": "చేతితో కుట్టిన బ్యాగులు, పౌచులు & ఉపకరణాలు",
    "hero.headlineItalic": "అమ్మ ప్రేమతో తయారు చేయబడింది",
    "hero.welcome": "స్వాగతం",
    "hero.brand": "శ్రేయా క్రాఫ్ట్స్ నెస్ట్‌కు",
    "hero.desc": "మా హోమ్ స్టూడియోలో ప్రతి కుట్టు స్వచ్ఛమైన కాటన్ వస్త్రంతో ఎంతో శ్రద్ధతో వేయబడుతుంది. ఫ్యాక్టరీ సత్వరమార్గాలు లేవు—నిజమైన ప్రేమ మరియు మన్నికైన కుట్లు మాత్రమే.",
    "hero.bullet1": "మన్నికైన ఫ్రెంచ్ కుట్లు",
    "hero.bullet2": "ప్లాస్టిక్ రహిత ప్యాకేజింగ్",
    "hero.bullet3": "తక్షణ UPI చెల్లింపు",
    "hero.cta": "కలెక్షన్ చూడండి",
    "hero.badge1": "చేతితో కుట్టిన పనితనం",
    "hero.badge2": "భారతదేశం అంతటా ఫాస్ట్ డెలివరీ",
    "trust.promise": "హస్తకళల ప్రమాణం",
    "trust.title": "శ్రద్ధతో తయారు చేసి, గర్వంగా పంపిణీ",
    "trust.subtitle": "మూడు సాధారణ దశల్లో భారతీయ సాంప్రదాయ చేనేత నైపుణ్యాన్ని అనుభవించండి.",
    "trust.step1Title": "పరిమిత సంఖ్యలో చేతిపని",
    "trust.step1Badge": "సహజమైనది & మన్నికైనది",
    "trust.step1Desc": "ప్రతి బ్యాగ్ మరియు పౌచ్ అమ్మ స్వయంగా గట్టి ఫ్రెంచ్ కుట్లతో కుడుతుంది.",
    "trust.step2Title": "డైరెక్ట్ UPI మరియు కార్డు చెల్లింపు",
    "trust.step2Badge": "తక్షణం & సురక్షితం",
    "trust.step2Desc": "Google Pay, PhonePe, Paytm లేదా కార్డుల ద్వారా సురక్షితంగా చెల్లించండి.",
    "trust.step3Title": "దేశవ్యాప్తంగా సురక్షిత షిప్పింగ్",
    "trust.step3Badge": "మీ ఇంటి వద్దకే",
    "trust.step3Desc": "పర్యావరణ అనుకూల ప్యాకింగ్ మరియు కృతజ్ఞతా లేఖతో పంపబడుతుంది.",
    "catalog.badge": "కళాత్మక కలెక్షన్",
    "catalog.title": "అమ్మ చేతిపనుల వస్తువులు",
    "catalog.subtitle": "స్వచ్ఛమైన కాటన్ మరియు బలమైన కుట్లతో తయారైన బ్యాగులు.",
    "catalog.showing": "చూపిస్తోంది",
    "catalog.designs": "చేతితో చేసిన డిజైన్లు",
    "catalog.catAll": "అన్నీ",
    "catalog.catHandbags": "హ్యాండ్‌బ్యాగులు",
    "catalog.catMiniBags": "మినీ బ్యాగులు",
    "catalog.catPouches": "పౌచులు",
    "catalog.catAccessories": "యాక్సెసరీలు",
    "catalog.addToCart": "కార్ట్‌కు జోడించండి",
    "catalog.inCart": "కార్ట్‌లో ఉంది",
    "catalog.buyNow": "ఇప్పుడే కొనండి",
    "catalog.inStock": "స్టాక్‌లో ఉంది",
    "catalog.price": "ధర (పన్నులతో సహా)",
    "catalog.save": "ఆదా",
    "catalog.fabric": "వస్త్రం:",
    "catalog.dimensions": "కొలతలు:",
    "catalog.delivery": "డెలివరీ ఛార్జీ ₹40",
    "cart.title": "షాపింగ్ కార్ట్",
    "cart.priceDetails": "ధర వివరాలు",
    "cart.subtotal": "ఉప మొత్తం",
    "cart.deliveryFee": "డెలివరీ ఛార్జీలు",
    "cart.total": "మొత్తం ధర",
    "cart.proceed": "కొనుగోలుకు కొనసాగండి",
    "cart.empty": "మీ షాపింగ్ కార్ట్ ప్రస్తుతం ఖాళీగా ఉంది",
    "cart.savings": "మీరు ఈ ఆర్డర్‌పై ఆదా చేస్తున్నారు",
  },
  KN: {
    "nav.greeting": "ನಮಸ್ಕಾರ, ಮಾಮ್ಸ್ ಸ್ಟುಡಿಯೋ",
    "nav.account": "ಖಾತೆ ಮತ್ತು ಪಟ್ಟಿಗಳು",
    "nav.cart": "ಕಾರ್ಟ್",
    "nav.orders": "ನಿಮ್ಮ ಆರ್ಡರ್ ಮತ್ತು ಟ್ರ್ಯಾಕಿಂಗ್",
    "nav.shoppingCart": "ನಿಮ್ಮ ಶಾಪಿಂಗ್ ಕಾರ್ಟ್",
    "nav.allBags": "ಎಲ್ಲಾ ಕೈಯಿಂದ ಹೊಲಿದ ಬ್ಯಾಗ್‌ಗಳು",
    "nav.whatsapp": "ಗ್ರಾಹಕ ಸೇವೆ ವಾಟ್ಸಾಪ್",
    "nav.langTitle": "ಭಾಷಾ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    "nav.langSelect": "ಶಾಪಿಂಗ್‌ಗಾಗಿ ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:",
    "nav.shoppingRegion": "ನೀವು ShreyaCraftNest.in ನಲ್ಲಿ ಶಾಪಿಂಗ್ ಮಾಡುತ್ತಿದ್ದೀರಿ",
    "hero.badge": "ಅಮ್ಮನ ಕರಕುಶಲ ಸಂಗ್ರಹ",
    "hero.headlineStart": "ಕೈಯಿಂದ ಹೊಲಿದ ಬ್ಯಾಗ್‌ಗಳು, ಪೌಚ್‌ಗಳು ಮತ್ತು ಪರಿಕರಗಳು",
    "hero.headlineItalic": "ಅಮ್ಮನ ಪ್ರೀತಿಯಿಂದ ತಯಾರಿಸಲ್ಪಟ್ಟಿದೆ",
    "hero.welcome": "ಸುಸ್ವಾಗತ",
    "hero.brand": "ಶ್ರೇಯಾ ಕ್ರಾಫ್ಟ್ಸ್ ನೆಸ್ಟ್‌ಗೆ",
    "hero.desc": "ನಮ್ಮ ಹೋಮ್ ಸ್ಟುಡಿಯೋದಲ್ಲಿ ಪ್ರತಿ ಹೊಲಿಗೆಯನ್ನು ಶುದ್ಧ ಹತ್ತಿ ಬಟ್ಟೆ ಮತ್ತು ನೈಸರ್ಗಿಕ ದಾರಗಳಿಂದ ಪ್ರೀತಿಯಿಂದ ಹೊಲಿಯಲಾಗುತ್ತದೆ. ಯಾವುದೇ ಫ್ಯಾಕ್ಟರಿ ತಂತ್ರಗಳಿಲ್ಲ—ಕೇವಲ ಅಮ್ಮನ ಪ್ರೀತಿ ಮತ್ತು ಬಲವಾದ ಹೊಲಿಗೆ.",
    "hero.bullet1": "ಬಲವಾದ ಫ್ರೆಂಚ್ ಹೊಲಿಗೆ",
    "hero.bullet2": "ಪ್ಲಾಸ್ಟಿಕ್ ಮುಕ್ತ ಪ್ಯಾಕೇಜಿಂಗ್",
    "hero.bullet3": "ತ್ವರಿತ UPI ಪಾವತಿ",
    "hero.cta": "ಕಲೆಕ್ಷನ್ ವೀಕ್ಷಿಸಿ",
    "hero.badge1": "ಕೈಯಿಂದ ಹೊಲಿದ ವಿನ್ಯಾಸ",
    "hero.badge2": "ಭಾರತದಾದ್ಯಂತ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ವಿತರಣೆ",
    "trust.promise": "ಕರಕುಶಲ ಭರವಸೆ",
    "trust.title": "ಪ್ರೀತಿಯಿಂದ ನಿರ್ಮಿಸಿ, ಹೆಮ್ಮೆಯಿಂದ ತಲುಪಿಸುತ್ತೇವೆ",
    "trust.subtitle": "ಮೂರು ಸರಳ ಹಂತಗಳಲ್ಲಿ ಭಾರತೀಯ ಸಾಂಪ್ರದಾಯಿಕ ಬಟ್ಟೆ ಕರಕುಶಲತೆಯನ್ನು ಅನುಭವಿಸಿ.",
    "trust.step1Title": "ಕಡಿಮೆ ಪ್ರಮಾಣದಲ್ಲಿ ಕೈಯಿಂದ ತಯಾರಿಕೆ",
    "trust.step1Badge": "ನೈಸರ್ಗಿಕ & ಬಾಳಿಕೆ ಬರುವಂತದ್ದು",
    "trust.step1Desc": "ಪ್ರತಿ ಬ್ಯಾಗ್ ಮತ್ತು ಪೌಚ್ ಅನ್ನು ಅಮ್ಮ ಸ್ವತಃ ಗಟ್ಟಿಯಾದ ಫ್ರೆಂಚ್ ಹೊಲಿಗೆಯೊಂದಿಗೆ ಸಿದ್ಧಪಡಿಸುತ್ತಾರೆ.",
    "trust.step2Title": "ನೇರ UPI ಮತ್ತು ಕಾರ್ಡ್ ಪಾವತಿ",
    "trust.step2Badge": "ತಕ್ಷಣ & ಸುರಕ್ಷಿತ",
    "trust.step2Desc": "Google Pay, PhonePe, Paytm ಅಥವಾ ಕಾರ್ಡ್ ಮೂಲಕ ಸುರಕ್ಷಿತವಾಗಿ ಪಾವತಿಸಿ.",
    "trust.step3Title": "ಭಾರತದಾದ್ಯಂತ ಸುರಕ್ಷಿತ ವಿತರಣೆ",
    "trust.step3Badge": "ನಿಮ್ಮ ಮನೆ ಬಾಗಿಲಿಗೆ",
    "trust.step3Desc": "ಪರಿಸರಸ್ನೇಹಿ ಬಟರ್ ಪೇಪರ್ ಪ್ಯಾಕಿಂಗ್ ಮತ್ತು ಧನ್ಯವಾದ ಪತ್ರದೊಂದಿಗೆ ಕಳುಹಿಸಲಾಗುತ್ತದೆ.",
    "catalog.badge": "ಕರಕುಶಲ ಕಲೆಕ್ಷನ್",
    "catalog.title": "ಅಮ್ಮ ಕೈಯಿಂದ ಹೊಲಿದ ಉತ್ಪನ್ನಗಳು",
    "catalog.subtitle": "ಶುದ್ಧ ಹತ್ತಿ ಬಟ್ಟೆ ಮತ್ತು ಗಟ್ಟಿಮುಟ್ಟಾದ ಹೊಲಿಗೆಯಿಂದ ತಯಾರಿಸಿದ ಬ್ಯಾಗ್‌ಗಳು.",
    "catalog.showing": "ತೋರಿಸಲಾಗುತ್ತಿದೆ",
    "catalog.designs": "ಕರಕುಶಲ ವಿನ್ಯಾಸಗಳು",
    "catalog.catAll": "ಎಲ್ಲವೂ",
    "catalog.catHandbags": "ಹ್ಯಾಂಡ್‌ಬ್ಯಾಗ್‌ಗಳು",
    "catalog.catMiniBags": "ಮಿನಿ ಬ್ಯಾಗ್‌ಗಳು",
    "catalog.catPouches": "ಪೌಚ್‌ಗಳು",
    "catalog.catAccessories": "ಪರಿಕರಗಳು",
    "catalog.addToCart": "ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ",
    "catalog.inCart": "ಕಾರ್ಟ್‌ನಲ್ಲಿದೆ",
    "catalog.buyNow": "ಈಗಲೇ ಖರೀದಿಸಿ",
    "catalog.inStock": "ಸ್ಟಾಕ್‌ನಲ್ಲಿದೆ",
    "catalog.price": "ಬೆಲೆ (ತೆರಿಗೆ ಸಹಿತ)",
    "catalog.save": "ಉಳಿತಾಯ",
    "catalog.fabric": "ಬಟ್ಟೆ:",
    "catalog.dimensions": "ಅಳತೆ:",
    "catalog.delivery": "ವಿತರಣಾ ಶುಲ್ಕ ₹40",
    "cart.title": "ಶಾಪಿಂಗ್ ಕಾರ್ಟ್",
    "cart.priceDetails": "ಬೆಲೆ ವಿವರಗಳು",
    "cart.subtotal": "ಉಪಮೊತ್ತ",
    "cart.deliveryFee": "ವಿತರಣಾ ಶುಲ್ಕ",
    "cart.total": "ಒಟ್ಟು ಮೊತ್ತ",
    "cart.proceed": "ಖರೀದಿಗೆ ಮುಂದುವರಿಯಿರಿ",
    "cart.empty": "ನಿಮ್ಮ ಶಾಪಿಂಗ್ ಕಾರ್ಟ್ ಪ್ರಸ್ತುತ ಖಾಲಿಯಾಗಿದೆ",
    "cart.savings": "ನೀವು ಈ ಆರ್ಡರ್‌ನಲ್ಲಿ ಉಳಿಸುತ್ತಿದ್ದೀರಿ",
  },
  ML: {
    "nav.greeting": "നമസ്കാരം, മോംസ് സ്റ്റുഡിയോ",
    "nav.account": "അക്കൗണ്ട് & ലിസ്റ്റുകൾ",
    "nav.cart": "കാർട്ട്",
    "nav.orders": "ഓർഡറുകളും ട്രാക്കിംഗും",
    "nav.shoppingCart": "ഷോപ്പിംഗ് കാർട്ട്",
    "nav.allBags": "കൈകൊണ്ട് തുന്നിയ ബാഗുകൾ",
    "nav.whatsapp": "കസ്റ്റമർ കെയർ വാട്സാപ്പ്",
    "nav.langTitle": "ഭാഷാ ക്രമീകരണങ്ങൾ",
    "nav.langSelect": "ഷോപ്പിംഗിനായി നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക:",
    "nav.shoppingRegion": "നിങ്ങൾ ShreyaCraftNest.in-ൽ ഷോപ്പിംഗ് ചെയ്യുന്നു",
    "hero.badge": "അമ്മയുടെ കരകൗശല ശേഖരം",
    "hero.headlineStart": "മനോഹരമായ ബാഗുകൾ, പൗച്ചുകൾ & ആക്സസറികൾ",
    "hero.headlineItalic": "അമ്മയുടെ സ്നേഹത്തിൽ തുന്നിയത്",
    "hero.welcome": "സ്വാഗതം",
    "hero.brand": "ശ്രേയ ക്രാഫ്റ്റ്സ് നെസ്റ്റിലേക്ക്",
    "hero.desc": "ഞങ്ങളുടെ ഹോം സ്റ്റുഡിയോയിൽ ഓരോ തയ്യലും ശുദ്ധമായ പരുത്തി തുണിയിൽ സ്നേഹത്തോടെ തുന്നുന്നു. ഫാക്ടറി കുറുക്കുവഴികളില്ല—അമ്മയുടെ സ്നേഹവും ഈടുമുള്ള തയ്യലും മാത്രം.",
    "hero.bullet1": "ഈടുനിൽക്കുന്ന ഫ്രഞ്ച് തയ്യൽ",
    "hero.bullet2": "പ്ലാസ്റ്റിക് രഹിത പാക്കിംഗ്",
    "hero.bullet3": "തൽക്ഷണ UPI പേയ്‌മെന്റ്",
    "hero.cta": "ശേഖരം കാണുക",
    "hero.badge1": "കൈത്തയ്യൽ കല",
    "hero.badge2": "ഇന്ത്യയിലുടനീളം എക്സ്പ്രസ്സ് ഡെലിവറി",
    "trust.promise": "കരകൗശല വാഗ്ദാനം",
    "trust.title": "സ്നേഹത്തോടെ നിർമ്മിച്ച്, ആദരവോടെ എത്തിക്കുന്നു",
    "trust.subtitle": "പരമ്പരാഗത ഇന്ത്യൻ തുണിത്തരങ്ങളുടെ ഗുണമേന്മ അനുഭവിച്ചറിയൂ.",
    "trust.step1Title": "ചെറിയ ബാച്ചുകളിൽ കൈകൊണ്ട് ഉണ്ടാക്കിയത്",
    "trust.step1Badge": "പ്രകൃതിദത്തം & ഈടുനിൽക്കുന്നത്",
    "trust.step1Desc": "ഓരോ ബാഗും പൗച്ചും അമ്മ സ്വന്തം കൈകൊണ്ട് ശക്തമായ ഫ്രഞ്ച് തയ്യലിൽ നിർമ്മിക്കുന്നു.",
    "trust.step2Title": "നേരിട്ടുള്ള UPI & കാർഡ് പേയ്‌മെന്റ്",
    "trust.step2Badge": "സുരക്ഷിതം & വേഗത്തിൽ",
    "trust.step2Desc": "Google Pay, PhonePe, Paytm അല്ലെങ്കിൽ കാർഡ് വഴി സുരക്ഷിതമായി പണമടയ്ക്കാം.",
    "trust.step3Title": "ഇന്ത്യയിലുടനീളം സുരക്ഷിത ഷിപ്പിംഗ്",
    "trust.step3Badge": "നിങ്ങളുടെ വീട്ടുപടിക്കൽ",
    "trust.step3Desc": "പരിസ്ഥിതി സൗഹൃദ പാക്കിംഗിലും നന്ദി കുറിപ്പിലും പൊതിഞ്ഞ് എത്തിക്കുന്നു.",
    "catalog.badge": "കരകൗശല ശേഖരം",
    "catalog.title": "അമ്മ തുന്നിയ ഉൽപ്പന്നങ്ങൾ",
    "catalog.subtitle": "ശുദ്ധമായ പരുത്തി തുണിയും ഉറപ്പുള്ള തയ്യലും ചേർന്ന ഉൽപ്പന്നങ്ങൾ.",
    "catalog.showing": "കാണിക്കുന്നത്",
    "catalog.designs": "കൈത്തറി ഡിസൈനുകൾ",
    "catalog.catAll": "എല്ലാം",
    "catalog.catHandbags": "ഹാൻഡ്ബാഗുകൾ",
    "catalog.catMiniBags": "മിനി ബാഗുകൾ",
    "catalog.catPouches": "പൗച്ചുകൾ",
    "catalog.catAccessories": "ആക്സസറികൾ",
    "catalog.addToCart": "കാർട്ടിലേക്ക് ചേർക്കുക",
    "catalog.inCart": "കാർട്ടിലുണ്ട്",
    "catalog.buyNow": "ഇപ്പോൾ വാങ്ങുക",
    "catalog.inStock": "സ്റ്റോക്കിലുണ്ട്",
    "catalog.price": "വില (നികുതി ഉൾപ്പെടെ)",
    "catalog.save": "ലാഭം",
    "catalog.fabric": "തുണി:",
    "catalog.dimensions": "അളവുകൾ:",
    "catalog.delivery": "ഡെലിവറി നിരക്ക് ₹40",
    "cart.title": "ഷോപ്പിംഗ് കാർട്ട്",
    "cart.priceDetails": "വില വിവരങ്ങൾ",
    "cart.subtotal": "ഉപതുക",
    "cart.deliveryFee": "ഡെലിവറി ചാർജ്ജ്",
    "cart.total": "ആകെ തുക",
    "cart.proceed": "വാങ്ങാൻ തുടരുക",
    "cart.empty": "നിങ്ങളുടെ ഷോപ്പിംഗ് കാർട്ട് കാലിയാണ്",
    "cart.savings": "നിങ്ങൾ ഈ ഓർഡറിൽ ലാഭിക്കുന്നു",
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  currentOption: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("EN");

  // Sync on mount from localStorage or cookie
  useEffect(() => {
    try {
      const saved = localStorage.getItem("scn_language") as LanguageCode;
      if (saved && TRANSLATIONS[saved]) {
        setLanguageState(saved);
        applyGoogleTranslate(saved.toLowerCase());
      }
    } catch {
      // ignore
    }
  }, []);

  const applyGoogleTranslate = (langCode: string) => {
    try {
      // Set the Google Translate cookie
      const val = `/en/${langCode}`;
      document.cookie = `googtrans=${val}; path=/;`;
      if (window.location.hostname !== "localhost") {
        document.cookie = `googtrans=${val}; domain=.${window.location.hostname}; path=/;`;
      }

      // If Google Translate dropdown exists in DOM, trigger it
      const select = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event("change"));
      }
    } catch (e) {
      console.warn("Could not apply Google Translate cookie", e);
    }
  };

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("scn_language", lang);
      applyGoogleTranslate(lang.toLowerCase());
    } catch {
      // ignore
    }
  };

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.EN;
    return langDict[key] || TRANSLATIONS.EN[key] || key;
  };

  const currentOption =
    LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentOption,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
