import type { ActionEffect, ActionType } from "./types";

export const STORAGE_KEY = "rescue_cat_react_v1";
export const TICK_MINUTES = 15;

// Tick effects (every 15 minutes)
export const TICK = {
    hunger: 4,
    dirty: 3,
    stressBase: 2,
    stressDirtyBonusThreshold: 60,
    stressDirtyBonus: 1,
};

// Actions
export const ACTIONS: Record<ActionType, ActionEffect> = {
    feed: { hunger: -20, stress: -3, dirty: 0, trust: 1, label: "ごはん" },
    play: { hunger: 6, stress: -18, dirty: 0, trust: 2, label: "遊ぶ" },
    clean: { hunger: 0, stress: -5, dirty: -25, trust: 0, label: "掃除" },
    rest: { hunger: 4, stress: -12, dirty: 0, trust: 1, label: "休む" },
};

// Trust Events
export const TRUST_EVENTS = [
    { at: 5, text: "少し近づいてきた" },
    { at: 10, text: "匂いを嗅いできた" },
    { at: 15, text: "おもちゃを見てる" },
    { at: 20, text: "足元に来た" },
    { at: 25, text: "ごはんのあとに座って待ってる" },
    { at: 30, text: "目の前で寝た" },
    { at: 40, text: "ゴロゴロ音が聞こえる" },
    { at: 50, text: "膝に乗る" },
    { at: 60, text: "ちょっとだけ抱っこOK" },
    { at: 75, text: "ずっと一緒にいたいアピール" },
];

export const MAX_LOGS = 60;

export const CRISIS_THRESHOLD = 80;
export const TRUST_DECAY = 1;

export const ADOPTION_TRUST_THRESHOLD = 100;
