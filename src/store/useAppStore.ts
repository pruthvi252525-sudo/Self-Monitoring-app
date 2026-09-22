import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Task,
  TaskPriority,
  TaskCategory,
  TaskStatus,
  ChecklistItem,
  ResourceLink,
  WorkspaceAsset,
  TimeBlock,
  TimeBlockStatus,
  PomodoroMode,
  PomodoroSession,
  DailyReview,
  DailyMetric,
  AppWindow,
} from '../types';
import { SEED_TASKS, SEED_BLOCKS, SEED_REVIEWS, SEED_METRICS } from './seedData';
import { autoPlanDay, AutoPlanResult } from '../utils/autoPlanner';
import { getTodayDateString, addMinutesToTime, timeToMinutes } from '../utils/dateUtils';
import confetti from 'canvas-confetti';

export interface TaskFilterState {
  search: string;
  category: TaskCategory | 'all';
  priority: TaskPriority | 'all';
  status: 'all' | 'active' | 'completed';
}

interface AppState {
  // Navigation & Shell
  activeWindow: AppWindow;
  setActiveWindow: (window: AppWindow) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  quickTaskModalOpen: boolean;
  setQuickTaskModalOpen: (open: boolean) => void;
  reviewModalOpen: boolean;
  setReviewModalOpen: (open: boolean) => void;
  exportModalOpen: boolean;
  setExportModalOpen: (open: boolean) => void;
  rolloverModalOpen: boolean;
  setRolloverModalOpen: (open: boolean) => void;

  // Window 1: Task State
  tasks: Task[];
  taskViewMode: 'table' | 'eisenhower' | 'kanban';
  setTaskViewMode: (mode: 'table' | 'eisenhower' | 'kanban') => void;
  taskFilter: TaskFilterState;
  setTaskFilter: (filter: Partial<TaskFilterState>) => void;
  resetTaskFilter: () => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'notes' | 'checklist' | 'resources' | 'assets'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  moveTaskStatus: (id: string, newStatus: TaskStatus) => void;
  changeTaskPriority: (id: string, newPriority: TaskPriority) => void;

  // Window 2: Dynamic Workspace State & Actions
  updateTaskNotes: (taskId: string, notes: string) => void;
  addChecklistItem: (taskId: string, text: string) => void;
  toggleChecklistItem: (taskId: string, itemId: string) => void;
  deleteChecklistItem: (taskId: string, itemId: string) => void;
  addResourceLink: (taskId: string, link: Omit<ResourceLink, 'id' | 'createdAt'>) => void;
  deleteResourceLink: (taskId: string, linkId: string) => void;
  addAsset: (taskId: string, asset: Omit<WorkspaceAsset, 'id' | 'createdAt'>) => void;
  deleteAsset: (taskId: string, assetId: string) => void;

  // Window 3: Smart Scheduler & Time Blocks
  timeBlocks: TimeBlock[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  calendarView: 'day' | 'week';
  setCalendarView: (view: 'day' | 'week') => void;
  addTimeBlock: (block: Omit<TimeBlock, 'id'>) => void;
  updateTimeBlock: (id: string, updates: Partial<TimeBlock>) => void;
  deleteTimeBlock: (id: string) => void;
  updateBlockStatus: (id: string, status: TimeBlockStatus) => void;
  adjustBlockDuration: (id: string, deltaMinutes: number) => void;
  autoPlanMyDay: (date?: string) => AutoPlanResult;

  // Window 3: Pomodoro Focus Widget
  pomodoro: PomodoroSession;
  startPomodoro: () => void;
  pausePomodoro: () => void;
  resetPomodoro: () => void;
  tickPomodoro: () => void;
  switchPomodoroMode: (mode: PomodoroMode) => void;
  setPomodoroBlock: (blockId: string | null, taskId?: string | null) => void;

  // Window 4: Performance & Analytics
  dailyReviews: DailyReview[];
  dailyMetrics: DailyMetric[];
  submitDailyReview: (review: Omit<DailyReview, 'id' | 'createdAt'>) => void;
  getProductivityScore: () => number;
  getTaskVelocityStats: () => {
    completed: number;
    inProgress: number;
    todo: number;
    rolledOver: number;
    total: number;
    completionRate: number;
  };
  getStreakStats: () => {
    currentStreak: number;
    totalFocusHours: number;
    todayFocusMinutes: number;
  };

  // Rollover & Rescheduling
  checkAndPromptOverdueTasks: () => Task[];
  rescheduleTask: (taskId: string, newDeadline: string, newDuration?: number) => void;
  rolloverTaskToToday: (taskId: string) => void;

  // System & Backup
  resetToSeedData: () => void;
  restoreFromBackup: (data: { tasks: Task[]; timeBlocks: TimeBlock[]; dailyReviews?: DailyReview[]; dailyMetrics?: DailyMetric[] }) => void;
}

const DEFAULT_FILTER: TaskFilterState = {
  search: '',
  category: 'all',
  priority: 'all',
  status: 'all',
};

const POMODORO_DURATIONS: Record<PomodoroMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Navigation
      activeWindow: 'tasks',
      setActiveWindow: (window) => set({ activeWindow: window }),
      selectedTaskId: 'task-1',
      setSelectedTaskId: (id) => set({ selectedTaskId: id }),
      quickTaskModalOpen: false,
      setQuickTaskModalOpen: (open) => set({ quickTaskModalOpen: open }),
      reviewModalOpen: false,
      setReviewModalOpen: (open) => set({ reviewModalOpen: open }),
      exportModalOpen: false,
      setExportModalOpen: (open) => set({ exportModalOpen: open }),
      rolloverModalOpen: false,
      setRolloverModalOpen: (open) => set({ rolloverModalOpen: open }),

