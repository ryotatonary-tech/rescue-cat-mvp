import { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { useGameLoop } from './hooks/useGameLoop';
import { StatusPanel } from './components/game/StatusPanel';
import { CatAvatar } from './components/game/CatAvatar';
import { CustomizeModal } from './components/game/CustomizeModal';
import { ActionButtons } from './components/game/ActionButtons';
import { LogList } from './components/game/LogList';
import { TabNav, type TabKey } from './components/layout/TabNav';
import { VersionModal } from './components/game/VersionModal';
import { AlertCircle, Trash2, Edit2, RotateCcw, HandHeart, ScrollText, Info, Palette } from 'lucide-react';

function App() {
  const { state, doAction, processTick, renameCat, setVariant, resetGame, clearLog, isCrisis, trustDecreased } = useGameState();
  const { nextTickLabel } = useGameLoop(state.lastTickAt, processTick);
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);

  // Helper to handle renaming
  const handleRename = () => {
    const newName = prompt("猫の名前を入力してね", state.cat.name);
    if (newName && newName.trim()) {
      renameCat(newName.trim().slice(0, 12));
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 pb-24 font-sans text-gray-800 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl overflow-hidden relative">

        {/* Header */}
        <header className="px-6 py-4 bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b border-orange-100 flex justify-between items-center">
          <div className="font-bold text-lg text-orange-800 flex items-center gap-2">
            🐾 Rescue Cat Life
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsVersionModalOpen(true)} className="text-xs text-gray-400 hover:text-orange-500 transition-colors">
              <Info size={16} />
            </button>
            <button onClick={() => setIsCustomizeModalOpen(true)} className="text-xs text-gray-400 hover:text-pink-500 transition-colors">
              <Palette size={16} />
            </button>
            <button onClick={resetGame} className="text-xs text-gray-400 hover:text-red-400 transition-colors">
              <RotateCcw size={16} />
            </button>
          </div>
        </header>

        <VersionModal isOpen={isVersionModalOpen} onClose={() => setIsVersionModalOpen(false)} />
        <CustomizeModal
          isOpen={isCustomizeModalOpen}
          onClose={() => setIsCustomizeModalOpen(false)}
          currentVariant={state.cat.variant}
          onSelectVariant={(v) => { setVariant(v); setIsCustomizeModalOpen(false); }}
        />

        {/* Crisis Overlay / Trust Decrease Notification */}
        {trustDecreased && (
          <div className="absolute top-20 left-0 right-0 z-50 flex justify-center pointer-events-none animate-in fade-in zoom-in duration-300">
            <div className="bg-slate-800/90 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 backdrop-blur-sm border border-slate-700">
              <span className="text-2xl">💔</span>
              <div>
                <div className="font-bold text-sm">信頼が下がってしまった…</div>
                <div className="text-xs text-slate-300">放置しすぎたみたい</div>
              </div>
            </div>
          </div>
        )}

        {/* Crisis Warning Banner */}
        {isCrisis && !trustDecreased && (
          <div className="bg-red-500 text-white px-4 py-2 text-xs font-bold text-center animate-pulse sticky top-[60px] z-30 shadow-md flex items-center justify-center gap-2">
            <AlertCircle size={14} className="animate-bounce" />
            <span>ピンチ！このままだと信頼されなくなるかも…</span>
          </div>
        )}

        {/* Home Notice (Secondary to Crisis) */}
        {!isCrisis && state.homeNotice && (
          <div className="mx-4 mt-4 bg-gradient-to-r from-orange-100 to-pink-100 border border-orange-200 text-orange-800 px-4 py-3 rounded-xl shadow-sm flex items-center gap-2 animate-in slide-in-from-top-4 fade-in duration-500">
            <AlertCircle size={18} className="text-orange-500 shrink-0" />
            <span className="font-bold text-sm">{state.homeNotice}</span>
          </div>
        )}

        <main className="p-4 flex flex-col items-center">

          {/* HOME TAB */}
          {activeTab === 'home' && (
            <div className="w-full animate-in fade-in zoom-in-95 duration-300">
              <div className="text-center mb-2 mt-4 relative">
                <h2 className="text-2xl font-black text-gray-800 inline-block relative z-10">
                  {state.cat.name}
                </h2>
                <button onClick={handleRename} className="ml-2 text-gray-400 hover:text-orange-500 align-middle relative z-20">
                  <Edit2 size={14} />
                </button>
                <div className="bg-yellow-200/50 absolute bottom-1 left-0 right-0 h-3 -z-0 -rotate-1 rounded-full"></div>
              </div>

              <div className="text-center text-xs text-gray-400 mb-6 font-mono bg-gray-100 inline-block px-3 py-1 rounded-full mx-auto">
                Next Update: {nextTickLabel}
              </div>

              <CatAvatar stats={state.stats} variant={state.cat.variant} />

              <div className="mt-8">
                <StatusPanel stats={state.stats} />
              </div>

              {/* Warnings */}
              <div className="mt-6 flex flex-col gap-2 w-full max-w-sm">
                {state.stats.hunger >= 90 && (
                  <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm border border-red-100 text-center animate-pulse">
                    おなかぺこぺこ…🍚
                  </div>
                )}
                {state.stats.stress >= 90 && (
                  <div className="bg-orange-50 text-orange-500 px-4 py-2 rounded-lg text-sm border border-orange-100 text-center animate-pulse">
                    ちょっと距離ほしい…💭
                  </div>
                )}
                {state.stats.dirty >= 90 && (
                  <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg text-sm border border-gray-200 text-center animate-pulse">
                    ここ、きもちわるい…🧼
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CARE TAB */}
          {activeTab === 'care' && (
            <div className="w-full flex flex-col items-center animate-in slide-in-from-right-8 fade-in duration-300">
              <h2 className="text-lg font-bold text-gray-600 mb-6 flex items-center gap-2">
                <HandHeart size={20} className="text-pink-400" />
                お世話をする
              </h2>

              <ActionButtons onAction={doAction} />

              <div className="mt-8 p-4 bg-blue-50/50 rounded-xl border border-blue-100 w-full max-w-sm text-center">
                <div className="text-xs text-blue-400 mb-1 font-bold">LATEST RESULT</div>
                <div className="text-sm text-gray-700 min-h-[1.5em] font-medium">
                  {(() => {
                    const text = state.logs[0]?.text || "なにをする？";
                    const parts = text.split("：");
                    return parts.length > 1 ? parts[1] : text;
                  })()}
                </div>
              </div>

              <div className="mt-8 text-xs text-gray-400 space-y-1 text-center">
                <p>※ 5分ごとに少しお腹が減ったりします</p>
                <p>※ 信頼関係を築くとイベントが発生します</p>
              </div>
            </div>
          )}

          {/* LOG TAB */}
          {activeTab === 'log' && (
            <div className="w-full flex flex-col items-center animate-in slide-in-from-right-8 fade-in duration-300">
              <div className="w-full max-w-sm flex justify-between items-end mb-4 px-2">
                <h2 className="text-lg font-bold text-gray-600 flex items-center gap-2">
                  <ScrollText size={20} className="text-gray-400" />
                  思い出ログ
                </h2>
                <button
                  onClick={clearLog}
                  className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={12} />
                  Clear
                </button>
              </div>
              <LogList logs={state.logs} />
            </div>
          )}

        </main>

        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  )
}

export default App
