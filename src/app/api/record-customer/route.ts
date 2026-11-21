import { NextResponse } from "next/server";
import { recordCustomerActivity } from "@/data/customersStore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, identifier, type = "signup" } = body;

    if (!identifier) {
      return NextResponse.json(
        { error: "Identifier (email or phone) is required" },
        { status: 400 }
      );
    }

    const cleanId = String(identifier).trim();
    const isEmail = cleanId.includes("@");
    const cleanPhone = cleanId.replace(/\D/g, "");

    // 1. Record customer activity in local studio store
    const customer = recordCustomerActivity(
      name ? String(name).trim() : "",
      cleanId,
      type === "signup" ? "signup" : "signin"
    );

    const effectiveName =
      name && String(name).trim()
        ? String(name).trim()
        : customer.name || "Customer";
    const effectivePhone =
      cleanPhone && cleanPhone.length >= 10
        ? cleanPhone.slice(-10)
        : customer.phone || cleanPhone || "";

    // 2. Dispatch to Google Sheets
    const webhookUrl =
      process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
      "https://script.google.com/macros/s/AKfycbygzrIq4_95S907coV6TMCi5_nqg3Y2jpP_WNVpFswfK53aropBugBBzsh1AgY9i4Yr/exec";

    if (webhookUrl && !webhookUrl.includes("YOUR_")) {
      try {
        const payload = {
          timestamp: new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          }),
          orderId:
            type === "signup"
              ? `MEMBER-${Date.now().toString().slice(-6)}`
              : `LOGIN-${Date.now().toString().slice(-6)}`,
          paymentId:
            type === "signup" ? "ACCOUNT_CREATED" : "CUSTOMER_ACTIVE",
          paymentMethod: "Customer Login",
          customerName: effectiveName,
          phoneNumber: effectivePhone,
          deliveryAddress: customer.email
            ? `Email: ${customer.email}`
            : `Mobile Customer: +91 ${effectivePhone}`,
          productName:
            type === "signup"
              ? "Created Shreya's Craft Nest Account"
              : "Customer Signed In",
          category: "Customer Profile",
          totalAmount: 0,
          paymentStatus: "LOGGED_IN",
        };

        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        console.log("Customer login synced to Google Sheets. HTTP status:", res.status);
      } catch (err: any) {
        console.error("Failed to sync customer to Google Sheets:", err.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Customer recorded successfully",
      customer,
    });
  } catch (error: any) {
    console.error("Error in /api/record-customer:", error);
    return NextResponse.json(
      { error: error.message || "Failed to record customer" },
      { status: 500 }
    );
  }
}
