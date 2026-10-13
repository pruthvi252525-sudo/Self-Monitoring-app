import { TaskCategory } from './task';

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
