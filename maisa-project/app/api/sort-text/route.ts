import { NextRequest, NextResponse } from 'next/server';
import { buildSortTextResponse, validateNumberArray } from '../../lib/numberWordsSort';

export async function POST(request: NextRequest) {
    // Check authentication

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ success: false, error: 'Invalid JSON body.' }, { status: 400 });
    }

    const validated = validateNumberArray(body);
    if (validated.ok === false) {
        return NextResponse.json({ success: false, error: validated.error }, { status: 400 });
    }

    const data = buildSortTextResponse(validated.numbers);
    return NextResponse.json({ success: true, data }, { status: 200 });
}
