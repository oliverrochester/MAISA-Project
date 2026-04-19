import { NextRequest, NextResponse } from 'next/server';
import { buildLargeNumberSvg } from '../../lib/largeNumberSvg';

export async function GET(request: NextRequest) {
    const raw = request.nextUrl.searchParams.get('n');
    if (raw === null || raw === '') {
        return NextResponse.json({ success: false, error: 'Query parameter n is required.' }, { status: 400 });
    }

    if (!/^-?\d+$/.test(raw)) {
        return NextResponse.json({ success: false, error: 'n must be an integer string.' }, { status: 400 });
    }

    const n = Number(raw);
    if (!Number.isSafeInteger(n)) {
        return NextResponse.json({ success: false, error: 'n must be a safe integer.' }, { status: 400 });
    }

    if (Math.abs(n) <= 9000) {
        return NextResponse.json(
            { success: false, error: 'Images are only provided for numbers with |n| > 9000.' },
            { status: 400 },
        );
    }

    const svg = buildLargeNumberSvg(n);

    return new NextResponse(svg, {
        status: 200,
        headers: {
            'Content-Type': 'image/svg+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=31536000, immutable',
        },
    });
}
