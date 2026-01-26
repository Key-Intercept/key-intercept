import { expect, test } from 'vitest'
import { applyBimbo, shouldApplyBimbo } from './index'

test("shouldApplyBimbo_TRUE_UNIVERSAL", () => {
    expect(shouldApplyBimbo(new Date(9999, 1), false)).toBeTruthy();
})

test("shouldApplyBimbo_TRUE_RELATIVE", () => {
    expect(shouldApplyBimbo(new Date(Date.now() + 1000), false)).toBeTruthy();
})

test("shouldApplyBimbo_FALSE_UNIVERSAL", () => {
    expect(shouldApplyBimbo(new Date(1, 1), false)).toBeFalsy();
})

test("shouldApplyBimbo_FALSE_RELATIVE", () => {
    expect(shouldApplyBimbo(new Date(Date.now() - 1000), false)).toBeFalsy();
})

test("shouldApplyBimbo_TRUE_NOW", () => {
    expect(shouldApplyBimbo(new Date(Date.now()), false)).toBeTruthy();
})

test("applyBimbo_BLANK", () => {
    expect(applyBimbo("", new Date(9999, 1), 0, false)).toContain(" ");
});

test("applyBimbo_SINGLEWORD", () => {
    expect(applyBimbo("test", new Date(9999, 1), 5, false)).toContain("test ");
});

test("applyBimbo_MULTIPLEWORDS", () => {
    expect(applyBimbo("this is a test", new Date(9999, 1), 5, false)).toContain("test");
});

test("applyBimbo_PRONOUNS_I", () => {
    expect(applyBimbo("I", new Date(9999, 1), 5, false)).toContain("totally");
});

test("applyBimbo_PRONOUNS_IS", () => {
    expect(applyBimbo("is", new Date(9999, 1), 5, false)).toContain("totally");
});

test("applyBimbo_PRONOUNS_YOU", () => {
    expect(applyBimbo("you", new Date(9999, 1), 5, false)).toContain("totally");
});

test("applyBimbo_PRONOUNS_HE", () => {
    expect(applyBimbo("he", new Date(9999, 1), 5, false)).toContain("totally");
});

test("applyBimbo_PRONOUNS_SHE", () => {
    expect(applyBimbo("SHE", new Date(9999, 1), 5, false)).toContain("totally");
});

test("applyBimbo_PRONOUNS_WE", () => {
    expect(applyBimbo("we", new Date(9999, 1), 5, false)).toContain("totally");
});

test("applyBimbo_PRONOUNS_IT", () => {
    expect(applyBimbo("it", new Date(9999, 1), 5, false)).toContain("totally");
});

test("applyBimbo_PRONOUNS_THEY", () => {
    expect(applyBimbo("they", new Date(9999, 1), 5, false)).toContain("totally");
});

test("applyBimbo_MAXWORDLENGTH", () => {
    expect(applyBimbo("testword", new Date(9999, 1), 4, false)).toContain("teuhhhh long words harddd hehe");
});

test("applyBimbo_MAXWORDLENGTH_AFTER", () => {
    expect(applyBimbo("testword test", new Date(9999, 1), 4, false)).toContain("teuhhhh long words harddd hehe");
});

test("applyBimbo_MAXWORDLENGTH", () => {
    expect(applyBimbo("testword", new Date(9999, 1), 4, false)).toBe("teuhhhh long words harddd hehe");
});
