import { beforeEach, expect, test, vi } from 'vitest'
import { applyDrone, shouldApplyDrone } from "./index"

const editPreviousMessage = vi.fn();
let previousMessage: { content: string; id: string } | null = null;
let previousSender: { id: string } | null = null;

vi.mock("./getPreviousMessage", () => ({
	getPreviousMessage: () => previousMessage,
	getPreviousMessageSender: () => previousSender,
	editPreviousMessage: (...args: unknown[]) => editPreviousMessage(...args),
}))

	; (globalThis as any).Vencord = {
		Webpack: {
			findByProps: (...props: string[]) => {
				if (props.includes("getCurrentUser") && props.includes("getUser")) {
					return { getCurrentUser: () => ({ id: "user-1" }) };
				}

				return {};
			},
		},
	};

// Default drone config for testing
const defaultDroneConfig = {
	speech_header: "This Drone Says:",
	speech_footer: "It Obeys.",
	action_header: "Drone::Action::Performs(",
	action_footer: ");",
	whisper_header: "Drone Initiating Quiet Mode",
	whisper_footer: "Normal Volume Restored",
	loud_header: "Volume.set(500);",
	loud_footer: "Volume.set(100)",
};

beforeEach(() => {
	previousMessage = null;
	previousSender = null;
	editPreviousMessage.mockReset();
})

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
	expect(applyDrone("", new Date(9999, 1), defaultDroneConfig.speech_header, defaultDroneConfig.speech_footer, defaultDroneConfig.action_header, defaultDroneConfig.action_footer, defaultDroneConfig.whisper_header, defaultDroneConfig.whisper_footer, defaultDroneConfig.loud_header, defaultDroneConfig.loud_footer, 100, "channel-1", false)).toBe("`This Drone Says:`\n\n`It Obeys.`");
})

test("applyDrone_SPACE", () => {
	expect(applyDrone(" ", new Date(9999, 1), defaultDroneConfig.speech_header, defaultDroneConfig.speech_footer, defaultDroneConfig.action_header, defaultDroneConfig.action_footer, defaultDroneConfig.whisper_header, defaultDroneConfig.whisper_footer, defaultDroneConfig.loud_header, defaultDroneConfig.loud_footer, 100, "channel-1", false)).toContain("It Obeys.");
})

test("applyDrone_REGEX_2", () => {
	expect(applyDrone("i cutie", new Date(9999, 1), defaultDroneConfig.speech_header, defaultDroneConfig.speech_footer, defaultDroneConfig.action_header, defaultDroneConfig.action_footer, defaultDroneConfig.whisper_header, defaultDroneConfig.whisper_footer, defaultDroneConfig.loud_header, defaultDroneConfig.loud_footer, 100, "channel-1", false)).toContain("This Drone cutie");
})

test("applyDrone_REGEX_3", () => {
	expect(applyDrone("me cutie", new Date(9999, 1), defaultDroneConfig.speech_header, defaultDroneConfig.speech_footer, defaultDroneConfig.action_header, defaultDroneConfig.action_footer, defaultDroneConfig.whisper_header, defaultDroneConfig.whisper_footer, defaultDroneConfig.loud_header, defaultDroneConfig.loud_footer, 100, "channel-1", false)).toContain("This Drone cutie");
})

test("applyDrone_REGEX_4", () => {
	expect(applyDrone("my cutie", new Date(9999, 1), defaultDroneConfig.speech_header, defaultDroneConfig.speech_footer, defaultDroneConfig.action_header, defaultDroneConfig.action_footer, defaultDroneConfig.whisper_header, defaultDroneConfig.whisper_footer, defaultDroneConfig.loud_header, defaultDroneConfig.loud_footer, 100, "channel-1", false)).toContain("Its' cutie");
})

test("applyDrone_REGEX_5", () => {
	expect(applyDrone("i am cutie", new Date(9999, 1), defaultDroneConfig.speech_header, defaultDroneConfig.speech_footer, defaultDroneConfig.action_header, defaultDroneConfig.action_footer, defaultDroneConfig.whisper_header, defaultDroneConfig.whisper_footer, defaultDroneConfig.loud_header, defaultDroneConfig.loud_footer, 100, "channel-1", false)).toContain("It is cutie");
})

test("applyDrone_REGEX_6", () => {
	expect(applyDrone("i'm cutie", new Date(9999, 1), defaultDroneConfig.speech_header, defaultDroneConfig.speech_footer, defaultDroneConfig.action_header, defaultDroneConfig.action_footer, defaultDroneConfig.whisper_header, defaultDroneConfig.whisper_footer, defaultDroneConfig.loud_header, defaultDroneConfig.loud_footer, 100, "channel-1", false)).toContain("It is cutie");
})

test("applyDrone_REGEX_7", () => {
	expect(applyDrone("im cutie", new Date(9999, 1), defaultDroneConfig.speech_header, defaultDroneConfig.speech_footer, defaultDroneConfig.action_header, defaultDroneConfig.action_footer, defaultDroneConfig.whisper_header, defaultDroneConfig.whisper_footer, defaultDroneConfig.loud_header, defaultDroneConfig.loud_footer, 100, "channel-1", false)).toContain("It is cutie");
})

test("applyDrone_does_not_duplicate_body", () => {
	const output = applyDrone("hello world", new Date(9999, 1), defaultDroneConfig.speech_header, defaultDroneConfig.speech_footer, defaultDroneConfig.action_header, defaultDroneConfig.action_footer, defaultDroneConfig.whisper_header, defaultDroneConfig.whisper_footer, defaultDroneConfig.loud_header, defaultDroneConfig.loud_footer, 100, "channel-1", false);

	expect(output.match(/hello world/g)?.length ?? 0).toBe(1);
})

