export type CatVariant = 'white' | 'black' | 'orange' | 'calico' | 'cream';

export interface CatState {
    name: string;
    variant: CatVariant;
    adoptedAt?: number;
}

export interface Stats {
    hunger: number;
    stress: number;
    dirty: number;
    trust: number;
}

export interface LogItem {
    id: string;
    text: string;
    timestamp: string;
}

export interface HistoryRecord {
    id: string;
    name: string;
    variant: CatVariant;
    adoptedAt: number;
    daysTakenCareOf?: number; // optionally calculate how many days in game or real life
}

export interface SleepWindow {
    startTime: string; // "23:00"
    endTime: string;   // "07:00"
    enabled: boolean;
}

export interface GameState {
    cat: CatState;
    stats: Stats;
    lastTickAt: number;
    unlocked: {
        trustEvents: number[]; // stored as trust thresholds (e.g. 5, 10, ...)
    };
    logs: LogItem[];
    homeNotice: string | null;
    isAdopted: boolean;
    history: HistoryRecord[];
    sleepWindow: SleepWindow;
}

export type ActionType = 'feed' | 'play' | 'clean' | 'rest';

export interface ActionEffect {
    hunger: number;
    stress: number;
    dirty: number;
    trust: number;
    label: string;
}
