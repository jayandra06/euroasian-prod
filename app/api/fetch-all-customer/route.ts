import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { status } = await request.json();

    if (!status) {
      return new Response(
        JSON.stringify({ success: false, error: "Status is required" }),
        { status: 400 }
      );
    }

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

    // Fetch customers with dynamic status
    const { data: customers, error } = await supabaseAdmin
      .from("customer_details")
      .select(
        "shipping_company_name, primary_contact_person, official_email_address, mobile_phone_number, number_of_vessels,id,status"
      )
      .eq("status", status);

    if (error) {
      console.error("Error fetching customer details:", error);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to fetch customer details" }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ success: true, customers }), {
      status: 200,
    });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
