/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { createClient } from "@supabase/supabase-js";

import { NormalizedString } from "./normalizedString";
import { Config, DroneConfig, Rule, WhitelistItem } from "./types";

export const version_number = "4.3.0";

const supabase = createClient("https://qjzgfwithyvmwctesnqs.supabase.co", "sb_publishable_cxq8QZp9BDtjE4G5qiPCFA_lUZ4Cbdh");

export let config: Config;
export let droneConfig: DroneConfig;
export let rules: Rule[] = [];
export let whitelist: WhitelistItem[] = [];
export let petWords: string[] = [];
export let censoredWords: string[] = [];

export type MessageLike = {
	id: string;
	content: string;
	author?: {
		id?: string;
	} | null;
};

export type DroneContext = {
	previousMessage?: MessageLike | null;
	previousSenderId?: string | null;
	currentUserId?: string | null;
};

export type DroneEditRequest = {
	channelId: string;
	messageId: string;
	newContent: string;
};

export type DroneRenderResult = {
	message: string;
	editPreviousMessage?: DroneEditRequest;
};

export async function createNewUser(userID: string, username: string): Promise<void> {
	console.log("creating new user...");
	await fetch("82.165.196.147:4222/" + userID + "/" + username);
}

export async function getData(userID: string, username: string) {
	const currentUserId = userID;
	console.log(currentUserId);
	let subIDData = await supabase.from("profiles").select("id").eq("discord_id", currentUserId).single();
	if (subIDData.data === null) {
		await createNewUser(userID, username);
		subIDData = await supabase.from("profiles").select("id").eq("discord_id", currentUserId).single();
	}
	console.log(subIDData);
	const subID = subIDData.data!.id;
	console.log(subID);
	let subData = await supabase.from("Sub_Config_Access").select().eq("sub_id", subID);
	console.log(subData);
	if (subData.data?.length === 0) {
		await createNewConfig(subID!);
		subData = await supabase.from("Sub_Config_Access").select().eq("sub_id", subID);
	}
	config = {} as Config;
	config.id = subData.data![0].config_id;

	supabase.channel("public:config").on("postgres_changes", {
		event: "*",
		schema: "public",
		table: "Config"
	}, async () => {
		await getConfig();
	}).subscribe();

	supabase.channel("public:rules").on("postgres_changes", {
		event: "*",
		schema: "public",
		table: "Rules"
	}, async () => {
		await getRules();
	}).subscribe();

	supabase.channel("public:server_whitelist_items").on("postgres_changes", {
		event: "*",
		schema: "public",
		table: "Server_Whitelist_Items"
	}, async () => {
		await getWhitelist();
	}).subscribe();

	supabase.channel("public:pet_type_words").on("postgres_changes", {
		event: "*",
		schema: "public",
		table: "Config"
	}, async () => {
		await getConfig();
		await getPetWords();
	}).subscribe();

	supabase.channel("public:censored_words").on("postgres_changes", {
		event: "*",
		schema: "public",
		table: "Censored_Words"
	}, async () => {
		await getCensoredWords();
	}).subscribe();

	supabase.channel("public:drone_config").on("postgres_changes", {
		event: "*",
		schema: "public",
		table: "Drone_Config"
	}, async () => {
		await getDroneConfig();
	}).subscribe();

	await getConfig();
	await getRules();
	await getWhitelist();
	await getPetWords();
	await getCensoredWords();
	await getDroneConfig();
}

export async function getConfig() {
	const configData = await supabase.from("Config").select().eq("id", config.id).single();
	config.id = configData.data!.id;
	config.rules_end = new Date(configData.data!.rules_end);
	config.gag_end = new Date(configData.data!.gag_end);
	config.pet_end = new Date(configData.data!.pet_end);
	config.bimbo_end = new Date(configData.data!.bimbo_end);
	config.bimbo_word_length = configData.data!.bimbo_word_length;
	config.pet_amount = configData.data!.pet_amount;
	config.horny_end = new Date(configData.data!.horny_end);
	config.pet_type = configData.data!.pet_type;
	config.drone_end = new Date(configData.data!.drone_end);
	config.debug = configData.data!.debug;
	config.uwu_end = new Date(configData.data!.uwu_end);
	config.censored_end = new Date(configData.data!.censored_end);
	config.censored_replacement = configData.data!.censored_replacement;
	console.log("Config:");
	console.log(config);
}

