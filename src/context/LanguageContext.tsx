"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type LanguageCode = "EN" | "HI" | "MR" | "BN" | "TA" | "TE" | "KN" | "ML";

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "EN", name: "English", nativeName: "English" },
  { code: "HI", name: "Hindi", nativeName: "हिन्दी" },
  { code: "MR", name: "Marathi", nativeName: "मराठी" },
  { code: "BN", name: "Bengali", nativeName: "বাংলা" },
  { code: "TA", name: "Tamil", nativeName: "தமிழ்" },
  { code: "TE", name: "Telugu", nativeName: "తెలుగు" },
  { code: "KN", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ML", name: "Malayalam", nativeName: "മലയാളം" },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  EN: {
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
    "nav.region": "Change Country/Region: India 🇮🇳",
    "hero.badge": "100% Hand-Stitched by Mom • Small Batch Goods",
    "hero.title": "Handcrafted Textile Creations by Mom",
    "hero.subtitle": "Delicately quilted pouches, artisanal shoulder bags & cotton totes crafted at home with precision needlework and love.",
    "catalog.title": "Mom's Handcrafted Collection",
    "catalog.subtitle": "Pure cotton textiles, quilted linings, and artisanal block-print accents.",
    "catalog.addToCart": "Add to Cart",
    "catalog.inCart": "in Cart",
    "catalog.inStock": "In Stock",
    "catalog.delivery": "Delivery ₹40 Pan-India",
    "cart.title": "Shopping Cart",
    "cart.priceDetails": "PRICE DETAILS",
    "cart.subtotal": "Subtotal",
    "cart.deliveryFee": "Delivery Charges",
    "cart.total": "Total Amount",
    "cart.proceed": "Proceed to Buy",
    "cart.savings": "You are saving on this artisanal order",
    "trust.handcrafted": "100% Hand-Stitched",
    "trust.cotton": "Pure Cotton Fabric",
    "trust.delivery": "Safe Pan-India Delivery",
    "trust.payment": "COD & Secure UPI",
  },
  HI: {
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
    "nav.region": "देश/क्षेत्र: भारत 🇮🇳",
    "hero.badge": "माँ द्वारा 100% हाथ से सिला गया • सीमित स्टॉक",
    "hero.title": "माँ द्वारा प्यार से बनाए गए सुंदर बैग और पाउच",
    "hero.subtitle": "बारीक हाथ की सिलाई और शुद्ध सूती कपड़े से घर पर तैयार किए गए डिज़ाइनर पर्स और टोट बैग।",
    "catalog.title": "माँ का हस्तनिर्मित संग्रह",
    "catalog.subtitle": "शुद्ध सूती कपड़ा, क्विल्टेड अस्तर और हाथ की बारीक कारीगरी।",
    "catalog.addToCart": "कार्ट में जोड़ें",
    "catalog.inCart": "कार्ट में",
    "catalog.inStock": "स्टॉक में उपलब्ध",
    "catalog.delivery": "डिलीवरी ₹40 पूरे भारत में",
    "cart.title": "शॉपिंग कार्ट",
    "cart.priceDetails": "मूल्य विवरण",
    "cart.subtotal": "उप-कुल",
    "cart.deliveryFee": "डिलीवरी शुल्क",
    "cart.total": "कुल राशि",
    "cart.proceed": "खरीदारी जारी रखें",
    "cart.savings": "आप इस हस्तनिर्मित ऑर्डर पर बचत कर रहे हैं",
    "trust.handcrafted": "माँ द्वारा हाथ से सिला",
    "trust.cotton": "शुद्ध सूती वस्त्र",
    "trust.delivery": "सुरक्षित देशव्यापी डिलीवरी",
    "trust.payment": "कैश ऑन डिलीवरी व यूपीआई",
  },
  MR: {
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
    "nav.region": "देश/प्रदेश: भारत 🇮🇳",
    "hero.badge": "आईने हाताने शिवलेले • मर्यादित स्टॉक",
    "hero.title": "आईने प्रेमाने तयार केलेल्या हस्तकलेच्या वस्तू",
    "hero.subtitle": "शुद्ध कॉटन फॅब्रिक आणि घरगुती सुईकामातून साकारलेले डिझायनर पाउच आणि बॅग्ज.",
    "catalog.title": "आईचा हस्तनिर्मित संग्रह",
    "catalog.subtitle": "शुद्ध सुती कपडे, क्विल्टेड अस्तर आणि पारंपरिक कारागिरी.",
    "catalog.addToCart": "कार्टमध्ये जोडा",
    "catalog.inCart": "कार्टमध्ये",
    "catalog.inStock": "स्टॉकमध्ये उपलब्ध",
    "catalog.delivery": "डिलिव्हरी शुल्क ₹40",
    "cart.title": "शॉपिंग कार्ट",
    "cart.priceDetails": "किंमत तपशील",
    "cart.subtotal": "उप-एकूण",
    "cart.deliveryFee": "डिलिव्हरी शुल्क",
    "cart.total": "एकूण रक्कम",
    "cart.proceed": "खरेदीसाठी पुढे जा",
    "cart.savings": "तुम्ही या ऑर्डरवर बचत करत आहात",
    "trust.handcrafted": "100% हाताने शिवलेले",
    "trust.cotton": "शुद्ध कॉटन फॅब्रिक",
    "trust.delivery": "सुरक्षित डिलिव्हरी",
    "trust.payment": "कॅश ऑन डिलिव्हरी व UPI",
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
    "nav.region": "দেশ/অঞ্চল: ভারত 🇮🇳",
    "hero.badge": "মায়ের হাতে তৈরি • সীমিত সংগ্রহ",
    "hero.title": "মায়ের হাতে তৈরি সুন্দর ব্যাগ ও পাউচ",
    "hero.subtitle": "বিশুদ্ধ সুতির কাপড় ও নিখুঁত সেলাইয়ে ঘরে তৈরি ব্যাগ।",
    "catalog.title": "হস্তনির্মিত কালেকশন",
    "catalog.subtitle": "খাঁটি সুতির বস্ত্র ও ঐতিহ্যবাহী কারুকাজ।",
    "catalog.addToCart": "কার্টে যোগ করুন",
    "catalog.inCart": "কার্টে আছে",
    "catalog.inStock": "স্টকে আছে",
    "catalog.delivery": "ডেলিভারি ₹40 সারা ভারতে",
    "cart.title": "শপিং কার্ট",
    "cart.priceDetails": "মূল্য বিবরণ",
    "cart.subtotal": "সাবটোটাল",
    "cart.deliveryFee": "ডেলিভারি চার্জ",
    "cart.total": "মোট মূল্য",
    "cart.proceed": "এগিয়ে যান",
    "cart.savings": "আপনি এই অর্ডারে সাশ্রয় করছেন",
    "trust.handcrafted": "100% হাতে সেলাই করা",
    "trust.cotton": "খাঁটি সুতি",
    "trust.delivery": "নিরাপদ ডেলিভারি",
    "trust.payment": "ক্যাশ অন ডেলিভারি ও UPI",
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
    "nav.langSelect": "ஷாப்பிங் செய்ய உங்களுக்கு விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்:",
    "nav.shoppingRegion": "நீங்கள் ShreyaCraftNest.in இல் ஷாப்பிங் செய்கிறீர்கள்",
    "nav.region": "நாடு/பகுதி: இந்தியா 🇮🇳",
    "hero.badge": "அம்மாவின் கைவண்ணத்தில் தைக்கப்பட்டது",
    "hero.title": "அம்மாவால் அன்போடு தைக்கப்பட்ட அழகிய பைகள்",
    "hero.subtitle": "தூய பருத்தி துணியில் கைவினையால் உருவாக்கப்பட்ட கைப்பைகள்.",
    "catalog.title": "கைவினை தொகுப்பு",
    "catalog.subtitle": "பாரம்பரிய கைவேலைப்பாடு நிறைந்த பைகள்.",
    "catalog.addToCart": "கார்ட்டில் சேர்",
    "catalog.inCart": "கார்ட்டில் உள்ளது",
    "catalog.inStock": "இருப்பில் உள்ளது",
    "catalog.delivery": "டெலிவரி ₹40 இந்தியா முழுவதும்",
    "cart.title": "ஷாப்பிங் கார்ட்",
    "cart.priceDetails": "விலை விவரங்கள்",
    "cart.subtotal": "துணை மொத்தம்",
    "cart.deliveryFee": "டெலிவரி கட்டணம்",
    "cart.total": "மொத்த தொகை",
    "cart.proceed": "தொடரவும்",
    "cart.savings": "இந்த ஆர்டரில் நீங்கள் சேமிக்கிறீர்கள்",
    "trust.handcrafted": "100% கைவினை தையல்",
    "trust.cotton": "தூய பருத்தி",
    "trust.delivery": "பாதுகாப்பான டெலிவரி",
    "trust.payment": "COD மற்றும் UPI",
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
    "nav.langSelect": "షాపింగ్ కోసం మీ ప్రాధాన్యత భాషను ఎంచుకోండి:",
    "nav.shoppingRegion": "మీరు ShreyaCraftNest.in లో షాపింగ్ చేస్తున్నారు",
    "nav.region": "దేశం/ప్రాంతం: భారతదేశం 🇮🇳",
    "hero.badge": "అమ్మ చేతి కుట్టుతో తయారు చేయబడింది",
    "hero.title": "అమ్మ ప్రేమతో కుట్టిన చేతిపనుల బ్యాగులు",
    "hero.subtitle": "స్వచ్ఛమైన కాటన్ వస్త్రంతో తయారు చేసిన బ్యాగులు.",
    "catalog.title": "చేతిపనుల కలెక్షన్",
    "catalog.subtitle": "మన్నికైన కాటన్ మెటీరియల్.",
    "catalog.addToCart": "కార్ట్‌కు జోడించండి",
    "catalog.inCart": "కార్ట్‌లో ఉంది",
    "catalog.inStock": "స్టాక్‌లో ఉంది",
    "catalog.delivery": "డెలివరీ ఛార్జీ ₹40",
    "cart.title": "షాపింగ్ కార్ట్",
    "cart.priceDetails": "ధర వివరాలు",
    "cart.subtotal": "ఉప మొత్తం",
    "cart.deliveryFee": "డెలివరీ ఛార్జీలు",
    "cart.total": "మొత్తం ధర",
    "cart.proceed": "కొనుగోలుకు కొనసాగండి",
    "cart.savings": "మీరు ఈ ఆర్డర్‌పై ఆదా చేస్తున్నారు",
    "trust.handcrafted": "100% చేతితో కుట్టినది",
    "trust.cotton": "స్వచ్ఛమైన కాటన్",
    "trust.delivery": "సురక్షిత డెలివరీ",
    "trust.payment": "క్యాష్ ఆన్ డెలివరీ & UPI",
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
    "nav.region": "ದೇಶ/ಪ್ರದೇಶ: ಭಾರತ 🇮🇳",
    "hero.badge": "ಅಮ್ಮನ ಕೈಯಿಂದ ಹೊಲಿದದ್ದು • ಸೀಮಿತ ಸ್ಟಾಕ್",
    "hero.title": "ಅಮ್ಮನ ಪ್ರೀತಿಯಿಂದ ತಯಾರಿಸಿದ ಕೈಚಳಕದ ಬ್ಯಾಗ್‌ಗಳು",
    "hero.subtitle": "ಶುದ್ಧ ಹತ್ತಿ ಬಟ್ಟೆಯಿಂದ ಮನೆಯಲ್ಲೇ ಹೊಲಿದ ಸುಂದರ ಪೌಚ್‌ಗಳು.",
    "catalog.title": "ಕರಕುಶಲ ಸಂಗ್ರಹ",
    "catalog.subtitle": "ಶುದ್ಧ ಹತ್ತಿ ಮತ್ತು ನೈಸರ್ಗಿಕ ವಿನ್ಯಾಸ.",
    "catalog.addToCart": "ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ",
    "catalog.inCart": "ಕಾರ್ಟ್‌ನಲ್ಲಿದೆ",
    "catalog.inStock": "ಸ್ಟಾಕ್‌ನಲ್ಲಿದೆ",
    "catalog.delivery": "ವಿತರಣಾ ಶುಲ್ಕ ₹40",
    "cart.title": "ಶಾಪಿಂಗ್ ಕಾರ್ಟ್",
    "cart.priceDetails": "ಬೆಲೆ ವಿವರಗಳು",
    "cart.subtotal": "ಉಪಮೊತ್ತ",
    "cart.deliveryFee": "ವಿತರಣಾ ಶುಲ್ಕ",
    "cart.total": "ಒಟ್ಟು ಮೊತ್ತ",
    "cart.proceed": "ಖರೀದಿಗೆ ಮುಂದುವರಿಯಿರಿ",
    "cart.savings": "ನೀವು ಈ ಆರ್ಡರ್‌ನಲ್ಲಿ ಉಳಿಸುತ್ತಿದ್ದೀರಿ",
    "trust.handcrafted": "100% ಕೈಯಿಂದ ಹೊಲಿದದ್ದು",
    "trust.cotton": "ಶುದ್ಧ ಹತ್ತಿ",
    "trust.delivery": "ಸುರಕ್ಷಿತ ವಿತರಣೆ",
    "trust.payment": "ಕ್ಯಾಶ್ ಆನ್ ಡೆಲಿವರಿ ಮತ್ತು UPI",
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
    "nav.region": "രാജ്യം/പ്രദേശം: ഇന്ത്യ 🇮🇳",
    "hero.badge": "അമ്മ സ്നേഹത്തോടെ തുന്നിയത്",
    "hero.title": "അമ്മയുടെ സ്നേഹത്തിൽ പിറന്ന മനോഹരമായ ബാഗുകൾ",
    "hero.subtitle": "ശുദ്ധമായ കോട്ടൺ തുണിയിൽ തുന്നിയ പൗച്ചുകളും ബാഗുകളും.",
    "catalog.title": "കരകൗശല ശേഖരം",
    "catalog.subtitle": "ശുദ്ധമായ പരുത്തിയും ഡിസൈനർ പണികളും.",
    "catalog.addToCart": "കാർട്ടിലേക്ക് ചേർക്കുക",
    "catalog.inCart": "കാർട്ടിലുണ്ട്",
    "catalog.inStock": "സ്റ്റോക്കിലുണ്ട്",
    "catalog.delivery": "ഡെലിവറി നിരക്ക് ₹40",
    "cart.title": "ഷോപ്പിംഗ് കാർട്ട്",
    "cart.priceDetails": "വില വിവരങ്ങൾ",
    "cart.subtotal": "ഉപതുക",
    "cart.deliveryFee": "ഡെലിവറി ചാർജ്ജ്",
    "cart.total": "ആകെ തുക",
    "cart.proceed": "വാങ്ങാൻ തുടരുക",
    "cart.savings": "നിങ്ങൾ ഈ ഓർഡറിൽ ലാഭിക്കുന്നു",
    "trust.handcrafted": "100% കൈകൊണ്ട് തുന്നിയത്",
    "trust.cotton": "ശുദ്ധമായ പരുത്തി",
    "trust.delivery": "സുരക്ഷിത ഡെലിവറി",
    "trust.payment": "ക്യാഷ് ഓൺ ഡെലിവറി & UPI",
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

  useEffect(() => {
    try {
      const saved = localStorage.getItem("scn_language") as LanguageCode;
      if (saved && TRANSLATIONS[saved]) {
        setLanguageState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("scn_language", lang);
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
