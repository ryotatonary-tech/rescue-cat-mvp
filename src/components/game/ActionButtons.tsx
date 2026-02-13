import type { ActionType } from '../../lib/types';
import { ACTIONS } from '../../lib/constants';
import { Fish, Gamepad2, Sparkles, Moon } from 'lucide-react';

interface Props {
    onAction: (action: ActionType) => void;
}

export function ActionButtons({ onAction }: Props) {
    const renderBtn = (action: ActionType, icon: React.ReactNode, colorClass: string) => {
        const meta = ACTIONS[action];
        return (
            <button
                key={action}
                onClick={() => onAction(action)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-md border-b-4 active:border-b-0 active:translate-y-1 transition-all ${colorClass} text-white`}
            >
                <div className="mb-1">{icon}</div>
                <div className="font-bold text-sm">{meta.label}</div>
            </button>
        );
    };

    return (
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
            {renderBtn('feed', <Fish size={24} />, "bg-orange-400 border-orange-600 hover:bg-orange-500")}
            {renderBtn('play', <Gamepad2 size={24} />, "bg-pink-400 border-pink-600 hover:bg-pink-500")}
            {renderBtn('clean', <Sparkles size={24} />, "bg-cyan-400 border-cyan-600 hover:bg-cyan-500")}
            {renderBtn('rest', <Moon size={24} />, "bg-indigo-400 border-indigo-600 hover:bg-indigo-500")}
        </div>
    );
}
