import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/woocommerce";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const order = await createOrder(body);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: "Bestellung konnte nicht erstellt werden." },
      { status: 500 }
    );
  }
}
