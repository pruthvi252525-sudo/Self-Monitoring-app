import { TaskCategory, TaskPriority } from './task';

export type TimeBlockStatus = 'scheduled' | 'active' | 'completed' | 'skipped';

export interface TimeBlock {
  id: string;
  taskId?: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  category: TaskCategory;
  priority: TaskPriority;
  status: TimeBlockStatus;
  actualMinutesLogged: number;
  isBreak?: boolean;
  notes?: string;
}

export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

export interface PomodoroSettings {
  focusDuration: number; // in seconds
  shortBreakDuration: number; // in seconds
  longBreakDuration: number; // in seconds
  autoStartBreaks: boolean;
  soundEnabled: boolean;
}

export interface PomodoroSession {
  mode: PomodoroMode;
  timeLeft: number;
  isRunning: boolean;
  activeBlockId: string | null;
  activeTaskId: string | null;
  completedPomodoros: number;
}

export interface AutoScheduleConfig {
  dayStartTime: string; // "08:00"
  dayEndTime: string; // "22:00"
  bufferMinutes: number; // 10
  includeLunch: boolean;
  lunchStartTime: string; // "12:30"
  lunchDurationMinutes: number; // 45
}

