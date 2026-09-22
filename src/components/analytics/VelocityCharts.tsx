import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Activity, CheckCircle2, Clock, RotateCcw, AlertTriangle } from 'lucide-react';

export const VelocityCharts: React.FC = () => {
  const { getTaskVelocityStats, tasks } = useAppStore();
  const velocity = getTaskVelocityStats();

  const metrics = [
    {
      label: 'Completed On-Time',
      count: velocity.completed,
      pct: velocity.total > 0 ? Math.round((velocity.completed / velocity.total) * 100) : 0,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      icon: CheckCircle2,
    },
    {
      label: 'In Progress / Active',
      count: velocity.inProgress,
      pct: velocity.total > 0 ? Math.round((velocity.inProgress / velocity.total) * 100) : 0,
      color: 'bg-blue-500',
      textColor: 'text-blue-400',
      icon: Activity,
    },
    {
      label: 'Pending To-Do',
      count: velocity.todo,
      pct: velocity.total > 0 ? Math.round((velocity.todo / velocity.total) * 100) : 0,
      color: 'bg-slate-500',
      textColor: 'text-slate-400',
      icon: Clock,
    },
    {
      label: 'Rolled Over',
      count: velocity.rolledOver,
      pct: velocity.total > 0 ? Math.round((velocity.rolledOver / velocity.total) * 100) : 0,
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      icon: RotateCcw,
    },
  ];

  return (
    <div className="bg-dark-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            Task Velocity & Completion Rate
          </h3>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-400">
          {velocity.completionRate}% Done
        </span>
      </div>

      {/* Stacked Percentage Bar */}
      <div>
        <div className="w-full bg-dark-800 h-3 rounded-full overflow-hidden flex">
          {metrics.map((m, i) => (
            <div
              key={i}
              className={`${m.color} h-full transition-all duration-500`}
              style={{ width: `${m.pct}%` }}
              title={`${m.label}: ${m.count} (${m.pct}%)`}
            />
          ))}
        </div>
      </div>

      {/* Metrics Breakdown List */}
      <div className="space-y-3">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-xl bg-dark-850 border border-slate-800/80 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${m.color}`} />
                <span className="text-slate-300 font-medium">{m.label}</span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-slate-400">{m.count} tasks</span>
                <span className={`font-bold ${m.textColor}`}>{m.pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

