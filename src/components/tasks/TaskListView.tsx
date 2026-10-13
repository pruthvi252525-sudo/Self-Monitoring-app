import React from 'react';
import { Task } from '../../types';
import { CategoryBadge, PriorityBadge } from '../common/Badge';
import { formatDeadlineRemaining } from '../../utils/dateUtils';
import { Check, Circle, Edit2, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface TaskListViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({ tasks, onEditTask }) => {
  const { toggleTaskStatus, deleteTask, setSelectedTaskId, setActiveWindow } =
    useAppStore();

  const openWorkspace = (task: Task) => {
    setSelectedTaskId(task.id);
    setActiveWindow('workspace');
  };

  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800/80 bg-dark-900 px-6 py-14 text-center">
        <h3 className="text-sm font-medium text-slate-200">Nothing here yet</h3>
        <p className="mt-1 text-xs text-slate-500">
          Try another search or add a task to get started.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2.5">
      {tasks.map((task) => {
        const isCompleted = task.status === 'completed';
        const deadline = formatDeadlineRemaining(task.deadline);
        const checklist = task.checklist ?? [];
        const checklistDone = checklist.filter((item) => item.completed).length;

        return (
          <li
            className={`group flex items-start gap-3 rounded-2xl border border-slate-800/80 bg-dark-900 p-3.5 transition hover:border-slate-700 sm:items-center sm:gap-4 sm:px-4 ${
              isCompleted ? 'opacity-65' : ''
            }`}
            key={task.id}
          >
            <button
              aria-label={isCompleted ? `Reopen ${task.title}` : `Complete ${task.title}`}
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition sm:mt-0 ${
                isCompleted
                  ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-300'
                  : 'border-slate-600 text-transparent hover:border-indigo-300 hover:text-indigo-200'
              }`}
              onClick={() => toggleTaskStatus(task.id)}
              title={isCompleted ? 'Reopen task' : 'Complete task'}
              type="button"
            >
              {isCompleted ? <Check className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                <button
                  className={`max-w-full truncate text-left text-sm font-medium text-slate-200 transition hover:text-indigo-200 ${
                    isCompleted ? 'line-through text-slate-500' : ''
                  }`}
                  onClick={() => openWorkspace(task)}
                  type="button"
                >
                  {task.title}
                </button>
                {task.notes && (
                  <span className="rounded-md bg-dark-750 px-1.5 py-0.5 text-[10px] text-slate-400">
                    Notes
                  </span>
                )}
              </div>

              {task.description && (
                <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                  {task.description}
                </p>
              )}

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <PriorityBadge priority={task.priority} size="sm" />
                <CategoryBadge category={task.category} size="sm" />
                {checklist.length > 0 && (
                  <span className="px-1 text-[10px] text-slate-500">
                    {checklistDone}/{checklist.length} steps
                  </span>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 self-start sm:self-center">
              <span
                className={`whitespace-nowrap rounded-lg px-2 py-1 text-[10px] font-medium ${
                  isCompleted
                    ? 'bg-dark-800 text-slate-500'
                    : deadline.isLate
                    ? 'border border-rose-400/15 bg-rose-400/[0.07] text-rose-200'
                    : deadline.isUrgent
                    ? 'border border-amber-400/15 bg-amber-400/[0.07] text-amber-200'
                    : 'bg-dark-800 text-slate-400'
                }`}
              >
                {deadline.label}
              </span>
              <button
                aria-label={`Edit ${task.title}`}
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/[0.05] hover:text-slate-200"
                onClick={() => onEditTask(task)}
                title="Edit task"
                type="button"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button
                aria-label={`Delete ${task.title}`}
                className="rounded-lg p-1.5 text-slate-600 transition hover:bg-rose-400/[0.08] hover:text-rose-300"
                onClick={() => deleteTask(task.id)}
                title="Delete task"
                type="button"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
