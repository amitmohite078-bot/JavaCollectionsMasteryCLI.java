import React from 'react';
import { useMasteryStore } from '../../store/useMasteryStore';
import { Workflow, Play, Zap, ArrowRight, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';

export const StreamsVisualizer: React.FC = () => {
  const { streamsState } = useMasteryStore();
  const { source, filterValue, mapMultiplier, isSorted, terminalOp, stages, activeElementIndex, isEvaluating, terminalResult, shortCircuited } = streamsState;

  return (
    <div className="flex flex-col h-full bg-[#0d1424] rounded-xl border border-white/10 p-5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Java Streams Lazy Pipeline &amp; Marble DAG
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-normal">
                Single-Pass Sink Chain
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Intermediate (Lazy) &rarr; Terminal (Eager: <code className="text-cyan-300">.{terminalOp}()</code>)
            </p>
          </div>
        </div>

        {/* Telemetry pills */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono">
            <span className="text-slate-400">sourceCount:</span>
            <span className="text-indigo-400 font-bold">{source.length}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono">
            <span className="text-slate-400">evaluation:</span>
            <span className={`font-bold ${isEvaluating ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
              {isEvaluating ? 'Evaluating...' : 'Terminal Invocation Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* Short Circuit / Terminal Result Banner */}
      {terminalResult !== null && (
        <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-indigo-500/20 border border-emerald-500/40 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-emerald-300 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Terminal Operation Evaluation Completed ({terminalOp})</span>
          </div>
          <div className="flex items-center gap-3">
            {shortCircuited && (
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 font-bold">
                <Zap className="w-3 h-3" /> Short-Circuited Early
              </span>
            )}
            <span className="px-2.5 py-1 rounded bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/50 text-sm">
              Result: {typeof terminalResult === 'object' ? JSON.stringify(terminalResult) : String(terminalResult)}
            </span>
          </div>
        </div>
      )}

      {/* Marble Diagram DAG Stages */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden flex items-center py-4 px-2">
        <div className="inline-flex items-stretch gap-3 min-w-max">
          {stages.map((stage, sIdx) => {
            const isLastStage = sIdx === stages.length - 1;

            return (
              <React.Fragment key={stage.id}>
                {/* Stage Box */}
                <div className="w-64 rounded-xl border border-white/10 bg-[#131c31] flex flex-col overflow-hidden shadow-lg">
                  {/* Stage Header */}
                  <div className="p-3 bg-slate-900/90 border-b border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                      {stage.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 uppercase">
                      {stage.type}
                    </span>
                  </div>

                  {/* Stage Marbles / Element Tokens */}
                  <div className="p-3 flex-1 flex flex-wrap gap-2 content-start min-h-[140px] max-h-[180px] overflow-y-auto">
                    {stage.items.length === 0 ? (
                      <div className="w-full text-center text-slate-600 font-mono text-xs my-auto italic">
                        [No elements emitted]
                      </div>
                    ) : (
                      stage.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 text-xs font-mono font-bold flex items-center gap-1 shadow-sm transition-all hover:scale-105"
                        >
                          <span>{item}</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Stage Footer Type info */}
                  <div className="px-3 py-2 bg-slate-950/60 border-t border-white/5 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Emitted: {stage.items.length} items</span>
                    <span className="text-cyan-400">{stage.type === 'terminal' ? 'Eager' : 'Lazy'}</span>
                  </div>
                </div>

                {/* Pipeline Arrow Connector */}
                {!isLastStage && (
                  <div className="flex items-center justify-center text-indigo-400 px-1">
                    <ArrowRight className="w-6 h-6 animate-pulse" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Footer Specs */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-indigo-400"></span>
            <span>Stateless Transform (Zero Buffer Allocations)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-400"></span>
            <span>Stateful Barrier (Buffered Sort/Distinct)</span>
          </div>
        </div>

        <div className="text-slate-400">
          Paradigm: <strong className="text-indigo-400">Internal Iteration &amp; Loop Fusion</strong>
        </div>
      </div>
    </div>
  );
};
