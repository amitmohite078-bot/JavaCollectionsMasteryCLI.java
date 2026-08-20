import React from 'react';
import { useMasteryStore } from '../../store/useMasteryStore';
import { TopicId } from '../../types/collections';
import { TOPICS_DATA } from '../../data/topicsData';
import {
  Layers,
  Table,
  Swords,
  Compass,
  ChevronLeft,
  ChevronRight,
  Database,
  ArrowLeftRight,
  Hash,
  GitMerge,
  LayoutGrid,
  Workflow,
  Sparkles,
  Award
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTopic,
    globalView,
    isSidebarCollapsed,
    quizProgress,
    setActiveTopic,
    setGlobalView,
    toggleSidebar
  } = useMasteryStore();

  const topicsList = Object.values(TOPICS_DATA);

  const getTopicIcon = (key: TopicId) => {
    switch (key) {
      case 'ArrayList':
        return <Layers className="w-4 h-4 text-cyan-400" />;
      case 'LinkedList':
        return <ArrowLeftRight className="w-4 h-4 text-violet-400" />;
      case 'HashSet':
        return <Hash className="w-4 h-4 text-emerald-400" />;
      case 'TreeSet':
        return <GitMerge className="w-4 h-4 text-rose-400" />;
      case 'HashMap':
        return <LayoutGrid className="w-4 h-4 text-amber-400" />;
      case 'Streams':
        return <Workflow className="w-4 h-4 text-indigo-400" />;
      default:
        return <Database className="w-4 h-4 text-cyan-400" />;
    }
  };

  if (isSidebarCollapsed) {
    return (
      <aside className="w-16 bg-[#0f172a] border-r border-white/10 flex flex-col items-center py-4 justify-between shrink-0 transition-all z-20">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all mb-4"
          title="Expand Sidebar"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="flex flex-col gap-2">
          {topicsList.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTopic(t.key)}
              className={`p-2.5 rounded-xl transition-all ${
                globalView === 'topic' && activeTopic === t.key
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
              title={t.title}
            >
              {getTopicIcon(t.key)}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => setGlobalView('master-matrix')}
            className={`p-2.5 rounded-xl ${globalView === 'master-matrix' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
            title="Master Matrix"
          >
            <Table className="w-4 h-4" />
          </button>
          <button
            onClick={() => setGlobalView('face-offs')}
            className={`p-2.5 rounded-xl ${globalView === 'face-offs' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:text-white'}`}
            title="Face-Offs"
          >
            <Swords className="w-4 h-4" />
          </button>
          <button
            onClick={() => setGlobalView('decision-wizard')}
            className={`p-2.5 rounded-xl ${globalView === 'decision-wizard' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'}`}
            title="Decision Wizard"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-72 bg-[#0f172a] border-r border-white/10 flex flex-col justify-between shrink-0 transition-all z-20 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-extrabold text-white text-base shadow-glow-cyan">
              ☕
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">
                Java Mastery Suite
              </h1>
              <p className="text-[10px] text-cyan-400 font-mono">
                Visual Memory Engine 2.0
              </p>
            </div>
          </div>

          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Topic Taxonomy Navigation */}
        <div className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-230px)]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 block">
              Core Data Structures
            </span>
            <div className="space-y-1 mt-1">
              {topicsList.map((t) => {
                const isActive = globalView === 'topic' && activeTopic === t.key;
                const prog = quizProgress[t.key];

                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTopic(t.key)}
                    className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between gap-2 group ${
                      isActive
                        ? 'bg-cyan-500/15 border border-cyan-500/40 text-white shadow-glow-cyan'
                        : 'hover:bg-white/5 text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 rounded-lg bg-black/40 border border-white/5 shrink-0">
                        {getTopicIcon(t.key)}
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-bold block truncate text-slate-100 group-hover:text-white">
                          {t.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block truncate">
                          {t.complexity}
                        </span>
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="shrink-0 text-right">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 text-slate-400">
                        {prog?.answered || 0}/20
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Global Decision Hub Section */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 block">
              Comparative &amp; Decision Hub
            </span>
            <div className="space-y-1 mt-1">
              <button
                onClick={() => setGlobalView('master-matrix')}
                className={`w-full p-2 rounded-xl text-left transition-all flex items-center gap-2.5 text-xs font-semibold ${
                  globalView === 'master-matrix'
                    ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300'
                    : 'hover:bg-white/5 text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                <Table className="w-4 h-4 text-cyan-400" />
                <span>Master Matrix</span>
              </button>

              <button
                onClick={() => setGlobalView('face-offs')}
                className={`w-full p-2 rounded-xl text-left transition-all flex items-center gap-2.5 text-xs font-semibold ${
                  globalView === 'face-offs'
                    ? 'bg-rose-500/15 border border-rose-500/40 text-rose-300'
                    : 'hover:bg-white/5 text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                <Swords className="w-4 h-4 text-rose-400" />
                <span>Architectural Face-Offs</span>
              </button>

              <button
                onClick={() => setGlobalView('decision-wizard')}
                className={`w-full p-2 rounded-xl text-left transition-all flex items-center gap-2.5 text-xs font-semibold ${
                  globalView === 'decision-wizard'
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                    : 'hover:bg-white/5 text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>Decision Wizard</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Profile / Hotkey Tag */}
      <div className="p-3 border-t border-white/10 bg-slate-900/60">
        <div className="p-2.5 rounded-xl bg-[#0b1120] border border-white/5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300 font-bold">FAANG+ Ready</span>
          </div>
          <span className="text-[10px] text-slate-500">Java 21+ JVM</span>
        </div>
      </div>
    </aside>
  );
};
