import React, { useState } from 'react';
import { CheckCircle2, Plus } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Task } from '../../types';
import { TaskFilterBar } from './TaskFilterBar';
import { TaskListView } from './TaskListView';
import { EisenhowerMatrix } from './EisenhowerMatrix';
import { KanbanBoard } from './KanbanBoard';
import { TaskModal } from './TaskModal';

export const TaskCommandCenter: React.FC = () => {
  const {
    tasks,
    taskFilter,
    taskViewMode,
    setQuickTaskModalOpen,
  } = useAppStore();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter((task) => {
    if (taskFilter.search.trim()) {
      const query = taskFilter.search.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(query);
      const matchesDescription = task.description?.toLowerCase().includes(query);
      const matchesNotes = task.notes?.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDescription && !matchesNotes) return false;
    }

    if (taskFilter.category !== 'all' && task.category !== taskFilter.category) {
      return false;
    }

    if (taskFilter.priority !== 'all' && task.priority !== taskFilter.priority) {
      return false;
    }

    if (taskFilter.status === 'active' && task.status === 'completed') {
      return false;
    }
    if (taskFilter.status === 'completed' && task.status !== 'completed') {
      return false;
    }

    return true;
  });

  const openCount = tasks.filter((task) => task.status !== 'completed').length;
  const completedCount = tasks.filter((task) => task.status === 'completed').length;

  return (
    <div className="space-y-4 pb-12 sm:space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-100">
            Your priorities
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <span>{openCount} open</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              {completedCount} completed
            </span>
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-400"
          onClick={() => setQuickTaskModalOpen(true)}
          type="button"
        >
          <Plus className="h-4 w-4" />
          Add task
        </button>
      </div>

      <TaskFilterBar />

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

      <TaskModal
        isOpen={editingTask !== null}
        onClose={() => setEditingTask(null)}
        taskToEdit={editingTask}
      />
    </div>
  );
};
