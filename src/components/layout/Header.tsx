import React from 'react';
import {
  CheckSquare,
  Cpu,
  Calendar,
  BarChart3,
  Search,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  Timer,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { minutesToTime } from '../../utils/dateUtils';

export const Header: React.FC = () => {
  const {
    activeWindow,
    setActiveWindow,
    taskFilter,
    setTaskFilter,
    pomodoro,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    checkAndPromptOverdueTasks,
    setRolloverModalOpen,
  } = useAppStore();

  const overdueTasks = checkAndPromptOverdueTasks();

  const windowInfo = {
    tasks: {
      title: 'Task Command Center',
      subtitle: 'Organize coursework, dev projects, and priorities',
      icon: CheckSquare,
    },
    workspace: {
      title: 'Dynamic Workspace',
      subtitle: 'Context hub, markdown documentation & research assets',
      icon: Cpu,
    },
    scheduler: {
      title: 'Smart Daily Scheduler',
      subtitle: 'Algorithmic time-blocking and focus sessions (08:00 - 22:00)',
      icon: Calendar,
    },
    analytics: {
      title: 'Performance & Accountability',
      subtitle: 'Dynamic velocity, weighted score, and reflection history',
      icon: BarChart3,
    },
  }[activeWindow];

  const Icon = windowInfo.icon;

  const pomodoroMinutes = Math.floor(pomodoro.timeLeft / 60);
  const pomodoroSeconds = pomodoro.timeLeft % 60;
  const formattedPomodoro = `${String(pomodoroMinutes).padStart(2, '0')}:${String(
    pomodoroSeconds
  ).padStart(2, '0')}`;

  return (
    <header className="h-16 bg-dark-900/80 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Left: Window Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-dark-800 text-indigo-400 border border-slate-700/50">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-100 leading-tight">
            {windowInfo.title}
          </h2>
          <p className="text-xs text-slate-400 hidden sm:block">
            {windowInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Center / Right: Global Search & Live Pomodoro Widget */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-48 md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks, tags, notes..."
            value={taskFilter.search}
            onChange={(e) => setTaskFilter({ search: e.target.value })}
            className="w-full bg-dark-800/80 border border-slate-700/60 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Header Pomodoro Quick Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-850 border border-slate-700/60 shadow-inner">
          <button
            onClick={() => setActiveWindow('scheduler')}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-200 hover:text-indigo-300"
            title="Open Focus Scheduler"
          >
            <Timer
              className={`w-3.5 h-3.5 ${
                pomodoro.isRunning ? 'text-red-400 animate-spin' : 'text-slate-400'
              }`}
            />
            <span
              className={
                pomodoro.isRunning ? 'text-red-400 font-extrabold' : 'text-slate-300'
              }
            >
              {formattedPomodoro}
            </span>
          </button>

          <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
            {pomodoro.isRunning ? (
              <button
                onClick={pausePomodoro}
                className="p-1 rounded text-amber-400 hover:bg-slate-700/50"
                title="Pause Focus Session"
              >
                <Pause className="w-3 h-3" />
              </button>
            ) : (
              <button
                onClick={startPomodoro}
                className="p-1 rounded text-emerald-400 hover:bg-slate-700/50"
                title="Start Focus Session"
              >
                <Play className="w-3 h-3 fill-current" />
              </button>
            )}
            <button
              onClick={resetPomodoro}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              title="Reset Timer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Overdue Tasks Alert Badge */}
        {overdueTasks.length > 0 && (
          <button
            onClick={() => setRolloverModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold animate-pulse transition-colors"
            title={`${overdueTasks.length} task(s) past deadline or need rollover`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Overdue</span>
            <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-mono">
              {overdueTasks.length}
            </span>
          </button>
        )}
      </div>
    </header>
  );
};

