export type Config = {
	id: bigint,
	created_at: Date,
	updated_at: Date,
	rules_end: Date,
	gag_end: Date,
	pet_end: Date,
	pet_amount: number,
	pet_type: bigint,
	bimbo_end: Date,
	horny_end: Date,
	bimbo_word_length: number,
	drone_end: Date,
	uwu_end: Date,
	censored_end: Date,
	censored_replacement: string,
	debug: boolean;
};

export type Rule = {
	id: bigint,
	created_at: Date,
	updated_at: Date,
	config_id: bigint,
	rule_regex: RegExp,
	rule_replacement: string,
	regex_normalize: boolean,
	enabled: boolean,
	chance_to_apply: number,
	label: string,
	order: number,
};

export type WhitelistItem = {
	id: bigint,
	config_id: bigint,
	server_name: string,
	discord_id: string,
}

export type DroneConfig = {
	config_id: bigint,
	drone_health: number
	speech_header: string,
	speech_footer: string,
	action_header: string,
	action_footer: string,
	whisper_header: string,
	whisper_footer: string,
	loud_header: string,
	loud_footer: string,
}
