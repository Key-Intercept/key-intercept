import { expect, test } from 'vitest'
import { applyGag, shouldApplyGag } from './index'

test("shouldApplyGag_TRUE_UNIVERSAL", () => {
    expect(shouldApplyGag(new Date(9999, 1), false)).toBeTruthy();
})

test("shouldApplyGag_TRUE_RELATIVE", () => {
    expect(shouldApplyGag(new Date(Date.now() + 1000), false)).toBeTruthy();
})

test("shouldApplyGag_FALSE_UNIVERSAL", () => {
    expect(shouldApplyGag(new Date(1, 1), false)).toBeFalsy();
})

test("shouldApplyGag_FALSE_RELATIVE", () => {
    expect(shouldApplyGag(new Date(Date.now() - 1000), false)).toBeFalsy();
})

test("shouldApplyGag_TRUE_NOW", () => {
    expect(shouldApplyGag(new Date(Date.now()), false)).toBeTruthy();
})

let GLOBALDATE = new Date(9999, 1);

test("applyGag_BLANK", () => {
    expect(applyGag("", GLOBALDATE, false)).toBe("");
})

test("applyGag_LOWERCASE_WORD", () => {
    const input = "test"
    const output = applyGag(input, GLOBALDATE, false);
    expect(output[0]).toBeOneOf(["g", "h"]);
    expect(output[1]).toBe("e");
    expect(output[2]).toBeOneOf(["g", "h"]);
    expect(output[3]).toBeOneOf(["g", "h"]);
})

test("applyGag_UPPERCASE_WORD", () => {
    const input = "TEST"
    const output = applyGag(input, GLOBALDATE, false);
    expect(output[0]).toBeOneOf(["G", "H"]);
    expect(output[1]).toBe("E");
    expect(output[2]).toBeOneOf(["G", "H"]);
    expect(output[3]).toBeOneOf(["G", "H"]);
})

test("applyGag_MIXED_WORD", () => {
    const input = "Test"
    const output = applyGag(input, GLOBALDATE, false);
    expect(output[0]).toBeOneOf(["G", "H"]);
    expect(output[1]).toBe("e");
    expect(output[2]).toBeOneOf(["g", "h"]);
    expect(output[3]).toBeOneOf(["g", "h"]);
})

test("applyGag_PUNCTUATION", () => {
    const input = "?!.,:;#*-()~"
    const output = applyGag(input, GLOBALDATE, false);
    expect(output).eq(input);
})

test("applyGag_LOWERCASE_GH", () => {
    const input = "ghabc";
    const output = applyGag(input, GLOBALDATE, false);
    expect(output[0]).toBe("g");
    expect(output[1]).toBe("h");
    expect(output[2]).toBe("a");
    expect(output[3]).toBeOneOf(["g", "h"]);
    expect(output[4]).toBeOneOf(["g", "h"]);
})

test("applyGag_UPPERCASE_GH", () => {
    const input = "GHABC";
    const output = applyGag(input, GLOBALDATE, false);
    expect(output[0]).toBe("G");
    expect(output[1]).toBe("H");
    expect(output[2]).toBe("A");
    expect(output[3]).toBeOneOf(["G", "H"]);
    expect(output[4]).toBeOneOf(["G", "H"]);
})

test("applyGag_LOWERCASE_VOWELS", () => {
    const input = "aeiou";
    const output = applyGag(input, GLOBALDATE, false);
    expect(output).eq(input);
})

test("applyGag_UPPERCASE_VOWELS", () => {
    const input = "AEIOU";
    const output = applyGag(input, GLOBALDATE, false);
    expect(output).eq(input);
})
