import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ProductivityScoreCard } from './ProductivityScoreCard';
import { VelocityCharts } from './VelocityCharts';
import { FocusStreakCard } from './FocusStreakCard';
import { Download } from 'lucide-react';
import { exportDailySummaryAsMarkdown } from '../../utils/exportUtils';
import { getTodayDateString } from '../../utils/dateUtils';

export const AnalyticsDashboard: React.FC = () => {
  const { tasks, timeBlocks } = useAppStore();

  const today = getTodayDateString();

  const handleExportToday = () => {
    const todayBlocks = timeBlocks.filter((b) => b.date === today);
    exportDailySummaryAsMarkdown(today, tasks, todayBlocks);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Action Strip */}
      <div className="bg-dark-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-100">
            Productivity & Velocity Metrics
          </h2>
          <p className="text-xs text-slate-400">
            Task completion, focus time, and productivity trends
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportToday}
            className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Export Today's Summary to Markdown"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Grid of Core Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProductivityScoreCard />
          <VelocityCharts />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <FocusStreakCard />
        </div>
      </div>
    </div>
  );
};
