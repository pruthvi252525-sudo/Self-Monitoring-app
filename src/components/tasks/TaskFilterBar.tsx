import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { TaskCategory, TaskPriority } from '../../types';
import {
  List,
  Grid2X2,
  Kanban,
  X,
  Filter,
} from 'lucide-react';

export const TaskFilterBar: React.FC = () => {
  const {
    taskFilter,
    setTaskFilter,
    resetTaskFilter,
    taskViewMode,
    setTaskViewMode,
    tasks,
  } = useAppStore();

  const categories: (TaskCategory | 'all')[] = ['all', 'Academic', 'Dev Project', 'Personal'];
  const priorities: (TaskPriority | 'all')[] = ['all', 'P1', 'P2', 'P3', 'P4'];
  const statuses: ('all' | 'active' | 'completed')[] = ['all', 'active', 'completed'];

  const hasActiveFilters =
    taskFilter.search !== '' ||
    taskFilter.category !== 'all' ||
    taskFilter.priority !== 'all' ||
    taskFilter.status !== 'all';

  return (
    <div className="bg-dark-900 border border-slate-800 rounded-2xl p-4 space-y-3">
      {/* Top Row: View Switcher & Quick Metrics */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* View Mode Toggle Buttons */}
        <div className="flex items-center p-1 bg-dark-850 rounded-xl border border-slate-800">
          <button
            onClick={() => setTaskViewMode('table')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              taskViewMode === 'table'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-dark-800'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Table List</span>
          </button>

          <button
            onClick={() => setTaskViewMode('eisenhower')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              taskViewMode === 'eisenhower'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-dark-800'
            }`}
          >
            <Grid2X2 className="w-3.5 h-3.5" />
            <span>Eisenhower Matrix</span>
          </button>

          <button
            onClick={() => setTaskViewMode('kanban')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              taskViewMode === 'kanban'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-dark-800'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Kanban Board</span>
          </button>
        </div>

        {/* Status Tab Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setTaskFilter({ status: s })}
              className={`px-3 py-1.5 rounded-xl capitalize font-medium transition-colors ${
                taskFilter.status === s
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-dark-800'
              }`}
            >
              {s}
            </button>
          ))}

          {hasActiveFilters && (
            <button
              onClick={resetTaskFilter}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium border border-red-500/20 ml-2"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Category and Priority Filter Chips */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-slate-800/60">
        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setTaskFilter({ category: cat })}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                taskFilter.category === cat
                  ? 'bg-purple-600/25 text-purple-300 border border-purple-500/40'
                  : 'bg-dark-800 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        {/* Priority Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mr-1">
            Priority:
          </span>
          {priorities.map((p) => {
            const active = taskFilter.priority === p;
            const colors = {
              all: active ? 'bg-slate-700 text-white' : 'bg-dark-800 text-slate-400',
              P1: active ? 'bg-red-500/30 text-red-300 border-red-500/50' : 'bg-dark-800 text-slate-400 hover:text-red-400',
              P2: active ? 'bg-amber-500/30 text-amber-300 border-amber-500/50' : 'bg-dark-800 text-slate-400 hover:text-amber-400',
              P3: active ? 'bg-blue-500/30 text-blue-300 border-blue-500/50' : 'bg-dark-800 text-slate-400 hover:text-blue-400',
              P4: active ? 'bg-slate-500/30 text-slate-300 border-slate-500/50' : 'bg-dark-800 text-slate-400 hover:text-slate-300',
            }[p];

            return (
              <button
                key={p}
                onClick={() => setTaskFilter({ priority: p })}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border border-transparent transition-all ${colors}`}
              >
                {p === 'all' ? 'All' : p}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

