import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function GET(req: NextRequest) {
  const supabase = createClient();

  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    const { data, error } = await supabase.rpc("get_branch_admin_rfqs", {
      limit_val: limit,
      offset_val: offset,
    });

    if (error) {
      return NextResponse.json(
        { message: "Failed to fetch RFQs", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "RFQs fetched successfully",
        data,
        limit,
        offset,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { message: "Server error occurred", error: err },
      { status: 500 }
    );
  }
}
