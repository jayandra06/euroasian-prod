import {createClient} from "@supabase/supabase-js";

export async function POST(request: Request) {
    const body = await request.json();
    const userID = body.userID;
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {auth: {autoRefreshToken: false, persistSession: false}}
    );
    console.log(userID);

    const userData = await supabaseAdmin.auth.admin.getUserById(userID);

    return Response.json({
        success: true,
        userData: userData.data.user
    })
}