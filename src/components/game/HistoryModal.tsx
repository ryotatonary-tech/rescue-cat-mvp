// (React import removed, using jsx runtime)
import type { HistoryRecord } from '../../lib/types';
import { X, Award, Calendar } from 'lucide-react';
import { CatAvatar } from './CatAvatar'; // Reuse avatar but stat-less if possible, or mocked stats

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: HistoryRecord[];
}

export function HistoryModal({ isOpen, onClose, history }: HistoryModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                <div className="p-4 border-b border-orange-100 flex justify-between items-center bg-orange-50/50">
                    <h2 className="font-bold text-lg text-orange-800 flex items-center gap-2">
                        <Award className="text-orange-500" size={20} />
                        卒業アルバム
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-orange-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto bg-gray-50 flex-1">
                    {history.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 text-sm">
                            <p>まだ卒業した猫はいません。</p>
                            <p className="mt-2 text-xs">信頼度を100まで上げると、<br />新しい家族のもとへ旅立ちます。</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {history.map((record) => {
                                const date = new Date(record.adoptedAt);
                                const dateString = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

                                return (
                                    <div key={record.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 shadow-sm hover:border-orange-200 transition-colors">
                                        <div className="w-16 h-16 shrink-0 bg-orange-50 rounded-full flex items-center justify-center overflow-hidden border border-orange-100">
                                            {/* Simple mock stats to render the avatar safely */}
                                            <div className="scale-75 origin-center">
                                                <CatAvatar stats={{ hunger: 0, stress: 0, dirty: 0, trust: 100 }} variant={record.variant} />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-black text-gray-800 text-lg">{record.name}</h3>
                                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                <Calendar size={12} />
                                                卒業日: {dateString}
                                            </div>
                                            <div className="text-xs text-orange-600 font-bold bg-orange-100 inline-block px-2 py-0.5 rounded-full mt-2">
                                                ずっとの家族ができました
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
