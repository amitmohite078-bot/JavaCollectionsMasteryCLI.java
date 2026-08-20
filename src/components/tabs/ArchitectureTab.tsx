import React, { useState } from 'react';
import { useMasteryStore } from '../../store/useMasteryStore';
import { TOPICS_DATA } from '../../data/topicsData';
import { Layers, ShieldCheck, CheckCircle2, XCircle, Code, Copy, Check, GitCommit, ChevronRight, Cpu } from 'lucide-react';

export const ArchitectureTab: React.FC = () => {
  const { activeTopic } = useMasteryStore();
  const data = TOPICS_DATA[activeTopic];
  const arch = data.architecture;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(arch.basicSyntax);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full overflow-y-auto space-y-6 pr-2">
      {/* 1. Definition & Core Architecture Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-xl bg-[#131c31] border border-white/10 flex flex-col gap-3 shadow-md">
          <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-base">
            <Layers className="w-5 h-5" />
            <span>1. Formal Definition &amp; Paradigm</span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            {arch.definition}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#131c31] border border-white/10 flex flex-col gap-3 shadow-md">
          <div className="flex items-center gap-2.5 text-violet-400 font-bold text-base">
            <Cpu className="w-5 h-5" />
            <span>2. Core Internal Architecture</span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            {arch.coreArchitecture}
          </p>
        </div>
      </div>

      {/* 2. Interactive Class Hierarchy Tree */}
      <div className="p-5 rounded-xl bg-[#131c31] border border-white/10 shadow-md">
        <div className="flex items-center gap-2.5 text-amber-400 font-bold text-base mb-3">
          <GitCommit className="w-5 h-5" />
          <span>3. Formal JVM Class &amp; Interface Hierarchy</span>
        </div>
        <div className="p-4 rounded-lg bg-[#0b1120] border border-white/5 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
          <pre>{data.mindMap}</pre>
        </div>
      </div>

      {/* 3. Deep Invariants & Key Mechanics */}
      <div className="p-5 rounded-xl bg-[#131c31] border border-white/10 shadow-md space-y-3">
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-base">
          <ShieldCheck className="w-5 h-5" />
          <span>4. Invariants &amp; Engine Mechanics</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {arch.keyPoints.map((point, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-[#0b1120] border border-white/5 flex items-start gap-2.5 text-sm text-slate-300">
              <span className="text-cyan-400 font-bold mt-0.5">&bull;</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Trade-Off Analysis (Pros vs Cons Matrix) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pros */}
        <div className="p-5 rounded-xl bg-[#131c31] border border-emerald-500/20 shadow-md space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-base">
            <CheckCircle2 className="w-5 h-5" />
            <span>Key Advantages &amp; Strengths</span>
          </div>
          <div className="space-y-2">
            {arch.advantages.map((adv, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 text-sm flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">&#10003;</span>
                <span>{adv}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cons */}
        <div className="p-5 rounded-xl bg-[#131c31] border border-rose-500/20 shadow-md space-y-3">
          <div className="flex items-center gap-2.5 text-rose-400 font-bold text-base">
            <XCircle className="w-5 h-5" />
            <span>Trade-Offs &amp; Disadvantages</span>
          </div>
          <div className="space-y-2">
            {arch.disadvantages.map((dis, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-200 text-sm flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">&#10007;</span>
                <span>{dis}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Production Syntax & Code Implementation */}
      <div className="p-5 rounded-xl bg-[#131c31] border border-white/10 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-base">
            <Code className="w-5 h-5" />
            <span>5. Production Syntax &amp; Usage Snippets</span>
          </div>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
        <div className="p-4 rounded-lg bg-[#0b1120] border border-white/5 font-mono text-xs text-cyan-200 overflow-x-auto">
          <pre>{arch.basicSyntax}</pre>
        </div>
      </div>
    </div>
  );
};
