import { NextResponse } from "next/server";
import { findOrderByQuery, StoredOrder } from "@/data/ordersStore";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || searchParams.get("orderId") || "";

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Please provide an Order ID or Phone Number to track." },
        { status: 400 }
      );
    }

    const order = findOrderByQuery(query);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: `No order found for "${query}". Please check your Order ID (e.g. SCN-XXXXXX) or 10-digit mobile number.`,
        },
        { status: 404 }
      );
    }

    // Dynamic timeline stages based on order age & status
    const createdTime = new Date(order.createdAt).getTime();
    const now = Date.now();
    const hoursElapsed = (now - createdTime) / (1000 * 3600);

    // Calculate progression
    let currentStageIndex = 0; // 0: Confirmed, 1: Inspected, 2: Packed, 3: Dispatched, 4: Delivered
    if (order.status === "DELIVERED") {
      currentStageIndex = 4;
    } else if (order.status === "DISPATCHED" || hoursElapsed >= 24) {
      currentStageIndex = 3;
    } else if (order.status === "PACKED" || hoursElapsed >= 12) {
      currentStageIndex = 2;
    } else if (order.status === "IN_STITCHING" || hoursElapsed >= 2) {
      currentStageIndex = 1;
    } else {
      currentStageIndex = 0;
    }

    const timeline = [
      {
        step: 1,
        title: "Order Placed & Confirmed",
        description: "Your order was successfully registered in our studio database.",
        timestamp: new Date(createdTime).toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
        isCompleted: currentStageIndex >= 0,
        isCurrent: currentStageIndex === 0,
      },
      {
        step: 2,
        title: "Artisan Quality & Seam Inspection",
        description: "Mom personally inspected all seam stitches, zippers, and fabric quality.",
        timestamp:
          currentStageIndex >= 1
            ? new Date(createdTime + 2 * 3600 * 1000).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })
            : "In Progress",
        isCompleted: currentStageIndex >= 1,
        isCurrent: currentStageIndex === 1,
      },
      {
        step: 3,
        title: "Eco-Friendly Artisan Packaging",
        description: "Carefully wrapped in delicate butter paper with a handwritten thank-you note.",
        timestamp:
          currentStageIndex >= 2
            ? new Date(createdTime + 12 * 3600 * 1000).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })
            : "Expected within 12-24 hrs",
        isCompleted: currentStageIndex >= 2,
        isCurrent: currentStageIndex === 2,
      },
      {
        step: 4,
        title: "Dispatched with Express Courier",
        description: `Handed over to ${order.courierName || "Delhivery Surface Express"}. AWB tracking active.`,
        timestamp:
          currentStageIndex >= 3
            ? new Date(createdTime + 24 * 3600 * 1000).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })
            : "Scheduled for next courier pickup",
        isCompleted: currentStageIndex >= 3,
        isCurrent: currentStageIndex === 3,
      },
      {
        step: 5,
        title: "Delivered to Doorstep",
        description: `Delivered safely to ${order.customer.city} - ${order.customer.pincode}.`,
        timestamp:
          currentStageIndex >= 4
            ? "Delivered"
            : order.estimatedDelivery || "Expected in 2-3 days",
        isCompleted: currentStageIndex >= 4,
        isCurrent: currentStageIndex === 4,
      },
    ];

    return NextResponse.json({
      success: true,
      order,
      currentStageIndex,
      timeline,
    });
  } catch (error: any) {
    console.error("Order tracking lookup error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve tracking details" },
      { status: 500 }
    );
  }
}
