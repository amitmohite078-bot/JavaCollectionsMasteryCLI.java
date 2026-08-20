import React, { useState, useMemo } from 'react';
import { useMasteryStore } from '../../store/useMasteryStore';
import { TOPICS_DATA } from '../../data/topicsData';
import { Briefcase, Search, ShieldCheck, ArrowRight } from 'lucide-react';

export const ScenariosTab: React.FC = () => {
  const { activeTopic } = useMasteryStore();
  const data = TOPICS_DATA[activeTopic];
  const [searchTerm, setSearchTerm] = useState('');

  const filteredScenarios = useMemo(() => {
    if (!searchTerm.trim()) return data.scenarios;
    const term = searchTerm.toLowerCase();
    return data.scenarios.filter(
      (s) =>
        s.domain.toLowerCase().includes(term) ||
        s.problem.toLowerCase().includes(term) ||
        s.solution.toLowerCase().includes(term)
    );
  }, [data.scenarios, searchTerm]);

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#131c31] border border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              20 Production Enterprise Architecture Scenarios
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-normal">
                {data.title}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Battle-tested architectural choices for high-scale microservices, financial systems, and distributed caches.
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by keyword (e.g. cache, auth)..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#0b1120] border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="flex-1 overflow-y-auto pr-1">
        {filteredScenarios.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-mono text-sm">
            No scenarios found matching "{searchTerm}".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredScenarios.map((sc) => (
              <div
                key={sc.id}
                className="p-5 rounded-xl bg-[#131c31] border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between gap-3 shadow-md"
              >
                <div>
                  {/* Scenario Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      Scenario #{sc.id}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold uppercase">
                      Production SLA
                    </span>
                  </div>

                  {/* Domain Title */}
                  <h4 className="text-base font-bold text-white mb-2">
                    {sc.domain}
                  </h4>

                  {/* Business Challenge */}
                  <div className="space-y-1 mb-3">
                    <span className="text-[11px] font-mono text-amber-400 uppercase font-bold block">
                      Engineering Challenge:
                    </span>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {sc.problem}
                    </p>
                  </div>
                </div>

                {/* Technical Solution Rationale */}
                <div className="p-3 rounded-lg bg-[#0b1120] border border-emerald-500/20 text-xs text-emerald-300 leading-relaxed font-mono flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-400 block mb-0.5">Architectural Choice:</strong>
                    <span>{sc.solution}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
