import type { Stats } from '../../lib/types';
import { Heart, Utensils, Zap, Sparkles } from 'lucide-react';

interface Props {
    stats: Stats;
}

export function StatusPanel({ stats }: Props) {
    const renderBar = (label: string, value: number, icon: React.ReactNode, color: string) => {
        // For bad stats (hunger, stress, dirty): high is bad (red)
        // For good stats (trust): high is good (blue/pink)

        // However, the bar fill logic:
        // If high is bad, we usually still fill 0-100.
        // The color changes or it's just a bar.
        // In MVP:
        // hunger/stress/dirty: 0 is good, 100 is bad. Bar fills up as it gets worse.
        // trust: 0 is bad, 100 is good. Bar fills up as it gets better.

        return (
            <div className="flex items-center gap-3 py-2 border-b border-white/10 last:border-0">
                <div className="w-20 text-xs font-bold text-gray-600 flex items-center gap-1">
                    {icon}
                    {label}
                </div>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                    <div
                        className={`h-full transition-all duration-500 ease-out ${color}`}
                        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                    />
                </div>
                <div className="w-8 text-right text-xs text-gray-500 font-mono">
                    {value}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/20 w-full max-w-sm">
            {renderBar("空腹", stats.hunger, <Utensils size={14} />, "bg-rose-400")}
            {renderBar("ストレス", stats.stress, <Zap size={14} />, "bg-orange-400")}
            {renderBar("汚れ", stats.dirty, <Sparkles size={14} />, "bg-gray-400")}
            {renderBar("信頼", stats.trust, <Heart size={14} />, "bg-sky-400")}
        </div>
    );
}
