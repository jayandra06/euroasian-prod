import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function GET(req: NextRequest) {
  const supabase = createClient();

  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const userId = searchParams.get("id");

    // 1️⃣ Get user role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_role")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { message: "User profile not found" },
        { status: 404 }
      );
    }

    const role = profile.user_role;
    let vesselIds: string[] = [];

    // 2️⃣ CUSTOMER
    if (role === "customer") {
      const { data: cust, error: custErr } = await supabase
        .from("customer_details")
        .select("id")
        .eq("login_id", userId)
        .single();

      if (custErr || !cust?.id) {
        console.error("Customer lookup error:", custErr);
        return NextResponse.json(
          { message: "No customer found for given login_id." },
          { status: 404 }
        );
      }

      const { data: customerVessels, error: customerVesselError } =
        await supabase
          .from("vessel_management")
          .select("id, vessel_name")
          .eq("customer_id", cust.id);

      if (customerVesselError) {
        console.error("Error fetching customer vessels:", customerVesselError);
        return NextResponse.json(
          { message: "Error fetching vessels" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          message: "Vessels fetched successfully",
          data: customerVessels,
        },
        { status: 200 }
      );
    }

    // 3️⃣ ADMIN
    else if (role === "branch_admin") {
      console.log("Admin role detected");
      const { data: branchAdmin, error: branchError } = await supabase
        .from("branch_admin")
        .select("branch")
        .eq("email", email)
        .single();

      if (branchError || !branchAdmin) {
        return NextResponse.json(
          { message: "Branch admin not found" },
          { status: 404 }
        );
      }

      const { data: assigned, error: assignError } = await supabase
        .from("vessel_assignments")
        .select("vessel_id")
        .eq("branch_id", branchAdmin.branch);

      if (assignError) throw assignError;

      vesselIds = assigned?.map((v) => v.vessel_id) || [];
    }

    // 4️⃣ MANAGER
    else if (role === "manager") {
      console.log("i am manager");
      const { data: manager, error: managerError } = await supabase
        .from("manager")
        .select("id")
        .eq("email", email)
        .single();

      if (managerError || !manager) {
        console.error(
          "Manager lookup failed. Error:",
          managerError,
          "Manager:",
          manager
        );
        return NextResponse.json(
          { message: "Manager not found" },
          { status: 404 }
        );
      }

      const { data: assigned, error: assignError } = await supabase
        .from("vessel_assignments")
        .select("vessel_id")
        .eq("manager_id", manager.id);

      if (assignError) {
        console.error("❌ Error fetching manager assignments:", assignError);
        throw assignError;
      }

      vesselIds = assigned?.map((v) => v.vessel_id) || [];
    }

    console.log("ar");

    vesselIds.forEach((item) => {
      console.log(item);
    });
    // 5️⃣ Get vessels for admin/manager roles
    if (vesselIds.length === 0) {
      console.log("mp")
      return NextResponse.json(
        { message: "No vessels assigned", data: [] },
        { status: 200 }
      );
    }

    const { data: vessels, error: vesselError } = await supabase
      .from("vessel_management")
      .select("id, vessel_name")
      .in("id", vesselIds);

    if (vesselError) throw vesselError;

    console.log("this is data", vessels);

    return NextResponse.json(
      {
        message: "Vessels fetched successfully",
        data: vessels,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { message: "Server error occurred", error: err },
      { status: 500 }
    );
  }
}
