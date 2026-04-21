import { integerToEnglishWords, englishWordsToTitleCase } from './integerToEnglishWords';

describe('integerToEnglishWords', () => {
    const expectSafeIntegerError = (n: number) => {
        expect(() => integerToEnglishWords(n)).toThrow(RangeError);
        expect(() => integerToEnglishWords(n)).toThrow('integerToEnglishWords expects a safe integer');
    };

    it('rejects NaN, non-finite, and non-integer values', () => {
        expectSafeIntegerError(NaN);
        expectSafeIntegerError(Number.POSITIVE_INFINITY);
        expectSafeIntegerError(Number.NEGATIVE_INFINITY);
        expectSafeIntegerError(1.5);
    });

    it('rejects integers outside the safe integer range', () => {
        expectSafeIntegerError(Number.MAX_SAFE_INTEGER + 1);
        expectSafeIntegerError(Number.MIN_SAFE_INTEGER - 1);
    });

    it('returns zero for 0', () => {
        const result = integerToEnglishWords(0);
        expect(result).toBe('zero');
        expect(englishWordsToTitleCase(result)).toBe('Zero');
    });

    it('spells 1–19', () => {
        const result = integerToEnglishWords(1);
        expect(result).toBe('one');
        expect(englishWordsToTitleCase(result)).toBe('One');
        const result11 = integerToEnglishWords(11);
        expect(result11).toBe('eleven');
        expect(englishWordsToTitleCase(result11)).toBe('Eleven');
        const result19 = integerToEnglishWords(19);
        expect(result19).toBe('nineteen');
        expect(englishWordsToTitleCase(result19)).toBe('Nineteen');
    });

    it('spells tens and hyphenated compounds under 100', () => {
        const result20 = integerToEnglishWords(20);
        expect(result20).toBe('twenty');
        expect(englishWordsToTitleCase(result20)).toBe('Twenty');
        const result21 = integerToEnglishWords(21);
        expect(result21).toBe('twenty-one');
        expect(englishWordsToTitleCase(result21)).toBe('Twenty One');
        const result99 = integerToEnglishWords(99);
        expect(result99).toBe('ninety-nine');
        expect(englishWordsToTitleCase(result99)).toBe('Ninety Nine');
    });

    it('spells hundreds and combined hundreds + remainder', () => {
        const result100 = integerToEnglishWords(100);
        expect(result100).toBe('one hundred');
        expect(englishWordsToTitleCase(result100)).toBe('One Hundred');

        const result101 = integerToEnglishWords(101);
        expect(result101).toBe('one hundred one');
        expect(englishWordsToTitleCase(result101)).toBe('One Hundred One');

        const result110 = integerToEnglishWords(110);
        expect(result110).toBe('one hundred ten');
        expect(englishWordsToTitleCase(result110)).toBe('One Hundred Ten');

        const result999 = integerToEnglishWords(999);
        expect(result999).toBe('nine hundred ninety-nine');
        expect(englishWordsToTitleCase(result999)).toBe('Nine Hundred Ninety Nine');
    });

    it('spells thousands and skips zero chunks between non-zero groups', () => {
        const result1000 = integerToEnglishWords(1000);
        expect(result1000).toBe('one thousand');
        expect(englishWordsToTitleCase(result1000)).toBe('One Thousand');

        const result1001 = integerToEnglishWords(1001);
        expect(result1001).toBe('one thousand one');
        expect(englishWordsToTitleCase(result1001)).toBe('One Thousand One');

        const result1_000_000 = integerToEnglishWords(1_000_000);
        expect(result1_000_000).toBe('one million');
        expect(englishWordsToTitleCase(result1_000_000)).toBe('One Million');

        const result1_000_001 = integerToEnglishWords(1_000_001);
        expect(result1_000_001).toBe('one million one');
        expect(englishWordsToTitleCase(result1_000_001)).toBe('One Million One');
    });

    it('spells a multi-scale positive number', () => {
        const result = integerToEnglishWords(1234567890123);
        expect(result).toBe(
            'one trillion two hundred thirty-four billion five hundred sixty-seven million eight hundred ninety thousand one hundred twenty-three'
        );
        expect(englishWordsToTitleCase(result)).toBe(
            'One Trillion Two Hundred Thirty Four Billion Five Hundred Sixty Seven Million Eight Hundred Ninety Thousand One Hundred Twenty Three'
        );

    });

    it('prefixes negatives with "negative "', () => {
        const resultNeg1 = integerToEnglishWords(-1);
        expect(resultNeg1).toBe('negative one');
        expect(englishWordsToTitleCase(resultNeg1)).toBe('Negative One');

        const resultNeg21 = integerToEnglishWords(-21);
        expect(resultNeg21).toBe('negative twenty-one');
        expect(englishWordsToTitleCase(resultNeg21)).toBe('Negative Twenty One');

        const resultNeg1001 = integerToEnglishWords(-1001);
        expect(resultNeg1001).toBe('negative one thousand one');
        expect(englishWordsToTitleCase(resultNeg1001)).toBe('Negative One Thousand One');
    });

    it('spells Number.MAX_SAFE_INTEGER', () => {
        const result = integerToEnglishWords(Number.MAX_SAFE_INTEGER);
        expect(result).toBe(
            'nine quadrillion seven trillion one hundred ninety-nine billion two hundred fifty-four million seven hundred forty thousand nine hundred ninety-one',
        );
        expect(englishWordsToTitleCase(result)).toBe(
            'Nine Quadrillion Seven Trillion One Hundred Ninety Nine Billion Two Hundred Fifty Four Million Seven Hundred Forty Thousand Nine Hundred Ninety One',
        );
    });
});
