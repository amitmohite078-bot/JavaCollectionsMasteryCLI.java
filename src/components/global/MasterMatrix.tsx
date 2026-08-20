import React, { useState } from 'react';
import { MASTER_MATRIX } from '../../data/comparisonsData';
import { Table, Search, ShieldCheck } from 'lucide-react';

export const MasterMatrix: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'List', 'Set', 'Map', 'Deque / Queue', 'Stream Pipeline'];

  const filtered = MASTER_MATRIX.filter((row) => {
    const matchesCategory = categoryFilter === 'All' || row.category.includes(categoryFilter);
    const matchesSearch =
      !searchTerm.trim() ||
      row.collection.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.backingStructure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.bestUseCase.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#131c31] border border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Java Collections &amp; Streams Master Comparison Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Complete architectural matrix covering Backing Structure, Read, Insert, Delete, Null Policy, and Best Use Case.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search matrix..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#0b1120] border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="flex rounded-lg bg-[#0b1120] p-1 border border-white/10 text-xs font-mono">
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  categoryFilter === cat ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="flex-1 overflow-auto rounded-xl border border-white/10 bg-[#131c31] shadow-lg">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="bg-slate-900/90 border-b border-white/10 text-slate-400 sticky top-0 z-10">
              <th className="p-3.5 font-bold text-white">Collection</th>
              <th className="p-3.5 font-bold text-slate-300">Category</th>
              <th className="p-3.5 font-bold text-cyan-300">Backing Structure</th>
              <th className="p-3.5 font-bold text-emerald-300">Read / Lookup</th>
              <th className="p-3.5 font-bold text-amber-300">Insert</th>
              <th className="p-3.5 font-bold text-rose-300">Delete</th>
              <th className="p-3.5 font-bold text-slate-300">Null Policy</th>
              <th className="p-3.5 font-bold text-violet-300">Thread-Safe</th>
              <th className="p-3.5 font-bold text-white min-w-[220px]">Optimal Use Case</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((row, idx) => (
              <tr key={idx} className="hover:bg-white/5 transition-colors">
                <td className="p-3.5 font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  {row.collection}
                </td>
                <td className="p-3.5 text-slate-400">{row.category}</td>
                <td className="p-3.5 text-cyan-300">{row.backingStructure}</td>
                <td className="p-3.5 text-emerald-400 font-bold">{row.readComplexity}</td>
                <td className="p-3.5 text-amber-400">{row.insertComplexity}</td>
                <td className="p-3.5 text-rose-400">{row.deleteComplexity}</td>
                <td className="p-3.5 text-slate-300">{row.nullPolicy}</td>
                <td className="p-3.5 text-violet-300">{row.threadSafe}</td>
                <td className="p-3.5 text-slate-300 font-sans text-xs">{row.bestUseCase}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
