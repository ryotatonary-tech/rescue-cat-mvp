import { Home, HandHeart, ScrollText } from 'lucide-react';

export type TabKey = 'home' | 'care' | 'log';

interface Props {
    activeTab: TabKey;
    onTabChange: (tab: TabKey) => void;
}

export function TabNav({ activeTab, onTabChange }: Props) {
    const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
        { key: 'home', label: 'Home', icon: <Home size={20} /> },
        { key: 'care', label: 'お世話', icon: <HandHeart size={20} /> },
        { key: 'log', label: 'ログ', icon: <ScrollText size={20} /> },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
            <div className="flex justify-between items-center max-w-md mx-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => onTabChange(tab.key)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${activeTab === tab.key
                                ? 'text-orange-500 scale-105 font-bold'
                                : 'text-gray-400 hover:text-gray-500'
                            }`}
                    >
                        {tab.icon}
                        <span className="text-[10px]">{tab.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}
