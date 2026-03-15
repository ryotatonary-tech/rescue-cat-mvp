// (React import removed)
import { HeartHandshake } from 'lucide-react';
import { CatAvatar } from './CatAvatar';
import type { CatState, Stats } from '../../lib/types';

interface EndingScreenProps {
    cat: CatState;
    onAdopt: () => void;
}

export function EndingScreen({ cat, onAdopt }: EndingScreenProps) {
    // Mock great stats for the ending screen
    const perfectStats: Stats = { hunger: 0, stress: 0, dirty: 0, trust: 100 };

    return (
        <div className="absolute inset-0 z-40 bg-white flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-700">

            {/* Confetti or decorative background can go here */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-30">
                <div className="w-[150%] h-[150%] bg-[radial-gradient(circle,theme(colors.pink.100)_0%,transparent_70%)] animate-pulse" style={{ animationDuration: '4s' }} />
            </div>

            <div className="relative z-10 text-center flex flex-col items-center">
                <div className="bg-pink-100 text-pink-600 rounded-full p-4 mb-6 shadow-inner animate-bounce" style={{ animationDuration: '2s' }}>
                    <HeartHandshake size={48} />
                </div>

                <h1 className="text-3xl font-black text-gray-800 mb-2 font-sans tracking-tight">
                    ずっとの家族へ！
                </h1>

                <p className="text-gray-600 mb-8 whitespace-pre-wrap leading-relaxed">
                    あなたのおかげで、{cat.name}は<br />
                    人間を完全に信頼し、<br />
                    新しい家族のもとへ旅立ちました。<br />
                    いままでお世話ありがとう！
                </p>

                <div className="bg-orange-50 rounded-full p-6 shadow-xl border-4 border-white mb-8">
                    <div className="scale-125 origin-center">
                        <CatAvatar stats={perfectStats} variant={cat.variant} />
                    </div>
                </div>

                <button
                    onClick={onAdopt}
                    className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 hover:scale-105 active:scale-95 active:translate-y-0 text-lg w-full max-w-[280px]"
                >
                    新しい保護猫を迎える
                </button>
            </div>
        </div>
    );
}
