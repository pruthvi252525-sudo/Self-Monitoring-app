import React from 'react';
import { Task, TaskStatus } from '../../types';
import { PriorityBadge, CategoryBadge } from '../common/Badge';
import { useAppStore } from '../../store/useAppStore';
import {
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ListTodo,
} from 'lucide-react';
import { formatDeadlineRemaining } from '../../utils/dateUtils';

interface KanbanBoardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onEditTask }) => {
  const { moveTaskStatus, setSelectedTaskId, setActiveWindow } = useAppStore();

  const columns: {
    status: TaskStatus;
    title: string;
    badgeColor: string;
    borderTopColor: string;
  }[] = [
    {
      status: 'todo',
      title: 'To Do',
      badgeColor: 'bg-slate-800 text-slate-300',
      borderTopColor: 'border-t-slate-400',
    },
    {
      status: 'in-progress',
      title: 'In Progress',
      badgeColor: 'bg-blue-500/20 text-blue-300',
      borderTopColor: 'border-t-blue-500',
    },
    {
      status: 'completed',
      title: 'Completed',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
      borderTopColor: 'border-t-emerald-500',
    },
    {
      status: 'rolled-over',
      title: 'Rolled Over',
      badgeColor: 'bg-amber-500/20 text-amber-300',
      borderTopColor: 'border-t-amber-500',
    },
  ];

  const statusOrder: TaskStatus[] = ['todo', 'in-progress', 'completed', 'rolled-over'];

  const getAdjacentStatuses = (current: TaskStatus) => {
    const idx = statusOrder.indexOf(current);
    const prev = idx > 0 ? statusOrder[idx - 1] : null;
    const next = idx < statusOrder.length - 1 ? statusOrder[idx + 1] : null;
    return { prev, next };
  };

  const handleOpenWorkspace = (taskId: string) => {
    setSelectedTaskId(taskId);
    setActiveWindow('workspace');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);

        return (
          <div
            key={col.status}
            className={`bg-dark-900 border border-slate-800 border-t-4 ${col.borderTopColor} rounded-2xl p-4 flex flex-col min-h-[460px] shadow-lg`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">{col.title}</h3>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${col.badgeColor}`}>
                  {colTasks.length}
                </span>
              </div>
            </div>

            {/* Column Task Cards */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] pr-1">
              {colTasks.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-xs text-slate-400 italic">
                  No tasks in {col.title}
                </div>
              ) : (
                colTasks.map((task) => {
                  const { prev, next } = getAdjacentStatuses(task.status);
                  const deadlineDiff = formatDeadlineRemaining(task.deadline);
                  const checklistTotal = task.checklist?.length || 0;
                  const checklistDone =
                    task.checklist?.filter((c) => c.completed).length || 0;

                  return (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl bg-dark-850 border border-slate-700/60 hover:border-slate-600 shadow-sm space-y-2.5 transition-all group"
                    >
                      {/* Top badges */}
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <PriorityBadge priority={task.priority} size="sm" />
                        <CategoryBadge category={task.category} size="sm" />
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h4
                          onClick={() => handleOpenWorkspace(task.id)}
                          className="text-xs font-semibold text-slate-100 hover:text-indigo-400 cursor-pointer line-clamp-2"
                        >
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Checklist & Duration info */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {task.estimatedDuration}m
                        </span>

                        {checklistTotal > 0 && (
                          <span className="flex items-center gap-1 font-mono text-slate-300">
                            <ListTodo className="w-3 h-3 text-indigo-400" />
                            {checklistDone}/{checklistTotal}
                          </span>
                        )}

                        <span
                          className={`text-[10px] font-mono ${
                            deadlineDiff.isLate
                              ? 'text-red-400 font-bold'
                              : 'text-slate-400'
                          }`}
                        >
                          {deadlineDiff.label}
                        </span>
                      </div>

                      {/* Card Footer Actions & Stage Moving */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => handleOpenWorkspace(task.id)}
                          className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Open Hub</span>
                        </button>

                        <div className="flex items-center gap-1">
                          {prev && (
                            <button
                              onClick={() => moveTaskStatus(task.id, prev)}
                              className="p-1 rounded bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
                              title={`Move back to ${prev}`}
                            >
                              <ChevronLeft className="w-3 h-3" />
                            </button>
                          )}
                          {next && (
                            <button
                              onClick={() => moveTaskStatus(task.id, next)}
                              className="p-1 rounded bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
                              title={`Move next to ${next}`}
                            >
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

