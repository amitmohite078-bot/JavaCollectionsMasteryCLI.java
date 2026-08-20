import React from 'react';
import { useMasteryStore } from '../../store/useMasteryStore';
import { Layers, Database, Cpu, Zap, ArrowRight } from 'lucide-react';

export const ArrayListVisualizer: React.FC = () => {
  const { arrayListState } = useMasteryStore();
  const { items, capacity, highlightIndex, shiftedIndices, isGrowing, growFrom, growTo } = arrayListState;
  const baseAddress = 0x7fff8a00;

  return (
    <div className="flex flex-col h-full bg-[#0d1424] rounded-xl border border-white/10 p-5 overflow-hidden">
      {/* Visualizer Header with JVM Specs */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Contiguous Array Memory Buffer
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-normal">
                Direct Offset: Base + (i * 4B)
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Backing Field: <code className="text-cyan-300">Object[] elementData</code>
            </p>
          </div>
        </div>

        {/* Capacity vs Size telemetry pills */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono">
            <span className="text-slate-400">size:</span>
            <span className="text-cyan-400 font-bold">{items.length}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono">
            <span className="text-slate-400">capacity:</span>
            <span className="text-amber-400 font-bold">{capacity}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono">
            <span className="text-slate-400">load:</span>
            <span className="text-emerald-400 font-bold">{Math.round((items.length / capacity) * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Capacity Expansion Notice */}
      {isGrowing && (
        <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/40 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2 text-amber-300 text-sm font-semibold">
            <Zap className="w-4 h-4" />
            <span>1.5x Capacity Expansion Triggered (grow())</span>
          </div>
          <div className="text-xs font-mono text-white flex items-center gap-1.5">
            <span>{growFrom} slots</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-emerald-400 font-bold">{growTo} slots</span>
          </div>
        </div>
      )}

      {/* Main Contiguous Array Memory Track */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden flex flex-col justify-center py-4">
        <div className="inline-flex items-stretch gap-2 min-w-max px-2">
          {Array.from({ length: capacity }).map((_, index) => {
            const isPopulated = index < items.length;
            const itemValue = isPopulated ? items[index] : null;
            const isHighlighted = highlightIndex === index;
            const isShifted = shiftedIndices.includes(index);
            const addressHex = '0x' + (baseAddress + index * 4).toString(16).toUpperCase();

            return (
              <div
                key={index}
                className={`flex flex-col items-center transition-all duration-300 ${
                  isHighlighted
                    ? 'scale-105 -translate-y-1'
                    : isShifted
                    ? 'scale-95 translate-x-1'
                    : ''
                }`}
              >
                {/* Memory Address Offset */}
                <span className="text-[10px] font-mono text-slate-500 mb-1.5">
                  {addressHex}
                </span>

                {/* Array Slot Box */}
                <div
                  className={`w-28 h-28 rounded-xl border flex flex-col justify-between p-2.5 transition-all duration-300 relative ${
                    isHighlighted
                      ? 'bg-cyan-500/20 border-cyan-400 shadow-glow-cyan'
                      : isShifted
                      ? 'bg-amber-500/15 border-amber-400/80 shadow-glow-amber'
                      : isPopulated
                      ? 'bg-[#152238] border-cyan-500/30 hover:border-cyan-400/60'
                      : 'bg-slate-900/40 border-dashed border-slate-700/60 opacity-60'
                  }`}
                >
                  {/* Slot Header (Index & Status) */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 text-slate-400">
                      [{index}]
                    </span>
                    {isPopulated ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    ) : (
                      <span className="text-[10px] text-slate-600 font-mono">null</span>
                    )}
                  </div>

                  {/* Slot Value */}
                  <div className="my-auto text-center">
                    {isPopulated ? (
                      <span className="text-sm font-semibold text-white truncate max-w-full block px-1" title={itemValue || ''}>
                        "{itemValue}"
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-slate-600 italic">
                        [free slot]
                      </span>
                    )}
                  </div>

                  {/* Slot Footer (Offset Byte Count) */}
                  <div className="text-[9px] font-mono text-slate-500 text-right">
                    +{index * 4}B
                  </div>
                </div>

                {/* Status Indicator Pill below slot */}
                <div className="mt-2 text-[10px] font-mono font-medium">
                  {isHighlighted ? (
                    <span className="text-cyan-400">Active</span>
                  ) : isShifted ? (
                    <span className="text-amber-400">Shifted</span>
                  ) : isPopulated ? (
                    <span className="text-slate-400">Occupied</span>
                  ) : (
                    <span className="text-slate-600">Headroom</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Memory Diagnostics Bar */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-cyan-400"></span>
            <span>Occupied ({items.length * 4} Bytes)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-slate-700"></span>
            <span>Allocated Headroom ({(capacity - items.length) * 4} Bytes)</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>Spatial Cache Line Hit: <strong className="text-emerald-400">98.4% (L1)</strong></span>
        </div>
      </div>
    </div>
  );
};
