import { NextResponse } from "next/server";
import crypto from "crypto";
import { getProductById } from "@/data/products";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      paymentMethod = "COD",
      upiRefId,
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
    let isSignatureValid = true;

    // Strict HMAC check only if using Razorpay with actual secret
    if (
      paymentMethod === "Razorpay" &&
      keySecret &&
      !keySecret.includes("YOUR_") &&
      razorpay_signature
    ) {
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

    const generatedOrderId =
      razorpay_order_id ||
      `SCN-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    const orderRecord = {
      orderId: generatedOrderId,
      paymentId:
        razorpay_payment_id ||
        (upiRefId ? `UPI-REF-${upiRefId}` : `COD-${Date.now()}`),
      paymentMethod:
        paymentMethod === "COD"
          ? "Cash on Delivery (Pay upon delivery)"
          : paymentMethod === "UPI"
          ? "Direct UPI / QR Code"
          : "Online Cards / Razorpay",
      paymentStatus:
        paymentMethod === "COD"
          ? "PENDING_CASH_ON_DELIVERY"
          : "CONFIRMED_PAID",
      verified: isSignatureValid,
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
      status: "ORDER_CONFIRMED",
      createdAt: new Date().toISOString(),
    };

    console.log("=== NEW VERIFIED ORDER PLACED (NO WHATSAPP REQUIRED) ===");
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
            paymentMethod: orderRecord.paymentMethod,
            customerName: orderRecord.customer.fullName,
            phoneNumber: orderRecord.customer.phone,
            deliveryAddress: `${orderRecord.customer.address}, ${orderRecord.customer.city} - ${orderRecord.customer.pincode}`,
            productName: itemsSummary,
            totalAmount: orderRecord.totalAmountPaid,
            paymentStatus: orderRecord.paymentStatus,
          }),
        });

        sheetSyncStatus = sheetResponse.ok ? "synced_successfully" : "sync_failed";
      } catch (err: any) {
        console.error("Google Sheets webhook dispatch failed:", err.message);
        sheetSyncStatus = "network_error";
      }
    }

    return NextResponse.json({
      success: true,
      message: "Order placed and confirmed successfully directly on the website!",
      order: orderRecord,
      sheetSyncStatus,
    });
  } catch (error: any) {
    console.error("Order recording error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to record order" },
      { status: 500 }
    );
  }
}
