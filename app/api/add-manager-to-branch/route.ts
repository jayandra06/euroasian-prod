import { createClient } from "@supabase/supabase-js";



export async function POST(request: Request) {
    const formdata = await request.json();
    const email = formdata.email;
    const branch = formdata.branch;
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const userData = await supabaseAdmin.auth.admin.inviteUserByEmail(email);    
    const member = await supabaseAdmin.from("member").insert({member_profile: userData.data.user?.id, branch: branch, member_role: "employee"});
    
    return Response.json({
        email: email,
        success: true
    })
} 