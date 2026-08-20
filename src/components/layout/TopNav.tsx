import React, { useEffect } from 'react';
import { useMasteryStore } from '../../store/useMasteryStore';
import { TabId } from '../../types/collections';
import { TOPICS_DATA } from '../../data/topicsData';
import {
  Play,
  Layers,
  Cpu,
  Briefcase,
  HelpCircle,
  Trophy,
  Search,
  ChevronRight
} from 'lucide-react';

export const TopNav: React.FC = () => {
  const {
    activeTopic,
    activeTab,
    globalView,
    setActiveTab,
    setSearchOpen
  } = useMasteryStore();

  const data = TOPICS_DATA[activeTopic];

  // Hotkey listener for Cmd + K or Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchOpen]);

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'sandbox', label: '1. Live Sandbox', icon: <Play className="w-3.5 h-3.5" /> },
    { id: 'architecture', label: '2. Architecture', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'operations', label: '3. Operations', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'scenarios', label: '4. Scenarios (20)', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'interview', label: '5. FAANG Q&As (20)', icon: <HelpCircle className="w-3.5 h-3.5" /> },
    { id: 'quiz', label: '6. Quiz (20)', icon: <Trophy className="w-3.5 h-3.5" /> }
  ];

  return (
    <header className="h-16 bg-[#0f172a]/95 backdrop-blur-md border-b border-white/10 px-6 flex items-center justify-between z-10 shrink-0 select-none">
      {/* Left: Active Topic Breadcrumb */}
      <div className="flex items-center gap-3">
        {globalView === 'topic' ? (
          <>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>Collections</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-cyan-400 font-bold">{data.category}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            </div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              {data.title}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono font-normal">
                {data.badge}
              </span>
            </h2>
          </>
        ) : (
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            {globalView === 'master-matrix'
              ? 'Master Comparison Matrix'
              : globalView === 'face-offs'
              ? 'Architectural Face-Offs'
              : 'Interactive Decision Wizard'}
          </h2>
        )}
      </div>

      {/* Center: View Switcher (Visible in Topic mode) */}
      {globalView === 'topic' && (
        <div className="hidden md:flex rounded-xl bg-[#0b1120] p-1 border border-white/10 text-xs font-mono">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Right: Search Modal Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0b1120] border border-white/10 hover:border-cyan-400/50 text-slate-400 hover:text-white text-xs font-mono transition-all shadow-inner"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Search Platform...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700">
            ⌘K
          </kbd>
        </button>
      </div>
    </header>
  );
};
