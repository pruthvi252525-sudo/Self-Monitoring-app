import React from 'react';
import { TaskPriority, TaskCategory, TaskStatus } from '../../types';
import { Flame, AlertCircle, Clock, CheckCircle2, RotateCcw, BookOpen, Code2, User } from 'lucide-react';

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const config = {
    P1: {
      label: 'P1 Urgent-Important',
      shortLabel: 'P1',
      bg: 'bg-red-500/10 text-red-400 border-red-500/30',
      dot: 'bg-red-500',
      icon: Flame,
    },
    P2: {
      label: 'P2 High',
      shortLabel: 'P2',
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      dot: 'bg-amber-500',
      icon: AlertCircle,
    },
    P3: {
      label: 'P3 Medium',
      shortLabel: 'P3',
      bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      dot: 'bg-blue-500',
      icon: Clock,
    },
    P4: {
      label: 'P4 Low',
      shortLabel: 'P4',
      bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
      dot: 'bg-slate-500',
      icon: Clock,
    },
  }[priority] || {
    label: priority,
    shortLabel: priority,
    bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    dot: 'bg-slate-500',
    icon: Clock,
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md transition-colors ${
        size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      } ${config.bg}`}
      title={config.label}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{size === 'sm' ? config.shortLabel : config.label}</span>
    </span>
  );
};

interface CategoryBadgeProps {
  category: TaskCategory;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'md' }) => {
  const config = {
    Academic: {
      bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      icon: BookOpen,
    },
    'Dev Project': {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: Code2,
    },
    Personal: {
      bg: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
      icon: User,
    },
  }[category] || {
    bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    icon: BookOpen,
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md ${
        size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      } ${config.bg}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{category}</span>
    </span>
  );
};

interface StatusBadgeProps {
  status: TaskStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = {
    todo: {
      label: 'To Do',
      bg: 'bg-slate-800 text-slate-300 border-slate-700',
      icon: Clock,
    },
    'in-progress': {
      label: 'In Progress',
      bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      icon: Clock,
    },
    completed: {
      label: 'Completed',
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
    },
    'rolled-over': {
      label: 'Rolled Over',
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: RotateCcw,
    },
  }[status] || {
    label: status,
    bg: 'bg-slate-800 text-slate-300 border-slate-700',
    icon: Clock,
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium border rounded-full ${config.bg}`}
    >
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </span>
  );
};

