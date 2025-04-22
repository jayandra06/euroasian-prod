import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const formdata = await request.json();
    const { email, branch } = formdata;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Supabase credentials missing");
      return new Response(
        JSON.stringify({ success: false, error: "Server misconfiguration" }),
        {
          status: 500,
        }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Step 1: Invite User by Email
    // Step 1: Invite User by Email
    const { data: userData, error: inviteError } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(email);

    if (inviteError || !userData?.user) {
      console.error("Invite failed:", JSON.stringify(inviteError, null, 2)); // <--- more detailed
      return new Response(
        JSON.stringify({
          success: false,
          error: inviteError?.message || "Invitation failed",
        }),
        {
          status: 400,
        }
      );
    }

    const userId = userData.user.id;

    const { error: updateProfileError } = await supabaseAdmin
    .from("profiles")
    .update({ user_role: "manager" })
    .eq("id", userId);

    // Step 2: Insert into member table
    const { data: memberData, error: memberError } = await supabaseAdmin
      .from("member")
      .insert({
        member_profile: userId,
        branch: branch,
        member_role: "manager",
      })
      .select()
      .single();

    if (memberError || !memberData) {
      console.error("Error inserting member:", memberError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to add member" }),
        {
          status: 500,
        }
      );
    }

    // Step 3: Insert into manager table (no vessels)
    const { data: managerData, error: managerError } = await supabaseAdmin
      .from("manager")
      .insert({
        branch_id: branch,
        email: email,
      })
      .select()
      .single();

    if (managerError || !managerData) {
      console.error("Error inserting manager:", managerError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to add manager" }),
        {
          status: 500,
        }
      );
    }

   

    return new Response(
      JSON.stringify({
        success: true,
        email: email,
        message: "User invited successfully. Invitation email sent!",
        member: memberData,
        manager: managerData,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Something went wrong",
      }),
      {
        status: 500,
      }
    );
  }
}
