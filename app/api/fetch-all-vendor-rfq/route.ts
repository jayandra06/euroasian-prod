// app/api/rfq/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

interface Rfq {
  id: string;
  created_at: string;
  supply_port: string;
  vessel_name: string;
  brand: string;
  status: string; // supplier status
  rfq_status: string; // rfq original status
}

export async function GET(req: NextRequest) {
  const supabase = createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("No user found");

    const { data, error } = await supabase
      .from('rfq')
      .select(`
        id,
        created_at,
        supply_port,
        vessel_name,
        brand,
        status,
        rfq_supplier (
          status
        )
      `)
      .eq('rfq_supplier.vendor_id', user.id);

    if (error) throw error;

    const updatedRfqs: Rfq[] = (data || []).map((rfq: any) => ({
      id: rfq.id,
      created_at: rfq.created_at,
      supply_port: rfq.supply_port,
      vessel_name: rfq.vessel_name,
      brand: rfq.brand,
      rfq_status: rfq.status, // from rfq table
      status: rfq.rfq_supplier?.status ?? "Not Available", // from rfq_supplier
    }));

    return NextResponse.json({ success: true, rfqs: updatedRfqs });
  } catch (error) {
    console.error("Error fetching RFQs:", error);
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
