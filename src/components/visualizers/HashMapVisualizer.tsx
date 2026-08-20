import React from 'react';
import { useMasteryStore } from '../../store/useMasteryStore';
import { LayoutGrid, Binary, GitFork, Cpu, ShieldAlert } from 'lucide-react';

export const HashMapVisualizer: React.FC = () => {
  const { hashMapState } = useMasteryStore();
  const { entries, capacity, buckets, activeCalculation } = hashMapState;

  const threshold = Math.floor(capacity * 0.75);
  const collisionsCount = buckets.filter(b => b.nodes.length > 1).length;

  return (
    <div className="flex flex-col h-full bg-[#0d1424] rounded-xl border border-white/10 p-5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              HashMap Dynamic Bucket Array &amp; Tree Nodes
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-normal">
                Node&lt;K, V&gt;[] table
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Index: <code className="text-cyan-300">i = (n - 1) &amp; (h ^ (h &gt;&gt;&gt; 16))</code>
            </p>
          </div>
        </div>

        {/* Telemetry pills */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono">
            <span className="text-slate-400">size:</span>
            <span className="text-amber-400 font-bold">{entries.length}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono">
            <span className="text-slate-400">threshold (75%):</span>
            <span className="text-cyan-400 font-bold">{threshold}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono">
            <span className="text-slate-400">capacity:</span>
            <span className="text-violet-400 font-bold">{capacity}</span>
          </div>
        </div>
      </div>

      {/* Active Hash Calculation Card */}
      {activeCalculation && (
        <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-amber-500/15 via-cyan-500/15 to-violet-500/15 border border-amber-500/30 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            <Binary className="w-4 h-4 text-amber-400" />
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">Key: "{activeCalculation.key}"</span>
              <span className="text-slate-400">&rarr;</span>
              <span className="text-cyan-300">h = {activeCalculation.hashCode}</span>
              <span className="text-slate-400">&rarr;</span>
              <span className="text-violet-300">spreadHash</span>
              <span className="text-slate-400">&rarr;</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 font-bold border border-amber-500/50">
                table[{activeCalculation.bucketIndex}]
              </span>
            </div>
          </div>
          <span className="text-slate-400">{activeCalculation.step}</span>
        </div>
      )}

      {/* 16 Buckets Grid */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {buckets.map((bucket) => {
            const hasNodes = bucket.nodes.length > 0;
            const isColliding = bucket.nodes.length > 1;
            const isTreeified = bucket.isTreeified;

            return (
              <div
                key={bucket.index}
                className={`p-3 rounded-xl border flex flex-col transition-all duration-200 ${
                  isTreeified
                    ? 'bg-rose-950/20 border-rose-500/60 shadow-glow-rose'
                    : isColliding
                    ? 'bg-amber-950/20 border-amber-500/50'
                    : hasNodes
                    ? 'bg-[#152238] border-amber-500/30'
                    : 'bg-slate-900/30 border-white/5 opacity-60'
                }`}
              >
                {/* Bucket Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 text-xs font-mono">
                  <span className="font-bold text-slate-300">
                    table<span className="text-amber-400">[{bucket.index}]</span>
                  </span>
                  {isTreeified ? (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1 font-bold">
                      <GitFork className="w-3 h-3" /> TreeNode
                    </span>
                  ) : isColliding ? (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                      {bucket.nodes.length} Bins
                    </span>
                  ) : hasNodes ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  ) : (
                    <span className="text-[10px] text-slate-600">empty</span>
                  )}
                </div>

                {/* Node entries chain */}
                <div className="space-y-2 flex-1">
                  {!hasNodes ? (
                    <div className="text-[11px] font-mono text-slate-600 italic py-2 text-center">
                      null
                    </div>
                  ) : (
                    bucket.nodes.map((node, nIdx) => (
                      <div
                        key={nIdx}
                        className="p-2 rounded-lg bg-black/40 border border-white/10 flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-cyan-300 truncate max-w-[90px]" title={node.key}>
                            "{node.key}"
                          </span>
                          <span className="text-slate-400">&rarr;</span>
                          <span className="font-bold text-amber-400">{node.val !== undefined ? node.val : 'N/A'}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between pt-1 border-t border-white/5">
                          <span>hash: {node.hash % 1000}</span>
                          <span>{nIdx === bucket.nodes.length - 1 ? 'next: null' : 'next &rarr;'}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Specs */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Resizing Rule: When <strong className="text-white">size ({entries.length}) &gt; threshold ({threshold})</strong> &rarr; 2x Expansion</span>
        </div>
        <div className="text-slate-400">
          Node Heap Overhead: <strong className="text-cyan-400">32 Bytes / Entry</strong>
        </div>
      </div>
    </div>
  );
};
