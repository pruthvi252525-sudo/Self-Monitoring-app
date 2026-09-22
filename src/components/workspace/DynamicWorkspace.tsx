import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { PriorityBadge, CategoryBadge, StatusBadge } from '../common/Badge';
import { MarkdownNotes } from './MarkdownNotes';
import { ResourceLinks } from './ResourceLinks';
import { AssetGallery } from './AssetGallery';
import { SubtaskChecklist } from './SubtaskChecklist';
import { formatDeadlineRemaining } from '../../utils/dateUtils';
import { exportTaskWorkspaceAsMarkdown } from '../../utils/exportUtils';
import {
  Clock,
  Download,
  CalendarPlus,
  Play,
  CheckCircle2,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { TaskStatus } from '../../types';

export const DynamicWorkspace: React.FC = () => {
  const {
    tasks,
    selectedTaskId,
    setSelectedTaskId,
    moveTaskStatus,
    setPomodoroBlock,
    setActiveWindow,
  } = useAppStore();

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || tasks[0];

  if (!selectedTask) {
    return (
      <div className="bg-dark-900 border border-slate-800 rounded-2xl p-12 text-center">
        <Layers className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-200">No Task Selected</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Select or create a task from the Task Command Center to open its dedicated workspace.
        </p>
      </div>
    );
  }

  const deadlineDiff = formatDeadlineRemaining(selectedTask.deadline);

  const handleStartFocus = () => {
    setPomodoroBlock(null, selectedTask.id);
    setActiveWindow('scheduler');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar: Task Switcher Dropdown & Header Card */}
      <div className="bg-dark-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        {/* Task Selector & Quick Switch */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Context Hub:</span>
            <div className="relative">
              <select
                value={selectedTask.id}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="bg-dark-850 border border-slate-700 rounded-xl pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-100 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
              >
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    [{t.priority}] {t.title} ({t.category})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Focus Session Trigger */}
            <button
              onClick={handleStartFocus}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Focus Timer</span>
            </button>

            {/* Markdown Export */}
            <button
              onClick={() => exportTaskWorkspaceAsMarkdown(selectedTask)}
              className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white border border-slate-700 font-medium text-xs flex items-center gap-1.5"
              title="Export Task Notes & Checklist to Markdown"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .md</span>
            </button>
          </div>
        </div>

        {/* Task Title & Metadata Strip */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <PriorityBadge priority={selectedTask.priority} />
              <CategoryBadge category={selectedTask.category} />
              <StatusBadge status={selectedTask.status} />
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded-md font-semibold ${
                  deadlineDiff.isLate
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : deadlineDiff.isUrgent
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-dark-800 text-slate-300'
                }`}
              >
                {deadlineDiff.label}
              </span>
            </div>

            <h1 className="text-xl font-bold text-slate-100">
              {selectedTask.title}
            </h1>

            {selectedTask.description && (
              <p className="text-xs text-slate-400 leading-relaxed">
                {selectedTask.description}
              </p>
            )}
          </div>

          {/* Quick Status Changers */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono bg-dark-850 p-2 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Estimate: <strong className="text-slate-200">{selectedTask.estimatedDuration}m</strong></span>
              </div>
              <div className="border-l border-slate-700 pl-3">
                <span>Logged: <strong className="text-indigo-400">{selectedTask.actualDuration || 0}m</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 mr-1">Status:</span>
              {(['todo', 'in-progress', 'completed'] as TaskStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => moveTaskStatus(selectedTask.id, st)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                    selectedTask.status === st
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-dark-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Markdown Notes Editor with Live Preview */}
        <div className="lg:col-span-7 space-y-6">
          <MarkdownNotes taskId={selectedTask.id} notes={selectedTask.notes} />
          <AssetGallery taskId={selectedTask.id} assets={selectedTask.assets || []} />
        </div>

        {/* Right Column (5 cols): Checklist & Resource Links */}
        <div className="lg:col-span-5 space-y-6">
          <SubtaskChecklist
            taskId={selectedTask.id}
            checklist={selectedTask.checklist || []}
          />
          <ResourceLinks
            taskId={selectedTask.id}
            resources={selectedTask.resources || []}
          />
        </div>
      </div>
    </div>
  );
};

