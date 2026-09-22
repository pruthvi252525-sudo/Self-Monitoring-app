import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Task } from '../../types';
import { TaskFilterBar } from './TaskFilterBar';
import { TaskListView } from './TaskListView';
import { EisenhowerMatrix } from './EisenhowerMatrix';
import { KanbanBoard } from './KanbanBoard';
import { TaskModal } from './TaskModal';
import { Plus, Flame, CheckCircle2, BookOpen, Code2 } from 'lucide-react';

export const TaskCommandCenter: React.FC = () => {
  const {
    tasks,
    taskFilter,
    taskViewMode,
  } = useAppStore();

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filter tasks based on store state
  const filteredTasks = tasks.filter((task) => {
    // Search query
    if (taskFilter.search.trim()) {
      const q = taskFilter.search.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      const matchNotes = task.notes?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchNotes) return false;
    }

    // Category filter
    if (taskFilter.category !== 'all' && task.category !== taskFilter.category) {
      return false;
    }

    // Priority filter
    if (taskFilter.priority !== 'all' && task.priority !== taskFilter.priority) {
      return false;
    }

    // Status filter
    if (taskFilter.status === 'active' && task.status === 'completed') {
      return false;
    }
    if (taskFilter.status === 'completed' && task.status !== 'completed') {
      return false;
    }

    return true;
  });

  const p1Count = tasks.filter((t) => t.priority === 'P1' && t.status !== 'completed').length;
  const academicCount = tasks.filter((t) => t.category === 'Academic' && t.status !== 'completed').length;
  const devCount = tasks.filter((t) => t.category === 'Dev Project' && t.status !== 'completed').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Quick Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-dark-900 border border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Critical (P1)</span>
            <div className="text-xl font-bold font-mono text-red-400 mt-0.5">{p1Count}</div>
          </div>
          <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-dark-900 border border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Coursework</span>
            <div className="text-xl font-bold font-mono text-purple-400 mt-0.5">{academicCount}</div>
          </div>
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-dark-900 border border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Dev Projects</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{devCount}</div>
          </div>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Code2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-dark-900 border border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Completed</span>
            <div className="text-xl font-bold font-mono text-indigo-400 mt-0.5">{completedCount}</div>
          </div>
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and View Toggler Bar */}
      <TaskFilterBar />

      {/* Main View Display */}
      {taskViewMode === 'table' && (
        <TaskListView
          tasks={filteredTasks}
          onEditTask={(task) => setEditingTask(task)}
        />
      )}

      {taskViewMode === 'eisenhower' && (
        <EisenhowerMatrix tasks={filteredTasks} />
      )}

      {taskViewMode === 'kanban' && (
        <KanbanBoard
          tasks={filteredTasks}
          onEditTask={(task) => setEditingTask(task)}
        />
      )}

      {/* Edit Task Modal */}
      <TaskModal
        isOpen={editingTask !== null}
        onClose={() => setEditingTask(null)}
        taskToEdit={editingTask}
      />
    </div>
  );
};

