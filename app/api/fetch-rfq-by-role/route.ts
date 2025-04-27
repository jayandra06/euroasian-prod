import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function POST(req: NextRequest) {
  const supabase = createClient();

  const { userRole, customerId } = await req.json(); // Get the body of the request

  console.log("Received userRole:", userRole);
  console.log("Received customerId:", customerId);

  try {
    if (userRole === "customer") {

      console.log("Fetching RFQs for customer role");
      // Step 1: Get branch ids for this customer
      
      const { data: branches, error: branchError } = await supabase
        .from('branch')
        .select('id')
        .eq('customer_id', customerId);

      if (branchError) {
        return NextResponse.json({ error: branchError.message }, { status: 500 });
      }

      const branchIds = branches?.map(branch => branch.id);

      if (!branchIds || branchIds.length === 0) {
        return NextResponse.json({ data: [] }, { status: 200 });
      }

      // Step 2: Get branch_admins for these branches
      const { data: branchAdmins, error: branchAdminError } = await supabase
        .from('branch_admin')
        .select('customer_id') // user_id
        .in('branch', branchIds);

      if (branchAdminError) {
        return NextResponse.json({ error: branchAdminError.message }, { status: 500 });
      }

      const branchAdminCustomerIds = branchAdmins?.map(admin => admin.customer_id);

      if (!branchAdminCustomerIds || branchAdminCustomerIds.length === 0) {
        return NextResponse.json({ data: [] }, { status: 200 });
      }

      // Step 3: Get RFQs where action_by is one of these customer ids
      const { data: rfqs, error: rfqError } = await supabase
        .from('rfq_approval_flow')
        .select('rfq:rfq_id ( * )') // join RFQ table
        .eq('status', 'requested')
        .eq('role', 'branch_admin')
        .in('action_by', branchAdminCustomerIds);

      if (rfqError) {
        return NextResponse.json({ error: rfqError.message }, { status: 500 });
      }

      const rfqList = rfqs?.map(flow => flow.rfq);

      return NextResponse.json({ data: rfqList }, { status: 200 });
    }

    else if (userRole === "branch_admin") {
      
      // Step 1: Get the branch ID for this branch_admin
      const { data: branchData, error: branchDataError } = await supabase
        .from('branch_admin')
        .select('branch')
        .eq('customer_id', customerId) // This is the branch_admin's customer_id
        .single(); // Assuming the branch_admin is associated with one branch

      if (branchDataError || !branchData) {
        return NextResponse.json({ error: branchDataError?.message || 'Branch data not found' }, { status: 500 });
      }

      const branchId = branchData.branch;

      // Step 2: Get manager customer_ids for this branch
      const { data: managers, error: managerError } = await supabase
        .from('manager')
        .select('customer_id')
        .eq('branch_id', branchId);

      if (managerError || !managers?.length) {
        return NextResponse.json({ error: managerError?.message || 'Managers not found' }, { status: 500 });
      }

      const managerCustomerIds = managers.map(manager => manager.customer_id);

      // Step 3: Get RFQs where action_by is one of these manager customer_ids
      const { data: rfqs, error: rfqError } = await supabase
        .from('rfq_approval_flow')
        .select('rfq:rfq_id ( * )') // join RFQ table
        .eq('status', 'requested')
        .eq('role', 'manager')
        .in('action_by', managerCustomerIds);

      if (rfqError) {
        return NextResponse.json({ error: rfqError.message }, { status: 500 });
      }

      const rfqList = rfqs?.map(flow => flow.rfq);

      return NextResponse.json({ data: rfqList }, { status: 200 });
    } 

    else {
      // If neither "customer" nor "branch_admin"
      return NextResponse.json({ error: "Invalid userRole" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Unexpected error occurred." }, { status: 500 });
  }
}
