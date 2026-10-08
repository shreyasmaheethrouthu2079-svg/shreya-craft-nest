import { NextResponse } from "next/server";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  StoredOrder,
} from "@/data/ordersStore";

export async function GET() {
  try {
    const orders = getAllOrders();

    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + (o.totalAmountPaid || 0), 0),
      confirmed: orders.filter((o) => o.status === "ORDER_CONFIRMED").length,
      inStitching: orders.filter((o) => o.status === "IN_STITCHING").length,
      packed: orders.filter((o) => o.status === "PACKED").length,
      dispatched: orders.filter((o) => o.status === "DISPATCHED").length,
      delivered: orders.filter((o) => o.status === "DELIVERED").length,
    };

    return NextResponse.json({
      success: true,
      orders,
      stats,
    });
  } catch (error) {
    console.error("Failed to fetch admin orders:", error);
    return NextResponse.json(
      { error: "Internal server error fetching orders" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status, courierName, trackingNumber, estimatedDelivery, paymentStatus } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const updated = updateOrderStatus(orderId, {
      status,
      courierName,
      trackingNumber,
      estimatedDelivery,
      paymentStatus,
    });

    if (!updated) {
      return NextResponse.json(
        { error: `Order ${orderId} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: updated,
    });
  } catch (error) {
    console.error("Failed to update order:", error);
    return NextResponse.json(
      { error: "Internal server error updating order" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const deleted = deleteOrder(orderId);
    if (!deleted) {
      return NextResponse.json(
        { error: `Order ${orderId} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Order ${orderId} deleted successfully`,
    });
  } catch (error) {
    console.error("Failed to delete order:", error);
    return NextResponse.json(
      { error: "Internal server error deleting order" },
      { status: 500 }
    );
  }
}
