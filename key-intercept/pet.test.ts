import { expect, test } from 'vitest'
import { applyPet, shouldApplyPet } from './index'

test("shouldApplyPet_TRUE_UNIVERSAL_MAX", () => {
    expect(shouldApplyPet(new Date(9999, 1), 1.0, false)).toBeTruthy();
})

test("shouldApplyPet_TRUE_UNIVERSAL_MID", () => {
    expect(shouldApplyPet(new Date(9999, 1), 0.5, false)).toBeTruthy();
})

test("shouldApplyPet_TRUE_UNIVERSAL_MIN", () => {
    expect(shouldApplyPet(new Date(9999, 1), 0.0, false)).toBeFalsy();
})

test("shouldApplyPet_TRUE_RELATIVE_MAX", () => {
    expect(shouldApplyPet(new Date(Date.now() + 1000), 1.0, false)).toBeTruthy();
})

test("shouldApplyPet_TRUE_RELATIVE_MID", () => {
    expect(shouldApplyPet(new Date(Date.now() + 1000), 0.5, false)).toBeTruthy();
})

test("shouldApplyPet_TRUE_RELATIVE_MIN", () => {
    expect(shouldApplyPet(new Date(Date.now() + 1000), 0.0, false)).toBeFalsy();
})

test("shouldApplyPet_NOW_MAX", () => {
    expect(shouldApplyPet(new Date(Date.now()), 1.0, false)).toBeTruthy();
})

test("shouldApplyPet_NOW_MID", () => {
    expect(shouldApplyPet(new Date(Date.now()), 0.5, false)).toBeTruthy();
})

test("shouldApplyPet_NOW_MIN", () => {
    expect(shouldApplyPet(new Date(Date.now()), 0.0, false)).toBeFalsy();
})

test("shouldApplyPet_FALSE_UNIVERSAL_MAX", () => {
    expect(shouldApplyPet(new Date(1, 1), 1.0, false)).toBeFalsy();
})

test("shouldApplyPet_FALSE_UNIVERSAL_MID", () => {
    expect(shouldApplyPet(new Date(1, 1), 0.5, false)).toBeFalsy();
})

test("shouldApplyPet_FALSE_UNIVERSAL_MIN", () => {
    expect(shouldApplyPet(new Date(1, 1), 0.0, false)).toBeFalsy();
})

test("shouldApplyPet_FALSE_RELATIVE_MAX", () => {
    expect(shouldApplyPet(new Date(Date.now() - 1000), 1.0, false)).toBeFalsy();
})

test("shouldApplyPet_FALSE_RELATIVE_MID", () => {
    expect(shouldApplyPet(new Date(Date.now() - 1000), 0.5, false)).toBeFalsy();
})

test("shouldApplyPet_FALSE_RELATIVE_MIN", () => {
    expect(shouldApplyPet(new Date(Date.now() - 1000), 0.0, false)).toBeFalsy();
})

test("applyPet_MIN_BLANK", () => {
    expect(applyPet("", new Date(9999, 1), 0.0, ["moo"], false).trim()).toBe("");
})

test("applyPet_MID_BLANK", () => {
    expect(applyPet("", new Date(9999, 1), 0.5, ["moo"], false).trim()).toBeOneOf(["moo", ""]);
})

test("applyPet_MAX_BLANK", () => {
    expect(applyPet("", new Date(9999, 1), 1.0, ["moo"], false).trim()).toBe("moo");
})

test("applyPet_MIN_SPACE", () => {
    expect(applyPet(" ", new Date(9999, 1), 0.0, ["moo"], false).trim()).toBe("");
})

test("applyPet_MAX_SPACE", () => {
    expect(applyPet(" ", new Date(9999, 1), 1.0, ["moo"], false).trim()).toContain("moo");
})

test("applyPet_MIN_ONEWORD", () => {
    expect(applyPet("test", new Date(9999, 1), 0.0, ["moo"], false).trim()).toBe("test");
})

test("applyPet_MID_ONEWORD", () => {
    expect(applyPet("test", new Date(9999, 1), 0.5, ["moo"], false).trim()).toBeOneOf(["test", "moo"]);
})

test("applyPet_MAX_ONEWORD", () => {
    expect(applyPet("test", new Date(9999, 1), 1.0, ["moo"], false).trim()).toBe("moo");
})

test("applyPet_MIN_MULTIWORD_MSG", () => {
    expect(applyPet("this is a test", new Date(9999, 1), 0.0, ["moo"], false).trim()).toBe("this is a test");
})

test("applyPet_MID_MULTIWORD_MSG", () => {
    expect(applyPet("this is a test", new Date(9999, 1), 0.5, ["moo"], false).split(" ")[1].trim()).toBeOneOf(["is", "moo"]);
})

test("applyPet_MAX_MULTIWORD_MSG", () => {
    expect(applyPet("this is a test", new Date(9999, 1), 1.0, ["moo"], false).trim()).toBe("moo moo moo moo");
})

test("applyPet_MIN_MULTIWORD_PET", () => {
    expect(applyPet("test", new Date(9999, 1), 0.0, ["mew", "meow", "nya"], false).trim()).toBe("test");
})

test("applyPet_MID_MULTIWORD_PET", () => {
    expect(applyPet("test", new Date(9999, 1), 0.5, ["mew", "meow", "nya"], false).trim()).toBeOneOf(["test", "mew", "meow", "nya"]);
})

test("applyPet_MAX_MULTIWORD_PET", () => {
    expect(applyPet("test", new Date(9999, 1), 1.0, ["mew", "meow", "nya"], false).trim()).toBeOneOf(["mew", "meow", "nya"]);
})
