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
    const insertedVessels = [];
    const errors = [];

    // ✅ Step 2: Iterate through the vessels and insert them into vessel_management
    for (const vessel of vessels) {
      const { vesselName, imoNumber, exVesselName, vesselType } = vessel;

      if (!vesselName || !imoNumber) {
        errors.push({ message: "Missing required fields (vesselName or imoNumber) for one of the vessels.", vessel });
        continue; // Skip to the next vessel if required fields are missing
      }

      const { data, error } = await supabase
        .from("vessel_management")
        .insert([
          {
            vessel_name: vesselName,
            imo_number: imoNumber,
            ex_vessel_name: exVesselName || null,
            customer_id,
            vessel_type: vesselType || null, // Use provided vesselType or null
          },
        ])
        .select();

      if (error) {
        console.error("Insert Error for vessel:", vessel, error);
        errors.push({ message: "Failed to save vessel information.", error, vessel });
      } else if (data && data.length > 0) {
        insertedVessels.push(data[0]);
      }
    }

    if (errors.length > 0 && insertedVessels.length === 0) {
      return NextResponse.json(
        { message: "Failed to save any vessel information.", errors },
        { status: 500 }
      );
    } else if (errors.length > 0) {
      return NextResponse.json(
        { message: "Some vessels were saved successfully, but others failed.", success: insertedVessels, errors },
        { status: 207 } // 207 Multi-Status to indicate partial success
      );
    } else {
      return NextResponse.json({ message: "Vessels saved successfully", data: insertedVessels });
    }

  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { message: "Server error occurred.", error: err },
      { status: 500 }
    );
  }
}

// You can add other named exports for other HTTP methods if needed (e.g., GET, PUT, DELETE)