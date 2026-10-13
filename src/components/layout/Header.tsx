import React from 'react';
import {
  AlertCircle,
  BarChart3,
  CalendarDays,
  CheckSquare,
  Cpu,
  Pause,
  Play,
  RotateCcw,
  Search,
  Timer,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

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
    tasks: { title: 'My tasks', icon: CheckSquare },
    workspace: { title: 'Workspace', icon: Cpu },
    scheduler: { title: 'Focus & plan', icon: CalendarDays },
    analytics: { title: 'Your progress', icon: BarChart3 },
  }[activeWindow];
  const Icon = windowInfo.icon;
  const formattedPomodoro = `${String(Math.floor(pomodoro.timeLeft / 60)).padStart(
    2,
    '0'
  )}:${String(pomodoro.timeLeft % 60).padStart(2, '0')}`;

  return (
    <header className="app-header sticky top-0 z-10 flex min-h-[76px] items-center justify-between gap-4 border-b border-white/[0.07] px-5 sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.055] text-indigo-200">
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-slate-100 sm:text-base">
            {windowInfo.title}
          </h2>
          <p className="hidden text-xs text-slate-500 sm:block">
            {new Intl.DateTimeFormat('en', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            }).format(new Date())}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {activeWindow === 'tasks' && (
          <label className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              aria-label="Search tasks"
              className="app-search w-52 rounded-xl border py-2 pl-9 pr-3 text-xs text-slate-200 placeholder:text-slate-500 focus:border-indigo-400/50 focus:outline-none"
              onChange={(event) => setTaskFilter({ search: event.target.value })}
              placeholder="Find a task"
              value={taskFilter.search}
            />
          </label>
        )}

        <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.07] bg-white/[0.035] px-2 py-1.5">
          <button
            aria-label="Open focus timer"
            className="flex items-center gap-2 rounded-lg px-1.5 py-1 text-xs font-medium text-slate-300 transition hover:text-white"
            onClick={() => setActiveWindow('scheduler')}
            title="Open focus timer"
            type="button"
          >
            <Timer className={`h-4 w-4 ${pomodoro.isRunning ? 'text-indigo-300' : 'text-slate-500'}`} />
            <span className="font-mono tabular-nums">{formattedPomodoro}</span>
          </button>
          <span className="h-4 w-px bg-white/[0.09]" />
          <button
            aria-label={pomodoro.isRunning ? 'Pause focus timer' : 'Start focus timer'}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-white/[0.07] hover:text-white"
            onClick={pomodoro.isRunning ? pausePomodoro : startPomodoro}
            title={pomodoro.isRunning ? 'Pause focus timer' : 'Start focus timer'}
            type="button"
          >
            {pomodoro.isRunning ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-current" />
            )}
          </button>
          <button
            aria-label="Reset focus timer"
            className="hidden rounded-lg p-1 text-slate-500 transition hover:bg-white/[0.07] hover:text-white sm:block"
            onClick={resetPomodoro}
            title="Reset focus timer"
            type="button"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        {overdueTasks.length > 0 && (
          <button
            aria-label={`${overdueTasks.length} overdue tasks`}
            className="flex items-center gap-1.5 rounded-xl border border-rose-300/15 bg-rose-300/[0.07] px-2.5 py-2 text-xs font-medium text-rose-200 transition hover:bg-rose-300/[0.12]"
            onClick={() => setRolloverModalOpen(true)}
            title={`${overdueTasks.length} task(s) past deadline or need rollover`}
            type="button"
          >
            <AlertCircle className="h-4 w-4" />
            <span className="hidden sm:inline">{overdueTasks.length} overdue</span>
            <span className="sm:hidden">{overdueTasks.length}</span>
          </button>
        )}
      </div>
    </header>
  );
};
