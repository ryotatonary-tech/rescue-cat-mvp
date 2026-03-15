import type { Stats, CatVariant } from '../../lib/types';
import normalCatBase from '../../assets/normal-cat.png';
import happyCatBase from '../../assets/happy-cat.png';
import sadCatBase from '../../assets/sad-cat.png';
import { VARIANTS } from './CustomizeModal';

interface Props {
    stats: Stats;
    variant?: CatVariant;
}

// Map variants to their generated asset filenames if available
// Since filenames have timestamps, we hardcode the specific ones generated
const GENERATED_ASSETS: Record<string, Record<string, string>> = {
    white: {
        normal: '/cats/white_normal_1772144971357.png',
        happy: '/cats/white_happy_1772145039202.png',
        sad: '/cats/white_sad_1772145052601.png'
    },
    black: {
        normal: '/cats/black_normal_1772145432914.png',
        happy: '/cats/black_happy_1772145727695.png',
        sad: '/cats/black_sad_1772145944232.png'
    }
};

export function CatAvatar({ stats, variant = 'white' }: Props) {
    let mood = 'normal';
    if (stats.stress >= 85 || stats.hunger >= 85 || stats.dirty >= 85) {
        mood = 'sad';
    } else if (stats.trust >= 75) {
        mood = 'happy';
    }

    let src = '';
    let useFilter = false;
    let fallbackFilter = '';

    // Check if we have generated assets for this variant
    if (GENERATED_ASSETS[variant]) {
        src = GENERATED_ASSETS[variant][mood];
    } else {
        // Fallback to base images + CSS filters for variants missing generated art
        useFilter = true;
        const currentVariant = VARIANTS.find(v => v.id === variant) || VARIANTS[0];
        fallbackFilter = currentVariant.filter;

        if (mood === 'sad') src = sadCatBase;
        else if (mood === 'happy') src = happyCatBase;
        else src = normalCatBase;
    }

    // Animation classes based on state
    const isHappy = mood === 'happy' || (stats.trust >= 50 && stats.hunger < 50 && stats.stress < 50);
    const isSad = mood === 'sad';

    let animationClass = "animate-pulse"; // moderate pulse
    if (isHappy) animationClass = "animate-bounce"; // happy bounce
    if (isSad) animationClass = "animate-pulse"; // rapid pulse (simulating shiver)

    return (
        <div className={`relative w-48 h-48 mx-auto my-4 transition-transform duration-300 hover:scale-105 active:scale-95 ${animationClass}`}>
            <div className={`absolute inset-0 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full blur-2xl opacity-50`} />
            <img
                src={src}
                alt={`${variant} cat`}
                className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-xl transition-all duration-500 bg-white"
                style={useFilter ? { filter: fallbackFilter } : undefined}
            />
        </div>
    );
}
