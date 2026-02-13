import type { Stats } from '../../lib/types';
import normalCat from '../../assets/normal-cat.png';
import happyCat from '../../assets/happy-cat.png';
import sadCat from '../../assets/sad-cat.png';

interface Props {
    stats: Stats;
}

export function CatAvatar({ stats }: Props) {
    let src = normalCat;
    if (stats.stress >= 85 || stats.hunger >= 85 || stats.dirty >= 85) {
        src = sadCat;
    } else if (stats.trust >= 75) {
        src = happyCat;
    }

    return (
        <div className="relative w-48 h-48 mx-auto my-4 transition-transform duration-300 hover:scale-105 active:scale-95">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full blur-2xl opacity-50 animate-pulse" />
            <img
                src={src}
                alt="Cat"
                className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-xl"
            />
        </div>
    );
}
