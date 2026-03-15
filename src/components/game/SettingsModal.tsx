import { useState, useEffect } from 'react';
import { X, Moon } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    sleepWindow: { startTime: string; endTime: string; enabled: boolean };
    onSave: (startTime: string, endTime: string, enabled: boolean) => void;
}

export function SettingsModal({ isOpen, onClose, sleepWindow, onSave }: Props) {
    const [startTime, setStartTime] = useState(sleepWindow.startTime);
    const [endTime, setEndTime] = useState(sleepWindow.endTime);
    const [enabled, setEnabled] = useState(sleepWindow.enabled);

    useEffect(() => {
        if (isOpen) {
            setStartTime(sleepWindow.startTime);
            setEndTime(sleepWindow.endTime);
            setEnabled(sleepWindow.enabled);
        }
    }, [isOpen, sleepWindow]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(startTime, endTime, enabled);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                        <Moon size={18} className="text-indigo-400" />
                        睡眠時間設定 (Sleep Window)
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <label className="font-bold text-sm text-gray-700">睡眠モードを有効にする</label>
                        <input
                            type="checkbox"
                            checked={enabled}
                            onChange={(e) => setEnabled(e.target.checked)}
                            className="w-5 h-5 text-indigo-500 rounded focus:ring-0 cursor-pointer"
                        />
                    </div>

                    <div className="space-y-4 transition-opacity" style={{ opacity: enabled ? 1 : 0.5, pointerEvents: enabled ? 'auto' : 'none' }}>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">就寝時間</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 font-mono text-gray-700 focus:outline-none focus:border-indigo-300"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">起床時間</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 font-mono text-gray-700 focus:outline-none focus:border-indigo-300"
                            />
                        </div>

                        <p className="text-xs text-gray-500 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                            設定した時間帯は、猫も一緒に眠ります。お腹が空いたり汚れたりせず、信頼度も下がりません。
                        </p>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">
                        キャンセル
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-sm transition-colors">
                        保存する
                    </button>
                </div>
            </div>
        </div>
    );
}
