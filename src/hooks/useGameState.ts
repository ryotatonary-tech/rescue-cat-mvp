import { useState, useEffect, useCallback } from 'react';
import type { GameState, ActionType, CatVariant } from '../lib/types';
import { ACTIONS, STORAGE_KEY, TICK, TICK_MINUTES, TRUST_EVENTS, MAX_LOGS, CRISIS_THRESHOLD, TRUST_DECAY } from '../lib/constants';
import { clamp, nowMs, formatTime, generateId } from '../lib/utils';

const defaultState: GameState = {
    cat: { name: "ミケ", variant: 'white' },
    stats: { hunger: 30, stress: 20, dirty: 15, trust: 10 },
    lastTickAt: nowMs(),
    unlocked: { trustEvents: [] },
    logs: [
        { id: generateId(), text: "保護猫がやってきた。まずは距離感を大事にしよう。", timestamp: formatTime() }
    ],
    homeNotice: null
};

export function useGameState() {
    const [state, setState] = useState<GameState>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Simple validation
                if (parsed.stats && parsed.cat) {
                    // Start: Migration for existing data without variant
                    if (!parsed.cat.variant) {
                        parsed.cat.variant = 'white';
                    }
                    // End: Migration
                    return parsed;
                }
            }
        } catch (e) {
            console.error("Failed to load state", e);
        }
        return defaultState;
    });

    // Persistence
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const unlockTrustEvents = useCallback((currentTrust: number, unlocked: number[]) => {
        const newUnlocked = new Set(unlocked);
        let notice: string | null = null;
        let logText: string | null = null;

        for (const ev of TRUST_EVENTS) {
            if (currentTrust >= ev.at && !newUnlocked.has(ev.at)) {
                newUnlocked.add(ev.at);
                logText = `💗 信頼イベント：${ev.text}`;
                notice = `💗 ${ev.text}`;
            }
        }
        return {
            unlocked: Array.from(newUnlocked).sort((a, b) => a - b),
            notice,
            logText
        };
    }, []);

    const [trustDecreased, setTrustDecreased] = useState(false);

    // Derived state for UI
    const isCrisis = state.stats.hunger >= CRISIS_THRESHOLD || state.stats.stress >= CRISIS_THRESHOLD || state.stats.dirty >= CRISIS_THRESHOLD;

    const processTick = useCallback(() => {
        setState(prev => {
            const intervalMs = TICK_MINUTES * 60 * 1000;
            const elapsed = nowMs() - prev.lastTickAt;
            if (elapsed < intervalMs) return prev;

            const ticks = Math.floor(elapsed / intervalMs);
            let newStats = { ...prev.stats };

            // Apply ticks
            for (let i = 0; i < ticks; i++) {
                newStats.hunger = clamp(newStats.hunger + TICK.hunger);
                newStats.dirty = clamp(newStats.dirty + TICK.dirty);

                let stressInc = TICK.stressBase;
                if (newStats.dirty >= TICK.stressDirtyBonusThreshold) {
                    stressInc += TICK.stressDirtyBonus;
                }
                newStats.stress = clamp(newStats.stress + stressInc);
            }

            // Trust Decay Logic
            const currentCrisis = newStats.hunger >= CRISIS_THRESHOLD || newStats.stress >= CRISIS_THRESHOLD || newStats.dirty >= CRISIS_THRESHOLD;

            let trustDecayed = 0;
            if (currentCrisis) {
                for (let i = 0; i < ticks; i++) {
                    if (newStats.trust > 0) {
                        newStats.trust = clamp(newStats.trust - TRUST_DECAY);
                        trustDecayed += TRUST_DECAY;
                    }
                }
            }

            // Log for significant time pass
            let newLogs = [...prev.logs];
            let homeNotice = prev.homeNotice;
            if (ticks >= 2) {
                const text = `時間がたった。様子を見てみよう（+${ticks}tick）`;
                newLogs.unshift({ id: generateId(), text, timestamp: formatTime() });
            }

            if (trustDecayed > 0) {
                newLogs.unshift({ id: generateId(), text: `放置しすぎて信頼が下がってしまった…（-${trustDecayed}）`, timestamp: formatTime() });
                // Trigger UI signal (side effect outside of reducer pattern, but okay for this simple hook)
                setTrustDecreased(true);
                // Auto-hide after 3s handled by component or timeout here? 
                // It's cleaner to let UI handle the reset or use a timestamp.
                // For now, we'll set it here and let UI effect reset it or use a timestamp. 
                // Better: return a "lastTrustDecrease" timestamp in state? 
                // Let's use the external state `trustDecreased` which we toggle.
                setTimeout(() => setTrustDecreased(false), 5000);
            }

            if (newLogs.length > MAX_LOGS) newLogs.length = MAX_LOGS;

            return {
                ...prev,
                stats: newStats,
                lastTickAt: prev.lastTickAt + ticks * intervalMs,
                logs: newLogs,
                homeNotice
            };
        });
    }, []);

    const doAction = useCallback((actionKey: ActionType) => {
        setState(prev => {
            const action = ACTIONS[actionKey];
            const s = prev.stats;

            // Trust mechanics
            let trustGain = action.trust;
            // Play is hard if low trust
            if (actionKey === "play" && s.trust < 15) trustGain = 1;

            const newStats = {
                hunger: clamp(s.hunger + action.hunger),
                stress: clamp(s.stress + action.stress),
                dirty: clamp(s.dirty + action.dirty),
                trust: clamp(s.trust + trustGain)
            };

            // Message
            let msg = "";
            switch (actionKey) {
                case "feed": msg = (s.hunger < 30) ? "おなか満足…💤" : "もぐもぐ…おいしい！"; break;
                case "play": msg = (trustGain === 1) ? "ちょっとだけ興味ある…" : "たのしい！またやろ！"; break;
                case "clean": msg = (s.dirty < 20) ? "ここ、きれい。いいね。" : "すっきり！呼吸しやすい！"; break;
                case "rest": msg = (s.stress < 30) ? "落ち着いた…" : "ふぅ…ちょっと安心。"; break;
            }

            // Check events
            const eventResult = unlockTrustEvents(newStats.trust, prev.unlocked.trustEvents);

            let newLogs = [...prev.logs];
            newLogs.unshift({ id: generateId(), text: `${action.label}：${msg}`, timestamp: formatTime() });
            if (eventResult.logText) {
                newLogs.unshift({ id: generateId(), text: eventResult.logText, timestamp: formatTime() });
            }
            if (newLogs.length > MAX_LOGS) newLogs.length = MAX_LOGS;

            return {
                ...prev,
                stats: newStats,
                logs: newLogs,
                unlocked: { trustEvents: eventResult.unlocked },
                homeNotice: eventResult.notice || null
            };
        });
    }, [unlockTrustEvents]);

    const renameCat = useCallback((newName: string) => {
        setState(prev => ({
            ...prev,
            cat: { ...prev.cat, name: newName },
            logs: [{ id: generateId(), text: `名前が「${newName}」になった。`, timestamp: formatTime() }, ...prev.logs]
        }));
    }, []);

    const setVariant = useCallback((variant: CatVariant) => {
        setState(prev => ({
            ...prev,
            cat: { ...prev.cat, variant },
            logs: [{ id: generateId(), text: `毛色が変わった気がする…？`, timestamp: formatTime() }, ...prev.logs]
        }));
    }, []);

    const resetGame = useCallback(() => {
        if (confirm("はじめからにしますか？（今のデータは消えます）")) {
            setState(defaultState);
        }
    }, []);

    const clearLog = useCallback(() => {
        if (confirm("ログを消しますか？")) {
            setState(prev => ({
                ...prev,
                logs: [{ id: generateId(), text: "ログを消した。お世話は続く。", timestamp: formatTime() }]
            }));
        }
    }, []);

    return {
        state,
        isCrisis,
        trustDecreased,
        doAction,
        processTick,
        renameCat,
        setVariant,
        resetGame,
        clearLog
    };
}
