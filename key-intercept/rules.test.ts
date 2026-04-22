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

const testRule = {rule_regex: RegExp("test"), rule_replacement: "exam", enabled: true, chance_to_apply: 100, id: BigInt(0), config_id: BigInt(0), created_at: new Date(0, 1), updated_at: new Date(0, 1) } as Rule;

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
const anotherRule = {rule_regex: RegExp("hello"), rule_replacement: "hi", enabled: true, chance_to_apply: 100, id: BigInt(0), config_id: BigInt(0), created_at: new Date(0, 1), updated_at: new Date(0, 1), order: 0, label: "" } as Rule;
    expect(applyRules("hello this is a test", [testRule, anotherRule], new Date(9999, 1), false)).toBe("hi this is a exam");
});

test("applyRules_ASCII_RULE_MATCHES_FULLWIDTH_TEXT", () => {
    expect(applyRules("this is a ｔｅｓｔ", [testRule], new Date(9999, 1), false)).toBe("this is a exam");
});

test("applyRules_ASCII_RULE_MATCHES_MATH_BOLD_TEXT", () => {
    expect(applyRules("this is a 𝐭𝐞𝐬𝐭", [testRule], new Date(9999, 1), false)).toBe("this is a exam");
});

test("applyRules_ASCII_RULE_MATCHES_MATH_MONOSPACE_TEXT", () => {
    expect(applyRules("this is a 𝚝𝚎𝚜𝚝", [testRule], new Date(9999, 1), false)).toBe("this is a exam");
});

test("applyRules_ASCII_RULE_MATCHES_MATH_FRAKTUR_TEXT", () => {
    expect(applyRules("this is a 𝖙𝖊𝖘𝖙", [testRule], new Date(9999, 1), false)).toBe("this is a exam");
});

test("applyRules_ORDER_APPLIES_LOWEST_ORDER_FIRST", () => {
    const rule1 = {
        rule_regex: RegExp("cat"),
        rule_replacement: "dog",
        enabled: true,
        chance_to_apply: 100,
        id: BigInt(1),
        config_id: BigInt(1),
        created_at: new Date(0, 1),
        updated_at: new Date(0, 1),
        label: "cat->dog",
        order: 2,
    } as Rule;

    const rule2 = {
        rule_regex: RegExp("dog"),
        rule_replacement: "wolf",
        enabled: true,
        chance_to_apply: 100,
        id: BigInt(2),
        config_id: BigInt(1),
        created_at: new Date(0, 1),
        updated_at: new Date(0, 1),
        label: "dog->wolf",
        order: 1,
    } as Rule;

    expect(applyRules("cat", [rule1, rule2], new Date(9999, 1), false)).toBe("dog");
});

test("applyRules_ORDER_CHANGES_FINAL_OUTPUT", () => {
    const first = {
        rule_regex: RegExp("ab"),
        rule_replacement: "x",
        enabled: true,
        chance_to_apply: 100,
        id: BigInt(3),
        config_id: BigInt(1),
        created_at: new Date(0, 1),
        updated_at: new Date(0, 1),
        label: "ab->x",
        order: 1,
    } as Rule;

    const second = {
        rule_regex: RegExp("x"),
        rule_replacement: "y",
        enabled: true,
        chance_to_apply: 100,
        id: BigInt(4),
        config_id: BigInt(1),
        created_at: new Date(0, 1),
        updated_at: new Date(0, 1),
        label: "x->y",
        order: 2,
    } as Rule;

    expect(applyRules("ab", [second, first], new Date(9999, 1), false)).toBe("y");
});

test("applyRules_ORDER_TIE_USES_ARRAY_ORDER", () => {
    const sameOrderA = {
        rule_regex: RegExp("a"),
        rule_replacement: "b",
        enabled: true,
        chance_to_apply: 100,
        id: BigInt(5),
        config_id: BigInt(1),
        created_at: new Date(0, 1),
        updated_at: new Date(0, 1),
        label: "a->b",
        order: 1,
    } as Rule;

    const sameOrderB = {
        rule_regex: RegExp("b"),
        rule_replacement: "c",
        enabled: true,
        chance_to_apply: 100,
        id: BigInt(6),
        config_id: BigInt(1),
        created_at: new Date(0, 1),
        updated_at: new Date(0, 1),
        label: "b->c",
        order: 1,
    } as Rule;

    expect(applyRules("a", [sameOrderA, sameOrderB], new Date(9999, 1), false)).toBe("c");
});
