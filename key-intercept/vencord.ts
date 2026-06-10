/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin from "@utils/types";

declare const Vencord: any;

import { editPreviousMessage, getPreviousMessage, getPreviousMessageSender } from "./getPreviousMessage";
import {
	applyDrone as applyDroneCore,
	applyReplacements as applyReplacementsCore,
	config,
	droneConfig,
	getData,
	DroneContext,
	whitelist,
} from "./core";

export function applyDrone(msg: string, drone_end: Date, speech_header: string, speech_footer: string, action_header: string, action_footer: string, whisper_header: string, whisper_footer: string, loud_header: string, loud_footer: string, drone_health: number, channelID: string, verbose: boolean = true) {
	const currentUser = Vencord.Webpack.findByProps("getCurrentUser", "getUser").getCurrentUser();
	const previousMessage = getPreviousMessage(channelID);
	const previousSender = getPreviousMessageSender(channelID);
	const result = applyDroneCore(msg, drone_end, speech_header, speech_footer, action_header, action_footer, whisper_header, whisper_footer, loud_header, loud_footer, drone_health, channelID, {
		previousMessage,
		previousSenderId: previousSender?.id ?? null,
		currentUserId: currentUser.id,
	}, verbose);

	if (result.editPreviousMessage) {
		editPreviousMessage(result.editPreviousMessage.channelId, result.editPreviousMessage.messageId, result.editPreviousMessage.newContent);
	}

	return result.message;
}

export function applyReplacements(msg: string, channelId: string): string {
	const currentUser = Vencord.Webpack.findByProps("getCurrentUser", "getUser").getCurrentUser();
	const previousMessage = getPreviousMessage(channelId);
	const previousSender = getPreviousMessageSender(channelId);
	const result = applyReplacementsCore(msg, channelId, {
		previousMessage,
		previousSenderId: previousSender?.id ?? null,
		currentUserId: currentUser.id,
	});

	if (result.editPreviousMessage) {
		editPreviousMessage(result.editPreviousMessage.channelId, result.editPreviousMessage.messageId, result.editPreviousMessage.newContent);
	}

	return result.message;
}

export default definePlugin({
	_filterBypassUsers: new Set<string>(),
	name: "key-intercept",
	description: "You don't need to control what you say, let someone else control it.",
	authors: [{ name: "Tom", id: 277137325342064640n }],
	dependencies: ["MessageEventsAPI"],
	_handler: null as ((event: any) => void) | null,

	async start() {
		const UserStore = Vencord.Webpack.findByProps("getCurrentUser", "getUser");
		const currentUser = UserStore.getCurrentUser();
		await getData(currentUser.id, currentUser.username);
	},
	onBeforeMessageSend(channelId: string, msg: { content: string }) {
		const ChannelStore = Vencord.Webpack.findByProps("getChannel", "getDMFromUserId");
		const GuildStore = Vencord.Webpack.findByProps("getGuild", "getGuilds");
		const UserStore = Vencord.Webpack.findByProps("getCurrentUser", "getUser");

		const channel = ChannelStore?.getChannel?.(channelId);
		if (!channel) return;
		if (config?.debug) console.log("Channel object:", channel);

		let nameToCheck: string | null = null;
		let idToCheck: string | null = null;

		if (channel.guild_id) {
			const guild = GuildStore?.getGuild(channel.guild_id);
			if (config?.debug) console.log("Guild object:", guild);
			nameToCheck = guild?.name ?? null;
			idToCheck = guild?.id ?? null;
		} else {
			if (channel.name) {
				nameToCheck = channel.name;
			} else if (channel.recipients?.length > 0) {
				const currentUser = UserStore.getCurrentUser();
				const recipientNames = channel.recipients
					.filter((id: string) => id !== currentUser.id)
					.map((id: string) => UserStore.getUser(id)?.username)
					.filter(Boolean);
				nameToCheck = recipientNames.join(", ");
				idToCheck = channel.id ?? null;
			}
		}

		if (config?.debug) console.log(`Name to check against whitelist: "${nameToCheck}"`);
		if (config?.debug) console.log(`ID to check against whitelist: "${idToCheck}"`);

		if (whitelist.length > 0) {
			const nameMatches = !!nameToCheck && whitelist.some(item => item.server_name === nameToCheck);
			const idMatches = !!idToCheck && whitelist.some(item => item.discord_id === idToCheck);

			if ((nameToCheck || idToCheck) && !nameMatches && !idMatches) {
				if (config?.debug) {
					console.log(
						`No whitelist match for name "${nameToCheck}" or ID "${idToCheck}", skipping modifications.`
					);
				}
				return;
			}
		}

		const channelName = channel?.name?.toLowerCase?.() ?? "";
		if (channelName.includes("sfw") && !channelName.includes("nsfw")) {
			if (config?.debug) console.log("SFW channel detected, skipping modifications");
			return;
		}

		console.log("Event caught: onBeforeMessageSend");
		const output = applyReplacements(msg.content, channelId);
		msg.content = output;
	},
});