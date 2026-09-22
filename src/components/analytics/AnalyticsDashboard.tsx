import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ProductivityScoreCard } from './ProductivityScoreCard';
import { VelocityCharts } from './VelocityCharts';
import { FocusStreakCard } from './FocusStreakCard';
import { Star, Trophy, AlertCircle, BookOpen, Plus, Calendar, Download } from 'lucide-react';
import { exportDailySummaryAsMarkdown } from '../../utils/exportUtils';
import { getTodayDateString } from '../../utils/dateUtils';

export const AnalyticsDashboard: React.FC = () => {
  const {
    dailyReviews,
    setReviewModalOpen,
    tasks,
    timeBlocks,
  } = useAppStore();

  const today = getTodayDateString();
  const todayReview = dailyReviews.find((r) => r.date === today);

  const handleExportToday = () => {
    const todayBlocks = timeBlocks.filter((b) => b.date === today);
    exportDailySummaryAsMarkdown(today, tasks, todayBlocks, todayReview);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Action Strip */}
      <div className="bg-dark-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-100">
            Accountability & Velocity Metrics
          </h2>
          <p className="text-xs text-slate-400">
            Weighted performance analytics and end-of-day reflection logs
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

          <button
            onClick={() => setReviewModalOpen(true)}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
          >
            <Star className="w-4 h-4 fill-current" />
            <span>{todayReview ? 'Update Today’s Reflection' : 'Log Daily Review'}</span>
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

      {/* Daily Reflection Journal & Review History */}
      <div className="bg-dark-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Daily Post-Day Review & Reflection Journal
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {dailyReviews.length} entries recorded
          </span>
        </div>

        {dailyReviews.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs italic">
            No reflections logged yet. Click "Log Daily Review" to reflect on your milestones and blockers today.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dailyReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl bg-dark-850 border border-slate-700/60 space-y-3 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-current text-amber-400' : 'text-slate-700'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-mono font-bold ml-1 text-slate-200">
                      {rev.rating}/5
                    </span>
                  </div>

                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{rev.date}</span>
                  </span>
                </div>

                {rev.wins && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      <span>Wins:</span>
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed pl-4 border-l border-amber-500/30">
                      {rev.wins}
                    </p>
                  </div>
                )}

                {rev.blockers && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-red-300 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-red-400" />
                      <span>Blockers:</span>
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed pl-4 border-l border-red-500/30">
                      {rev.blockers}
                    </p>
                  </div>
                )}

                {rev.notes && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-indigo-300 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-indigo-400" />
                      <span>Action Items for Tomorrow:</span>
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed pl-4 border-l border-indigo-500/30 italic">
                      {rev.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

