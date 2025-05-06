import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'arun@123') as {
      rfqId: string;
      role: string;
      email: string;
    };

    if (!decoded || decoded.role !== 'director') {
      return NextResponse.json({ error: 'Invalid role or token' }, { status: 403 });
    }

    const { rfqId, email } = decoded;

    // Update the existing approval entry for this director
    const { error, data } = await supabase
      .from('rfq_approval_flow')
      .update({ status: 'approved', action_by:null})
      .eq('rfq_id', rfqId)
      .eq('role', 'director')
      .eq('email', email);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: 'Failed to update approval status' }, { status: 500 });
    }

    return NextResponse.json({ message: 'RFQ approved successfully' }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}