export async function getRules() {
	const rulesData = await supabase.from("Rules").select().eq("config_id", config.id).order("id", { ascending: false });
	rules = rulesData.data!;
	console.log("Rules:");
	console.log(rules);
}

export async function getWhitelist() {
	const whitelistData = await supabase.from("Server_Whitelist_Items").select().eq("config_id", config.id);
	whitelist = whitelistData.data!.map((item: any) => ({
		id: item.id,
		config_id: item.config_id,
		server_name: item.server_name,
		discord_id: item.discord_id,
	}));
	console.log("Whitelist:");
	console.log(whitelist);
}

export async function getPetWords() {
	const petWordsData = await supabase.from("Pet_Type_Words").select().eq("pet_type", config.pet_type);
	petWords = [];
	for (const wordData of petWordsData.data!) {
		petWords.push(wordData.word);
	}
	console.log("Pet words:");
	console.log(petWords);
}

export async function getCensoredWords() {
	const censoredWordsData = await supabase.from("Censored_Words").select().eq("config_id", config.id);
	censoredWords = [];
	for (const wordData of censoredWordsData.data!) {
		censoredWords.push(wordData.word);
	}
	console.log("Censored Words:");
	console.log(censoredWords);
}

export async function getDroneConfig() {
	const droneConfigData = await supabase.from("Drone_Config").select().eq("config_id", config.id).single();
	droneConfig = {
		config_id: droneConfigData.data!.config_id as bigint,
		drone_health: droneConfigData.data!.drone_health as number,
		speech_header: droneConfigData.data!.speech_header as string,
		speech_footer: droneConfigData.data!.speech_footer as string,
		action_header: droneConfigData.data!.action_header as string,
		action_footer: droneConfigData.data!.action_footer as string,
		whisper_header: droneConfigData.data!.whisper_header as string,
		whisper_footer: droneConfigData.data!.whisper_footer as string,
		loud_header: droneConfigData.data!.loud_header as string,
		loud_footer: droneConfigData.data!.loud_footer as string,
		drone_term: droneConfigData.data!.drone_term as string,
	}
	console.log("Drone Config:");
	console.log(droneConfig);
}

export function shouldApplyRules(rules_end: Date, verbose: boolean = true): boolean {
	if (verbose) { console.log(Date.now() <= rules_end.getTime() ? "Should apply rules" : "Should not apply rules"); }
	return Date.now() <= rules_end.getTime();
}

export function shouldApplyGag(gag_end: Date, verbose: boolean = true): boolean {
	if (verbose) { console.log(Date.now() <= gag_end.getTime() ? "Should apply gag" : "Should not apply gag"); }
	return Date.now() <= gag_end.getTime();
}

export function shouldApplyPet(pet_end: Date, pet_amount: number, verbose: boolean = true): boolean {
	if (verbose) { console.log(Date.now() <= pet_end.getTime() ? "Should apply pet" : "Should not apply pet"); }
	return Date.now() <= pet_end.getTime() && pet_amount !== 0;
}

export function shouldApplyBimbo(bimbo_end: Date, verbose: boolean = true): boolean {
	if (verbose) { console.log(Date.now() <= bimbo_end.getTime() ? "Should apply bimbo" : "Should not apply bimbo"); }
	return Date.now() <= bimbo_end.getTime();
}

export function shouldApplyHorny(horny_end: Date, verbose: boolean = true): boolean {
	if (verbose) { console.log(Date.now() <= horny_end.getTime() ? "Should apply horny" : "Should not apply horny"); }
	return Date.now() <= horny_end.getTime();
}

export function shouldApplyDrone(drone_end: Date, verbose: boolean = true): boolean {
	if (verbose) { console.log(Date.now() <= drone_end.getTime() ? "Should apply drone" : "Should not apply drone"); }
	return Date.now() <= drone_end.getTime();
}

export function shouldApplyUWU(uwu_end: Date, verbose: boolean = true): boolean {
	if (verbose) { console.log(Date.now() <= uwu_end.getTime() ? "Should apply uwu" : "Should not apply uwu"); }
	return Date.now() <= uwu_end.getTime();
}

export function shouldApplyCensored(censored_end: Date, verbose: boolean = true): boolean {
	if (verbose) { console.log(Date.now() <= censored_end.getTime() ? "Should apply censored" : "Should not apply censored"); }
	return Date.now() <= censored_end.getTime();
}

