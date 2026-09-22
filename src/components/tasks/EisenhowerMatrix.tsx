import React from 'react';
import { Task, TaskPriority } from '../../types';
import { CategoryBadge } from '../common/Badge';
import { useAppStore } from '../../store/useAppStore';
import {
  Flame,
  AlertCircle,
  Clock,
  Coffee,
  CheckCircle2,
  Circle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { formatDeadlineRemaining } from '../../utils/dateUtils';

interface EisenhowerMatrixProps {
  tasks: Task[];
}

export const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({ tasks }) => {
  const {
    toggleTaskStatus,
    changeTaskPriority,
    setSelectedTaskId,
    setActiveWindow,
  } = useAppStore();

  const quadrants: {
    priority: TaskPriority;
    title: string;
    actionLabel: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    borderClass: string;
    bgClass: string;
  }[] = [
    {
      priority: 'P1',
      title: 'Urgent & Important',
      actionLabel: 'DO FIRST',
      subtitle: 'Critical academic labs, imminent deadlines & blockers',
      icon: Flame,
      accentColor: 'text-red-400',
      borderClass: 'border-red-500/40 hover:border-red-500/60',
      bgClass: 'bg-red-950/10',
    },
    {
      priority: 'P2',
      title: 'Important & Not Urgent',
      actionLabel: 'SCHEDULE',
      subtitle: 'Deep dev projects, midterm prep & skill mastery',
      icon: AlertCircle,
      accentColor: 'text-amber-400',
      borderClass: 'border-amber-500/40 hover:border-amber-500/60',
      bgClass: 'bg-amber-950/10',
    },
    {
      priority: 'P3',
      title: 'Urgent & Not Important',
      actionLabel: 'TIMEBOX',
      subtitle: 'Quick code reviews, administrative syncs & routine tasks',
      icon: Clock,
      accentColor: 'text-blue-400',
      borderClass: 'border-blue-500/40 hover:border-blue-500/60',
      bgClass: 'bg-blue-950/10',
    },
    {
      priority: 'P4',
      title: 'Not Urgent & Not Important',
      actionLabel: 'MINIMIZE',
      subtitle: 'Low-priority backlog, exploratory reads & leisure',
      icon: Coffee,
      accentColor: 'text-slate-400',
      borderClass: 'border-slate-600/40 hover:border-slate-500/60',
      bgClass: 'bg-slate-900/40',
    },
  ];

  const handleOpenWorkspace = (taskId: string) => {
    setSelectedTaskId(taskId);
    setActiveWindow('workspace');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {quadrants.map((q) => {
        const Icon = q.icon;
        const quadTasks = tasks.filter((t) => t.priority === q.priority);

        return (
          <div
            key={q.priority}
            className={`rounded-2xl border ${q.borderClass} ${q.bgClass} bg-dark-900/70 p-5 flex flex-col min-h-[360px] shadow-lg transition-all`}
          >
            {/* Quadrant Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-800/80">
              <div>
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${q.accentColor}`} />
                  <h3 className="text-sm font-bold text-slate-100">{q.title}</h3>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-dark-800 border border-slate-700/60 ${q.accentColor}`}>
                    {quadTasks.length}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{q.subtitle}</p>
              </div>

              <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-1 rounded bg-dark-800 border border-slate-700/60 text-slate-300">
                {q.actionLabel}
              </span>
            </div>

            {/* Task Cards Container */}
            <div className="flex-1 py-3 space-y-2.5 overflow-y-auto max-h-[380px]">
              {quadTasks.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400 italic py-10">
                  No tasks in this quadrant
                </div>
              ) : (
                quadTasks.map((task) => {
                  const isCompleted = task.status === 'completed';
                  const deadlineDiff = formatDeadlineRemaining(task.deadline);

                  return (
                    <div
                      key={task.id}
                      className={`p-3 rounded-xl bg-dark-850/80 border border-slate-700/50 hover:border-slate-600 transition-all ${
                        isCompleted ? 'opacity-60 bg-dark-900' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                          <button
                            onClick={() => toggleTaskStatus(task.id)}
                            className="mt-0.5 text-slate-400 hover:text-slate-200 transition-transform active:scale-90 flex-shrink-0"
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <h4
                              onClick={() => handleOpenWorkspace(task.id)}
                              className={`text-xs font-semibold text-slate-100 truncate cursor-pointer hover:text-indigo-400 ${
                                isCompleted ? 'line-through text-slate-400' : ''
                              }`}
                            >
                              {task.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap text-[11px]">
                              <CategoryBadge category={task.category} size="sm" />
                              <span className="text-slate-400 font-mono">
                                ~{task.estimatedDuration}m
                              </span>
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                                  deadlineDiff.isLate
                                    ? 'text-red-400 font-bold'
                                    : 'text-slate-400'
                                }`}
                              >
                                {deadlineDiff.label}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleOpenWorkspace(task.id)}
                            className="p-1 rounded text-slate-400 hover:text-indigo-300 hover:bg-dark-750"
                            title="Open Workspace"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick priority reassignment selector */}
                          <select
                            value={task.priority}
                            onChange={(e) =>
                              changeTaskPriority(task.id, e.target.value as TaskPriority)
                            }
                            className="bg-dark-800 text-[10px] font-mono text-slate-300 border border-slate-700 rounded px-1 py-0.5 focus:outline-none cursor-pointer"
                            title="Move Priority Quadrant"
                          >
                            <option value="P1">P1</option>
                            <option value="P2">P2</option>
                            <option value="P3">P3</option>
                            <option value="P4">P4</option>
                          </select>
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

