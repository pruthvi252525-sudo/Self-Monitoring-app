import React, { useEffect, useState } from 'react';
import { Modal } from '../common/Modal';
import { PriorityBadge, CategoryBadge } from '../common/Badge';
import { useAppStore } from '../../store/useAppStore';
import { RotateCcw, Calendar, Check, ArrowRight } from 'lucide-react';
import { formatDeadlineRemaining, getTodayDateString } from '../../utils/dateUtils';

export const OverdueRolloverModal: React.FC = () => {
  const {
    rolloverModalOpen,
    setRolloverModalOpen,
    tasks,
    rolloverTaskToToday,
    rescheduleTask,
    toggleTaskStatus,
  } = useAppStore();

  const [customDates, setCustomDates] = useState<Record<string, string>>({});
  const [handledTaskIds, setHandledTaskIds] = useState<string[]>([]);
  const [exitingTaskIds, setExitingTaskIds] = useState<string[]>([]);

  useEffect(() => {
    if (rolloverModalOpen) setHandledTaskIds([]);
  }, [rolloverModalOpen]);

  const now = Date.now();
  const overdueTaskIds = new Set(
    tasks
      .filter((task) => {
        if (task.status === 'completed' || !task.deadline) return false;
        return new Date(task.deadline).getTime() < now;
      })
      .map((task) => task.id)
  );
  const overdueTasks = tasks.filter((task) => {
    const isExiting = exitingTaskIds.includes(task.id);
    return (
      isExiting ||
      (overdueTaskIds.has(task.id) && !handledTaskIds.includes(task.id))
    );
  });

  const animateTaskOut = (taskId: string, action: () => void) => {
    setHandledTaskIds((ids) => (ids.includes(taskId) ? ids : [...ids, taskId]));
    setExitingTaskIds((ids) => (ids.includes(taskId) ? ids : [...ids, taskId]));
    action();
    window.setTimeout(() => {
      setExitingTaskIds((ids) => ids.filter((id) => id !== taskId));
    }, 220);
  };

  const handleDone = (taskId: string) => {
    animateTaskOut(taskId, () => toggleTaskStatus(taskId));
  };

  const handleRollover = (taskId: string) => {
    animateTaskOut(taskId, () => rolloverTaskToToday(taskId));
  };

  const handleReschedule = (taskId: string) => {
    const newDate = customDates[taskId];
    if (!newDate) return;
    animateTaskOut(taskId, () => rescheduleTask(taskId, newDate));
  };

  const handleRolloverAll = () => {
    overdueTasks.forEach((task) => rolloverTaskToToday(task.id));
    setRolloverModalOpen(false);
  };

  return (
    <Modal
      isOpen={rolloverModalOpen}
      onClose={() => setRolloverModalOpen(false)}
      title="Overdue Grace & Task Rollover"
      subtitle="The following high-priority coursework or project tasks need your attention"
      maxWidth="2xl"
    >
      <div className="space-y-4">
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
          <RotateCcw className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <p>
            You have <strong className="font-semibold text-amber-200">{overdueTasks.length} unfinished tasks</strong> with past deadlines.
            Adjust estimates, rollover to today's schedule, or adjust deadlines to preserve your productivity momentum.
          </p>
        </div>

        {overdueTasks.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">
            🎉 All set for now. Your task decisions have been saved.
          </div>
        ) : (
          <div className="space-y-3 divide-y divide-slate-800">
            {overdueTasks.map((task) => {
              const diff = formatDeadlineRemaining(task.deadline);
              const isExiting = exitingTaskIds.includes(task.id);
              return (
                <div
                  key={task.id}
                  className={`overflow-hidden transition-[max-height,opacity,transform] duration-200 ease-in-out ${
                    isExiting
                      ? 'max-h-0 -translate-x-3 opacity-0'
                      : 'max-h-[320px] opacity-100'
                  }`}
                >
                  <div className="pt-3 first:pt-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <PriorityBadge priority={task.priority} size="sm" />
                          <CategoryBadge category={task.category} size="sm" />
                          <span className="text-xs font-semibold text-red-400 font-mono">
                            {diff.label}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-100">{task.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1">{task.description}</p>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          disabled={isExiting}
                          onClick={() => handleDone(task.id)}
                          className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs flex items-center gap-1 disabled:pointer-events-none"
                          title="Mark Complete"
                          type="button"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Done</span>
                        </button>

                        <button
                          disabled={isExiting}
                          onClick={() => handleRollover(task.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1 shadow-sm disabled:pointer-events-none"
                          title="Rollover deadline to tonight"
                          type="button"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Rollover Today</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Or Pick New Date:</span>
                      </span>
                      <input
                        type="datetime-local"
                        defaultValue={`${getTodayDateString()}T20:00`}
                        disabled={isExiting}
                        onChange={(event) =>
                          setCustomDates({ ...customDates, [task.id]: event.target.value })
                        }
                        className="bg-dark-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handleReschedule(task.id)}
                        disabled={!customDates[task.id] || isExiting}
                        className="px-2 py-1 rounded-lg bg-dark-750 hover:bg-dark-700 text-slate-200 text-xs border border-slate-600 disabled:opacity-40"
                        type="button"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {overdueTasks.length > 0 && (
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setRolloverModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              Dismiss for Now
            </button>
            <button
              onClick={handleRolloverAll}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md shadow-indigo-600/25"
            >
              <span>Rollover All to Today</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
