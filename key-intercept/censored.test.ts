import { expect, test } from 'vitest'
import { applyCensored, shouldApplyCensored } from './index'

test("shouldApplyCensored_TRUE_UNIVERSAL", () => {
	expect(shouldApplyCensored(new Date(9999, 1), false)).toBeTruthy();
})

test("shouldApplyCensored_TRUE_RELATIVE", () => {
	expect(shouldApplyCensored(new Date(Date.now() + 1000), false)).toBeTruthy();
})

test("shouldApplyCensored_FALSE_UNIVERSAL", () => {
	expect(shouldApplyCensored(new Date(1, 1), false)).toBeFalsy();
})

test("shouldApplyCensored_FALSE_RELATIVE", () => {
	expect(shouldApplyCensored(new Date(Date.now() - 1000), false)).toBeFalsy();
})

test("shouldApplyCensored_TRUE_NOW", () => {
	expect(shouldApplyCensored(new Date(Date.now()), false)).toBeTruthy();
})

let GLOBALDATE = new Date(9999, 1);
let censoredWords = ["test"];

test("applyCensored_BLANK", () => {
	expect(applyCensored("", censoredWords, "_", GLOBALDATE, false)).toBe("");
})

test("applyCensored_NO_MATCH", () => {
	expect(applyCensored("This is a sample text.", censoredWords, "_", GLOBALDATE, false)).toBe("This is a sample text.");
})

test("applyCensored_MATCH", () => {
	expect(applyCensored("This is a test.", censoredWords, "_", GLOBALDATE, false)).toBe("This is a ____.");
})

test("applyCensored_MULTIPLE_MATCHES", () => {
	expect(applyCensored("Test the test cases.", censoredWords, "_", GLOBALDATE, false)).toBe("____ the ____ cases.");
})

test("applyCensored_CASE_INSENSITIVE", () => {
	expect(applyCensored("TEST the test cases.", censoredWords, "_", GLOBALDATE, false)).toBe("____ the ____ cases.");
})

test("applyCensored_DIFFCHAR_REPLACEMENT", () => {
	expect(applyCensored("This is a test.", censoredWords, "X", GLOBALDATE, false)).toBe("This is a XXXX.");
})

test("applyCensored_MULTCHAR_REPLACEMENT_SAMELENGTH", () => {
	expect(applyCensored("This is a test.", censoredWords, "xxxx", GLOBALDATE, false)).toBe("This is a xxxx.");
})

test("applyCensored_MULTCHAR_REPLACEMENT_DIFFLENGTH", () => {
	expect(applyCensored("This is a test.", censoredWords, "xxx", GLOBALDATE, false)).toBe("This is a xxxxxx.");
})

test("applyCensored_MULTIPLE_WORDS", () => {
	let multipleCensoredWords = ["test", "sample"];
	expect(applyCensored("This is a test and a sample.", multipleCensoredWords, "_", GLOBALDATE, false)).toBe("This is a ____ and a ______.");
})