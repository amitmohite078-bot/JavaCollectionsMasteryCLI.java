import React from 'react';
import { useMasteryStore } from '../../store/useMasteryStore';
import { Terminal, Cpu, Database, Activity, Clock, Layers } from 'lucide-react';

export const TelemetryView: React.FC = () => {
  const { currentLog, activeTopic } = useMasteryStore();

  return (
    <div className="flex flex-col h-full bg-[#0b1120] rounded-xl border border-white/10 p-4 font-mono text-xs overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
        <div className="flex items-center gap-2 text-cyan-400 font-bold">
          <Terminal className="w-4 h-4" />
          <span>Real-Time JVM Telemetry &amp; Execution Trace</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[11px] text-slate-400">Live In-Memory Profiler</span>
        </div>
      </div>

      {!currentLog ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-600 italic py-8">
          <span>[No operations dispatched yet. Execute an action in the Control Center to inspect JVM state telemetry.]</span>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {/* Top Method & Complexity Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-900/90 border border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[10px] uppercase font-sans font-bold">OpenJDK Method:</span>
              <code className="text-cyan-300 font-bold text-sm">{currentLog.operation}</code>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px]">
                Time: {currentLog.timeComplexity}
              </span>
              <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/40 text-[11px]">
                Space: {currentLog.spaceComplexity}
              </span>
            </div>
          </div>

          {/* JVM Metrics Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-lg bg-[#131c31] border border-white/5 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>Heap Allocated</span>
              </div>
              <span className="text-cyan-300 font-bold text-sm">+{currentLog.jvmBytesAllocated} Bytes</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#131c31] border border-white/5 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>Spatial Locality</span>
              </div>
              <span className={`font-bold text-sm ${currentLog.cacheLocalityScore.includes('High') ? 'text-emerald-400' : 'text-amber-400'}`}>
                {currentLog.cacheLocalityScore}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#131c31] border border-white/5 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                <Activity className="w-3.5 h-3.5 text-rose-400" />
                <span>GC Pressure</span>
              </div>
              <span className={`font-bold text-sm ${currentLog.gcPressure.includes('None') ? 'text-emerald-400' : currentLog.gcPressure.includes('High') ? 'text-rose-400' : 'text-amber-400'}`}>
                {currentLog.gcPressure}
              </span>
            </div>
          </div>

          {/* State Differential Track */}
          <div className="p-2.5 rounded-lg bg-[#131c31] border border-white/5 space-y-1.5">
            <span className="text-slate-400 text-[10px] uppercase font-sans font-bold block">
              In-Memory State Differential:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-500 block mb-0.5">BEFORE:</span>
                <span className="text-slate-300 break-all">{currentLog.beforeState}</span>
              </div>
              <div className="p-2 rounded bg-black/40 border border-cyan-500/20">
                <span className="text-[10px] text-cyan-400 block mb-0.5">AFTER:</span>
                <span className="text-cyan-200 break-all font-bold">{currentLog.afterState}</span>
              </div>
            </div>
          </div>

          {/* STDOUT / Output Message */}
          <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
            <span className="text-slate-500 text-[10px] block mb-1">EXECUTION STDOUT / RETURN:</span>
            <p className="text-emerald-300 font-semibold">{currentLog.output}</p>
          </div>

          {/* Step Mechanics Breakdown if available */}
          {currentLog.stepDetails && currentLog.stepDetails.length > 0 && (
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-white/5 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-sans font-bold block">
                Low-Level Execution Steps:
              </span>
              <ul className="space-y-1 pl-4 list-disc text-slate-300 text-[11px]">
                {currentLog.stepDetails.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
