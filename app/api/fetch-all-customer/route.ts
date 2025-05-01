import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { status, search, from = 0, to = 9 } = await request.json();

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

    let query = supabaseAdmin
      .from("customer_details")
      .select(
        "shipping_company_name, primary_contact_person, official_email_address, mobile_phone_number, number_of_vessels, id, status",
        { count: "exact" }
      )
      .eq("status", status)
      .range(from, to);

    if (search && search.trim() !== "") {
      query = query.or(
        `shipping_company_name.ilike.%${search}%,primary_contact_person.ilike.%${search}%,official_email_address.ilike.%${search}%,mobile_phone_number.ilike.%${search}%`
      );
    }

    const { data: customers, error, count } = await query;

    if (error) {
      console.error("Error fetching customer details:", error);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to fetch customer details" }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, customers, total: count }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