test("applyDrone_continues_own_block_without_header", () => {
	previousSender = { id: "user-1" };
	previousMessage = { id: "m1", content: "first body\n`It Obeys.`" };

	const output = applyDrone("second body", new Date(9999, 1), defaultDroneConfig.speech_header, defaultDroneConfig.speech_footer, defaultDroneConfig.action_header, defaultDroneConfig.action_footer, defaultDroneConfig.whisper_header, defaultDroneConfig.whisper_footer, defaultDroneConfig.loud_header, defaultDroneConfig.loud_footer, 100, "channel-1", false);

	expect(editPreviousMessage).toHaveBeenCalledWith("channel-1", "m1", "first body");
	expect(output).toBe("second body\n`It Obeys.`");
})

test("applyDrone_starts_new_block_with_header", () => {
	previousSender = { id: "user-2" };
	previousMessage = { id: "m1", content: "someone else\n`It Obeys.`" };

	const output = applyDrone("hello body", new Date(9999, 1), defaultDroneConfig.speech_header, defaultDroneConfig.speech_footer, defaultDroneConfig.action_header, defaultDroneConfig.action_footer, defaultDroneConfig.whisper_header, defaultDroneConfig.whisper_footer, defaultDroneConfig.loud_header, defaultDroneConfig.loud_footer, 100, "channel-1", false);

	expect(editPreviousMessage).not.toHaveBeenCalled();
	expect(output).toBe("`This Drone Says:`\nhello body\n`It Obeys.`");
})

test("applyDrone_action_mode_new_block", () => {
	previousSender = { id: "user-2" };
	previousMessage = null;

	const output = applyDrone("*performs action", new Date(9999, 1), defaultDroneConfig.speech_header, defaultDroneConfig.speech_footer, defaultDroneConfig.action_header, defaultDroneConfig.action_footer, defaultDroneConfig.whisper_header, defaultDroneConfig.whisper_footer, defaultDroneConfig.loud_header, defaultDroneConfig.loud_footer, 100, "channel-1", false);

	expect(output).toContain(`\`${defaultDroneConfig.action_header}\``);
	expect(output).toContain(`\`${defaultDroneConfig.action_footer}\``);
})

test("applyDrone_loud_mode_new_block", () => {
	previousSender = { id: "user-2" };
	previousMessage = null;

	const output = applyDrone("**LOUD MESSAGE", new Date(9999, 1), defaultDroneConfig.speech_header, defaultDroneConfig.speech_footer, defaultDroneConfig.action_header, defaultDroneConfig.action_footer, defaultDroneConfig.whisper_header, defaultDroneConfig.whisper_footer, defaultDroneConfig.loud_header, defaultDroneConfig.loud_footer, 100, "channel-1", false);

	expect(output).toContain(`\`${defaultDroneConfig.loud_header}\``);
	expect(output).toContain(`\`${defaultDroneConfig.loud_footer}\``);
})

test("applyDrone_whisper_mode_new_block", () => {
	previousSender = { id: "user-2" };
	previousMessage = null;

	const output = applyDrone("-#whisper quietly", new Date(9999, 1), defaultDroneConfig.speech_header, defaultDroneConfig.speech_footer, defaultDroneConfig.action_header, defaultDroneConfig.action_footer, defaultDroneConfig.whisper_header, defaultDroneConfig.whisper_footer, defaultDroneConfig.loud_header, defaultDroneConfig.loud_footer, 100, "channel-1", false);

	expect(output).toContain(`\`${defaultDroneConfig.whisper_header}\``);
	expect(output).toContain(`\`${defaultDroneConfig.whisper_footer}\``);
})

test("applyDrone_action_mode_continues_own_block", () => {
	previousSender = { id: "user-1" };
	previousMessage = { id: "m1", content: "first action\n`);`" };

	const output = applyDrone("*second action", new Date(9999, 1), defaultDroneConfig.speech_header, defaultDroneConfig.speech_footer, defaultDroneConfig.action_header, defaultDroneConfig.action_footer, defaultDroneConfig.whisper_header, defaultDroneConfig.whisper_footer, defaultDroneConfig.loud_header, defaultDroneConfig.loud_footer, 100, "channel-1", false);

	expect(editPreviousMessage).toHaveBeenCalledWith("channel-1", "m1", "first action");
	expect(output).not.toContain(`\`${defaultDroneConfig.action_header}\``);
	expect(output).toContain(`\`${defaultDroneConfig.action_footer}\``);
})

test("applyDrone_link_no_regex", () => {
	const output = applyDrone("check this https://example.com", new Date(9999, 1), defaultDroneConfig.speech_header, defaultDroneConfig.speech_footer, defaultDroneConfig.action_header, defaultDroneConfig.action_footer, defaultDroneConfig.whisper_header, defaultDroneConfig.whisper_footer, defaultDroneConfig.loud_header, defaultDroneConfig.loud_footer, 100, "channel-1", false);

	expect(output).toContain("https://example.com");
})

test("applyDrone_low_health", () => {
	const output = applyDrone("hello world", new Date(9999, 1), defaultDroneConfig.speech_header, defaultDroneConfig.speech_footer, defaultDroneConfig.action_header, defaultDroneConfig.action_footer, defaultDroneConfig.whisper_header, defaultDroneConfig.whisper_footer, defaultDroneConfig.loud_header, defaultDroneConfig.loud_footer, 5, "channel-1", false);

	expect(output).toContain("haaaaas receieved bzzzzt");
	expect(output).toContain("0x7547372482");
})
