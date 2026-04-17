import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Check authentication

    const body = await request.json();

    
    return NextResponse.json({ success: true, data: 'hello world' }, { status: 200 });
}
