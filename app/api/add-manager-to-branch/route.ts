import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
    try {
        const formdata = await request.json();
        const { email, branch, vessels } = formdata;

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            { auth: { autoRefreshToken: false, persistSession: false } }
        );

        // Step 1: Invite User by creating them without a password
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
            email: email,
            email_confirm: false, // User still needs to set a password
        });

        if (userError || !userData?.user) {
            console.error("Error inviting user:", userError);
            return Response.json({ success: false, error: "User not invited" });
        }

        const userId = userData.user.id;

        // Step 2: Send an invite email with a password reset link
        const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(email);

        if (resetError) {
            console.error("Error sending invite email:", resetError);
            return Response.json({ success: false, error: "Failed to send invite email" });
        }

        // Step 3: Insert into the member table
        const { data: memberData, error: memberError } = await supabaseAdmin
            .from("member")
            .insert({
                member_profile: userId,
                branch: branch,
                member_role: "employee"
            })
            .select()
            .single();

        if (memberError || !memberData) {
            console.error("Error inserting member:", memberError);
            return Response.json({ success: false, error: "Failed to add member" });
        }

        // Step 4: Insert into the manager table
        const { data: managerData, error: managerError } = await supabaseAdmin
            .from("manager")
            .insert({
               // Link the manager to the member table
                branch_id: branch,
                email: email,
                vessel: JSON.stringify(vessels)
            })
            .select()
            .single();

        if (managerError || !managerData) {
            console.error("Error inserting manager:", managerError);
            return Response.json({ success: false, error: "Failed to add manager" });
        }

        // Step 5: Update member table with the manager_id
        const { error: updateError } = await supabaseAdmin
            .from("member")
            .update({ manager_id: managerData.id })
            .eq("id", memberData.id);

        if (updateError) {
            console.error("Error updating member with manager_id:", updateError);
            return Response.json({ success: false, error: "Failed to link manager" });
        }

        return Response.json({
            success: true,
            email: email,
            message: "User invited successfully, password reset email sent!",
            member: memberData,
            manager: managerData
        });

    } catch (error) {
        console.error("Unexpected error:", error);
        return Response.json({ success: false, error: "Something went wrong" });
    }
}
