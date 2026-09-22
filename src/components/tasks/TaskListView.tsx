import React from 'react';
import { Task } from '../../types';
import { PriorityBadge, CategoryBadge, StatusBadge } from '../common/Badge';
import { formatDeadlineRemaining } from '../../utils/dateUtils';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Edit2,
  Trash2,
  Clock,
  ListTodo,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface TaskListViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({ tasks, onEditTask }) => {
  const {
    toggleTaskStatus,
    deleteTask,
    setSelectedTaskId,
    setActiveWindow,
  } = useAppStore();

  const handleOpenWorkspace = (task: Task) => {
    setSelectedTaskId(task.id);
    setActiveWindow('workspace');
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-dark-900 border border-slate-800/80 rounded-2xl p-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-dark-800 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-400 mb-4">
          <ListTodo className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-200">No tasks found</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Try resetting your filters, searching with different keywords, or adding a new task to your queue.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-dark-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-dark-850/70 text-slate-400 text-[11px] font-mono uppercase tracking-wider">
              <th className="py-3.5 pl-5 pr-2 w-12 text-center">Done</th>
              <th className="py-3.5 px-3 w-28">Priority</th>
              <th className="py-3.5 px-3 w-32">Category</th>
              <th className="py-3.5 px-3 min-w-[240px]">Task Title & Description</th>
              <th className="py-3.5 px-3 w-24">Est. Time</th>
              <th className="py-3.5 px-3 w-40">Deadline</th>
              <th className="py-3.5 px-3 w-24">Status</th>
              <th className="py-3.5 pl-3 pr-5 text-right w-28">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {tasks.map((task) => {
              const isCompleted = task.status === 'completed';
              const deadlineDiff = formatDeadlineRemaining(task.deadline);
              const checklistTotal = task.checklist?.length || 0;
              const checklistDone = task.checklist?.filter((c) => c.completed).length || 0;

              return (
                <tr
                  key={task.id}
                  className={`group hover:bg-dark-800/50 transition-colors ${
                    isCompleted ? 'bg-dark-900/40 opacity-70' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-4 pl-5 pr-2 text-center align-top">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`transition-transform active:scale-90 ${
                        isCompleted ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title={isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                  </td>

                  {/* Priority */}
                  <td className="py-4 px-3 align-top">
                    <PriorityBadge priority={task.priority} size="sm" />
                  </td>

                  {/* Category */}
                  <td className="py-4 px-3 align-top">
                    <CategoryBadge category={task.category} size="sm" />
                  </td>

                  {/* Title & Description */}
                  <td className="py-4 px-3 align-top">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          onClick={() => handleOpenWorkspace(task)}
                          className={`font-semibold text-slate-100 cursor-pointer hover:text-indigo-400 transition-colors ${
                            isCompleted ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {task.title}
                        </span>
                        {task.notes && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-dark-750 text-indigo-300 font-mono" title="Has workspace notes">
                            Notes
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {task.description}
                        </p>
                      )}

                      {checklistTotal > 0 && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-0.5">
                          <span>Checklist:</span>
                          <span className="font-mono text-slate-300">
                            {checklistDone}/{checklistTotal}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Estimated Duration */}
                  <td className="py-4 px-3 align-top whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs text-slate-300 font-mono bg-dark-800 px-2 py-1 rounded-md border border-slate-700/50">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{task.estimatedDuration}m</span>
                    </span>
                  </td>

                  {/* Deadline with urgency countdown badge */}
                  <td className="py-4 px-3 align-top whitespace-nowrap">
                    <div className="space-y-1">
                      <span
                        className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-md ${
                          isCompleted
                            ? 'bg-slate-800 text-slate-400'
                            : deadlineDiff.isLate
                            ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                            : deadlineDiff.isUrgent
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-dark-800 text-slate-300'
                        }`}
                      >
                        {deadlineDiff.label}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-3 align-top whitespace-nowrap">
                    <StatusBadge status={task.status} />
                  </td>

                  {/* Actions */}
                  <td className="py-4 pl-3 pr-5 text-right align-top whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenWorkspace(task)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-dark-750 transition-colors"
                        title="Open Dynamic Workspace Hub"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onEditTask(task)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-dark-750 transition-colors"
                        title="Edit Task"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-dark-750 transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

