import React, { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { PomodoroMode } from '../../types';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Timer,
  Coffee,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const PomodoroWidget: React.FC = () => {
  const {
    pomodoro,
    tasks,
    timeBlocks,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    tickPomodoro,
    switchPomodoroMode,
    setPomodoroBlock,
  } = useAppStore();

  // Tick timer every second if running
  useEffect(() => {
    let interval: any = null;
    if (pomodoro.isRunning) {
      interval = setInterval(() => {
        tickPomodoro();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pomodoro.isRunning, tickPomodoro]);

  const activeTask = tasks.find((t) => t.id === pomodoro.activeTaskId);
  const activeBlock = timeBlocks.find((b) => b.id === pomodoro.activeBlockId);

  const minutes = Math.floor(pomodoro.timeLeft / 60);
  const seconds = pomodoro.timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const modeDurations: Record<PomodoroMode, number> = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  const totalDuration = modeDurations[pomodoro.mode];
  const progressPercent = Math.min(100, Math.max(0, ((totalDuration - pomodoro.timeLeft) / totalDuration) * 100));

  // Circular stroke offset calculation
  const strokeDashoffset = 283 - (283 * progressPercent) / 100;

  const modeTheme = {
    focus: {
      color: 'text-indigo-400',
      ringColor: '#6366f1',
      bgGlow: 'shadow-indigo-500/10',
      label: 'Deep Focus Sprint',
      icon: Timer,
    },
    shortBreak: {
      color: 'text-emerald-400',
      ringColor: '#10b981',
      bgGlow: 'shadow-emerald-500/10',
      label: 'Short Rest & Hydrate',
      icon: Coffee,
    },
    longBreak: {
      color: 'text-blue-400',
      ringColor: '#3b82f6',
      bgGlow: 'shadow-blue-500/10',
      label: 'Long Recharging Break',
      icon: Coffee,
    },
  }[pomodoro.mode];

  const ModeIcon = modeTheme.icon;

  return (
    <div className={`bg-dark-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center relative overflow-hidden ${modeTheme.bgGlow}`}>
      {/* Background radial accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none opacity-20 blur-3xl"
        style={{ background: modeTheme.ringColor }}
      />

      {/* Mode Switcher Tabs */}
      <div className="flex items-center p-1 bg-dark-850 rounded-xl border border-slate-800 mb-6 z-10">
        <button
          onClick={() => switchPomodoroMode('focus')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            pomodoro.mode === 'focus'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Focus (25m)
        </button>
        <button
          onClick={() => switchPomodoroMode('shortBreak')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            pomodoro.mode === 'shortBreak'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Break (5m)
        </button>
        <button
          onClick={() => switchPomodoroMode('longBreak')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            pomodoro.mode === 'longBreak'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Long Rest (15m)
        </button>
      </div>

      {/* Circular Progress Ring with Digital Countdown */}
      <div className="relative w-52 h-52 flex items-center justify-center my-2 z-10">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            className="text-dark-800"
            strokeWidth="6"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={modeTheme.ringColor}
            strokeWidth="6"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300"
          />
        </svg>

        <div className="absolute flex flex-col items-center text-center">
          <ModeIcon className={`w-5 h-5 mb-1 ${modeTheme.color}`} />
          <span className="text-4xl font-extrabold font-mono text-slate-100 tracking-tight">
            {timeFormatted}
          </span>
          <span className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider font-mono">
            {modeTheme.label}
          </span>
        </div>
      </div>

      {/* Active Task / Block Context */}
      <div className="w-full max-w-sm mt-4 p-3 rounded-xl bg-dark-850 border border-slate-800 text-center z-10">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">
          Current Focus Block
        </span>
        <div className="text-xs font-semibold text-slate-200 truncate mt-0.5">
          {activeTask ? activeTask.title : activeBlock ? activeBlock.title : 'General Academic Study Block'}
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center gap-4 mt-6 z-10">
        <button
          onClick={resetPomodoro}
          className="p-3 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white border border-slate-700/60 transition-all active:scale-95"
          title="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {pomodoro.isRunning ? (
          <button
            onClick={pausePomodoro}
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <Pause className="w-4 h-4 fill-current" />
            <span>Pause Sprint</span>
          </button>
        ) : (
          <button
            onClick={startPomodoro}
            className="px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Sprint</span>
          </button>
        )}

        <button
          onClick={() => {
            const nextMode: PomodoroMode = pomodoro.mode === 'focus' ? 'shortBreak' : 'focus';
            switchPomodoroMode(nextMode);
          }}
          className="p-3 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white border border-slate-700/60 transition-all active:scale-95"
          title="Skip session"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Completed Sessions Tracker */}
      <div className="flex items-center gap-2 mt-5 text-xs text-slate-400 z-10">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Completed Sprints Today:</span>
        <div className="flex items-center gap-1 font-mono font-bold text-amber-400">
          {Array.from({ length: Math.min(6, pomodoro.completedPomodoros) }).map((_, i) => (
            <CheckCircle2 key={i} className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
          ))}
          <span className="ml-1 text-slate-300 font-bold">({pomodoro.completedPomodoros})</span>
        </div>
      </div>
    </div>
  );
};

