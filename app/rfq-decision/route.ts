import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { decisions } = body;

    if (!decisions || !Array.isArray(decisions) || decisions.length === 0) {
      return NextResponse.json({ error: "Invalid or empty data" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("rfq_decision")
      .insert(decisions);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Decisions inserted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
