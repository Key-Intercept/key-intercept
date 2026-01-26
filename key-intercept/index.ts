/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { createClient } from "@supabase/supabase-js";
import definePlugin from "@utils/types";

import { Config, Rule } from "./types";

const supabase = createClient("https://qjzgfwithyvmwctesnqs.supabase.co", "sb_publishable_cxq8QZp9BDtjE4G5qiPCFA_lUZ4Cbdh");

let config: Config;
let rules: Rule[] = [];
let whitelist: string[] = [];
let petWords: string[] = [];

export async function createNewUser(userID: string, username: string): Promise<void> {
    console.log("creating new user...");
    await supabase.from("profiles").insert({ "display_name": username, "discord_id": userID });
}

export async function createNewConfig(userID: string): Promise<void> {
    console.log("creating new config...");
    const configData = await supabase.from("Config").insert({}).select().single();
    await supabase.from("Sub_Config_Access").insert({ "sub_id": userID, "config_id": configData.data!.id });
}

export async function getData() {

    const UserStore = Vencord.Webpack.findByProps("getCurrentUser", "getUser");
    const currentUser = UserStore.getCurrentUser();
    const currentUserId = currentUser.id;
    console.log(currentUserId);
    let subIDData = await supabase.from("profiles").select("id").eq("discord_id", currentUserId).single();
    if (subIDData.data === null) {
        await createNewUser(currentUser.id, currentUser.username);
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
    }, async payload => {
        await getConfig();
    }).subscribe();

    supabase.channel("public:rules").on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "Rules"
    }, async payload => {
        await getRules();
    }).subscribe();

    supabase.channel("public:server_whitelist_items").on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "Server_Whitelist_Items"
    }, async payload => {
        await getWhitelist();
    }).subscribe();

    supabase.channel("public:pet_type_words").on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "Config"
    }, async payload => {
        await getConfig();
        await getPetWords();
    }).subscribe();

    await getConfig();
    await getRules();
    await getWhitelist();
    await getPetWords();

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
    config.drone_header_text = configData.data!.drone_header_text;
    config.drone_footer_text = configData.data!.drone_footer_text;
    config.drone_health = configData.data!.drone_health;
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
    whitelist = whitelistData.data!.map((v, i, a) => {
        return a[i].server_name;
    });
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

