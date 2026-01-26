import { expect, test } from 'vitest'
import { applyHorny, shouldApplyHorny } from './index'

test("shouldApplyHorny_TRUE_UNIVERSAL", () => {
    expect(shouldApplyHorny(new Date(9999, 1), false)).toBeTruthy();
})

test("shouldApplyHorny_TRUE_RELATIVE", () => {
    expect(shouldApplyHorny(new Date(Date.now() + 1000), false)).toBeTruthy();
})

test("shouldApplyHorny_FALSE_UNIVERSAL", () => {
    expect(shouldApplyHorny(new Date(1, 1), false)).toBeFalsy();
})

test("shouldApplyHorny_FALSE_RELATIVE", () => {
    expect(shouldApplyHorny(new Date(Date.now() - 1000), false)).toBeFalsy();
})

test("shouldApplyHorny_TRUE_NOW", () => {
    expect(shouldApplyHorny(new Date(Date.now()), false)).toBeTruthy();
})

test("applyHorny_CONTAINS", () => {
    expect(applyHorny("This message is a test message", new Date(9999, 1), false, ["Test"])).toContain(["Test"]);
})

test("applyHorny_NOT_UNDEFINED", () => {
    expect(applyHorny("This message is a test message", new Date(9999, 1), false).search("undefined")).lessThanOrEqual(0);
})
