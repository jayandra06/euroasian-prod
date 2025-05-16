import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = createClient();

    // Get the user from the session
    const {
      data: { user },
      error: userError,
    } = await (await supabase).auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { role } = await req.json();

    if (!role || role.trim() === "") {
      return NextResponse.json({ success: false, message: "Role name is required" });
    }

    // Insert the new role with the user's ID as the creator
    const { error } = await (await supabase).from("all_role").insert({
      role,
      created_by: user.id, // Using the authenticated user's ID here
    });

    if (error) {
      return NextResponse.json({ success: false, message: error.message });
    }

    return NextResponse.json({ success: true, message: "Role created successfully" });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Internal server error" });
  }
}
