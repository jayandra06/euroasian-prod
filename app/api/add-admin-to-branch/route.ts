import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
    try {
        const formdata = await request.json();
        const { email, branch} = formdata;

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error("Supabase credentials missing");
            return new Response(JSON.stringify({ success: false, error: "Server misconfiguration" }), {
                status: 500,
            });
        }

        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: { autoRefreshToken: false, persistSession: false },
        });

        // Step 1: Invite User by Email
        const { data: userData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

        if (inviteError || !userData?.user) {
            console.error("Invite failed:", inviteError);
            return new Response(JSON.stringify({ success: false, error: inviteError?.message || "Invitation failed" }), {
                status: 400,
            });
        }

        const userId = userData.user.id;

        //Update the role in profile table
        const { error: updateProfileError } = await supabaseAdmin
            .from("profiles")
            .update({ user_role: "admin" })
            .eq("id", userId);

        // Step 2: Insert into member table
        const { data: memberData, error: memberError } = await supabaseAdmin
            .from("member")
            .insert({
                member_profile: userId,
                branch: branch,
                member_role: "admin",
            })
            .select()
            .single();

        if (memberError || !memberData) {
            console.error("Error inserting member:", memberError);
            return new Response(JSON.stringify({ success: false, error: "Failed to add member" }), {
                status: 500,
            });
        }

        // Step 3: Insert into branch_admin table (instead of manager)
        const { data: adminData, error: adminError } = await supabaseAdmin
            .from("branch_admin")
            .insert({
                branch: branch,
                email: email,
            })
            .select()
            .single();

        if (adminError || !adminData) {
            console.error("Error inserting branch admin:", adminError);
            return new Response(JSON.stringify({ success: false, error: "Failed to add branch admin" }), {
                status: 500,
            });
        }

        // Step 4: Link branch_admin to member
        const { error: updateError } = await supabaseAdmin
            .from("member")
            .update({ member_profile: adminData.id }) // assuming you still want to keep this linkage
            .eq("id", memberData.id);

        if (updateError) {
            console.error("Error linking branch_admin to member:", updateError);
            return new Response(JSON.stringify({ success: false, error: "Failed to link admin" }), {
                status: 500,
            });
        }

        return new Response(JSON.stringify({
            success: true,
            email: email,
            message: "User invited successfully. Invitation email sent!",
            member: memberData,
            branch_admin: adminData,
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error: any) {
        console.error("Unexpected error:", error);
        return new Response(JSON.stringify({ success: false, error: error.message || "Something went wrong" }), {
            status: 500,
        });
    }
}
