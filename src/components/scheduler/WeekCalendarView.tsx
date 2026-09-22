import React from 'react';
import { TimeBlock } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { getWeekDates, formatTimeDisplay } from '../../utils/dateUtils';
import { PriorityBadge } from '../common/Badge';
import { Calendar } from 'lucide-react';

interface WeekCalendarViewProps {
  timeBlocks: TimeBlock[];
}

export const WeekCalendarView: React.FC<WeekCalendarViewProps> = ({ timeBlocks }) => {
  const { selectedDate, setSelectedDate, setCalendarView } = useAppStore();
  const weekDays = getWeekDates(selectedDate);

  const handleDaySelect = (date: string) => {
    setSelectedDate(date);
    setCalendarView('day');
  };

  return (
    <div className="bg-dark-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            Weekly Schedule Overview
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          Click any day card to view and adjust its hourly time blocks
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const dayBlocks = timeBlocks.filter((b) => b.date === day.date);
          const isCurrentSelected = day.date === selectedDate;

          return (
            <div
              key={day.date}
              onClick={() => handleDaySelect(day.date)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col min-h-[220px] ${
                isCurrentSelected
                  ? 'bg-indigo-600/10 border-indigo-500/50 shadow-md'
                  : 'bg-dark-850 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
                <span className="text-xs font-bold text-slate-300">
                  {day.dayName}
                </span>
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                    day.isToday
                      ? 'bg-indigo-600 text-white'
                      : 'bg-dark-800 text-slate-400'
                  }`}
                >
                  {day.dayNumber}
                </span>
              </div>

              {/* Day Block Pills */}
              <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[200px]">
                {dayBlocks.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[11px] text-slate-400 italic py-4">
                    Empty
                  </div>
                ) : (
                  dayBlocks.map((block) => (
                    <div
                      key={block.id}
                      className="p-1.5 rounded-lg bg-dark-800 border border-slate-700/60 text-[11px] space-y-0.5"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>{block.startTime}</span>
                        {!block.isBreak && <PriorityBadge priority={block.priority} size="sm" />}
                      </div>
                      <p className="font-semibold text-slate-200 truncate">
                        {block.title}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 font-mono text-right mt-1">
                {dayBlocks.length} blocks
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

