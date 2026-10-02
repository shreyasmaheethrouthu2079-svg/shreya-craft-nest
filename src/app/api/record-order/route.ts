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
      items,
      customer,
    } = body;

    if (!customer || !customer.fullName || !customer.phone) {
      return NextResponse.json(
        { error: "Missing required customer shipping information" },
        { status: 400 }
      );
    }

    const orderItems: Array<{
      id: string;
      name: string;
      category: string;
      price: number;
      quantity: number;
    }> = [];
    let calculatedTotal = 0;

    if (items && Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        const prod = getProductById(item.productId || item.id);
        if (prod) {
          const qty = item.quantity && item.quantity > 0 ? item.quantity : 1;
          orderItems.push({
            id: prod.id,
            name: prod.name,
            category: prod.category,
            price: prod.price,
            quantity: qty,
          });
          calculatedTotal += prod.price * qty;
        }
      }
    } else if (productId) {
      const prod = getProductById(productId);
      if (prod) {
        orderItems.push({
          id: prod.id,
          name: prod.name,
          category: prod.category,
          price: prod.price,
          quantity: 1,
        });
        calculatedTotal = prod.price;
      }
    }

    if (orderItems.length === 0) {
      return NextResponse.json(
        { error: "No valid products found for this order" },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const isDemoOrder =
      !keySecret ||
      keySecret.includes("YOUR_") ||
      (razorpay_order_id && razorpay_order_id.startsWith("order_demo_"));

    let isSignatureValid = false;

    if (isDemoOrder) {
      isSignatureValid = true;
    } else {
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
      items: orderItems,
      totalAmountPaid: calculatedTotal,
      currency: "INR",
      paymentMethod: isDemoOrder ? "UPI / Test Mode" : "Razorpay Verified UPI/Card",
      status: "CONFIRMED",
      createdAt: new Date().toISOString(),
    };

    console.log("=== NEW VERIFIED ORDER RECORDED ===");
    console.log(JSON.stringify(orderRecord, null, 2));

    // Optional Google Sheets Webhook Integration
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    let sheetSyncStatus = "not_configured";

    const itemsSummary = orderItems
      .map((item) => `${item.name} (Qty: ${item.quantity})`)
      .join(", ");

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
            productName: itemsSummary,
            category: orderItems.map((i) => i.category).join(", "),
            totalAmount: orderRecord.totalAmountPaid,
            paymentStatus: orderRecord.status,
          }),
        });

        sheetSyncStatus = sheetResponse.ok ? "synced_successfully" : "sync_failed";
      } catch (err: any) {
        console.error("Google Sheets webhook dispatch failed:", err.message);
        sheetSyncStatus = "network_error";
      }
    }

    // Direct WhatsApp message builder for the maker
    const itemsListForWA = orderItems
      .map((item) => `• ${item.name} x${item.quantity} (₹${item.price * item.quantity})`)
      .join("\n");

    const waText = encodeURIComponent(
      `Hello Shreya Craft Nest! 🧵\nI just placed an order for:\n${itemsListForWA}\n\n*Total Amount:* ₹${calculatedTotal} (Free Shipping)\n*Order ID:* ${orderRecord.orderId}\n*Name:* ${customer.fullName}\n*Address:* ${customer.address}, ${customer.city} - ${customer.pincode}\n*Contact:* ${customer.phone}\n\nPlease confirm dispatch timeline. Thank you!`
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
