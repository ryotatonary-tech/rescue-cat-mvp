import { X, GitCommit } from 'lucide-react';
import { VERSIONS } from '../../lib/versions';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export function VersionModal({ isOpen, onClose }: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-sm max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-orange-50/50 rounded-t-2xl">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <GitCommit size={20} className="text-orange-500" />
                        更新履歴
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-black/5 rounded-full transition-colors text-gray-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto">
                    <div className="space-y-6">
                        {VERSIONS.map((ver, i) => (
                            <div key={ver.version} className={`relative pl-4 ${i !== VERSIONS.length - 1 ? 'border-l-2 border-gray-100 pb-6' : ''}`}>
                                <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white ${i === 0 ? 'bg-orange-500 ring-2 ring-orange-100' : 'bg-gray-300'}`} />

                                <div className="flex items-baseline justify-between mb-1">
                                    <span className={`font-bold text-lg ${i === 0 ? 'text-orange-600' : 'text-gray-600'}`}>
                                        v{ver.version}
                                    </span>
                                    <span className="text-xs text-gray-400 font-mono">{ver.date}</span>
                                </div>

                                <ul className="space-y-1">
                                    {ver.changes.map((change, idx) => (
                                        <li key={idx} className="text-sm text-gray-700 leading-relaxed flex items-start gap-1.5">
                                            <span className="text-gray-300 mt-1.5 text-[6px]">●</span>
                                            {change}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 text-center">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-gray-100 font-bold text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        とじる
                    </button>
                </div>
            </div>
        </div>
    );
}
