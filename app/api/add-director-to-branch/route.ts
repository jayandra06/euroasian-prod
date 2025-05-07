import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
    try {
        const formData = await request.json();
        const { email, branch } = formData;

        if (!email || !branch) {
            return new Response(
                JSON.stringify({ success: false, error: "Missing required fields" }),
                { status: 400 }
            );
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error("Supabase configuration is missing");
            return new Response(
                JSON.stringify({ success: false, error: "Server misconfiguration" }),
                { status: 500 }
            );
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Insert into director table
        const { data: directorData, error: directorError } = await supabase
            .from("director")
            .insert({
                branch_id: branch,
                email: email,
            })
            .select()
            .single();

        if (directorError) {
            console.error("Error inserting director:", directorError);
            return new Response(
                JSON.stringify({ success: false, error: "Failed to save director" }),
                { status: 500 }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                email: email,
                message: "User invited successfully. Invitation email sent!",
                director: directorData,
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
            { status: 500 }
        );
    }
}
