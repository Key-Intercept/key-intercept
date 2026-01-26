import { expect, test } from 'vitest'
import { applyDrone, shouldApplyDrone } from "./index"

test("shouldApplyDrone_TRUE_UNIVERSAL", () => {
    expect(shouldApplyDrone(new Date(9999, 1), false)).toBeTruthy();
})

test("shouldApplyDrone_TRUE_RELATIVE", () => {
    expect(shouldApplyDrone(new Date(Date.now() + 1000), false)).toBeTruthy();
})

test("shouldApplyDrone_FALSE_UNIVERSAL", () => {
    expect(shouldApplyDrone(new Date(1, 1), false)).toBeFalsy();
})

test("shouldApplyDrone_FALSE_RELATIVE", () => {
    expect(shouldApplyDrone(new Date(Date.now() - 1000), false)).toBeFalsy();
})

test("shouldApplyDrone_TRUE_NOW", () => {
    expect(shouldApplyDrone(new Date(Date.now()), false)).toBeTruthy();
})

test("applyDrone_BLANK", () => {
    expect(applyDrone("", new Date(9999, 1), "This Drone Says:", "it Obeys.", 100, false)).toBe("`This Drone Says:`\n\n`it Obeys.`");
})

test("applyDrone_SPACE", () => {
    expect(applyDrone(" ", new Date(9999, 1), "This Drone Says:", "it Obeys.", 100, false)).toContain("Obeys.");
})

test("applyDrone_REGEX_2", () => {
    expect(applyDrone("i cutie", new Date(9999, 1), "This Drone Says:", "it Obeys.", 100, false)).toContain("This Drone cutie");
})

test("applyDrone_REGEX_3", () => {
    expect(applyDrone("me cutie", new Date(9999, 1), "This Drone Says:", "it Obeys.", 100, false)).toContain("This Drone cutie");
})

test("applyDrone_REGEX_4", () => {
    expect(applyDrone("my cutie", new Date(9999, 1), "This Drone Says:", "it Obeys.", 100, false)).toContain("Its' cutie");
})

test("applyDrone_REGEX_5", () => {
    expect(applyDrone("i am cutie", new Date(9999, 1), "This Drone Says:", "it Obeys.", 100, false)).toContain("It is cutie");
})

test("applyDrone_REGEX_6", () => {
    expect(applyDrone("i'm cutie", new Date(9999, 1), "This Drone Says:", "it Obeys.", 100, false)).toContain("It is cutie");
})

test("applyDrone_REGEX_7", () => {
    expect(applyDrone("im cutie", new Date(9999, 1), "This Drone Says:", "it Obeys.", 100, false)).toContain("It is cutie");
})