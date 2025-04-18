import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const formdata = await request.json();
    const { email } = formdata;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Supabase credentials missing");
      return new Response(
        JSON.stringify({ success: false, error: "Server misconfiguration" }),
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Step 1: Invite User by Email
    const { data: inviteData, error: inviteError } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(email);

    if (inviteError || !inviteData?.user) {
      console.error("Invite failed:", inviteError);
      return new Response(
        JSON.stringify({
          success: false,
          error: inviteError?.message || "Invitation failed",
        }),
        { status: 400 }
      );
    }

    const profile_id = inviteData.user.id;

    // Step 2: Update user role in profiles table
    const { error: profileUpdateError } = await supabaseAdmin
      .from("profiles")
      .update({ user_role: "vendor" })
      .eq("id", profile_id);

    if (profileUpdateError) {
      console.error("Failed to update profile role:", profileUpdateError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to update user role",
        }),
        { status: 500 }
      );
    }

    // Step 3: Insert into invitations table
    const { data: invitationData, error: invitationError } = await supabaseAdmin
      .from("invitations")
      .insert({
        type: "vendor",
        email,
        status: "pending",
      })
      .select()
      .single();

    if (invitationError || !invitationData) {
      console.error("Error inserting into invitations table:", invitationError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to add invitation details",
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "User invited and data saved successfully",
      }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
