/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

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
    drone_header_text: string,
    drone_footer_text: string,
    drone_health: number,
    debug: boolean;
};

export type Rule = {
    id: bigint,
    created_at: Date,
    updated_at: Date,
    config_id: bigint,
    rule_regex: RegExp,
    rule_replacement: string,
    enabled: boolean,
    chance_to_apply: number,
};