export function applyRules(msg: string, rules: Rule[], rules_end: Date, verbose: boolean = true): string {
	if (!shouldApplyRules(rules_end, verbose)) {
		return msg;
	}
	let output = msg.normalize("NFKC");
	rules.sort((a, b) => a.order - b.order);
	for (const rule of rules) {
		if (!rule.enabled) {
			if (verbose) { console.log("Rule disabled, skipping"); }
			continue;
		}
		const temp = new RegExp(rule.rule_regex.toString().replaceAll("\\\\", "\\"));
		const matchCallback = (match: string, ..._args: unknown[]): string => {
			if (Math.random() > rule.chance_to_apply) {
				if (verbose) { console.log(`Skipping match ${rule.chance_to_apply}`); }
				return match;
			}
			if (verbose) { console.log(`Rule Applied ${match.replace(new RegExp(temp, "i"), rule.rule_replacement)}`); }
			return match.replace(new RegExp(temp, "i"), rule.rule_replacement);
		};

		if (rule.regex_normalize) {
			if (verbose) { console.log("Using input normalization"); }
			output = new NormalizedString(output, verbose).replace(new RegExp(temp, "gi"), matchCallback);
		} else {
			output = output.replace(new RegExp(temp, "gi"), matchCallback);
		}



		if (verbose) { console.log(`Applying rule: ${temp}`); }
	}
	if (verbose) { console.log("message after rules: " + output); }
	return output;
}

export function applyGag(msg: string, gag_end: Date, verbose: boolean = true): string {
	if (!shouldApplyGag(gag_end, verbose)) {
		return msg;
	}
	let output = "";
	let inEmote = false;
	const remainChars = ["a", "e", "i", "o", "u", "g", "h", "A", "E", "I", "O", "U", "G", "H", "?", "!", ".", ",", ":", ";", "#", "*", "-", "(", ")", "~"];
	for (const word of msg.split(" ")) {
		let outword = "";
		if (word_is_link(word, verbose)) {
			outword = word + " ";
			continue;
		}
		for (const char of word) {
			if (char === ":" && !inEmote) {
				if (verbose) { console.log("Starting emote") };
				inEmote = true;
				outword += char;
				continue;
			} else if (char === ":" && inEmote) {
				if (verbose) { console.log("Ending emote") };
				inEmote = false;
				outword += char;
				continue;
			}
			if (inEmote) {
				if (verbose) { console.log("Inside emote") };
				outword += char;
				continue;
			}
			if (remainChars.includes(char)) {
				outword += char;
			} else {
				if (!(char.charCodeAt(0) >= 97 && char.charCodeAt(0) <= 122)) {
					outword += ["G", "H"][Math.floor(Math.random() * 2)];
				} else {
					outword += ["g", "h"][Math.floor(Math.random() * 2)];
				}
			}
		}
		output += outword + " ";
	}
	if (verbose) { console.log("message after gag: " + output); }
	return output;
}

export function applyPet(msg: string, pet_end: Date, pet_amount: number, pet_words: string[], verbose: boolean = true) {
	if (!shouldApplyPet(pet_end, pet_amount, verbose)) {
		return msg;
	}
	let output = "";
	for (const word of msg.split(" ")) {
		if (word_is_link(word, verbose)) {
			output += word + " ";
			continue
		}
		if (word[0] === ":" && word[word.length] === ":") {
			output += word + " ";
			if (verbose) { console.log("Skipping emote word") };
			continue;
		}
		if (Math.random() < pet_amount) {
			if (verbose) { console.log("Replacing word with pet word"); }
			output += pet_words[Math.floor(Math.random() * (pet_words.length))];
		} else {
			output += word;
		}
		output += " ";
	}
	if (verbose) { console.log("message after pet: " + output); }
	return output;
}

export function applyBimbo(msg: string, bimbo_end: Date, bimbo_word_length: number, verbose: boolean = true) {
	if (!shouldApplyBimbo(bimbo_end, verbose)) {
		return msg;
	}
	let output = "";
	const pronouns = ["i", "you", "he", "she", "it", "we", "they", "is"];
	const maxWordLength = bimbo_word_length;
	const likeChance = 0.1;
	const gargle_words = ["like", "hehe", "uhh", "totally", "so dumbb", "ummm", "hhhhh"];
	for (const word of msg.split(" ")) {
		let changed = false;
		if (!word_is_link(word, verbose)) {
			if (pronouns.includes(word.toLowerCase())) {
				output += word;
				output += " like totally ";
				changed = true;
				if (verbose) { console.log("pronoun found, added 'like totally'"); }
			}
			if (word.length > maxWordLength) {
				if (verbose) { console.log("word: " + word + " was too long"); }
				output += word.substring(0, maxWordLength - 2);
				output += "uhhhh long words harddd hehe";
				return output;
			}
		}
		if (!changed) {
			output += word;
			output += " ";
		}
		if (Math.random() < likeChance && !word_is_link(word, verbose)) {
			output += gargle_words[Math.floor(Math.random() * (gargle_words.length - 1))];
			output += " ";
			if (verbose) { console.log("added gargle word " + output.split(" ").reverse()[0]) };
		}
	}
	if (verbose) { console.log("message after bimbo: " + output); }
	return output;
}

