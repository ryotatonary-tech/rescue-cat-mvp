import { X, Palette } from 'lucide-react';
import type { CatVariant } from '../../lib/types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    currentVariant: CatVariant;
    onSelectVariant: (variant: CatVariant) => void;
}

export const VARIANTS: { id: CatVariant; label: string; color: string; filter: string }[] = [
    { id: 'white', label: 'しろ', color: 'bg-white border-gray-200', filter: 'none' },
    { id: 'black', label: 'くろ', color: 'bg-gray-800 text-white', filter: 'brightness(0.3) contrast(1.2)' },
    { id: 'orange', label: '茶トラ', color: 'bg-orange-300', filter: 'sepia(1) saturate(3) hue-rotate(-10deg)' },
    { id: 'calico', label: 'ミケ', color: 'bg-amber-100 border-amber-300', filter: 'sepia(0.5) saturate(2) hue-rotate(10deg) contrast(1.1)' }, // Simplified for now
    { id: 'cream', label: 'クリーム', color: 'bg-[#fef3c7]', filter: 'sepia(0.3) saturate(1.5) brightness(1.1)' },
];

export function CustomizeModal({ isOpen, onClose, currentVariant, onSelectVariant }: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative">

                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                >
                    <X size={20} />
                </button>

                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-6">
                    <Palette size={20} className="text-pink-500" />
                    毛色をえらぶ
                </h3>

                <div className="grid grid-cols-2 gap-3">
                    {VARIANTS.map(v => (
                        <button
                            key={v.id}
                            onClick={() => onSelectVariant(v.id)}
                            className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${currentVariant === v.id
                                    ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                                    : 'border-transparent bg-gray-50 hover:bg-gray-100'
                                }`}
                        >
                            <div
                                className={`w-6 h-6 rounded-full shadow-sm border ${v.id === 'white' ? 'border-gray-200' : 'border-transparent'}`}
                                style={{ backgroundColor: v.id === 'black' ? '#333' : v.id === 'orange' ? '#fdba74' : v.id === 'calico' ? '#fcd34d' : v.id === 'cream' ? '#fef3c7' : '#fff' }}
                            />
                            <span className="font-bold text-sm text-gray-700">{v.label}</span>
                        </button>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition-colors"
                    >
                        決定
                    </button>
                </div>
            </div>
        </div>
    );
}
