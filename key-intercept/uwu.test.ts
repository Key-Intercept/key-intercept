import { expect, test } from 'vitest'
import { applyUWU, shouldApplyUWU } from './index'

test("shouldApplyUWU_TRUE_UNIVERSAL", () => {
    expect(shouldApplyUWU(new Date(9999, 1), false)).toBeTruthy();
})

test("shouldApplyUWU_TRUE_RELATIVE", () => {
    expect(shouldApplyUWU(new Date(Date.now() + 1000), false)).toBeTruthy();
})

test("shouldApplyUWU_FALSE_UNIVERSAL", () => {
    expect(shouldApplyUWU(new Date(1, 1), false)).toBeFalsy();
})

test("shouldApplyUWU_FALSE_RELATIVE", () => {
    expect(shouldApplyUWU(new Date(Date.now() - 1000), false)).toBeFalsy();
})

test("shouldApplyUWU_TRUE_NOW", () => {
    expect(shouldApplyUWU(new Date(Date.now()), false)).toBeTruthy();
})

test("applyUWU_SINGLEWORD_TH_REPLACE", () => {
    expect(applyUWU("the", new Date(9999, 1), false)).toContain("de ");
});

test("applyUWU_SINGLEWORD_R_REPLACE", () => {
    expect(applyUWU("rabbit", new Date(9999, 1), false)).toContain("wabbit ");
});

test("applyUWU_SINGLEWORD_U_REPLACE", () => {
    expect(applyUWU("cute", new Date(9999, 1), false)).toContain("cuwte ");
});

test("applyUWU_MULTIPLEWORDS", () => {
    expect(applyUWU("this is a test", new Date(9999, 1), false)).toContain("dis ");
});

test("applyUWU_TH_LOWERCASE", () => {
    expect(applyUWU("the", new Date(9999, 1), false)).toContain("de");
});

test("applyUWU_TH_UPPERCASE", () => {
    expect(applyUWU("THE", new Date(9999, 1), false)).toContain("dE");
});

test("applyUWU_TH_MIXED_CASE", () => {
    expect(applyUWU("ThE", new Date(9999, 1), false)).toContain("dE");
});

test("applyUWU_R_LOWERCASE", () => {
    expect(applyUWU("red", new Date(9999, 1), false)).toContain("wed");
});

test("applyUWU_R_UPPERCASE", () => {
    expect(applyUWU("RED", new Date(9999, 1), false)).toContain("wED");
});

test("applyUWU_U_LOWERCASE", () => {
    expect(applyUWU("upp", new Date(9999, 1), false)).toContain("uwpp");
});

test("applyUWU_U_UPPERCASE", () => {
    expect(applyUWU("UPP", new Date(9999, 1), false)).toContain("uwPP");
});

test("applyUWU_COMBINED_REPLACEMENTS", () => {
    expect(applyUWU("the true story", new Date(9999, 1), false)).toContain("de twuwe stowy");
});

test("applyUWU_COMBINED_ALL_RULES", () => {
    expect(applyUWU("this future", new Date(9999, 1), false)).toContain("dis fuwtuwwe");
});

test("applyUWU_NOT_APPLIED_WHEN_EXPIRED", () => {
    expect(applyUWU("the", new Date(1, 1), false)).toBe("the");
});

test("applyUWU_PRESERVES_SPACING", () => {
    expect(applyUWU("word", new Date(9999, 1), false)).toContain(" ");
});

test("applyUWU_MULTIPLE_SPACES", () => {
    expect(applyUWU("hello world test", new Date(9999, 1), false)).toContain("hello ");
});
