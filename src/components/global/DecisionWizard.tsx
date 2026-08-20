import React, { useState } from 'react';
import { DECISION_TREE, DecisionNode } from '../../data/comparisonsData';
import { Compass, ArrowRight, RotateCcw, CheckCircle2, Code, Copy, Check, Sparkles } from 'lucide-react';

export const DecisionWizard: React.FC = () => {
  const [history, setHistory] = useState<string[]>(['start']);
  const [copied, setCopied] = useState(false);

  const currentId = history[history.length - 1];
  const currentNode = DECISION_TREE[currentId] || DECISION_TREE['start'];

  const [finalRecommendation, setFinalRecommendation] = useState<any | null>(null);

  const handleSelectOption = (option: any) => {
    if (option.recommendation) {
      setFinalRecommendation(option.recommendation);
    } else if (option.nextId) {
      setHistory(prev => [...prev, option.nextId]);
      setFinalRecommendation(null);
    }
  };

  const handleRestart = () => {
    setHistory(['start']);
    setFinalRecommendation(null);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[#131c31] border border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Interactive Collection Decision Engine
            </h3>
            <p className="text-xs text-slate-400">
              Diagnostic engineering wizard mapping specific constraints to optimal Java data structures.
            </p>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart Wizard</span>
        </button>
      </div>

      {/* Decision Engine Workspace */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col justify-center">
        {!finalRecommendation ? (
          <div className="max-w-2xl mx-auto w-full p-8 rounded-2xl bg-[#131c31] border border-white/10 shadow-2xl space-y-6 animate-fade-in">
            {/* Step Counter */}
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
              <span>Step {history.length} of Diagnostic Tree</span>
              <span className="text-slate-500">Diagnostic ID: {currentNode.id}</span>
            </div>

            {/* Question */}
            <div>
              <h2 className="text-xl font-bold text-white mb-2 leading-relaxed">
                {currentNode.question}
              </h2>
              <p className="text-sm text-slate-400">
                {currentNode.description}
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentNode.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  className="w-full p-4 rounded-xl bg-[#0b1120] border border-white/10 hover:border-cyan-400 hover:bg-cyan-950/20 text-left transition-all group flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 mb-1">
                      {opt.label}
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      {opt.detail}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 shrink-0 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Final Recommendation Card */
          <div className="max-w-2xl mx-auto w-full p-8 rounded-2xl bg-[#131c31] border border-cyan-500/40 shadow-2xl space-y-6 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">Optimal Solution Found</span>
                <h2 className="text-2xl font-extrabold text-white">{finalRecommendation.name}</h2>
              </div>
            </div>

            {/* Architectural Justification */}
            <div className="p-4 rounded-xl bg-[#0b1120] border border-white/10 space-y-2">
              <strong className="text-emerald-400 font-mono text-xs block uppercase">Architectural Justification:</strong>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {finalRecommendation.reason}
              </p>
            </div>

            {/* Key Advantages */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 font-bold uppercase">Why this choice wins:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {finalRecommendation.pros.map((p: string, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900/80 border border-white/5 text-xs text-cyan-200 font-mono flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Sample */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 font-bold uppercase">Production Initialization:</span>
                <button
                  onClick={() => handleCopy(finalRecommendation.codeSample)}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-lg bg-[#0b1120] border border-white/10 font-mono text-xs text-cyan-300 overflow-x-auto">
                {finalRecommendation.codeSample}
              </pre>
            </div>

            <button
              onClick={handleRestart}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white text-xs font-mono font-bold transition-all shadow-lg shadow-cyan-600/30"
            >
              Restart Decision Diagnostic
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
