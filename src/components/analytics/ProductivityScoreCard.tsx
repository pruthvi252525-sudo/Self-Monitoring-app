import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Award, Flame, AlertCircle, TrendingUp, CheckCircle } from 'lucide-react';

export const ProductivityScoreCard: React.FC = () => {
  const { tasks, getProductivityScore } = useAppStore();
  const score = getProductivityScore();

  const getTierInfo = (s: number) => {
    if (s >= 90) return { label: 'Mastery Tier', desc: 'Flawless execution of critical priorities', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
    if (s >= 75) return { label: 'Elite Focus', desc: 'Strong high-priority output and cadence', color: 'text-indigo-400', bg: 'bg-indigo-500/10' };
    if (s >= 60) return { label: 'Steady Momentum', desc: 'Consistent progress, watch for slippages', color: 'text-amber-400', bg: 'bg-amber-500/10' };
    return { label: 'Re-calibration Needed', desc: 'Prioritize P1/P2 items to regain control', color: 'text-red-400', bg: 'bg-red-500/10' };
  };

  const tier = getTierInfo(score);

  // Breakdown of points by priority tier
  const priorityWeights = { P1: 40, P2: 30, P3: 20, P4: 10 };
  const breakdown = (['P1', 'P2', 'P3', 'P4'] as const).map((p) => {
    const tierTasks = tasks.filter((t) => t.priority === p);
    const completed = tierTasks.filter((t) => t.status === 'completed').length;
    const total = tierTasks.length;
    const weight = priorityWeights[p];
    return { priority: p, completed, total, weight, rate: total > 0 ? Math.round((completed / total) * 100) : 0 };
  });

  return (
    <div className="bg-dark-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            Weighted Productivity Score
          </h3>
        </div>
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${tier.bg} ${tier.color}`}>
          {tier.label}
        </span>
      </div>

      {/* Main Score Display */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-extrabold font-mono text-slate-100 tracking-tight">
            {score}
          </span>
          <span className="text-slate-400 text-sm font-mono">/ 100 pts</span>
        </div>

        <p className="text-xs text-slate-400 max-w-xs">
          {tier.desc}. Completing P1 (Urgent-Important) accounts for 40% weight, P2 (High) for 30%.
        </p>
      </div>

      {/* Progress meter */}
      <div className="w-full bg-dark-800 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Priority Tier Weight Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {breakdown.map((b) => {
          const colors = {
            P1: 'border-red-500/30 text-red-400',
            P2: 'border-amber-500/30 text-amber-400',
            P3: 'border-blue-500/30 text-blue-400',
            P4: 'border-slate-600/30 text-slate-400',
          }[b.priority];

          return (
            <div
              key={b.priority}
              className={`p-3 rounded-xl bg-dark-850 border ${colors} space-y-1`}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold">{b.priority}</span>
                <span className="text-slate-400 text-[10px]">({b.weight}pts)</span>
              </div>
              <div className="text-base font-bold text-slate-100 font-mono">
                {b.completed}/{b.total}
              </div>
              <div className="text-[10px] text-slate-400">
                {b.rate}% done
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

