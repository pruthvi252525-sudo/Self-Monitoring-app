import React from 'react';
import {
  CheckSquare,
  Cpu,
  Calendar,
  BarChart3,
  Plus,
  Zap,
  Star,
  Download,
  Flame,
  Clock,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AppWindow } from '../../types';

export const Sidebar: React.FC = () => {
  const {
    activeWindow,
    setActiveWindow,
    selectedTaskId,
    tasks,
    pomodoro,
    getProductivityScore,
    getStreakStats,
    setQuickTaskModalOpen,
    setReviewModalOpen,
    setExportModalOpen,
    autoPlanMyDay,
    resetToSeedData,
  } = useAppStore();

  const score = getProductivityScore();
  const streak = getStreakStats();
  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  const navItems: {
    id: AppWindow;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    isFlashing?: boolean;
  }[] = [
    {
      id: 'tasks',
      label: 'Task Command',
      description: 'Matrix, Kanban & Lists',
      icon: CheckSquare,
      badge: `${tasks.filter((t) => t.status !== 'completed').length}`,
    },
    {
      id: 'workspace',
      label: 'Dynamic Workspace',
      description: selectedTask ? selectedTask.title : 'Notes, Links, Assets',
      icon: Cpu,
      badge: selectedTask ? 'Active' : undefined,
    },
    {
      id: 'scheduler',
      label: 'Smart Scheduler',
      description: 'Auto-Plan & Pomodoro',
      icon: Calendar,
      isFlashing: pomodoro.isRunning,
      badge: pomodoro.isRunning ? 'FOCUS' : undefined,
    },
    {
      id: 'analytics',
      label: 'Performance Hub',
      description: 'Velocity & Reviews',
      icon: BarChart3,
      badge: `${score}%`,
    },
  ];

  const handleAutoPlanClick = () => {
    autoPlanMyDay();
    setActiveWindow('scheduler');
  };

  return (
    <aside className="w-72 bg-dark-900 border-r border-slate-800/80 flex flex-col flex-shrink-0 h-screen sticky top-0 select-none z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-100 text-base leading-tight tracking-tight">
                Self-Monitoring
              </h1>
              <p className="text-[11px] text-slate-400 font-mono tracking-wider uppercase mt-0.5">
                Productivity OS
              </p>
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" title="Offline-ready & Sync Active" />
        </div>
      </div>

      {/* Quick Primary Actions */}
      <div className="p-4 space-y-2 border-b border-slate-800/60">
        <button
          onClick={() => {
            setActiveWindow('tasks');
            setQuickTaskModalOpen(true);
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm shadow-md shadow-indigo-600/25 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>

        <button
          onClick={handleAutoPlanClick}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-dark-800 hover:bg-dark-750 text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/50 rounded-xl font-medium text-xs transition-all active:scale-[0.98]"
        >
          <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20" />
          <span>Auto-Plan My Day</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Windows & Workspaces
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeWindow === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveWindow(item.id)}
              className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left ${
                isActive
                  ? 'bg-indigo-600/15 text-white border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-dark-800/60 border border-transparent'
              }`}
            >
              <div
                className={`p-2 rounded-lg mt-0.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-dark-800 text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold truncate ${isActive ? 'text-slate-100' : 'text-slate-300'}`}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                        item.isFlashing
                          ? 'bg-red-500 text-white animate-pulse'
                          : isActive
                          ? 'bg-indigo-500/30 text-indigo-300'
                          : 'bg-dark-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Mini Productivity Snapshot */}
      <div className="p-3 mx-3 mb-3 bg-dark-850 border border-slate-800/80 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Streak</span>
          </span>
          <span className="font-bold text-amber-400 font-mono">
            {streak.currentStreak} Days
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Focus Time</span>
          </span>
          <span className="font-bold text-blue-300 font-mono">
            {streak.todayFocusMinutes}m
          </span>
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Daily Score</span>
            <span className="font-semibold text-emerald-400">{score}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Utility Actions */}
      <div className="p-3 border-t border-slate-800/80 grid grid-cols-3 gap-1 bg-dark-900/90">
        <button
          onClick={() => setReviewModalOpen(true)}
          title="Daily Reflection / Review"
          className="flex flex-col items-center justify-center p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-dark-800 transition-colors"
        >
          <Star className="w-4 h-4" />
          <span className="text-[10px] mt-1">Review</span>
        </button>

        <button
          onClick={() => setExportModalOpen(true)}
          title="Backup & Export"
          className="flex flex-col items-center justify-center p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-dark-800 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="text-[10px] mt-1">Backup</span>
        </button>

        <button
          onClick={resetToSeedData}
          title="Reset to Fresh Sample Coursework Data"
          className="flex flex-col items-center justify-center p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-dark-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-[10px] mt-1">Reset</span>
        </button>
      </div>
    </aside>
  );
};

