import React from 'react';
import { TimeBlock, TimeBlockStatus } from '../../types';
import { PriorityBadge, CategoryBadge } from '../common/Badge';
import { useAppStore } from '../../store/useAppStore';
import {
  Clock,
  Play,
  CheckCircle2,
  Trash2,
  Plus,
  Minus,
  Coffee,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { formatTimeDisplay, timeToMinutes, getTodayDateString } from '../../utils/dateUtils';

interface TimeBlockGridProps {
  blocks: TimeBlock[];
  selectedDate: string;
}

export const TimeBlockGrid: React.FC<TimeBlockGridProps> = ({ blocks, selectedDate }) => {
  const {
    updateBlockStatus,
    adjustBlockDuration,
    deleteTimeBlock,
    setPomodoroBlock,
    startPomodoro,
  } = useAppStore();

  const isToday = selectedDate === getTodayDateString();

  // Generate hours array from 08:00 to 22:00
  const hours = Array.from({ length: 15 }, (_, i) => {
    const hour = i + 8;
    return `${String(hour).padStart(2, '0')}:00`;
  });

  const handleStartFocusOnBlock = (block: TimeBlock) => {
    updateBlockStatus(block.id, 'active');
    setPomodoroBlock(block.id, block.taskId);
    startPomodoro();
  };

  const getStatusColor = (status: TimeBlockStatus) => {
    switch (status) {
      case 'active':
        return 'border-l-4 border-l-amber-500 bg-amber-500/5';
      case 'completed':
        return 'border-l-4 border-l-emerald-500 bg-emerald-500/5 opacity-75';
      case 'skipped':
        return 'border-l-4 border-l-slate-600 opacity-50';
      default:
        return 'border-l-4 border-l-indigo-500 bg-indigo-500/5';
    }
  };

  return (
    <div className="bg-dark-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            Daily Time-Blocking Schedule (08:00 - 22:00)
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {blocks.length} scheduled intervals
        </span>
      </div>

      {/* Hour-by-hour timeline view */}
      <div className="space-y-3">
        {blocks.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs italic border border-dashed border-slate-800 rounded-xl">
            No time blocks scheduled for this date. Click "Auto-Plan My Day" above to automatically allocate pending tasks.
          </div>
        ) : (
          blocks.map((block) => {
            const startMinutes = timeToMinutes(block.startTime);
            const endMinutes = timeToMinutes(block.endTime);
            const duration = Math.max(0, endMinutes - startMinutes);

            return (
              <div
                key={block.id}
                className={`p-3.5 rounded-xl border border-slate-700/60 transition-all ${getStatusColor(
                  block.status
                )} flex items-start justify-between gap-3 group`}
              >
                {/* Left: Time & Block Details */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-200 bg-dark-800 px-2 py-0.5 rounded border border-slate-700">
                      {formatTimeDisplay(block.startTime)} – {formatTimeDisplay(block.endTime)}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      ({duration} mins)
                    </span>

                    {block.isBreak ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-medium flex items-center gap-1">
                        <Coffee className="w-3 h-3" />
                        <span>Break / Recovery</span>
                      </span>
                    ) : (
                      <>
                        <PriorityBadge priority={block.priority} size="sm" />
                        <CategoryBadge category={block.category} size="sm" />
                      </>
                    )}
                  </div>

                  <h4 className="text-sm font-semibold text-slate-100 truncate">
                    {block.title}
                  </h4>

                  {block.actualMinutesLogged > 0 && (
                    <div className="text-[11px] font-mono text-indigo-300">
                      ⏱️ Logged focus: {block.actualMinutesLogged}m
                    </div>
                  )}
                </div>

                {/* Right: Interactive Duration & Status Adjustments */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Duration resize controls */}
                  <div className="flex items-center bg-dark-800 border border-slate-700 rounded-lg p-0.5">
                    <button
                      onClick={() => adjustBlockDuration(block.id, -15)}
                      className="p-1 hover:bg-dark-750 text-slate-400 hover:text-white rounded transition-colors"
                      title="Shorten by 15 mins"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => adjustBlockDuration(block.id, 15)}
                      className="p-1 hover:bg-dark-750 text-slate-400 hover:text-white rounded transition-colors"
                      title="Extend by 15 mins"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Start Pomodoro Focus Button */}
                  {!block.isBreak && block.status !== 'completed' && (
                    <button
                      onClick={() => handleStartFocusOnBlock(block)}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-semibold flex items-center gap-1 transition-all"
                      title="Focus on this block"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span className="hidden sm:inline">Focus</span>
                    </button>
                  )}

                  {/* Quick Status toggle */}
                  <button
                    onClick={() => {
                      const nextStatus: TimeBlockStatus =
                        block.status === 'completed'
                          ? 'scheduled'
                          : 'completed';
                      updateBlockStatus(block.id, nextStatus);
                    }}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      block.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'text-slate-400 hover:text-slate-200 bg-dark-800 border-slate-700'
                    }`}
                    title={block.status === 'completed' ? 'Mark Incomplete' : 'Mark Completed'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  {/* Delete block */}
                  <button
                    onClick={() => deleteTimeBlock(block.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-dark-800 transition-colors"
                    title="Remove Block"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

