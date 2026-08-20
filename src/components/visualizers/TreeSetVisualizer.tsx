import React, { useMemo } from 'react';
import { useMasteryStore } from '../../store/useMasteryStore';
import { Network, GitMerge, RotateCw, Compass, ShieldCheck } from 'lucide-react';

interface TreeNodeData {
  val: number;
  color: 'RED' | 'BLACK';
  x: number;
  y: number;
  left?: TreeNodeData;
  right?: TreeNodeData;
  parentVal?: number;
}

export const TreeSetVisualizer: React.FC = () => {
  const { treeSetState } = useMasteryStore();
  const { keys, highlightPath, targetKey, rotationInfo, boundaryResult } = treeSetState;

  // Build a balanced Red-Black Tree model from keys
  const treeRoot = useMemo(() => {
    if (keys.length === 0) return null;
    const sorted = [...keys].sort((a, b) => a - b);

    function buildSubtree(arr: number[], depth: number, x: number, y: number, spread: number): TreeNodeData | null {
      if (arr.length === 0) return null;
      const mid = Math.floor(arr.length / 2);
      const val = arr[mid];
      // Root is always black; alternate color by depth
      const color: 'RED' | 'BLACK' = depth === 0 ? 'BLACK' : depth % 2 === 1 ? 'RED' : 'BLACK';

      const leftArr = arr.slice(0, mid);
      const rightArr = arr.slice(mid + 1);

      const node: TreeNodeData = {
        val,
        color,
        x,
        y,
      };

      const childY = y + 70;
      const nextSpread = spread / 2;

      if (leftArr.length > 0) {
        const leftNode = buildSubtree(leftArr, depth + 1, x - spread, childY, nextSpread);
        if (leftNode) {
          leftNode.parentVal = val;
          node.left = leftNode;
        }
      }

      if (rightArr.length > 0) {
        const rightNode = buildSubtree(rightArr, depth + 1, x + spread, childY, nextSpread);
        if (rightNode) {
          rightNode.parentVal = val;
          node.right = rightNode;
        }
      }

      return node;
    }

    return buildSubtree(sorted, 0, 360, 45, 140);
  }, [keys]);

  // Flatten nodes and edges for SVG rendering
  const { allNodes, allEdges } = useMemo(() => {
    const nodes: TreeNodeData[] = [];
    const edges: { x1: number; y1: number; x2: number; y2: number; from: number; to: number }[] = [];

    function traverse(node: TreeNodeData | null) {
      if (!node) return;
      nodes.push(node);
      if (node.left) {
        edges.push({ x1: node.x, y1: node.y, x2: node.left.x, y2: node.left.y, from: node.val, to: node.left.val });
        traverse(node.left);
      }
      if (node.right) {
        edges.push({ x1: node.x, y1: node.y, x2: node.right.x, y2: node.right.y, from: node.val, to: node.right.val });
        traverse(node.right);
      }
    }

    traverse(treeRoot);
    return { allNodes: nodes, allEdges: edges };
  }, [treeRoot]);

  return (
    <div className="flex flex-col h-full bg-[#0d1424] rounded-xl border border-white/10 p-5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <GitMerge className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Red-Black Self-Balancing Binary Search Tree
              <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-normal">
                Height &le; 2 * log(n + 1)
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Invariants: <code className="text-slate-300">Black Root</code>, <code className="text-rose-400">No Adjacent Reds</code>, <code className="text-emerald-400">Uniform Black-Height</code>
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono">
            <span className="text-slate-400">nodes:</span>
            <span className="text-rose-400 font-bold">{keys.length}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono">
            <span className="text-slate-400">timeBound:</span>
            <span className="text-cyan-400 font-bold">O(log n)</span>
          </div>
        </div>
      </div>

      {/* Dynamic Search / Rotation Banner */}
      {boundaryResult && (
        <div className="mb-3 p-3 rounded-lg bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/40 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold">
            <Compass className="w-4 h-4" />
            <span>{boundaryResult.label}</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/50">
            Result: {boundaryResult.value !== null ? boundaryResult.value : 'null'}
          </span>
        </div>
      )}

      {rotationInfo && (
        <div className="mb-3 p-2.5 rounded-lg bg-violet-500/20 border border-violet-500/40 flex items-center gap-2 text-xs font-mono text-violet-300">
          <RotateCw className="w-4 h-4 text-violet-400 animate-spin" />
          <span>{rotationInfo}</span>
        </div>
      )}

      {/* SVG Tree Canvas */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-2">
        {keys.length === 0 ? (
          <div className="text-center font-mono text-slate-500 py-12">
            <span>root == null (Empty TreeSet)</span>
            <div className="text-xs text-slate-600 mt-1">Use "tree.add(x)" in Controls to insert elements</div>
          </div>
        ) : (
          <svg className="w-full h-full min-w-[720px] min-h-[300px]" viewBox="0 0 720 300">
            <defs>
              <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Tree Branch Edges */}
            {allEdges.map((edge, idx) => {
              const isPath = highlightPath.includes(edge.from) && highlightPath.includes(edge.to);
              return (
                <g key={idx}>
                  <line
                    x1={edge.x1}
                    y1={edge.y1}
                    x2={edge.x2}
                    y2={edge.y2}
                    stroke={isPath ? '#38bdf8' : '#334155'}
                    strokeWidth={isPath ? 3 : 1.5}
                    strokeDasharray={isPath ? '4 2' : 'none'}
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}

            {/* Tree Nodes */}
            {allNodes.map((node) => {
              const isPathNode = highlightPath.includes(node.val);
              const isTarget = targetKey === node.val;
              const isRed = node.color === 'RED';

              return (
                <g
                  key={node.val}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="transition-all duration-300"
                >
                  {/* Outer glow ring for active node */}
                  {isPathNode && (
                    <circle
                      r="24"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      className="animate-spin"
                      style={{ transformOrigin: '0 0' }}
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    r="18"
                    fill={isRed ? '#e11d48' : '#090d16'}
                    stroke={isTarget ? '#38bdf8' : isRed ? '#f43f5e' : '#475569'}
                    strokeWidth={isTarget ? 3 : 2}
                    filter={isRed ? 'url(#glow-red)' : isPathNode ? 'url(#glow-cyan)' : 'none'}
                    className="cursor-pointer transition-all duration-200 hover:scale-110"
                  />

                  {/* Value Text */}
                  <text
                    textAnchor="middle"
                    dy="5"
                    fill="#ffffff"
                    fontSize="12"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {node.val}
                  </text>

                  {/* Color Label Tag */}
                  <text
                    textAnchor="middle"
                    dy="28"
                    fill={isRed ? '#fda4af' : '#94a3b8'}
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {node.color}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* Footer Navigable Legend */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-black border border-slate-500"></span>
            <span>BLACK Node</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-600 border border-rose-400"></span>
            <span>RED Node</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
            <span>Search Path</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Max Rotations / Insertion: <strong className="text-emerald-400">2</strong></span>
        </div>
      </div>
    </div>
  );
};
