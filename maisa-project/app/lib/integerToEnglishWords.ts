const ONES = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
] as const;

const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'] as const;

/** Scale suffix for each 1000^i group; index 0 is the lowest (ones) group — no suffix. */
const SCALES = [
    '',
    'thousand',
    'million',
    'billion',
    'trillion',
    'quadrillion',
    'quintillion',
    'sextillion',
    'septillion',
    'octillion',
    'nonillion',
    'decillion',
] as const;

function wordsUnder100(n: number): string {
    if (n < 1 || n > 99) {
        throw new RangeError('wordsUnder100 expects 1-99');
    }
    if (n < 20) {
        return ONES[n];
    }
    const t = Math.floor(n / 10);
    const o = n % 10;
    return o ? `${TENS[t]}-${ONES[o]}` : TENS[t];
}

function words1to999(n: number): string {
    if (n < 1 || n > 999) {
        throw new RangeError('words1to999 expects 1–999');
    }
    if (n < 100) {
        return wordsUnder100(n);
    }
    const h = Math.floor(n / 100);
    const r = n % 100;
    return r ? `${ONES[h]} hundred ${wordsUnder100(r)}` : `${ONES[h]} hundred`;
}

function positiveSafeIntegerToWords(n: number): string {
    if (n === 0) {
        return 'zero';
    }
    const chunks: number[] = [];
    let x = n;
    while (x > 0) {
        chunks.push(x % 1000);
        x = Math.floor(x / 1000);
    }
    const parts: string[] = [];
    for (let i = chunks.length - 1; i >= 0; i--) {
        const chunk = chunks[i];
        if (chunk === 0) {
            continue;
        }
        const scale = SCALES[i];
        if (scale === undefined) {
            throw new RangeError('Number is too large to spell out');
        }
        const base = words1to999(chunk);
        parts.push(scale ? `${base} ${scale}` : base);
    }
    return parts.join(' ');
}

/**
 * English words for any safe integer. Lowercase, hyphenated compounds (e.g. twenty-one).
 */
export function integerToEnglishWords(n: number): string {
    if (!Number.isSafeInteger(n)) {
        throw new RangeError('integerToEnglishWords expects a safe integer');
    }
    if (n < 0) {
        return `negative ${integerToEnglishWords(-n)}`;
    }
    return positiveSafeIntegerToWords(n);
}

function capitalizeToken(token: string): string {
    if (token.length === 0) {
        return token;
    }
    return token[0].toUpperCase() + token.slice(1).toLowerCase();
}

/**
 * Title Case for output from {@link integerToEnglishWords} (splits on spaces and hyphens).
 */
export function englishWordsToTitleCase(words: string): string {
    return words
        .split(/[\s-]+/)
        .filter(Boolean)
        .map(capitalizeToken)
        .join(' ');
}
