import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const formdata = await request.json();
    const { email, type, userId } = formdata;

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

    let inviteData;
    try {
      // Step 1: Invite User by Email
      const result = await supabaseAdmin.auth.admin.inviteUserByEmail(email);
      inviteData = result.data;
      if (result.error || !inviteData?.user) {
        throw result.error || new Error("Invitation failed");
      }
    } catch (error) {
      console.error("Error inviting user:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to invite user",
        }),
        { status: 400 }
      );
    }

    const profile_id = inviteData.user.id;

    try {
      // Step 2: Update user role in profiles table
      const { error: profileUpdateError } = await supabaseAdmin
        .from("profiles")
        .update({ user_role: "vendor" })
        .eq("id", profile_id);

      if (profileUpdateError) {
        throw profileUpdateError;
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to update user role in profiles table",
        }),
        { status: 500 }
      );
    }

    try {
      // Step 4: Insert into invitations table
      const { data: invitationData, error: invitationError } =
        await supabaseAdmin
          .from("invitations")
          .insert({
            type: type,
            email,

            new_user_id: profile_id,
            status: "pending",
            invited_by: userId,
          })
          .select()
          .single();

      if (invitationError || !invitationData) {
        throw invitationError || new Error("Insert failed");
      }
    } catch (error) {
      console.error("Error inserting invitation record:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to log invitation in the database",
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
    console.error("Unexpected error:", err.message || err);
    return new Response(
      JSON.stringify({ success: false, error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
