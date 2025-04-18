import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/client';

export async function POST(req: NextRequest) {
    const supabase = createClient();

    try {
        const body = await req.json();
        const { vessels, login_id } = body;

        if (!Array.isArray(vessels) || vessels.length === 0 || !login_id) {
            return NextResponse.json(
                { message: "Missing required fields or invalid vessel data." },
                { status: 400 }
            );
        }

        // ✅ Step 1: Fetch the customer ID from customer_details using login_id
        const { data: customerData, error: customerError } = await supabase
            .from("customer_details")
            .select("id")
            .eq("login_id", login_id)
            .single();

        if (customerError || !customerData?.id) {
            console.error("Customer fetch error:", customerError);
            return NextResponse.json(
                { message: "Customer not found for provided login_id." },
                { status: 404 }
            );
        }

        const customer_id = customerData.id;

        // ✅ Step 2: Prepare the array of vessels for bulk insert
        const vesselsToInsert = vessels.map((vessel) => ({
            vessel_name: vessel.vesselName,
            imo_number: vessel.imoNumber,
            ex_vessel_name: vessel.exVesselName || null,
            vessel_type: vessel.vesselType || null, // Use the vesselType from the input
            customer_id,
        }));

        // ✅ Step 3: Insert the new vessels into vessel_management in bulk
        const { data, error } = await supabase
            .from("vessel_management")
            .insert(vesselsToInsert)
            .select();

        if (error) {
            console.error("Bulk Insert Error:", error);
            return NextResponse.json(
                { message: "Failed to save vessel information.", error },
                { status: 500 }
            );
        }

        return NextResponse.json({ message: "Vessels saved successfully", data });
    } catch (err) {
        console.error("API Error:", err);
        return NextResponse.json(
            { message: "Server error occurred.", error: err },
            { status: 500 }
        );
    }
}