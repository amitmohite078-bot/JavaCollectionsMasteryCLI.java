import React from 'react';
import { useMasteryStore } from '../../store/useMasteryStore';
import { GitCommit, ArrowLeftRight, ArrowRight, ArrowLeft, Disc, AlertCircle } from 'lucide-react';

export const LinkedListVisualizer: React.FC = () => {
  const { linkedListState } = useMasteryStore();
  const { nodes, highlightId, unlinkingId, isLinkingHead, isLinkingTail } = linkedListState;

  return (
    <div className="flex flex-col h-full bg-[#0d1424] rounded-xl border border-white/10 p-5 overflow-hidden">
      {/* Visualizer Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-400">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Doubly-Linked Node Pointer Chain
              <span className="text-xs px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-mono font-normal">
                Node&lt;E&gt; (item, next, prev)
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Direct Endpoints: <code className="text-cyan-300">first</code> (Head) &amp; <code className="text-amber-300">last</code> (Tail)
            </p>
          </div>
        </div>

        {/* Node count & heap overhead telemetry */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono">
            <span className="text-slate-400">nodeCount:</span>
            <span className="text-violet-400 font-bold">{nodes.length}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono">
            <span className="text-slate-400">nodeOverhead:</span>
            <span className="text-rose-400 font-bold">{nodes.length * 24}B</span>
          </div>
        </div>
      </div>

      {/* Linking / Unlinking active alert */}
      {unlinkingId && (
        <div className="mb-4 p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4" />
          <span>Unlinking node references: prev.next = next; next.prev = prev; (O(1))</span>
        </div>
      )}

      {/* Main Pointer Chain Canvas */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden flex items-center py-6 px-2">
        {nodes.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center text-slate-500 font-mono text-sm py-12">
            <Disc className="w-8 h-8 mb-2 opacity-40 animate-spin" />
            <span>first == null &amp;&amp; last == null (Empty LinkedList)</span>
            <span className="text-xs text-slate-600 mt-1">Use "+ addFirst()" or "+ addLast()" in Controls to initialize nodes</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-3 min-w-max">
            {/* HEAD Pointer Tag */}
            <div className="flex flex-col items-center mr-2">
              <span className="px-2 py-1 rounded bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-[11px] font-mono font-bold shadow-glow-cyan">
                HEAD (first)
              </span>
              <ArrowRight className="w-5 h-5 text-cyan-400 mt-1" />
            </div>

            {/* Nodes Loop */}
            {nodes.map((node, index) => {
              const isFirst = index === 0;
              const isLast = index === nodes.length - 1;
              const isHighlighted = highlightId === node.id;
              const isUnlinking = unlinkingId === node.id;

              return (
                <React.Fragment key={node.id}>
                  {/* Doubly Linked Node Block */}
                  <div
                    className={`flex flex-col items-center transition-all duration-300 ${
                      isHighlighted
                        ? 'scale-105 -translate-y-2'
                        : isUnlinking
                        ? 'opacity-40 scale-90 -translate-y-4'
                        : ''
                    }`}
                  >
                    {/* Heap Address */}
                    <span className="text-[10px] font-mono text-slate-500 mb-1">
                      {node.address}
                    </span>

                    {/* Node 3-Compartment Box */}
                    <div
                      className={`w-52 rounded-xl border flex flex-col overflow-hidden transition-all duration-300 ${
                        isHighlighted
                          ? 'bg-violet-500/20 border-violet-400 shadow-glow-violet'
                          : isUnlinking
                          ? 'bg-rose-500/20 border-rose-500'
                          : 'bg-[#152238] border-violet-500/30 hover:border-violet-400/60'
                      }`}
                    >
                      {/* Node Header */}
                      <div className="bg-slate-900/80 px-2.5 py-1 border-b border-white/5 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-violet-400 font-bold">Node [{index}]</span>
                        <span className="text-slate-500 text-[9px]">24B Heap</span>
                      </div>

                      {/* 3 Columns: prev | item | next */}
                      <div className="grid grid-cols-3 divide-x divide-white/10 text-center text-xs font-mono py-3">
                        {/* Prev pointer slot */}
                        <div className="px-1 flex flex-col justify-center">
                          <span className="text-[9px] text-slate-500 uppercase">prev</span>
                          <span className={`text-[10px] font-semibold truncate ${isFirst ? 'text-slate-600' : 'text-cyan-400'}`}>
                            {isFirst ? 'null' : nodes[index - 1].address}
                          </span>
                        </div>

                        {/* Item payload slot */}
                        <div className="px-1 flex flex-col justify-center bg-white/5">
                          <span className="text-[9px] text-slate-400 uppercase font-sans">item</span>
                          <span className="text-xs font-bold text-white truncate px-1" title={node.val}>
                            "{node.val}"
                          </span>
                        </div>

                        {/* Next pointer slot */}
                        <div className="px-1 flex flex-col justify-center">
                          <span className="text-[9px] text-slate-500 uppercase">next</span>
                          <span className={`text-[10px] font-semibold truncate ${isLast ? 'text-slate-600' : 'text-amber-400'}`}>
                            {isLast ? 'null' : nodes[index + 1].address}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Node Role Tag */}
                    <div className="mt-2 text-[10px] font-mono">
                      {isFirst && isLast ? (
                        <span className="text-cyan-300 font-bold">Head &amp; Tail</span>
                      ) : isFirst ? (
                        <span className="text-cyan-300 font-bold">Head</span>
                      ) : isLast ? (
                        <span className="text-amber-300 font-bold">Tail</span>
                      ) : (
                        <span className="text-slate-500">Internal</span>
                      )}
                    </div>
                  </div>

                  {/* Bidirectional Pointers Connector */}
                  {!isLast && (
                    <div className="flex flex-col items-center justify-center px-1 text-slate-400">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400">
                        <span>next</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                      <div className="w-12 h-0.5 bg-gradient-to-r from-amber-400 to-cyan-400 my-1 rounded"></div>
                      <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-400">
                        <ArrowLeft className="w-4 h-4" />
                        <span>prev</span>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}

            {/* TAIL Pointer Tag */}
            <div className="flex flex-col items-center ml-2">
              <ArrowLeft className="w-5 h-5 text-amber-400 mb-1" />
              <span className="px-2 py-1 rounded bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[11px] font-mono font-bold shadow-glow-amber">
                TAIL (last)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Specs */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-cyan-400"></span>
            <span>prev pointer (4B)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-400"></span>
            <span>next pointer (4B)</span>
          </div>
        </div>

        <div className="text-slate-400">
          Random Access Traversal: <strong className="text-amber-400">O(n) [Pointer Chasing]</strong>
        </div>
      </div>
    </div>
  );
};
