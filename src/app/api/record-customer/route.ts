import { NextResponse } from "next/server";

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

    const webhookUrl =
      process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
      "https://script.google.com/macros/s/AKfycbygzrIq4_95S907coV6TMCi5_nqg3Y2jpP_WNVpFswfK53aropBugBBzsh1AgY9i4Yr/exec";

    if (webhookUrl && !webhookUrl.includes("YOUR_")) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            timestamp: new Date().toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            }),
            orderId: type === "signup" ? "NEW-MEMBER" : "MEMBER-LOGIN",
            paymentId: type === "signup" ? "NEW_ACCOUNT_CREATED" : "CUSTOMER_ACTIVE",
            paymentMethod: "Online Account",
            customerName: name ? String(name).trim() : (isEmail ? cleanId.split("@")[0] : `Customer ${cleanPhone.slice(-4)}`),
            phoneNumber: !isEmail && cleanPhone ? cleanPhone : "",
            deliveryAddress: isEmail ? `Email: ${cleanId}` : `Mobile User: +91 ${cleanPhone}`,
            productName:
              type === "signup"
                ? "Created Shreya Craft Nest Account"
                : "Customer Sign In",
            category: "Customer Profile",
            totalAmount: 0,
            paymentStatus: "ACTIVE",
          }),
        });
      } catch (err: any) {
        console.error("Failed to sync customer to Google Sheets:", err.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Customer recorded successfully",
    });
  } catch (error: any) {
    console.error("Error in /api/record-customer:", error);
    return NextResponse.json(
      { error: error.message || "Failed to record customer" },
      { status: 500 }
    );
  }
}
