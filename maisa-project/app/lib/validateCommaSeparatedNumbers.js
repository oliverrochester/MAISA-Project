/** Only optional leading minus, then digits — no decimals, scientific notation, or signs elsewhere. */
const WHOLE_NUMBER_TOKEN = /^-?\d+$/;
export default function validateCommaSeparatedNumbers(input) {
    const parts = input.split(',').map((s) => s.trim())
    if (parts.length === 1 && parts[0] == '') {
        return { ok: false, parts: [], error: 'Enter at least one number (e.g. 1, 2, 15, -42).' };
    }
    const numberParts = [];
    for (const p of parts) {
        if (p.length < 1) {
            return {
                ok: false,
                error: 'Empty number detected. Please ensure all numbers are valid whole numbers (e.g. 1, 2, 15, -42).',
            };
        }
        if (p.includes('\n')) {
            return {
                ok: false,
                error: 'Newline character detected. Please enter numbers separated by commas only.',
            };
        }
        if (!WHOLE_NUMBER_TOKEN.test(p)) {
            return {
                ok: false,
                error: `Invalid whole number: "${p}". Use whole numbers only (e.g. 1, 2, 15, -42).`,
            };
        }
        const n = Number(p);
        if (!Number.isSafeInteger(n)) {
            const displayP = p.length > 20 ? p.substring(0, 20) + '...' : p;
            return {
                ok: false,
                error: `Number too large: "${displayP}". Use whole numbers only (e.g. 1, 2, 15, -42).`,
            };
        }
        numberParts.push(n);
    }
    return { ok: true, parts: numberParts, error: null };
}