export function applyRules(msg: string, rules: Rule[], rules_end: Date, verbose: boolean = true): string {
    if (!shouldApplyRules(rules_end)) {
        return msg;
    }
    let output = msg;
    for (const rule of rules) {
        if (!rule.enabled) {
            if (verbose) { console.log("Rule disabled, skipping"); }
            continue;
        }
        const temp = new RegExp(rule.rule_regex.toString().replaceAll("\\\\", "\\"));
        output = output.replace(new RegExp(temp, "gi"), (match: string, ...args): string => {
            if (Math.random() > rule.chance_to_apply) {
                if (verbose) { console.log(`Skipping match ${rule.chance_to_apply}`); }
                return match;
            }
            if (verbose) { console.log(`Rule Applied ${match.replace(new RegExp(temp, "i"), rule.rule_replacement)}`); }
            return match.replace(new RegExp(temp, "i"), rule.rule_replacement);
        });
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
    const remainChars = ["a", "e", "i", "o", "u", " ", "g", "h", "A", "E", "I", "O", "U", "G", "H", "?", "!", ".", ",", ":", ";", "#", "*", "-", "(", ")", "~"];
    for (const char of msg) {
        if (char === ":" && !inEmote) {
            console.log("Starting emote");
            inEmote = true;
            output += char;
            continue;
        } else if (char === ":" && inEmote) {
            console.log("Ending emote");
            inEmote = false;
            output += char;
            continue;
        }
        if (inEmote) {
            console.log("Inside emote");
            output += char;
            continue;
        }
        if (remainChars.includes(char)) {
            output += char;
        } else {
            if (!(char.charCodeAt(0) >= 97 && char.charCodeAt(0) <= 122)) {
                output += ["G", "H"][Math.floor(Math.random() * 2)];
            } else {
                output += ["g", "h"][Math.floor(Math.random() * 2)];
            }
        }
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
        if (word[0] === ":" && word[word.length] === ":") {
            output += word + " ";
            console.log("Skipping emote word");
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
    const pronouns = ["i", "is", "you", "he", "she", "we", "they"];
    const maxWordLength = bimbo_word_length;
    const likeChance = 0.1;
    const gargle_words = ["like", "hehe", "uhh", "totally", "so dumbb"];
    for (const word of msg.split(" ")) {
        let changed = false;
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
        if (!changed) {
            output += word;
            output += " ";
        }
        if (Math.random() < likeChance) {
            output += gargle_words[Math.floor(Math.random() * (gargle_words.length - 1))];
            output += " ";
            console.log("added gargle word " + output.split(" ").reverse()[0]);
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
        if (Math.random() < 0.75) {
            if (verbose) { console.log("Adding horny word"); }
            output += horny_words[Math.floor(Math.random() * (horny_words.length - 1))];
            output += " ";
        }
        output += word + " ";
    }
    return output;
}

export function applyDrone(msg: string, drone_end: Date, header_text: string, footer_text: string, drone_health: number, verbose: boolean = true) {
    if (!shouldApplyDrone(drone_end, verbose)) {
        return msg;
    }

    if (drone_health < 10) {
        return "`This Drone haaaaas receieved bzzzzt, ppplease provide repaiirs using beep '/repair', tthank youu. Returned Error: 0x7547372482`";
    }

    let output = "";
    msg = msg.replace(new RegExp("\\bMe\\b", "gi"), "This Drone");
    msg = msg.replace(new RegExp("\\bMy\\b", "gi"), "Its'");
    msg = msg.replace(new RegExp("\\bI am\\b", "gi"), "It is");
    msg = msg.replace(new RegExp("\\bI(')?m\\b", "gi"), "It is");
    msg = msg.replace(new RegExp("\\bI\\b", "gi"), "This Drone");
    if (verbose) { console.log("Drone Regex Applied"); }

    let ignoreFirstOne = false;

    for (const word of msg.split(" ")) {
        if (ignoreFirstOne) {
            ignoreFirstOne = false;
            continue;
        }
        if (Math.random() > (drone_health / 100)) {
            if (verbose) { console.log("Adding random beep"); }
            output += Math.random() > 0.5 ? "`beep` " : "`bzzzt` ";
        }
        output += word + " ";
    }

    const tempOutput = output;
    output = "";

    let lastTriggered = 0;

    for (const char of tempOutput) {
        output += char;
        lastTriggered += 1;
        if (Math.random() + (lastTriggered / 100) - 1 > (drone_health / 100) && char !== "`") {
            lastTriggered = 0;
            for (let i = 0; i < Math.floor(Math.random() * 10); i++) {
                if (verbose) { console.log("Adding random static"); }
                output += char;
            }
        }
    }

    output = "`" + header_text + "`\n" + output.trimEnd() + "\n`" + footer_text + "`";
    return output;
}

export function applyReplacements(msg: string) {
    const originalMsg = msg;
    console.log("Original message: " + originalMsg);
    msg = applyRules(msg, rules, config.rules_end);
    msg = applyHorny(msg, config.horny_end);
    msg = applyPet(msg, config.pet_end, config.pet_amount, petWords);
    msg = applyBimbo(msg, config.bimbo_end, config.bimbo_word_length);
    msg = applyGag(msg, config.gag_end);
    msg = applyDrone(msg, config.drone_end, config.drone_header_text, config.drone_footer_text, config.drone_health);
    return msg + (config.debug && (shouldApplyRules(config.rules_end) || shouldApplyGag(config.gag_end) || shouldApplyPet(config.pet_end, config.pet_amount) || shouldApplyBimbo(config.bimbo_end) || shouldApplyHorny(config.horny_end) || shouldApplyDrone(config.drone_end)) ? `\n        (original message: ${originalMsg})` : "");
}

export default definePlugin({
    _filterBypassUsers: new Set<string>(),
    name: "key-intercept",
    description: "You don't need to control what you say, let someone else control it.",
    authors: [{ name: "Tom", id: 277137325342064640n }],

    _handler: null as ((event: any) => void) | null,

    async start() {
        await getData();
    },
    onBeforeMessageSend(channelId, msg) {
        const ChannelStore = Vencord.Webpack.findByProps("getChannel", "getDMFromUserId");
        const GuildStore = Vencord.Webpack.findByProps("getGuild", "getGuilds");
        const UserStore = Vencord.Webpack.findByProps("getCurrentUser", "getUser");

        const channel = ChannelStore?.getChannel?.(channelId);
        if (!channel) return;
        if (config?.debug) console.log("Channel object:", channel);

        let nameToCheck: string | null = null;

        if (channel.guild_id) {
            // It's a server channel
            const guild = GuildStore?.getGuild(channel.guild_id);
            if (config?.debug) console.log("Guild object:", guild);
            nameToCheck = guild?.name ?? null;
        } else {
            // It's a DM or Group DM
            if (channel.name) {
                // Group DM with a name
                nameToCheck = channel.name;
            } else if (channel.recipients?.length > 0) {
                // 1-on-1 DM or Group DM without a name
                const currentUser = UserStore.getCurrentUser();
                const recipientNames = channel.recipients
                    .filter((id: string) => id !== currentUser.id)
                    .map((id: string) => UserStore.getUser(id)?.username)
                    .filter(Boolean);
                nameToCheck = recipientNames.join(", ");
            }
        }

        if (config?.debug) console.log(`Name to check against whitelist: "${nameToCheck}"`);

        if (whitelist.length > 0) {

            // If a name exists, check against the whitelist.
            if (nameToCheck && !whitelist.includes(nameToCheck)) {
                if (config?.debug) console.log(`"${nameToCheck}" is not in the whitelist, skipping modifications.`);
                return;
            }
        }

        const channelName = channel?.name?.toLowerCase?.() ?? "";
        if (channelName.includes("sfw") && !channelName.includes("nsfw")) {
            if (config?.debug) console.log("SFW channel detected, skipping modifications");
            return;
        }

        console.log("Event caught: onBeforeMessageSend");
        const output = applyReplacements(msg.content);
        msg.content = output;
    },
});

