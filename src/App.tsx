import React, { useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { TaskModal } from './components/tasks/TaskModal';
import { OverdueRolloverModal } from './components/layout/OverdueRolloverModal';
import { ExportModal } from './components/layout/ExportModal';
import { TaskCommandCenter } from './components/tasks/TaskCommandCenter';
import { DynamicWorkspace } from './components/workspace/DynamicWorkspace';
import { SmartScheduler } from './components/scheduler/SmartScheduler';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { WelcomePage } from './components/auth/WelcomePage';

export const App: React.FC = () => {
  const [hasEnteredDemo, setHasEnteredDemo] = useState(false);
  const {
    activeWindow,
    setActiveWindow,
    quickTaskModalOpen,
    setQuickTaskModalOpen,
    checkAndPromptOverdueTasks,
    setRolloverModalOpen,
  } = useAppStore();

  // Keep the demo sign-in screen free of app alerts.
  useEffect(() => {
    if (!hasEnteredDemo) return;
    const overdue = checkAndPromptOverdueTasks();
    if (overdue.length > 0) {
      // Delay slightly for smooth page load
      const timer = setTimeout(() => {
        setRolloverModalOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [checkAndPromptOverdueTasks, hasEnteredDemo, setRolloverModalOpen]);

  // Global keyboard shortcuts
  useEffect(() => {
    if (!hasEnteredDemo) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is typing in an input or textarea, don't trigger global shortcuts
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(
          (e.target as HTMLElement)?.tagName
        )
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveWindow('tasks');
        setQuickTaskModalOpen(true);
      } else if (e.key === '1') {
        setActiveWindow('tasks');
      } else if (e.key === '2') {
        setActiveWindow('workspace');
      } else if (e.key === '3') {
        setActiveWindow('scheduler');
      } else if (e.key === '4') {
        setActiveWindow('analytics');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasEnteredDemo, setActiveWindow, setQuickTaskModalOpen]);

  if (!hasEnteredDemo) {
    return <WelcomePage onEnterDemo={() => setHasEnteredDemo(true)} />;
  }

  return (
    <div className="app-shell flex min-h-screen bg-dark-950 font-sans text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Sidebar Navigation */}
      <Sidebar onExitDemo={() => setHasEnteredDemo(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
        <Header />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {activeWindow === 'tasks' && <TaskCommandCenter />}
          {activeWindow === 'workspace' && <DynamicWorkspace />}
          {activeWindow === 'scheduler' && <SmartScheduler />}
          {activeWindow === 'analytics' && <AnalyticsDashboard />}
        </main>
      </div>

      {/* Global Modals */}
      <TaskModal
        isOpen={quickTaskModalOpen}
        onClose={() => setQuickTaskModalOpen(false)}
      />
      <OverdueRolloverModal />
      <ExportModal />
    </div>
  );
};

export default App;
