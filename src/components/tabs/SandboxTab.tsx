import React from 'react';
import { useMasteryStore } from '../../store/useMasteryStore';
import { ControlPanel } from '../sandbox/ControlPanel';
import { TelemetryView } from '../sandbox/TelemetryView';
import { ArrayListVisualizer } from '../visualizers/ArrayListVisualizer';
import { LinkedListVisualizer } from '../visualizers/LinkedListVisualizer';
import { HashSetVisualizer } from '../visualizers/HashSetVisualizer';
import { TreeSetVisualizer } from '../visualizers/TreeSetVisualizer';
import { HashMapVisualizer } from '../visualizers/HashMapVisualizer';
import { StreamsVisualizer } from '../visualizers/StreamsVisualizer';

export const SandboxTab: React.FC = () => {
  const { activeTopic } = useMasteryStore();

  const renderVisualizer = () => {
    switch (activeTopic) {
      case 'ArrayList':
        return <ArrayListVisualizer />;
      case 'LinkedList':
        return <LinkedListVisualizer />;
      case 'HashSet':
        return <HashSetVisualizer />;
      case 'TreeSet':
        return <TreeSetVisualizer />;
      case 'HashMap':
        return <HashMapVisualizer />;
      case 'Streams':
        return <StreamsVisualizer />;
      default:
        return <ArrayListVisualizer />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full overflow-hidden">
      {/* Left Column (40% width ~ 5 cols) - Interactive Control Center */}
      <div className="lg:col-span-5 h-full overflow-hidden">
        <ControlPanel />
      </div>

      {/* Right Column (60% width ~ 7 cols) - Memory Visualizer (Top 60%) + Telemetry (Bottom 40%) */}
      <div className="lg:col-span-7 h-full flex flex-col gap-4 overflow-hidden">
        {/* Top 60% - Live Visualizer */}
        <div className="h-[60%] min-h-[320px]">
          {renderVisualizer()}
        </div>

        {/* Bottom 40% - Telemetry Stream */}
        <div className="h-[40%] min-h-[220px]">
          <TelemetryView />
        </div>
      </div>
    </div>
  );
};
