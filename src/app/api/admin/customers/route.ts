import { NextResponse } from "next/server";
import { getAllCustomers } from "@/data/customersStore";

export async function GET() {
  try {
    const customers = getAllCustomers();
    return NextResponse.json({
      success: true,
      customers,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
