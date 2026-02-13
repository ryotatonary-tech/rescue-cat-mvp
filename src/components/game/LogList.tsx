import type { LogItem } from '../../lib/types';

interface Props {
    logs: LogItem[];
}

export function LogList({ logs }: Props) {
    if (logs.length === 0) {
        return <div className="text-center text-gray-400 py-8">ログはありません</div>;
    }

    return (
        <div className="flex flex-col gap-2 w-full max-w-sm max-h-[60vh] overflow-y-auto px-1">
            {logs.map(log => (
                <div key={log.id} className="bg-white/60 p-3 rounded-lg text-sm border border-gray-100 shadow-sm animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="text-gray-800 font-medium mb-1">{log.text}</div>
                    <div className="text-xs text-gray-400 text-right">{log.timestamp}</div>
                </div>
            ))}
        </div>
    );
}
