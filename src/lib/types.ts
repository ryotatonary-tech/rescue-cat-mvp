export interface CatState {
    name: string;
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

export interface GameState {
    cat: CatState;
    stats: Stats;
    lastTickAt: number;
    unlocked: {
        trustEvents: number[]; // stored as trust thresholds (e.g. 5, 10, ...)
    };
    logs: LogItem[];
    homeNotice: string | null;
}

export type ActionType = 'feed' | 'play' | 'clean' | 'rest';

export interface ActionEffect {
    hunger: number;
    stress: number;
    dirty: number;
    trust: number;
    label: string;
}
