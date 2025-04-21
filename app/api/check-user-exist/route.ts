import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, userId }: { email: string; userId: string } = await req.json();

    if (!email || !userId) {
      return NextResponse.json({ message: 'Email and userId are required' }, { status: 400 });
    }

    // Step 1: Get user from auth.users
    const { data, error: userError } = await supabaseAdmin.auth.admin.listUsers();

    if (userError || !data?.users?.length) {
      console.error("User fetch error:", userError);
      return NextResponse.json({ exists: false });
    }

    const authUser = data.users.find((user) => user.email === email);

    if (!authUser) {
      return NextResponse.json({ exists: false });
    }

    const authUserId = authUser.id;

    // Step 2: Get user_role from profiles
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('user_role')
      .eq('id', authUserId)
      .single();

    if (profileError || !profileData) {
      console.error("Profile fetch error:", profileError);
      return NextResponse.json({ message: 'Error fetching profile' }, { status: 500 });
    }

    if (profileData.user_role !== 'vendor') {
      return NextResponse.json({ exists: true, linked: false });
    }

    // Step 3: Get merchant by business_email
    const { data: merchantData, error: merchantError } = await supabaseAdmin
      .from('merchant')
      .select('id, parent_id')
      .eq('business_email', email)
      .single();

    if (merchantError || !merchantData) {
      console.error("Merchant fetch error:", merchantError);
      return NextResponse.json({ message: 'Vendor found, but merchant not found' }, { status: 404 });
    }

    // Step 4: Check parent role
    const { data: parentProfile, error: parentError } = await supabaseAdmin
      .from('profiles')
      .select('user_role')
      .eq('id', merchantData.parent_id)
      .single();

    if (parentError || !parentProfile) {
      console.error("Parent profile fetch error:", parentError);
      return NextResponse.json({ message: 'Error checking parent role' }, { status: 500 });
    }

    if (parentProfile.user_role !== 'admin') {
      return NextResponse.json({ message: 'Vendor already exists' }, { status: 403 });
    }

    // Step 5: Insert into vendor_access
    const { error: insertError } = await supabaseAdmin
      .from('vendor_access')
      .insert({
        vendor_id: merchantData.id,
        customer_id: userId
      });

    if (insertError) {
      console.error("Insert vendor_access error:", insertError);
      return NextResponse.json({ message: 'Error inserting into vendor_access' }, { status: 500 });
    }

    return NextResponse.json({ exists: true, linked: true });

  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
