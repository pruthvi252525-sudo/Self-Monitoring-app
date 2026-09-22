import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Flame, Clock, BookOpen, Code2, User, Zap } from 'lucide-react';

export const FocusStreakCard: React.FC = () => {
  const { getStreakStats, tasks, timeBlocks } = useAppStore();
  const streak = getStreakStats();

  // Calculate focus distribution by category from tasks and time blocks
  const categoryTime = {
    Academic: 0,
    'Dev Project': 0,
    Personal: 0,
  };

  tasks.forEach((t) => {
    const mins = (t.actualDuration || 0) + (t.status === 'completed' ? t.estimatedDuration : 0);
    categoryTime[t.category] = (categoryTime[t.category] || 0) + mins;
  });

  const totalMinutes = Math.max(1, categoryTime.Academic + categoryTime['Dev Project'] + categoryTime.Personal);

  const categories = [
    {
      name: 'Academic Coursework',
      mins: categoryTime.Academic,
      pct: Math.round((categoryTime.Academic / totalMinutes) * 100),
      color: 'bg-purple-500',
      textColor: 'text-purple-400',
      icon: BookOpen,
    },
    {
      name: 'Dev Projects',
      mins: categoryTime['Dev Project'],
      pct: Math.round((categoryTime['Dev Project'] / totalMinutes) * 100),
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      icon: Code2,
    },
    {
      name: 'Personal Habits & Health',
      mins: categoryTime.Personal,
      pct: Math.round((categoryTime.Personal / totalMinutes) * 100),
      color: 'bg-pink-500',
      textColor: 'text-pink-400',
      icon: User,
    },
  ];

  return (
    <div className="bg-dark-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-semibold text-slate-100">
            Streak & Focus Allocation
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
          <Zap className="w-3.5 h-3.5" />
          <span>{streak.currentStreak} Day Streak</span>
        </div>
      </div>

      {/* Focus Hours Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Total Focus Hours</span>
          </span>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {streak.totalFocusHours} <span className="text-sm text-slate-400 font-normal">hrs</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Active Sprint Days</span>
          </span>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {streak.currentStreak} <span className="text-sm text-slate-400 font-normal">days</span>
          </div>
        </div>
      </div>

      {/* Category Focus Breakdown */}
      <div className="space-y-3 pt-1">
        <h4 className="text-xs font-semibold text-slate-300">
          Focus Distribution by Domain
        </h4>

        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${cat.textColor}`} />
                  <span className="text-slate-300">{cat.name}</span>
                </div>
                <div className="font-mono text-slate-400">
                  <span className="text-slate-200 font-semibold">{cat.mins}m</span> ({cat.pct}%)
                </div>
              </div>
              <div className="w-full bg-dark-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`${cat.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${cat.pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

