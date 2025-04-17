import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const formdata = await request.json();
    const { email, branch, company_name, phone_number, type, invited_by } =
      formdata;

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
    const { data: userData, error: inviteError } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(email);

    if (inviteError || !userData?.user) {
      console.error("Invite failed:", inviteError);
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

  

    // Step 3: Insert into invitations table
    const { data: invitationData, error: invitationError } = await supabaseAdmin
      .from("invitations")
      .insert({
        company_name,
        phone_number,
        type,
        email,
        invited_by,
        
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
        {
          status: 500,
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "User invited and data saved successfully",
      }),
      {
        status: 200,
      }
    );
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Internal Server Error" }),
      {
        status: 500,
      }
    );
  }
}
