import type { Stats, CatVariant } from '../../lib/types';
import normalCat from '../../assets/normal-cat.png';
import happyCat from '../../assets/happy-cat.png';
import sadCat from '../../assets/sad-cat.png';
import { VARIANTS } from './CustomizeModal';

interface Props {
    stats: Stats;
    variant?: CatVariant;
}

export function CatAvatar({ stats, variant = 'white' }: Props) {
    let src = normalCat;
    if (stats.stress >= 85 || stats.hunger >= 85 || stats.dirty >= 85) {
        src = sadCat;
    } else if (stats.trust >= 75) {
        src = happyCat;
    }

    // Get filter for the current variant
    const currentVariant = VARIANTS.find(v => v.id === variant) || VARIANTS[0];

    // Animation classes based on state
    // Idle breathing is always on (pulse-slow).
    // If happy, maybe bounce?
    const isHappy = stats.trust >= 50 && stats.hunger < 50 && stats.stress < 50;
    const isSad = stats.stress >= 80 || stats.hunger >= 80 || stats.dirty >= 80;

    let animationClass = "animate-pulse"; // moderate pulse
    if (isHappy) animationClass = "animate-bounce"; // happy bounce
    if (isSad) animationClass = "animate-pulse"; // rapid pulse (simulating shiver maybe? or just standard pulse)

    // Note: To mix filters (grayscale for sad?) and variant filters might be complex.
    // For now, consistent variant filter.

    return (
        <div className={`relative w-48 h-48 mx-auto my-4 transition-transform duration-300 hover:scale-105 active:scale-95 ${animationClass}`}>
            <div className={`absolute inset-0 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full blur-2xl opacity-50`} />
            <img
                src={src}
                alt="Cat"
                className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-xl transition-all duration-500"
                style={{ filter: currentVariant.filter }}
            />
        </div>
    );
}
