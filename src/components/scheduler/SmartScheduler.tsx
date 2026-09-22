import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { TimeBlockGrid } from './TimeBlockGrid';
import { WeekCalendarView } from './WeekCalendarView';
import { PomodoroWidget } from './PomodoroWidget';
import { ManualBlockModal } from './ManualBlockModal';
import { AutoPlanResult } from '../../utils/autoPlanner';
import {
  Zap,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  Info,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { formatDateDisplay, getTodayDateString } from '../../utils/dateUtils';
import confetti from 'canvas-confetti';

export const SmartScheduler: React.FC = () => {
  const {
    timeBlocks,
    selectedDate,
    setSelectedDate,
    calendarView,
    setCalendarView,
    autoPlanMyDay,
  } = useAppStore();

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [autoPlanSummary, setAutoPlanSummary] = useState<AutoPlanResult | null>(null);

  // Filter blocks for selected date
  const dayBlocks = timeBlocks.filter((b) => b.date === selectedDate);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate(getTodayDateString());
  };

  const handleRunAutoPlan = () => {
    const result = autoPlanMyDay(selectedDate);
    setAutoPlanSummary(result);
    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
    } catch {}
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Controls: Date Navigator, Auto-Plan Action & View Toggler */}
      <div className="bg-dark-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between flex-wrap gap-4">
        {/* Date Navigator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-dark-850 rounded-xl border border-slate-800 p-1">
            <button
              onClick={handlePrevDay}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Today
            </button>
            <button
              onClick={handleNextDay}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-dark-850 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-300 hidden sm:inline">
              {formatDateDisplay(selectedDate)}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Day / Week View Mode Switcher */}
          <div className="flex items-center p-1 bg-dark-850 rounded-xl border border-slate-800">
            <button
              onClick={() => setCalendarView('day')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                calendarView === 'day'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setCalendarView('week')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                calendarView === 'week'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Week
            </button>
          </div>

          {/* Add Manual Block Button */}
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Custom Block</span>
          </button>

          {/* Primary One-Click Auto-Plan Engine Button */}
          <button
            onClick={handleRunAutoPlan}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all active:scale-[0.98]"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Auto-Plan My Day</span>
          </button>
        </div>
      </div>

      {/* Auto-Plan Result Alert Banner if just triggered */}
      {autoPlanSummary && (
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 text-xs text-indigo-200 flex items-start justify-between gap-3 shadow-lg animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-100">
                Auto-Plan Complete! Allocated {autoPlanSummary.scheduledTaskIds.length} tasks into non-overlapping blocks between 08:00 and 22:00.
              </p>
              <p className="text-slate-300 mt-0.5">
                Total planned focus duration: <strong className="font-mono text-indigo-300">{autoPlanSummary.totalMinutesScheduled} minutes</strong> (~{(autoPlanSummary.totalMinutesScheduled / 60).toFixed(1)} hrs).
              </p>
              {autoPlanSummary.warnings.length > 0 && (
                <div className="mt-2 text-amber-300 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{autoPlanSummary.warnings[0]}</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setAutoPlanSummary(null)}
            className="text-slate-400 hover:text-slate-200 text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Scheduler Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Area (7 cols): Time Blocking Timeline or Week Grid */}
        <div className="lg:col-span-7 space-y-6">
          {calendarView === 'day' ? (
            <TimeBlockGrid blocks={dayBlocks} selectedDate={selectedDate} />
          ) : (
            <WeekCalendarView timeBlocks={timeBlocks} />
          )}
        </div>

        {/* Right Area (5 cols): Pomodoro Focus Widget */}
        <div className="lg:col-span-5 space-y-6">
          <PomodoroWidget />
        </div>
      </div>

      {/* Custom Block Modal */}
      <ManualBlockModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
      />
    </div>
  );
};

