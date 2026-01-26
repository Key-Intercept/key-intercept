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
    expect(applyDrone("", new Date(9999, 1), false, false)).toBe("`This Drone Says:`\n\n`it Obeys.`");
})

test("applyDrone_SPACE", () => {
    expect(applyDrone(" ", new Date(9999, 1), false)).toContain("Obeys");
})

test("applyDrone_REGEX_1", () => {
    expect(applyDrone("i want food", new Date(9999, 1), false, false)).toContain("This Drone does not have needs or wants, it only wishes to obey");
})

test("applyDrone_REGEX_2", () => {
    expect(applyDrone("i cutie", new Date(9999, 1), false, false)).toContain("This Drone cutie");
})

test("applyDrone_REGEX_3", () => {
    expect(applyDrone("me cutie", new Date(9999, 1), false, false)).toContain("This Drone cutie");
})

test("applyDrone_REGEX_4", () => {
    expect(applyDrone("my cutie", new Date(9999, 1), false, false)).toContain("Its' cutie");
})

test("applyDrone_REGEX_5", () => {
    expect(applyDrone("i am cutie", new Date(9999, 1), false, false)).toContain("It is cutie");
})

test("applyDrone_REGEX_6", () => {
    expect(applyDrone("i'm cutie", new Date(9999, 1), false, false)).toContain("It is cutie");
})

test("applyDrone_REGEX_7", () => {
    expect(applyDrone("im cutie", new Date(9999, 1), false, false)).toContain("It is cutie");
})

test("applyDrone_REGEX_8", () => {
    expect(applyDrone("thinking about cuties", new Date(9999, 1), false, false)).toContain("processing about cuties");
})

test("applyDrone_REGEX_9", () => {
    expect(applyDrone("thinks about cuties", new Date(9999, 1), false, false)).toContain("processes about cuties");
})

test("applyDrone_REGEX_10", () => {
    expect(applyDrone("i think", new Date(9999, 1), false, false)).toContain("This Drone is programmed to process");
})

test("applyDrone_REGEX_11", () => {
    expect(applyDrone("i thought", new Date(9999, 1), false, false)).toContain("This Drone was programmed to process");
})
