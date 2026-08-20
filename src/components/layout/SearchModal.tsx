import React, { useState, useMemo } from 'react';
import { useMasteryStore } from '../../store/useMasteryStore';
import { TOPICS_DATA } from '../../data/topicsData';
import { TopicId, TabId } from '../../types/collections';
import { Search, X, Layers, Briefcase, HelpCircle, ArrowRight, Table, Swords, Compass } from 'lucide-react';

interface SearchResult {
  type: 'Topic' | 'Operation' | 'Scenario' | 'Interview' | 'Tool';
  title: string;
  subtitle: string;
  topicId?: TopicId;
  tabId?: TabId;
  globalView?: 'master-matrix' | 'face-offs' | 'decision-wizard';
}

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setSearchOpen,
    setActiveTopic,
    setActiveTab,
    setGlobalView
  } = useMasteryStore();

  const [query, setQuery] = useState('');

  const results: SearchResult[] = useMemo(() => {
    if (!query.trim()) {
      return [
        { type: 'Tool', title: 'Master Comparison Matrix', subtitle: 'Global complexity and features comparison table', globalView: 'master-matrix' },
        { type: 'Tool', title: 'Architectural Face-Offs', subtitle: 'Side-by-side engineering breakdowns (ArrayList vs LinkedList, etc.)', globalView: 'face-offs' },
        { type: 'Tool', title: 'Collection Decision Wizard', subtitle: 'Interactive diagnostic questionnaire for data structure selection', globalView: 'decision-wizard' }
      ];
    }

    const q = query.toLowerCase();
    const list: SearchResult[] = [];

    // Search topics
    Object.values(TOPICS_DATA).forEach((t) => {
      if (t.title.toLowerCase().includes(q) || t.complexity.toLowerCase().includes(q) || t.badge.toLowerCase().includes(q)) {
        list.push({
          type: 'Topic',
          title: t.title,
          subtitle: `${t.category} • ${t.complexity} • ${t.badge}`,
          topicId: t.key,
          tabId: 'sandbox'
        });
      }

      // Search operations
      t.operations.forEach((op) => {
        if (op.name.toLowerCase().includes(q) || op.syntax.toLowerCase().includes(q) || op.internalWorking.toLowerCase().includes(q)) {
          list.push({
            type: 'Operation',
            title: `${t.title}: ${op.name}`,
            subtitle: `Time: ${op.timeComplexity} • Syntax: ${op.syntax}`,
            topicId: t.key,
            tabId: 'architecture'
          });
        }
      });

      // Search scenarios
      t.scenarios.forEach((sc) => {
        if (sc.domain.toLowerCase().includes(q) || sc.problem.toLowerCase().includes(q) || sc.solution.toLowerCase().includes(q)) {
          list.push({
            type: 'Scenario',
            title: `#${sc.id} ${sc.domain} (${t.title})`,
            subtitle: sc.problem,
            topicId: t.key,
            tabId: 'scenarios'
          });
        }
      });

      // Search interview Q&As
      t.interviewQAs.forEach((qa) => {
        if (qa.question.toLowerCase().includes(q) || qa.answer.toLowerCase().includes(q)) {
          list.push({
            type: 'Interview',
            title: `[${qa.category}] ${qa.question}`,
            subtitle: `${t.title} • ${qa.answer.substring(0, 100)}...`,
            topicId: t.key,
            tabId: 'interview'
          });
        }
      });
    });

    return list.slice(0, 20); // Limit to top 20
  }, [query]);

  if (!isSearchOpen) return null;

  const handleSelect = (item: SearchResult) => {
    if (item.globalView) {
      setGlobalView(item.globalView);
    } else if (item.topicId && item.tabId) {
      setActiveTopic(item.topicId);
      setActiveTab(item.tabId);
    }
    setSearchOpen(false);
    setQuery('');
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'Topic':
        return <Layers className="w-4 h-4 text-cyan-400" />;
      case 'Scenario':
        return <Briefcase className="w-4 h-4 text-emerald-400" />;
      case 'Interview':
        return <HelpCircle className="w-4 h-4 text-violet-400" />;
      case 'Tool':
        return <Compass className="w-4 h-4 text-amber-400" />;
      default:
        return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4"
      onClick={() => setSearchOpen(false)}
    >
      <div
        className="bg-[#131c31] border border-cyan-500/40 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[75vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-[#0b1120]">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, algorithms, 120 scenarios, or FAANG questions..."
            autoFocus
            className="flex-1 bg-transparent text-white text-sm font-mono focus:outline-none placeholder:text-slate-500"
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 divide-y divide-white/5">
          {results.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono text-xs">
              No matching records found for "{query}".
            </div>
          ) : (
            results.map((res, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(res)}
                className="w-full p-3 rounded-xl hover:bg-white/5 text-left transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-[#0b1120] border border-white/5 shrink-0">
                    {getResultIcon(res.type)}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 uppercase">
                        {res.type}
                      </span>
                      <span className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                        {res.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                      {res.subtitle}
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-[#0b1120] border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>Navigate with Arrow keys</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
