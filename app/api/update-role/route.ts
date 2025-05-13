import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Check for empty request body
  const contentLength = req.headers.get("content-length");
  if (contentLength === "0") {
    return NextResponse.json(
      { success: false, error: "Request body is empty" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { success: false, error: "Missing userId or role" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Verify user exists
    const { data: user, error: userError } = await (await supabase)
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Add role to `all_roles` if it doesn't exist
    const { error: insertRoleError } = await (await supabase)
      .from("all_role")
      .upsert(
        { role },
        { onConflict: "role" } // Prevent duplicates based on the `role` column
      );

    if (insertRoleError) {
      return NextResponse.json(
        { success: false, error: insertRoleError.message },
        { status: 500 }
      );
    }

    // Update role in `role_management`
    const { error: upsertError } = await (await supabase)
      .from("role_management")
      .upsert(
        { user_id: userId, role },
       { onConflict: 'user_id' }
      );

    if (upsertError) {
      return NextResponse.json(
        { success: false, error: upsertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
