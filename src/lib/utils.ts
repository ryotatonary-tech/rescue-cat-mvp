export const clamp = (n: number, min = 0, max = 100) =>
    Math.max(min, Math.min(max, n));

export const nowMs = () => Date.now();

export const fmt2 = (n: number) => String(n).padStart(2, "0");

export const formatTime = (date: Date = new Date()) =>
    `${fmt2(date.getMonth() + 1)}/${fmt2(date.getDate())} ${fmt2(date.getHours())}:${fmt2(date.getMinutes())}`;

export const generateId = () => Math.random().toString(36).substr(2, 9);

export function isTimeInWindow(dateOffsetMs: number, startStr: string, endStr: string): boolean {
    const date = new Date(dateOffsetMs);
    const [startH, startM] = startStr.split(':').map(Number);
    const [endH, endM] = endStr.split(':').map(Number);

    // Convert all to minutes from midnight
    const currentMs = date.getHours() * 60 + date.getMinutes();
    const startMs = startH * 60 + startM;
    const endMs = endH * 60 + endM;

    if (startMs <= endMs) {
        // e.g. 05:00 to 07:00
        return currentMs >= startMs && currentMs < endMs;
    } else {
        // e.g. 23:00 to 07:00 (crosses midnight)
        return currentMs >= startMs || currentMs < endMs;
    }
}
