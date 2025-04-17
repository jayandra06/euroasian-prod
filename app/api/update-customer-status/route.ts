// File: /app/api/approve-customer/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function POST(req: NextRequest) {
console.log("Approve customer API called");
  const supabase = createClient();

  try {
    const body = await req.json();
    const { customerId } = body;

    if (!customerId) {
      return NextResponse.json(
        { error: "Missing customerId." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("customer_details")
      .update({ status: "accepted" })
      .eq("id", customerId)
      .select();

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json(
        { error: "Failed to update customer status." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Customer status updated to 'accepted'",
      data,
    });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Server error occurred." },
      { status: 500 }
    );
  }
}
