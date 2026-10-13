import React, { useState } from 'react';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { TaskCategory, TaskPriority } from '../../types';

export const TaskFilterBar: React.FC = () => {
  const {
    taskFilter,
    setTaskFilter,
    resetTaskFilter,
    taskViewMode,
    setTaskViewMode,
  } = useAppStore();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const hasAdvancedFilters =
    taskFilter.category !== 'all' || taskFilter.priority !== 'all';
  const hasActiveFilters = hasAdvancedFilters || taskFilter.status !== 'all';
  const statuses: { value: 'all' | 'active' | 'completed'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Open' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800/80 bg-dark-900">
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:px-4">
        <div className="flex items-center gap-1 rounded-xl bg-dark-850 p-1">
          {statuses.map((status) => (
            <button
              aria-pressed={taskFilter.status === status.value}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                taskFilter.status === status.value
                  ? 'bg-dark-700 text-slate-100'
                  : 'text-slate-500 hover:text-slate-200'
              }`}
              key={status.value}
              onClick={() => setTaskFilter({ status: status.value })}
              type="button"
            >
              {status.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label className="relative">
            <span className="sr-only">Task view</span>
            <select
              className="app-search appearance-none rounded-xl border py-2 pl-3 pr-8 text-xs font-medium text-slate-300 focus:border-indigo-400/50 focus:outline-none"
              onChange={(event) =>
                setTaskViewMode(event.target.value as 'table' | 'eisenhower' | 'kanban')
              }
              value={taskViewMode}
            >
              <option value="table">List view</option>
              <option value="kanban">Board view</option>
              <option value="eisenhower">Priority view</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          </label>

          <button
            aria-expanded={filtersOpen}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition ${
              filtersOpen || hasAdvancedFilters
                ? 'border-indigo-400/20 bg-indigo-400/[0.08] text-indigo-200'
                : 'border-white/[0.07] text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
            }`}
            onClick={() => setFiltersOpen((open) => !open)}
            type="button"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {hasAdvancedFilters && <span className="h-1.5 w-1.5 rounded-full bg-indigo-300" />}
          </button>
          {hasActiveFilters && (
            <button
              aria-label="Clear filters"
              className="rounded-lg p-2 text-slate-500 transition hover:bg-white/[0.05] hover:text-slate-200"
              onClick={resetTaskFilter}
              title="Clear filters"
              type="button"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="flex flex-wrap gap-4 border-t border-slate-800/70 px-4 py-3">
          <FilterSelect
            label="Category"
            onChange={(category) => setTaskFilter({ category })}
            options={[
              ['all', 'All categories'],
              ['Academic', 'Academic'],
              ['Dev Project', 'Dev project'],
              ['Personal', 'Personal'],
            ]}
            value={taskFilter.category}
          />
          <FilterSelect
            label="Priority"
            onChange={(priority) => setTaskFilter({ priority })}
            options={[
              ['all', 'All priorities'],
              ['P1', 'P1 · Urgent'],
              ['P2', 'P2 · High'],
              ['P3', 'P3 · Normal'],
              ['P4', 'P4 · Low'],
            ]}
            value={taskFilter.priority}
          />
        </div>
      )}
    </section>
  );
};

interface FilterSelectProps<T extends string> {
  label: string;
  options: [T, string][];
  value: T;
  onChange: (value: T) => void;
}

const FilterSelect = <T extends TaskCategory | TaskPriority | 'all'>({
  label,
  options,
  value,
  onChange,
}: FilterSelectProps<T>) => (
  <label className="flex items-center gap-2 text-xs text-slate-500">
    {label}
    <select
      className="app-search rounded-lg border px-2.5 py-1.5 text-xs text-slate-300 focus:border-indigo-400/50 focus:outline-none"
      onChange={(event) => onChange(event.target.value as T)}
      value={value}
    >
      {options.map(([optionValue, optionLabel]) => (
        <option key={optionValue} value={optionValue}>
          {optionLabel}
        </option>
      ))}
    </select>
  </label>
);