      // Tasks
      tasks: SEED_TASKS,
      taskViewMode: 'table',
      setTaskViewMode: (mode) => set({ taskViewMode: mode }),
      taskFilter: DEFAULT_FILTER,
      setTaskFilter: (filter) =>
        set((state) => ({ taskFilter: { ...state.taskFilter, ...filter } })),
      resetTaskFilter: () => set({ taskFilter: DEFAULT_FILTER }),

      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          createdAt: new Date().toISOString(),
          status: taskData.status || 'todo',
          notes: '',
          checklist: [],
          resources: [],
          assets: [],
          order: get().tasks.length,
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
        return newTask;
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
          timeBlocks: state.timeBlocks.filter((b) => b.taskId !== id),
        }));
      },

      toggleTaskStatus: (id) => {
        const target = get().tasks.find((t) => t.id === id);
        if (!target) return;
        const willBeComplete = target.status !== 'completed';
        const newStatus: TaskStatus = willBeComplete ? 'completed' : 'in-progress';

        if (willBeComplete) {
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 },
            });
          } catch {
            // gracefully ignore if canvas confetti context fails
          }
        }

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status: newStatus,
                  completedAt: willBeComplete ? new Date().toISOString() : undefined,
                }
              : task
          ),
          timeBlocks: state.timeBlocks.map((block) =>
            block.taskId === id
              ? {
                  ...block,
                  status: willBeComplete ? 'completed' : block.status,
                }
              : block
          ),
        }));
      },

      moveTaskStatus: (id, newStatus) => {
        const willBeComplete = newStatus === 'completed';
        if (willBeComplete) {
          try {
            confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
          } catch {}
        }
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status: newStatus,
                  completedAt: willBeComplete ? new Date().toISOString() : undefined,
                }
              : task
          ),
        }));
      },

      changeTaskPriority: (id, newPriority) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, priority: newPriority } : task
          ),
        }));
      },

      // Workspace Actions
      updateTaskNotes: (taskId, notes) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, notes } : t)),
        }));
      },

      addChecklistItem: (taskId, text) => {
        const newItem: ChecklistItem = {
          id: `chk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          text,
          completed: false,
        };
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, checklist: [...(t.checklist || []), newItem] }
              : t
          ),
        }));
      },

      toggleChecklistItem: (taskId, itemId) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== taskId) return t;
            return {
              ...t,
              checklist: (t.checklist || []).map((item) =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
              ),
            };
          }),
        }));
      },

      deleteChecklistItem: (taskId, itemId) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== taskId) return t;
            return {
              ...t,
              checklist: (t.checklist || []).filter((item) => item.id !== itemId),
            };
          }),
        }));
      },

      addResourceLink: (taskId, linkData) => {
        const newLink: ResourceLink = {
          ...linkData,
          id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, resources: [...(t.resources || []), newLink] }
              : t
          ),
        }));
      },

      deleteResourceLink: (taskId, linkId) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== taskId) return t;
            return {
              ...t,
              resources: (t.resources || []).filter((r) => r.id !== linkId),
            };
          }),
        }));
      },

      addAsset: (taskId, assetData) => {
        const newAsset: WorkspaceAsset = {
          ...assetData,
          id: `ast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, assets: [...(t.assets || []), newAsset] }
              : t
          ),
        }));
      },

      deleteAsset: (taskId, assetId) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== taskId) return t;
            return {
              ...t,
              assets: (t.assets || []).filter((a) => a.id !== assetId),
            };
          }),
        }));
      },

      // Schedule & Time Blocks
      timeBlocks: SEED_BLOCKS,
      selectedDate: getTodayDateString(),
      setSelectedDate: (date) => set({ selectedDate: date }),
      calendarView: 'day',
      setCalendarView: (view) => set({ calendarView: view }),

      addTimeBlock: (blockData) => {
        const newBlock: TimeBlock = {
          ...blockData,
          id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        };
        set((state) => ({
          timeBlocks: [...state.timeBlocks, newBlock].sort(
            (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
          ),
        }));
      },

      updateTimeBlock: (id, updates) => {
        set((state) => ({
          timeBlocks: state.timeBlocks.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        }));
      },

      deleteTimeBlock: (id) => {
        set((state) => ({
          timeBlocks: state.timeBlocks.filter((b) => b.id !== id),
          pomodoro:
            state.pomodoro.activeBlockId === id
              ? { ...state.pomodoro, activeBlockId: null }
              : state.pomodoro,
        }));
      },

      updateBlockStatus: (id, status) => {
        set((state) => ({
          timeBlocks: state.timeBlocks.map((b) =>
            b.id === id ? { ...b, status } : b
          ),
        }));
      },

      adjustBlockDuration: (id, deltaMinutes) => {
        set((state) => {
          return {
            timeBlocks: state.timeBlocks.map((b) => {
              if (b.id !== id) return b;
              const newEnd = addMinutesToTime(b.endTime, deltaMinutes);
              if (timeToMinutes(newEnd) <= timeToMinutes(b.startTime)) return b;
              return { ...b, endTime: newEnd };
            }),
          };
        });
      },

      autoPlanMyDay: (date) => {
        const targetDate = date || get().selectedDate;
        const result = autoPlanDay(get().tasks, targetDate, get().timeBlocks);

        // Merge generated blocks: remove old auto-generated blocks on target date that aren't manual/fixed
        const remainingBlocks = get().timeBlocks.filter((b) => b.date !== targetDate);
        set({
          timeBlocks: [...remainingBlocks, ...result.blocks].sort(
            (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
          ),
        });

        return result;
      },

      // Pomodoro Focus Engine
      pomodoro: {
        mode: 'focus',
        timeLeft: POMODORO_DURATIONS.focus,
        isRunning: false,
        activeBlockId: 'b-2',
        activeTaskId: 'task-1',
        completedPomodoros: 3,
      },

      startPomodoro: () => {
        set((state) => ({
          pomodoro: { ...state.pomodoro, isRunning: true },
        }));
      },

      pausePomodoro: () => {
        set((state) => ({
          pomodoro: { ...state.pomodoro, isRunning: false },
        }));
      },

      resetPomodoro: () => {
        set((state) => ({
          pomodoro: {
            ...state.pomodoro,
            isRunning: false,
            timeLeft: POMODORO_DURATIONS[state.pomodoro.mode],
          },
        }));
      },

      tickPomodoro: () => {
        const { pomodoro, timeBlocks, tasks } = get();
        if (!pomodoro.isRunning) return;

        if (pomodoro.timeLeft > 1) {
          // Decrement by 1s
          set({
            pomodoro: { ...pomodoro, timeLeft: pomodoro.timeLeft - 1 },
          });

          // Accumulate minutes logged every 60s
          if (pomodoro.timeLeft % 60 === 0 && pomodoro.mode === 'focus') {
            if (pomodoro.activeBlockId) {
              set({
                timeBlocks: timeBlocks.map((b) =>
                  b.id === pomodoro.activeBlockId
                    ? { ...b, actualMinutesLogged: (b.actualMinutesLogged || 0) + 1 }
                    : b
                ),
              });
            }
            if (pomodoro.activeTaskId) {
              set({
                tasks: tasks.map((t) =>
                  t.id === pomodoro.activeTaskId
                    ? { ...t, actualDuration: (t.actualDuration || 0) + 1 }
                    : t
                ),
              });
            }
          }
        } else {
          // Timer finished!
          const nextMode: PomodoroMode =
            pomodoro.mode === 'focus'
              ? (pomodoro.completedPomodoros + 1) % 4 === 0
                ? 'longBreak'
                : 'shortBreak'
              : 'focus';

          try {
            confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
          } catch {}

          set({
            pomodoro: {
              ...pomodoro,
              mode: nextMode,
              timeLeft: POMODORO_DURATIONS[nextMode],
              isRunning: false,
              completedPomodoros:
                pomodoro.mode === 'focus'
                  ? pomodoro.completedPomodoros + 1
                  : pomodoro.completedPomodoros,
            },
          });
        }
      },

      switchPomodoroMode: (mode) => {
        set((state) => ({
          pomodoro: {
            ...state.pomodoro,
            mode,
            timeLeft: POMODORO_DURATIONS[mode],
            isRunning: false,
          },
        }));
      },

      setPomodoroBlock: (blockId, taskId) => {
        const matchedBlock = get().timeBlocks.find((b) => b.id === blockId);
        set((state) => ({
          pomodoro: {
            ...state.pomodoro,
            activeBlockId: blockId,
            activeTaskId: taskId || matchedBlock?.taskId || null,
          },
        }));
      },

      // Analytics & Accountability
      dailyReviews: SEED_REVIEWS,
      dailyMetrics: SEED_METRICS,

      submitDailyReview: (reviewData) => {
        const newReview: DailyReview = {
          ...reviewData,
          id: `rev-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          dailyReviews: [
            newReview,
            ...state.dailyReviews.filter((r) => r.date !== reviewData.date),
          ],
          reviewModalOpen: false,
        }));
        try {
          confetti({ particleCount: 100, spread: 100 });
        } catch {}
      },

      getProductivityScore: () => {
        const { tasks } = get();
        if (tasks.length === 0) return 100;

        const priorityMultiplier: Record<TaskPriority, number> = {
          P1: 40,
          P2: 30,
          P3: 20,
          P4: 10,
        };

        let totalAvailablePoints = 0;
        let pointsEarned = 0;

        tasks.forEach((t) => {
          const weight = priorityMultiplier[t.priority] || 10;
          totalAvailablePoints += weight;
          if (t.status === 'completed') {
            pointsEarned += weight;
          } else if (t.status === 'in-progress') {
            pointsEarned += weight * 0.4;
          }
        });

        if (totalAvailablePoints === 0) return 100;
        return Math.min(100, Math.round((pointsEarned / totalAvailablePoints) * 100));
      },

      getTaskVelocityStats: () => {
        const { tasks } = get();
        const total = tasks.length;
        if (total === 0) {
          return { completed: 0, inProgress: 0, todo: 0, rolledOver: 0, total: 0, completionRate: 0 };
        }

        const completed = tasks.filter((t) => t.status === 'completed').length;
        const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
        const rolledOver = tasks.filter((t) => t.status === 'rolled-over').length;
        const todo = tasks.filter((t) => t.status === 'todo').length;
        const completionRate = Math.round((completed / total) * 100);

        return { completed, inProgress, todo, rolledOver, total, completionRate };
      },

      getStreakStats: () => {
        const { dailyMetrics, timeBlocks } = get();
        const todayMinutes = timeBlocks
          .filter((b) => b.date === getTodayDateString())
          .reduce((acc, b) => acc + (b.actualMinutesLogged || 0), 0);

        const pastMinutes = dailyMetrics.reduce((acc, m) => acc + m.focusMinutes, 0);
        const totalFocusHours = Number(((pastMinutes + todayMinutes) / 60).toFixed(1));

        return {
          currentStreak: 4, // 4-day active streak from seeds
          totalFocusHours,
          todayFocusMinutes: todayMinutes || 90,
        };
      },

      checkAndPromptOverdueTasks: () => {
        const now = new Date().getTime();
        const overdue = get().tasks.filter((t) => {
          if (t.status === 'completed') return false;
          if (!t.deadline) return false;
          return new Date(t.deadline).getTime() < now;
        });
        return overdue;
      },

      rescheduleTask: (taskId, newDeadline, newDuration) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  deadline: newDeadline,
                  estimatedDuration: newDuration || t.estimatedDuration,
                  status: t.status === 'rolled-over' ? 'todo' : t.status,
                }
              : t
          ),
        }));
      },

      rolloverTaskToToday: (taskId) => {
        const todayStr = getTodayDateString();
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  deadline: `${todayStr}T21:00:00`,
                  status: 'rolled-over',
                }
              : t
          ),
        }));
      },

      resetToSeedData: () => {
        set({
          tasks: SEED_TASKS,
          timeBlocks: SEED_BLOCKS,
          dailyReviews: SEED_REVIEWS,
          dailyMetrics: SEED_METRICS,
          selectedTaskId: 'task-1',
          activeWindow: 'tasks',
        });
      },

      restoreFromBackup: (data) => {
        if (data.tasks) set({ tasks: data.tasks });
        if (data.timeBlocks) set({ timeBlocks: data.timeBlocks });
        if (data.dailyReviews) set({ dailyReviews: data.dailyReviews });
        if (data.dailyMetrics) set({ dailyMetrics: data.dailyMetrics });
      },
    }),
    {
      name: 'self_monitoring_app_storage_v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

