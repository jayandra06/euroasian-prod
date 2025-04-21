import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function POST(req: NextRequest) {
  const supabase = createClient();

  try {
    const body = await req.json();
    const { vessels, login_id, vessel_added, total_vessel } = body;

    console.log("Received Data:", {
      vessels,
      login_id,
      vessel_added,
      total_vessel,
    });

    // Basic validation
    if (!Array.isArray(vessels) || vessels.length === 0 || !login_id) {
      console.error("Missing or invalid input.");
      return NextResponse.json(
        { message: "Missing required fields or invalid vessel data." },
        { status: 400 }
      );
    }

    const added = Number(vessel_added);
    const total = Number(total_vessel);
    const remaining = total - added;

    console.log(`Remaining vessels allowed: ${remaining}`);

    if (vessels.length > remaining) {
      console.warn(`Exceeds vessel limit. Tried to add: ${vessels.length}, allowed: ${remaining}`);
      return NextResponse.json(
        {
          message: `You can only add ${remaining} more vessel(s).`,
          allowed: remaining,
        },
        { status: 403 }
      );
    }

    // Get customer_id using login_id
    const { data: customerData, error: customerError } = await supabase
      .from("customer_details")
      .select("id")
      .eq("login_id", login_id)
      .single();

    if (customerError || !customerData?.id) {
      console.error("Customer lookup failed:", customerError);
      return NextResponse.json(
        { message: "Customer not found for provided login_id." },
        { status: 404 }
      );
    }

    const customer_id = customerData.id;
    const insertedVessels = [];
    const errors = [];

    for (const vessel of vessels) {
      const { vesselName, imoNumber, exVesselName, vesselType } = vessel;

      if (!vesselName || !imoNumber) {
        console.warn("Missing vesselName or imoNumber for vessel:", vessel);
        errors.push({
          message: "Missing required fields (vesselName or imoNumber).",
          vessel,
        });
        continue;
      }

      const { data, error } = await supabase
        .from("vessel_management")
        .insert([
          {
            vessel_name: vesselName,
            imo_number: imoNumber,
            ex_vessel_name: exVesselName || null,
            vessel_type: vesselType || null,
            customer_id,
          },
        ])
        .select();

      if (error) {
        console.error("Error inserting vessel:", vessel, error);
        errors.push({
          message: "Failed to save vessel.",
          vessel,
          error,
        });
      } else if (data && data.length > 0) {
        insertedVessels.push(data[0]);
      }
    }

    // Response based on result
    if (insertedVessels.length === 0 && errors.length > 0) {
      return NextResponse.json(
        { message: "Failed to save any vessels.", errors },
        { status: 500 }
      );
    } else if (insertedVessels.length > 0 && errors.length > 0) {
      return NextResponse.json(
        {
          message: "Some vessels were saved, others failed.",
          success: insertedVessels,
          errors,
        },
        { status: 207 }
      );
    } else {
      return NextResponse.json({
        message: "All vessels saved successfully.",
        data: insertedVessels,
      });
    }

  } catch (err) {
    console.error("Unexpected server error:", err);
    return NextResponse.json(
      { message: "Unexpected server error.", error: err },
      { status: 500 }
    );
  }
}
