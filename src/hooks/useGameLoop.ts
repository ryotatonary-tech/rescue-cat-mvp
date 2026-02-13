import { useEffect, useState } from 'react';
import { TICK_MINUTES } from '../lib/constants';
import { nowMs, clamp } from '../lib/utils';

export function useGameLoop(
    lastTickAt: number,
    processTick: () => void
) {
    const [nextTickLabel, setNextTickLabel] = useState("--:--");

    useEffect(() => {
        const timer = setInterval(() => {
            processTick();

            // Update timer label
            const intervalMs = TICK_MINUTES * 60 * 1000;
            const elapsed = nowMs() - lastTickAt;
            const remain = clamp(intervalMs - elapsed, 0, intervalMs);
            const mm = Math.floor(remain / 60000);
            const ss = Math.floor((remain % 60000) / 1000);
            setNextTickLabel(`${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`);

        }, 1000);

        return () => clearInterval(timer);
    }, [lastTickAt, processTick]);

    return { nextTickLabel };
}
