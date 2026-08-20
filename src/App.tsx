import React from 'react';
import { useMasteryStore } from './store/useMasteryStore';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { SearchModal } from './components/layout/SearchModal';
import { SandboxTab } from './components/tabs/SandboxTab';
import { ArchitectureTab } from './components/tabs/ArchitectureTab';
import { OperationsTab } from './components/tabs/OperationsTab';
import { ScenariosTab } from './components/tabs/ScenariosTab';
import { InterviewTab } from './components/tabs/InterviewTab';
import { QuizTab } from './components/tabs/QuizTab';
import { MasterMatrix } from './components/global/MasterMatrix';
import { FaceOffView } from './components/global/FaceOffView';
import { DecisionWizard } from './components/global/DecisionWizard';

export const App: React.FC = () => {
  const { activeTab, globalView } = useMasteryStore();

  const renderContent = () => {
    // Check if user is in Global Hub Views
    if (globalView === 'master-matrix') {
      return <MasterMatrix />;
    }
    if (globalView === 'face-offs') {
      return <FaceOffView />;
    }
    if (globalView === 'decision-wizard') {
      return <DecisionWizard />;
    }

    // Otherwise render active topic tab
    switch (activeTab) {
      case 'sandbox':
        return <SandboxTab />;
      case 'architecture':
        return <ArchitectureTab />;
      case 'operations':
        return <OperationsTab />;
      case 'scenarios':
        return <ScenariosTab />;
      case 'interview':
        return <InterviewTab />;
      case 'quiz':
        return <QuizTab />;
      default:
        return <SandboxTab />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090d16] text-[#f8fafc]">
      {/* 280px Collapsible Left Sidebar */}
      <Sidebar />

      {/* Main Center-Right Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* 64px Global Top Navigation Bar */}
        <TopNav />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 p-5 overflow-hidden bg-[#090d16]">
          {renderContent()}
        </main>
      </div>

      {/* Cmd + K Global Search Modal */}
      <SearchModal />
    </div>
  );
};

export default App;
