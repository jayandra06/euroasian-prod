import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function GET(req: NextRequest) {
  const supabase = createClient();

  try {
    const { searchParams } = new URL(req.url);
    const login_id = searchParams.get("login_id");  // actually your login_id

    if (!login_id) {
      return NextResponse.json(
        { message: "Missing customer_id (login_id) query parameter." },
        { status: 400 }
      );
    }

    // 1️⃣ Lookup the real customer id from customer_details
    const { data: cust, error: custErr } = await supabase
      .from("customer_details")
      .select("id")
      .eq("login_id", login_id)
      .single();

    if (custErr || !cust?.id) {
      console.error("Customer lookup error:", custErr);
      return NextResponse.json(
        { message: "No customer found for given login_id." },
        { status: 404 }
      );
    }

    const customer_id = cust.id;

    // 2️⃣ Fetch all vessels for that customer_id
    const { data, error } = await supabase
      .from("vessel_management")
      .select("*")
      .eq("customer_id", customer_id)

      console.log("Fetched vessels:", data);
      

    if (error) {
      console.error("Fetch Error:", error);
      return NextResponse.json(
        { message: "Failed to fetch vessel data.", error },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Vessels fetched successfully", data });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { message: "Server error occurred.", error: err },
      { status: 500 }
    );
  }
}
