import React, { useState, useMemo } from 'react';
import { useMasteryStore } from '../../store/useMasteryStore';
import { TOPICS_DATA } from '../../data/topicsData';
import { HelpCircle, ChevronDown, ChevronUp, Copy, Check, Filter, Search, Award } from 'lucide-react';

export const InterviewTab: React.FC = () => {
  const { activeTopic } = useMasteryStore();
  const data = TOPICS_DATA[activeTopic];

  const [tierFilter, setTierFilter] = useState<'All' | 'Service-Based' | 'Product-Based'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const expandAll = () => {
    setExpandedIds(data.interviewQAs.map(q => q.id));
  };

  const collapseAll = () => {
    setExpandedIds([]);
  };

  const handleCopy = (id: number, answer: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(answer);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredQAs = useMemo(() => {
    return data.interviewQAs.filter((qa) => {
      const matchesTier = tierFilter === 'All' || qa.category === tierFilter;
      const matchesSearch =
        !searchTerm.trim() ||
        qa.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        qa.answer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTier && matchesSearch;
    });
  }, [data.interviewQAs, tierFilter, searchTerm]);

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#131c31] border border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              20 Technical Interview Questions &amp; Model Answers
              <span className="text-xs px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-mono font-normal">
                {data.title}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              10 Tier 1 Enterprise (Hierarchy/Contracts) + 10 Tier 2 FAANG+ (Cache lines, JVM internals, Amortized proofs).
            </p>
          </div>
        </div>

        {/* Tier Selector & Expand Actions */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-[#0b1120] p-1 border border-white/10 text-xs font-mono">
            {(['All', 'Service-Based', 'Product-Based'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setTierFilter(tier)}
                className={`px-3 py-1 rounded-md transition-all ${
                  tierFilter === tier
                    ? 'bg-violet-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tier === 'Service-Based' ? 'Tier 1: Service' : tier === 'Product-Based' ? 'Tier 2: FAANG+' : 'All 20'}
              </button>
            ))}
          </div>

          <button
            onClick={expandedIds.length === data.interviewQAs.length ? collapseAll : expandAll}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 border border-slate-700 transition-all"
          >
            {expandedIds.length === data.interviewQAs.length ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3">
        {filteredQAs.map((qa) => {
          const isExpanded = expandedIds.includes(qa.id);
          const isProduct = qa.category === 'Product-Based';

          return (
            <div
              key={qa.id}
              onClick={() => toggleExpand(qa.id)}
              className="p-4 rounded-xl bg-[#131c31] border border-white/10 hover:border-violet-500/40 cursor-pointer transition-all shadow-md"
            >
              {/* Question Top Line */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold shrink-0 mt-0.5 border ${
                      isProduct
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                    }`}
                  >
                    {isProduct ? 'Tier 2: FAANG+' : 'Tier 1: Enterprise'}
                  </span>
                  <h4 className="text-sm font-bold text-white leading-relaxed">
                    Q{qa.id}: {qa.question}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => handleCopy(qa.id, qa.answer, e)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                    title="Copy Answer"
                  >
                    {copiedId === qa.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <div className="p-1 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Answer Body */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-white/10 text-sm text-slate-300 leading-relaxed font-sans bg-[#0b1120] p-3 rounded-lg border border-white/5 animate-fade-in">
                  <strong className="text-cyan-400 font-mono text-xs block mb-1.5 uppercase">Model Architectural Answer:</strong>
                  <p>{qa.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
