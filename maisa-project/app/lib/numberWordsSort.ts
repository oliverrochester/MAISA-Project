import { Buffer } from 'node:buffer';
import { buildLargeNumberSvg } from './largeNumberSvg';
import { englishWordsToTitleCase, integerToEnglishWords } from './integerToEnglishWords';

export type SortTextTextRow = {
    type: 'text';
    number: number;
    value: string;
};

export type SortTextImageRow = {
    type: 'image';
    number: number;
    value: string;
    image: string;
};

export type SortTextRow = SortTextTextRow | SortTextImageRow;

function svgToDataUrl(svg: string): string {
    const b64 = Buffer.from(svg, 'utf8').toString('base64');
    return `data:image/svg+xml;base64,${b64}`;
}

export function validateNumberArray(body: unknown): { ok: true; numbers: number[] } | { ok: false; error: string } {
    if (!Array.isArray(body)) {
        return { ok: false, error: 'Request body must be a JSON array of whole numbers.' };
    }
    if (body.length === 0) {
        return { ok: false, error: 'Array must contain at least one number.' };
    }
    const numbers: number[] = [];
    for (let i = 0; i < body.length; i++) {
        const v = body[i];
        if (typeof v !== 'number' || !Number.isInteger(v) || !Number.isSafeInteger(v)) {
            return { ok: false, error: `Invalid number at index ${i}: expected a safe whole number.` };
        }
        numbers.push(v);
    }
    return { ok: true, numbers };
}

export function buildSortTextResponse(nums: number[]): SortTextRow[] {
    const rows: { row: SortTextRow; index: number; sortKey: string }[] = [];

    nums.forEach((n, index) => {
        const rawWords = integerToEnglishWords(n);
        const value = englishWordsToTitleCase(rawWords);

        if (n > 9000) {
            const svg = buildLargeNumberSvg(n);
            rows.push({
                row: {
                    type: 'image',
                    number: n,
                    value: value,
                    image: svgToDataUrl(svg),
                },
                index,
                sortKey: rawWords,
            });
        } else {
            rows.push({
                row: {
                    type: 'text',
                    number: n,
                    value: value
                },
                index,
                sortKey: rawWords,
            });
        }
    });

    rows.sort((a, b) => {
        const cmp = a.sortKey.localeCompare(b.sortKey, 'en', { sensitivity: 'base' });
        if (cmp !== 0) {
            return cmp;
        }
        return a.index - b.index;
    });

    return rows.map((r) => r.row);
}
