import { NextRequest, NextResponse } from 'next/server';
import { buildSortTextResponse, parseSortTextRequestBody } from '../../lib/numberWordsSort';

export async function POST(request: NextRequest) {
    // Check authentication

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ success: false, error: 'Invalid JSON body.' }, { status: 400 });
    }

    const parsed = parseSortTextRequestBody(body);
    if (parsed.ok === false) {
        return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
    }

    const data = buildSortTextResponse(parsed.numbers);
    return NextResponse.json({ success: true, data }, { status: 200 });
}
