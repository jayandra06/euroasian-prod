import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
    const formdata = await request.json();
    const email = formdata.email;
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const userData = await supabaseAdmin.auth.admin.inviteUserByEmail(email)
    const profile = await supabaseAdmin.from("profiles").update({user_role: "admin"}).eq("id", userData.data.user?.id);

    console.log(profile);
    return Response.json({
        email: email,
        success: true
    })
} 