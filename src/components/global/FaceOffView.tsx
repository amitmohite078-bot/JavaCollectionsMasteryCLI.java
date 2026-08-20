import React, { useState } from 'react';
import { FACE_OFFS } from '../../data/comparisonsData';
import { Swords, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

export const FaceOffView: React.FC = () => {
  const [selectedFaceOff, setSelectedFaceOff] = useState<string>(FACE_OFFS[0].id);

  const current = FACE_OFFS.find((f) => f.id === selectedFaceOff) || FACE_OFFS[0];

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* Header with Face-Off Selector Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#131c31] border border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Deep Architectural Face-Offs
            </h3>
            <p className="text-xs text-slate-400">
              Side-by-side engineering comparisons of competing data structures.
            </p>
          </div>
        </div>

        {/* Face-Off Selector */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-lg bg-[#0b1120] border border-white/10 text-xs font-mono">
          {FACE_OFFS.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFaceOff(f.id)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                selectedFaceOff === f.id
                  ? 'bg-rose-600 text-white font-bold shadow-glow-rose'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Face-Off Content */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        {/* Title Header Card */}
        <div className="p-5 rounded-xl bg-[#131c31] border border-white/10">
          <h2 className="text-xl font-bold text-white mb-1">{current.title}</h2>
          <p className="text-xs text-cyan-300 font-mono mb-4">{current.subtitle}</p>

          {/* Verdict Summary Box */}
          <div className="p-4 rounded-lg bg-[#0b1120] border border-emerald-500/30 text-sm text-slate-300 leading-relaxed font-sans flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-400 font-mono text-xs block mb-1 uppercase">
                Principal Architect Verdict:
              </strong>
              <p>{current.verdictSummary}</p>
            </div>
          </div>
        </div>

        {/* Comparison Feature Table */}
        <div className="rounded-xl border border-white/10 bg-[#131c31] overflow-hidden shadow-lg">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-900/90 border-b border-white/10 text-slate-400">
                <th className="p-4 font-bold text-white w-1/4">Evaluation Dimension</th>
                <th className="p-4 font-bold text-cyan-300 w-1/3">{current.title.split(' vs ')[0]}</th>
                <th className="p-4 font-bold text-violet-300 w-1/3">{current.title.split(' vs ')[1] || 'Alternative'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {current.features.map((feat, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white align-top">
                    {feat.feature}
                  </td>
                  <td className="p-4 text-cyan-200 align-top">
                    <p className="mb-1">{feat.colA}</p>
                  </td>
                  <td className="p-4 text-violet-200 align-top">
                    <p className="mb-1">{feat.colB}</p>
                    <span className="text-[11px] text-slate-400 italic block font-sans mt-1">
                      &bull; {feat.verdict}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
