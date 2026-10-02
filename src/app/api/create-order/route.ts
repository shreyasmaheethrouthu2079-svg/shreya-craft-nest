import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getProductById } from "@/data/products";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, items } = body;

    const orderItems: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }> = [];
    let totalAmountRupees = 0;

    if (items && Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        const prod = getProductById(item.productId || item.id);
        if (prod) {
          const qty = item.quantity && item.quantity > 0 ? item.quantity : 1;
          orderItems.push({
            id: prod.id,
            name: prod.name,
            price: prod.price,
            quantity: qty,
          });
          totalAmountRupees += prod.price * qty;
        }
      }
    } else if (productId) {
      const prod = getProductById(productId);
      if (prod) {
        orderItems.push({
          id: prod.id,
          name: prod.name,
          price: prod.price,
          quantity: 1,
        });
        totalAmountRupees = prod.price;
      }
    }

    if (orderItems.length === 0 || totalAmountRupees <= 0) {
      return NextResponse.json(
        { error: "No valid products found for order" },
        { status: 400 }
      );
    }

    const keyId =
      process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    const amountInPaise = Math.round(totalAmountRupees * 100);

    const isPlaceholderKey =
      !keyId ||
      !keySecret ||
      keyId.includes("YOUR_") ||
      keySecret.includes("YOUR_") ||
      keyId.includes("sampleKey");

    // Try real Razorpay Order creation if valid key format is present
    if (!isPlaceholderKey) {
      try {
        const razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });

        const orderOptions = {
          amount: amountInPaise,
          currency: "INR",
          receipt: `scn_${Date.now()}`,
          notes: {
            brand: "Shreya Craft Nest",
            itemsCount: orderItems.length.toString(),
            summary: orderItems.map((i) => `${i.name} (x${i.quantity})`).join(", "),
          },
        };

        const order = await razorpay.orders.create(orderOptions);

        return NextResponse.json({
          success: true,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: keyId,
          items: orderItems,
          totalAmount: totalAmountRupees,
          isDemo: false,
        });
      } catch (razorpayErr: any) {
        console.warn(
          "Razorpay API returned error (falling back to demo mode):",
          razorpayErr.error?.description || razorpayErr.message
        );
      }
    }

    // Development / Demo fallback if Razorpay keys are placeholders
    const mockOrderId = `order_demo_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 7)}`;

    return NextResponse.json({
      success: true,
      orderId: mockOrderId,
      amount: amountInPaise,
      currency: "INR",
      keyId: keyId || "rzp_test_placeholder",
      items: orderItems,
      totalAmount: totalAmountRupees,
      isDemo: true,
      message:
        "Demo mode active: Configure active RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local for live production transactions.",
    });
  } catch (error: any) {
    console.error("Order initialization error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to initialize payment order",
      },
      { status: 500 }
    );
  }
}
