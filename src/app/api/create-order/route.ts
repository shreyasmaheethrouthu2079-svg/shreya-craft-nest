import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getProductById } from "@/data/products";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = getProductById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found in catalog" },
        { status: 404 }
      );
    }

    const keyId =
      process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    const amountInPaise = Math.round(product.price * 100);

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
          receipt: `scn_${product.id.slice(0, 10)}_${Date.now()}`,
          notes: {
            brand: "Shreya Crafts Nest",
            productId: product.id,
            productName: product.name,
          },
        };

        const order = await razorpay.orders.create(orderOptions);

        return NextResponse.json({
          success: true,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: keyId,
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
          },
          isDemo: false,
        });
      } catch (razorpayErr: any) {
        console.warn(
          "Razorpay API returned error (falling back to demo mode):",
          razorpayErr.error?.description || razorpayErr.message
        );
        // Fallback to demo mode if credentials are unauthenticated
      }
    }

    // Development / Demo fallback if Razorpay keys are placeholders or not yet verified
    const mockOrderId = `order_demo_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 7)}`;

    return NextResponse.json({
      success: true,
      orderId: mockOrderId,
      amount: amountInPaise,
      currency: "INR",
      keyId: keyId || "rzp_test_placeholder",
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
      },
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
