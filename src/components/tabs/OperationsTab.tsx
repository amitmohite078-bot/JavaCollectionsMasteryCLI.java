import React, { useState } from 'react';
import { useMasteryStore } from '../../store/useMasteryStore';
import { TOPICS_DATA } from '../../data/topicsData';
import { OperationCategory, OperationDeepDive } from '../../types/collections';
import {
  Code,
  Copy,
  Check,
  Search,
  Zap,
  Layers,
  ArrowRight,
  ShieldAlert,
  Cpu,
  GitCompare,
  PlusCircle,
  Trash2,
  ListFilter
} from 'lucide-react';

export const OperationsTab: React.FC = () => {
  const { activeTopic } = useMasteryStore();
  const topic = TOPICS_DATA[activeTopic];

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const categories: { label: string; key: string; icon: React.ReactNode; color: string }[] = [
    { label: 'All Operations', key: 'All', icon: <Layers className="w-3.5 h-3.5" />, color: 'text-slate-300' },
    { label: 'Compare & Equality', key: 'Compare', icon: <GitCompare className="w-3.5 h-3.5" />, color: 'text-violet-400' },
    { label: 'Insertion & Growth', key: 'Insertion', icon: <PlusCircle className="w-3.5 h-3.5" />, color: 'text-emerald-400' },
    { label: 'Deletion & Unlinking', key: 'Deletion', icon: <Trash2 className="w-3.5 h-3.5" />, color: 'text-rose-400' },
    { label: 'Searching & Lookup', key: 'Searching', icon: <Search className="w-3.5 h-3.5" />, color: 'text-cyan-400' },
    { label: 'Sorting & Ordering', key: 'Sorting', icon: <ListFilter className="w-3.5 h-3.5" />, color: 'text-amber-400' }
  ];

  const getCategoryBadge = (cat: OperationCategory) => {
    switch (cat) {
      case 'Compare':
        return 'bg-violet-500/10 text-violet-300 border-violet-500/30';
      case 'Insertion':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'Deletion':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      case 'Searching':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'Sorting':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
    }
  };

  const filteredOperations = topic.operations.filter((op) => {
    const matchesCat = selectedCategory === 'All' || op.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.signature.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.internalWorking.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.syntax.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#131c31] border border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              {topic.title} Core Operations Architecture
            </h3>
            <p className="text-xs text-slate-400">
              Deep syntax explanations, complexity proofs, and OpenJDK memory mechanics across Compare, Insert, Delete, Search, and Sort.
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search operations..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#0b1120] border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 shrink-0">
        {categories.map((cat) => {
          const count =
            cat.key === 'All'
              ? topic.operations.length
              : topic.operations.filter((o) => o.category === cat.key).length;

          const isActive = selectedCategory === cat.key;

          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-white font-bold shadow-glow-cyan'
                  : 'bg-[#131c31] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              <span className={cat.color}>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px] text-slate-400 font-bold">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Operations List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        {filteredOperations.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs rounded-xl bg-[#131c31] border border-white/10">
            No operations match the selected criteria.
          </div>
        ) : (
          filteredOperations.map((op, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-[#131c31] border border-white/10 hover:border-white/20 transition-all space-y-4 shadow-lg"
            >
              {/* Operation Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold border ${getCategoryBadge(
                      op.category
                    )}`}
                  >
                    {op.category.toUpperCase()}
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      {op.name}
                    </h4>
                    <code className="text-xs font-mono text-cyan-300">
                      {op.signature}
                    </code>
                  </div>
                </div>

                {/* Complexity Pills */}
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                    ⏱ Time: {op.timeComplexity}
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-mono font-bold">
                    💾 Space: {op.spaceComplexity}
                  </div>
                </div>
              </div>

              {/* Code Syntax Section */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    Java Syntax &amp; Usage
                  </span>
                  <button
                    onClick={() => handleCopy(op.syntax, idx)}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3.5 rounded-lg bg-[#0b1120] border border-white/10 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed shadow-inner">
                  {op.syntax}
                </pre>
              </div>

              {/* Internal Working & Mechanics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
                {/* Left: JVM Internal Working */}
                <div className="p-3.5 rounded-lg bg-[#0b1120]/70 border border-white/5 space-y-2">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase block flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    OpenJDK JVM Mechanics
                  </span>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {op.internalWorking}
                  </p>
                </div>

                {/* Right: Step-by-Step Execution Sequence */}
                <div className="p-3.5 rounded-lg bg-[#0b1120]/70 border border-white/5 space-y-2">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase block flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                    Execution Pipeline
                  </span>
                  <ul className="space-y-1.5">
                    {op.mechanics.map((step, sIdx) => (
                      <li
                        key={sIdx}
                        className="text-xs text-slate-400 font-mono flex items-start gap-2"
                      >
                        <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          {sIdx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pitfalls & Gotchas Alert (if present) */}
              {op.pitfalls && op.pitfalls.length > 0 && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-xs text-rose-300 font-sans space-y-1">
                  <span className="font-mono font-bold uppercase text-[11px] text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    Production Pitfalls &amp; Edge Cases:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                    {op.pitfalls.map((p, pIdx) => (
                      <li key={pIdx}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
