import { expect, test } from 'vitest'
import { applyRules, shouldApplyRules } from './index'
import { Rule } from './types'

test("shouldApplyRules_TRUE_UNIVERSAL", () => {
    expect(shouldApplyRules(new Date(9999, 1), false)).toBeTruthy();
})

test("shouldApplyRules_TRUE_RELATIVE", () => {
    expect(shouldApplyRules(new Date(Date.now() + 1000), false)).toBeTruthy();
})

test("shouldApplyRules_FALSE_UNIVERSAL", () => {
    expect(shouldApplyRules(new Date(1, 1), false)).toBeFalsy();
})

test("shouldApplyRules_FALSE_RELATIVE", () => {
    expect(shouldApplyRules(new Date(Date.now() - 1000), false)).toBeFalsy();
})

test("shouldApplyRules_TRUE_NOW", () => {
    expect(shouldApplyRules(new Date(Date.now()), false)).toBeTruthy();
})

const testRule = {rule_regex: "test", rule_replacement: "exam", enabled: true, chance_to_apply: 100, id: BigInt(0), config_id: BigInt(0), created_at: new Date(0, 1), updated_at: new Date(0, 1) } as Rule;

test("applyRules_BLANK", () => {
    expect(applyRules("", [testRule], new Date(9999, 1), false)).toBe("");
});

test("applyRules_BLANK_RULES", () => {
    expect(applyRules("this is a test", [], new Date(9999, 1), false)).toBe("this is a test");
});

test("applyRules_SINGLEWORD_MATCH", () => {
    expect(applyRules("test", [testRule], new Date(9999, 1), true)).toBe("exam");
});

test("applyRules_SINGLEWORD_NOMATCH", () => {
    expect(applyRules("hello", [testRule], new Date(9999, 1), false)).toBe("hello");
});

test("applyRules_MULTIPLEWORDS_MATCH", () => {
    expect(applyRules("this is a test", [testRule], new Date(9999, 1), false)).toBe("this is a exam");
});

test("applyRules_MULTIPLEWORDS_NOMATCH", () => {
    expect(applyRules("this is a quiz", [testRule], new Date(9999, 1), false)).toBe("this is a quiz");
});

test("applyRules_DISABLED_RULE", () => {
    const disabledRule = { ...testRule, enabled: false };
    expect(applyRules("this is a test", [disabledRule], new Date(9999, 1), false)).toBe("this is a test");
});

test("applyRules_MULTIPLE_RULES", () => {
const anotherRule = {rule_regex: "hello", rule_replacement: "hi", enabled: true, chance_to_apply: 100, id: BigInt(0), config_id: BigInt(0), created_at: new Date(0, 1), updated_at: new Date(0, 1) } as Rule;
    expect(applyRules("hello this is a test", [testRule, anotherRule], new Date(9999, 1), false)).toBe("hi this is a exam");
});
