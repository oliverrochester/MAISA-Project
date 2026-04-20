import { buildSortTextResponse, parseSortTextRequestBody } from './numberWordsSort';

describe('buildSortTextResponse', () => {
    it('Test sorting only text type numbers, postives and negatives, and zero', () => {
        const parsed = parseSortTextRequestBody([3, 2, 1, 0, -1, -2, -3]);
        expect(parsed.ok).toBe(true);
        if (!parsed.ok) throw new Error("Expected parsing to succeed");
        const result = buildSortTextResponse(parsed.numbers);
        expect(result.map((r) => r.number)).toEqual([-1, -3, -2, 1, 3, 2, 0]);
        expect(result.map((r) => r.value)).toEqual(['Negative One', 'Negative Three', 'Negative Two', 'One', 'Three', 'Two', 'Zero']);
        expect(result.every((r) => r.type === 'text')).toBe(true);
    });

    it('handles negative numbers and zero correctly', () => {
        const result = buildSortTextResponse([0, -1, -2]);
        expect(result.map((r) => r.number)).toEqual([-1, -2, 0]);
        expect(result.map((r) => r.value)).toEqual(['Negative One', 'Negative Two', 'Zero']);
        expect(result.every((r) => r.type === 'text')).toBe(true);
    });

    it('Tests sorting only large numbers with image type', () => {
        const parsed = parseSortTextRequestBody([9005, -9006, 10000, 100867, 8008475]);
        expect(parsed.ok).toBe(true);
        if (!parsed.ok) throw new Error("Expected parsing to succeed");
        const result = buildSortTextResponse(parsed.numbers);
        expect(result.map((r) => r.number)).toEqual([8008475, -9006, 9005, 100867, 10000]);
        expect(result.map((r) => r.value)).toEqual([
            'Eight Million Eight Thousand Four Hundred Seventy Five',
            'Negative Nine Thousand Six',
            'Nine Thousand Five',
            'One Hundred Thousand Eight Hundred Sixty Seven',
            'Ten Thousand'
        ]);
        expect(result[0].type).toBe('image');
        expect(result[1].type).toBe('text');
        expect(result[2].type).toBe('image');
        expect(result[3].type).toBe('image');
        expect(result[4].type).toBe('image');
    });

    it('Edge Case: Tests sorting with text to image transition [9000, 9001]', () => {
        const parsed = parseSortTextRequestBody([9001, 9000]);
        expect(parsed.ok).toBe(true);
        if (!parsed.ok) throw new Error("Expected parsing to succeed");
        const result = buildSortTextResponse(parsed.numbers);
        expect(result.map((r) => r.number)).toEqual([9000, 9001]);
        expect(result.map((r) => r.value)).toEqual([
            'Nine Thousand',
            'Nine Thousand One',
        ]);
         expect(result[0].type).toBe('text');
          expect(result[1].type).toBe('image');
    });

    it('Tests sorting correctly with a mix of small text and large image numbers', () => {
        const parsed = parseSortTextRequestBody([0, 9001, -1, -9002, 9002, 2]);
        expect(parsed.ok).toBe(true);
        if (!parsed.ok) throw new Error("Expected parsing to succeed");
        const result = buildSortTextResponse(parsed.numbers);
        expect(result.map((r) => r.number)).toEqual([-9002, -1, 9001, 9002, 2, 0]);
        expect(result.map((r) => r.value)).toEqual([
            'Negative Nine Thousand Two',
            'Negative One',
            'Nine Thousand One',
            'Nine Thousand Two',
            'Two',
            'Zero',
        ]);
        expect(result[0].type).toBe('text');
        expect(result[1].type).toBe('text');
        expect(result[2].type).toBe('image');
        expect(result[3].type).toBe('image');
        expect(result[4].type).toBe('text');
        expect(result[5].type).toBe('text');
    });

    

    it('rejects singular positive unsafe integer in parseSortTextRequestBody', () => {
        const unsafePositiveInteger = Number.MAX_SAFE_INTEGER + 1;
        expect(parseSortTextRequestBody([unsafePositiveInteger])).toEqual({
            ok: false,
            error: 'Invalid number at index 0: expected a safe whole number.',
        });
    });

    it('rejects singular negative unsafe integer in parseSortTextRequestBody', () => {
        const unsafeNegativeInteger = Number.MIN_SAFE_INTEGER - 1;
        expect(parseSortTextRequestBody([unsafeNegativeInteger])).toEqual({
            ok: false,
            error: 'Invalid number at index 0: expected a safe whole number.',
        });
    });

    it('rejects unsafe positive integer mixed with safe integers in parseSortTextRequestBody', () => {
        const unsafePositiveInteger = Number.MAX_SAFE_INTEGER + 1;
        expect(parseSortTextRequestBody([1, unsafePositiveInteger, 2])).toEqual({
            ok: false,
            error: 'Invalid number at index 1: expected a safe whole number.',
        });
    });

    it('rejects unsafe negative integer mixed with safe integers in parseSortTextRequestBody', () => {
        const unsafeNegativeInteger = Number.MIN_SAFE_INTEGER - 1;
        expect(parseSortTextRequestBody([1, unsafeNegativeInteger, 2])).toEqual({
            ok: false,
            error: 'Invalid number at index 1: expected a safe whole number.',
        });
    });

    it('rejects singular text in parseSortTextRequestBody', () => {
        expect(parseSortTextRequestBody(['hello'])).toEqual({
            ok: false,
            error: 'Invalid number at index 0: expected a safe whole number.',
        });
    });

    it('rejects text mixed with safe integers in parseSortTextRequestBody', () => {
        expect(parseSortTextRequestBody([1,'hello', 2])).toEqual({
            ok: false,
            error: 'Invalid number at index 1: expected a safe whole number.',
        });
    });

    it('rejects singular NAN in parseSortTextRequestBody', () => {
        expect(parseSortTextRequestBody([NaN])).toEqual({
            ok: false,
            error: 'Invalid number at index 0: expected a safe whole number.',
        });
    });

    it('rejects NAN mixed with safe integers in parseSortTextRequestBody', () => {
        expect(parseSortTextRequestBody([1, NaN, 2])).toEqual({
            ok: false,
            error: 'Invalid number at index 1: expected a safe whole number.',
        });
    });

    it('rejects empty array in parseSortTextRequestBody', () => {
        expect(parseSortTextRequestBody([])).toEqual({
            ok: false,
            error: 'Array must contain at least one number.',
        });
    });

    it('rejects invalid JSON array in parseSortTextRequestBody', () => {
        expect(parseSortTextRequestBody({})).toEqual({
            ok: false,
            error: 'Request body must be a JSON array of whole numbers.',
        });
    });
});