export function applyHorny(msg: string, horny_end: Date, verbose: boolean = true, horny_words: string[] = ["hmmph", "nngh", "ahhh", "ooh", "oohh", "mmm", "hehe", "hehehe", "heheh", "eheh", "ehehe", "eheheh", "guhh", "pleasee", "need to cumm", "oh goshh", "ohhh", "ahhh", "cummm", "gggg"]) {
	if (!shouldApplyHorny(horny_end, verbose)) {
		return msg;
	}
	let output = "";
	for (const word of msg.split(" ")) {
		if (!word_is_link(word, verbose)) {
			if (Math.random() < 0.75) {
				if (verbose) { console.log("Adding horny word"); }
				output += horny_words[Math.floor(Math.random() * (horny_words.length - 1))];
				output += " ";
			}
		}
		output += word + " ";
	}
	return output;
}

export function applyUWU(msg: string, uwu_end: Date, verbose: boolean = true) {
	if (!shouldApplyUWU(uwu_end, verbose)) {
		return msg;
	}
	let output = "";

	for (let word of msg.split(" ")) {
		if (word_is_link(word, verbose)) {
			output += word + " ";
			continue;
		}
		word = word.replace(new RegExp("th", "gi"), "d");
		word = word.replace(new RegExp("r|l", "gi"), "w");
		word = word.replace(new RegExp("u", "gi"), "uw");
		word = word.replace(new RegExp("n([aeiou])", "gi"), "ny$1")
		word = word.replace(new RegExp("ove", "gi"), "uv")
		output += word + " "
	}

	return output;
}

export function applyCensored(msg: string, censoredWords: string[], replacement: string, censored_end: Date, verbose: boolean = true) {
	if (!shouldApplyCensored(censored_end, verbose)) {
		return msg;
	}

	for (let word of censoredWords) {
		let replacementText = "";
		for (let i = 0; i < word.length; i += replacement.length) {
			replacementText += replacement
		}
		msg = msg.replace(new RegExp(word, "gi"), replacementText);
	}

	return msg;
}

