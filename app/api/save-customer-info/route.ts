// app/api/save-customer-info/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Must use the secret key on the server
);

export async function POST(req: NextRequest) {
  const formData = await req.json();

  const { data, error } = await supabase.from('customer_details').insert([formData]);

  if (error) {
    console.error('Supabase Insert Error:', error);
    return NextResponse.json({ message: 'Error saving customer info', error }, { status: 500 });
  }

  return NextResponse.json({ message: 'Customer info saved successfully!', data }, { status: 200 });
}
