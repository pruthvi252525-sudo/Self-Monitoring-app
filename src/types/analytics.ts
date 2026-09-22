import { TaskCategory } from './task';

export interface DailyReview {
  id: string;
  date: string; // YYYY-MM-DD
  rating: number; // 1 - 5 stars
  wins: string;
  blockers: string;
  notes: string;
  createdAt: string;
}

export interface DailyMetric {
  date: string;
  tasksPlanned: number;
  tasksCompleted: number;
  tasksOverdue: number;
  tasksRolledOver: number;
  focusMinutes: number;
  productivityScore: number;
  categoryBreakdown: {
    Academic: number;
    'Dev Project': number;
    Personal: number;
  };
}

export interface AccountabilityStats {
  currentStreak: number;
  longestStreak: number;
  totalFocusHours: number;
  totalTasksCompleted: number;
  overallVelocity: number; // percentage
  averageProductivityScore: number;
  lastActiveDate: string;
}

