import React, { useRef, useState } from 'react';
import { Modal } from '../common/Modal';
import { useAppStore } from '../../store/useAppStore';
import {
  exportAppStateAsJson,
  exportTaskWorkspaceAsMarkdown,
  exportDailySummaryAsMarkdown,
} from '../../utils/exportUtils';
import { Download, Upload, FileText, Check, AlertCircle } from 'lucide-react';
import { getTodayDateString } from '../../utils/dateUtils';

export const ExportModal: React.FC = () => {
  const {
    exportModalOpen,
    setExportModalOpen,
    tasks,
    timeBlocks,
    dailyMetrics,
    dailyReviews,
    selectedTaskId,
    restoreFromBackup,
  } = useAppStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || tasks[0];
  const today = getTodayDateString();
  const todayReview = dailyReviews.find((r) => r.date === today);

  const handleExportJson = () => {
    exportAppStateAsJson({
      tasks,
      timeBlocks,
      dailyMetrics,
      dailyReviews,
      exportedAt: new Date().toISOString(),
    });
  };

  const handleExportWorkspaceMarkdown = () => {
    if (!selectedTask) return;
    exportTaskWorkspaceAsMarkdown(selectedTask);
  };

  const handleExportDayMarkdown = () => {
    const todayBlocks = timeBlocks.filter((b) => b.date === today);
    exportDailySummaryAsMarkdown(today, tasks, todayBlocks, todayReview);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.tasks && Array.isArray(json.tasks)) {
          restoreFromBackup(json);
          setImportStatus('Backup successfully restored!');
          setTimeout(() => {
            setImportStatus(null);
            setExportModalOpen(false);
          }, 1500);
        } else {
          setImportStatus('Invalid backup file structure.');
        }
      } catch {
        setImportStatus('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Modal
      isOpen={exportModalOpen}
      onClose={() => setExportModalOpen(false)}
      title="Export, Backup & Data Portability"
      subtitle="Export offline markdown reports or create full JSON database backups"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Full JSON Backup & Restore */}
        <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-3">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Complete Database Backup (JSON)</span>
          </h4>
          <p className="text-xs text-slate-400">
            Save all tasks, notes, time blocks, Pomodoro logs, and daily reviews into a single JSON file.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleExportJson}
              className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON Backup</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-2 px-3 rounded-xl bg-dark-750 hover:bg-dark-700 text-slate-200 border border-slate-600 font-medium text-xs flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Restore Backup</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {importStatus && (
            <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>{importStatus}</span>
            </div>
          )}
        </div>

        {/* Markdown Exports */}
        <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-4">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            <span>Markdown Reports (Notion / Obsidian Ready)</span>
          </h4>

          <div className="space-y-3">
            {/* Task Markdown */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-dark-800 border border-slate-700/50">
              <div className="min-w-0 pr-3">
                <div className="text-xs font-semibold text-slate-200 truncate">
                  Active Task Workspace Notes
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {selectedTask ? selectedTask.title : 'No task selected'}
                </div>
              </div>
              <button
                onClick={handleExportWorkspaceMarkdown}
                disabled={!selectedTask}
                className="py-1.5 px-3 rounded-lg bg-dark-700 hover:bg-dark-600 text-purple-300 font-medium text-xs flex items-center gap-1 flex-shrink-0 disabled:opacity-40"
              >
                <Download className="w-3 h-3" />
                <span>Export .md</span>
              </button>
            </div>

            {/* Daily Summary Markdown */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-dark-800 border border-slate-700/50">
              <div className="min-w-0 pr-3">
                <div className="text-xs font-semibold text-slate-200 truncate">
                  Daily Productivity & Accountability Report
                </div>
                <div className="text-[11px] text-slate-400">
                  Today ({today}) schedule, completed tasks, and review reflection
                </div>
              </div>
              <button
                onClick={handleExportDayMarkdown}
                className="py-1.5 px-3 rounded-lg bg-dark-700 hover:bg-dark-600 text-purple-300 font-medium text-xs flex items-center gap-1 flex-shrink-0"
              >
                <Download className="w-3 h-3" />
                <span>Export .md</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

