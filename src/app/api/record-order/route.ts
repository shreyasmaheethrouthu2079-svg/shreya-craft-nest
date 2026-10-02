import { NextResponse } from "next/server";
import crypto from "crypto";
import { getProductById } from "@/data/products";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      productId,
      customer,
    } = body;

    if (!productId || !customer || !customer.fullName || !customer.phone) {
      return NextResponse.json(
        { error: "Missing required order or customer information" },
        { status: 400 }
      );
    }

    const product = getProductById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const isDemoOrder =
      !keySecret ||
      keySecret.includes("YOUR_") ||
      (razorpay_order_id && razorpay_order_id.startsWith("order_demo_"));

    let isSignatureValid = false;

    if (isDemoOrder) {
      // In demo mode or local testing, simulate verified payment
      isSignatureValid = true;
    } else {
      // Perform strict cryptographic HMAC-SHA256 signature verification
      if (!razorpay_signature || !razorpay_payment_id || !razorpay_order_id) {
        return NextResponse.json(
          { error: "Incomplete payment verification payload" },
          { status: 400 }
        );
      }

      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      isSignatureValid = generatedSignature === razorpay_signature;

      if (!isSignatureValid) {
        return NextResponse.json(
          { error: "Payment signature verification failed. Untrusted request." },
          { status: 400 }
        );
      }
    }

    // Standardized Order Record ready for Google Sheets, CRM, or Database
    const orderRecord = {
      orderId: razorpay_order_id || `demo_${Date.now()}`,
      paymentId: razorpay_payment_id || `pay_simulated_${Date.now()}`,
      verified: isSignatureValid,
      isDemo: isDemoOrder,
      customer: {
        fullName: customer.fullName.trim(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        city: customer.city.trim(),
        pincode: customer.pincode.trim(),
      },
      item: {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        material: product.material,
      },
      amountPaid: product.price,
      currency: "INR",
      paymentMethod: isDemoOrder ? "UPI / Test Mode" : "Razorpay Verified UPI/Card",
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
    };

    console.log("=== NEW VERIFIED ORDER RECORDED ===");
    console.log(JSON.stringify(orderRecord, null, 2));

    // Optional Google Sheets Webhook Integration
    // If GOOGLE_SHEETS_WEBHOOK_URL is provided in .env.local, forward order row
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    let sheetSyncStatus = "not_configured";

    if (webhookUrl && !webhookUrl.includes("YOUR_")) {
      try {
        const sheetResponse = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
            orderId: orderRecord.orderId,
            paymentId: orderRecord.paymentId,
            customerName: orderRecord.customer.fullName,
            phoneNumber: orderRecord.customer.phone,
            deliveryAddress: `${orderRecord.customer.address}, ${orderRecord.customer.city} - ${orderRecord.customer.pincode}`,
            productName: orderRecord.item.name,
            category: orderRecord.item.category,
            totalAmount: orderRecord.amountPaid,
            paymentStatus: orderRecord.status,
          }),
        });

        sheetSyncStatus = sheetResponse.ok ? "synced_successfully" : "sync_failed";
      } catch (err: any) {
        console.error("Google Sheets webhook dispatch failed:", err.message);
        sheetSyncStatus = "network_error";
      }
    }

    // Generate pre-filled WhatsApp message for customer confirmation
    const waText = encodeURIComponent(
      `Hello Shreya Crafts Nest! 🧵\nI just placed an order for *${product.name}* (₹${product.price}).\n\n*Order ID:* ${orderRecord.orderId}\n*Name:* ${customer.fullName}\n*Address:* ${customer.address}, ${customer.city} - ${customer.pincode}\n*Contact:* ${customer.phone}\n\nPlease confirm dispatch timeline. Thank you!`
    );

    const whatsappConfirmationUrl = `https://wa.me/919876543210?text=${waText}`;

    return NextResponse.json({
      success: true,
      message: "Order successfully verified and recorded!",
      order: orderRecord,
      sheetSyncStatus,
      whatsappConfirmationUrl,
    });
  } catch (error: any) {
    console.error("Order recording error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to record order" },
      { status: 500 }
    );
  }
}
