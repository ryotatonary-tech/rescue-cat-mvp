export const clamp = (n: number, min = 0, max = 100) =>
    Math.max(min, Math.min(max, n));

export const nowMs = () => Date.now();

export const fmt2 = (n: number) => String(n).padStart(2, "0");

export const formatTime = (date: Date = new Date()) =>
    `${fmt2(date.getMonth() + 1)}/${fmt2(date.getDate())} ${fmt2(date.getHours())}:${fmt2(date.getMinutes())}`;

export const generateId = () => Math.random().toString(36).substr(2, 9);