export function applyDrone(msg: string, drone_end: Date, speech_header: string, speech_footer: string, action_header: string, action_footer: string, whisper_header: string, whisper_footer: string, loud_header: string, loud_footer: string, drone_term: string, drone_health: number, channelId: string, context: DroneContext = {}, verbose: boolean = true): DroneRenderResult {
	if (!shouldApplyDrone(drone_end, verbose)) {
		return { message: msg };
	}

	if (drone_health < 10) {
		return {
			message: "`" + drone_term + " haaaaas receieved bzzzzt, ppplease provide repaiirs using beep '/repair', tthank youu. Returned Error: 0x7547372482`",
		};
	}

	let containsLink = false;
	for (const word of msg.split(" ")) {
		if (word_is_link(word, verbose)) {
			containsLink = true;
		}
	}

	let output = "";
	if (!containsLink) {
		msg = msg.replace(new RegExp("\\bMe\\b", "gi"), drone_term);
		msg = msg.replace(new RegExp("\\bMy\\b", "gi"), "Its'");
		msg = msg.replace(new RegExp("\\bI am\\b", "gi"), "It is");
		msg = msg.replace(new RegExp("\\bI(')?m\\b", "gi"), "It is");
		msg = msg.replace(new RegExp("\\bI\\b", "gi"), drone_term);
		if (verbose) { console.log("Drone Regex Applied"); }
	}

	let ignoreFirstOne = false;

	for (const word of msg.split(" ")) {
		if (ignoreFirstOne) {
			ignoreFirstOne = false;
			continue;
		}
		if (!word_is_link(word, verbose)) {
			if (Math.random() > (drone_health / 100)) {
				if (verbose) { console.log("Adding random beep"); }
				output += Math.random() > 0.5 ? "`beep` " : "`bzzzt` ";
			}
		}
		output += word + " ";
	}

	const tempOutput = output;
	output = "";

	let lastTriggered = 0;

	for (const word of tempOutput.split(" ")) {
		let outword = "";
		if (!word_is_link(word, verbose)) {
			for (const char of word) {
				outword += char;
				lastTriggered += 1;
				if (Math.random() + (lastTriggered / 100) - 1 > (drone_health / 100) && char !== "`") {
					lastTriggered = 0;
					for (let i = 0; i < Math.floor(Math.random() * 10); i++) {
						if (verbose) { console.log("Adding random static"); }
						outword += char;
					}
				}
			}
		} else {
			outword = word;
		}
		output += outword + " ";
	}

	const previousMessage = context.previousMessage ?? null;
	const previousSenderId = context.previousSenderId ?? previousMessage?.author?.id ?? null;
	const currentUserId = context.currentUserId ?? null;

	if (verbose) { console.log("Previous message sent by: " + previousSenderId) }
	if (verbose) { console.log("Current user ID: " + currentUserId) }
	if (verbose) { console.log("Previous message content: " + previousMessage?.content) }

	let header = speech_header;
	let footer = speech_footer;

	if (msg.startsWith("**")) {
		header = loud_header;
		footer = loud_footer;
	}
	else if (msg.startsWith("*")) {
		header = action_header;
		footer = action_footer;
	}
	else if (msg.startsWith("-#")) {
		header = whisper_header;
		footer = whisper_footer;
	}

	if (verbose) { console.log("header: " + header) }
	if (verbose) { console.log("footer: " + footer) }

	const continuingOwnBlock = previousSenderId != null && currentUserId != null && previousSenderId === currentUserId;
	const footerSuffix = "\n`" + footer + "`";
	const previousHadMatchingFooter = previousMessage?.content.endsWith(footerSuffix) ?? false;
	const editPreviousMessage = continuingOwnBlock && previousHadMatchingFooter && previousMessage
		? {
			channelId,
			messageId: previousMessage.id,
			newContent: previousMessage.content.replace(footerSuffix, ""),
		}
		: undefined;

	const formattedBody = output.trimEnd();
	let formattedMessage = formattedBody + footerSuffix;

	if (!continuingOwnBlock || !previousHadMatchingFooter) {
		formattedMessage = "`" + header + "`\n" + formattedMessage;
	}

	return {
		message: formattedMessage,
		editPreviousMessage,
	};
}

export function applyReplacements(msg: string, channelId: string, context: DroneContext = {}): DroneRenderResult {
	const originalMsg = msg;
	console.log("Original message: " + originalMsg);
	msg = applyRules(msg, rules, config.rules_end);
	msg = applyUWU(msg, config.uwu_end);
	msg = applyHorny(msg, config.horny_end);
	msg = applyPet(msg, config.pet_end, config.pet_amount, petWords);
	msg = applyBimbo(msg, config.bimbo_end, config.bimbo_word_length);
	msg = applyCensored(msg, censoredWords, config.censored_replacement, config.censored_end);
	msg = applyGag(msg, config.gag_end);
	let editPreviousMessage: DroneEditRequest | undefined;
	if (droneConfig != null) {
		const droneResult = applyDrone(msg, config.drone_end, droneConfig.speech_header, droneConfig.speech_footer, droneConfig.action_header, droneConfig.action_footer, droneConfig.whisper_header, droneConfig.whisper_footer, droneConfig.loud_header, droneConfig.loud_footer, droneConfig.drone_term, droneConfig.drone_health, channelId, context);
		msg = droneResult.message;
		editPreviousMessage = droneResult.editPreviousMessage;
	}
	return {
		message: msg + (config.debug && (shouldApplyRules(config.rules_end) || shouldApplyGag(config.gag_end) || shouldApplyPet(config.pet_end, config.pet_amount) || shouldApplyBimbo(config.bimbo_end) || shouldApplyHorny(config.horny_end) || shouldApplyDrone(config.drone_end)) ? `\n        (original message: ${originalMsg})` : ""),
		editPreviousMessage,
	};
}

export function word_is_link(word: string, verbose: boolean = true): boolean {
	if (verbose) {
		console.log("testing if is link:");
		console.log(word.at(0));
		console.log(word.at(1));
		console.log(word.at(2));
		console.log(word.at(3));
	}
	return (word.at(0) == "h" && word.at(1) == "t" && word.at(2) == "t" && word.at(3) == "p")
}
