/** Only optional leading minus, then digits — no decimals, scientific notation, or signs elsewhere. */
const WHOLE_NUMBER_TOKEN = /^-?\d+$/;
export default function validateCommaSeparatedNumbers(input) {
    const parts = input.split(',').map((s) => s.trim())
    if (parts.length === 0) {
        return { ok: false, parts: [], error: 'Enter at least one number.' };
    }
    const normalizedParts = [];
    for (const p of parts) {
        if (p.length < 1) {
            return {
                ok: false,
                parts: parts,
                error: 'Empty number detected. Please ensure all numbers are valid whole numbers.',
            };
        }
        if (!WHOLE_NUMBER_TOKEN.test(p)) {
            return {
                ok: false,
                parts: parts,
                error: `Invalid whole number: "${p}". Use digits only (e.g. 0, 1, 2, -3).`,
            };
        }
        const n = Number(p);
        if (!Number.isSafeInteger(n)) {
            return {
                ok: false,
                parts: parts,
                error: `Number out of range: "${p}".`,
            };
        }
        normalizedParts.push(n);
    }
    console.log('Validated parts:', normalizedParts);
    return { ok: true, parts: normalizedParts, error: null };
}