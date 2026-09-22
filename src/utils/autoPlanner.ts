import { Task, TimeBlock, AutoScheduleConfig } from '../types';
import { timeToMinutes, minutesToTime } from './dateUtils';

export interface AutoPlanResult {
  blocks: TimeBlock[];
  scheduledTaskIds: string[];
  unscheduledTasks: Task[];
  totalMinutesScheduled: number;
  warnings: string[];
}

const DEFAULT_CONFIG: AutoScheduleConfig = {
  dayStartTime: '08:00',
  dayEndTime: '22:00',
  bufferMinutes: 10,
  includeLunch: true,
  lunchStartTime: '12:30',
  lunchDurationMinutes: 45,
};

export const autoPlanDay = (
  tasks: Task[],
  targetDate: string,
  existingBlocks: TimeBlock[] = [],
  config: Partial<AutoScheduleConfig> = {}
): AutoPlanResult => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const dayStartMinutes = timeToMinutes(mergedConfig.dayStartTime);
  const dayEndMinutes = timeToMinutes(mergedConfig.dayEndTime);
  const lunchStartMinutes = timeToMinutes(mergedConfig.lunchStartTime);
  const lunchEndMinutes = lunchStartMinutes + mergedConfig.lunchDurationMinutes;

  // Filter pending tasks that are not yet completed
  const pendingTasks = tasks.filter(
    (t) => t.status === 'todo' || t.status === 'in-progress' || t.status === 'rolled-over'
  );

  // Priority ranking score for sorting
  const priorityWeight: Record<string, number> = {
    P1: 4000,
    P2: 3000,
    P3: 2000,
    P4: 1000,
  };

  // Sort candidate tasks:
  // 1. High priority first (P1 > P2 > P3 > P4)
  // 2. Earliest deadline
  // 3. Realistic duration
  const sortedTasks = [...pendingTasks].sort((a, b) => {
    const weightDiff = (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
    if (weightDiff !== 0) return weightDiff;

    const deadlineA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
    const deadlineB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
    if (deadlineA !== deadlineB) return deadlineA - deadlineB;

    return a.estimatedDuration - b.estimatedDuration;
  });

  const newBlocks: TimeBlock[] = [];
  const scheduledTaskIds: string[] = [];
  const unscheduledTasks: Task[] = [];
  const warnings: string[] = [];

  // Identify blocked intervals (existing blocks for targetDate + lunch)
  interface TimeInterval {
    start: number;
    end: number;
    title: string;
    isFixed: boolean;
  }

  const occupiedIntervals: TimeInterval[] = [];

  // Add existing blocks that already exist on targetDate (manual user blocks)
  existingBlocks
    .filter((b) => b.date === targetDate)
    .forEach((b) => {
      occupiedIntervals.push({
        start: timeToMinutes(b.startTime),
        end: timeToMinutes(b.endTime),
        title: b.title,
        isFixed: true,
      });
    });

  // Add lunch if configured and not already conflicting
  if (mergedConfig.includeLunch) {
    const hasLunchConflict = occupiedIntervals.some(
      (int) => Math.max(int.start, lunchStartMinutes) < Math.min(int.end, lunchEndMinutes)
    );
    if (!hasLunchConflict) {
      occupiedIntervals.push({
        start: lunchStartMinutes,
        end: lunchEndMinutes,
        title: '🍽️ Lunch & Mental Reset',
        isFixed: true,
      });
      // Also register lunch block in newBlocks
      newBlocks.push({
        id: `lunch-${targetDate}`,
        title: '🍽️ Lunch & Mental Reset',
        date: targetDate,
        startTime: mergedConfig.lunchStartTime,
        endTime: minutesToTime(lunchEndMinutes),
        category: 'Personal',
        priority: 'P4',
        status: 'scheduled',
        actualMinutesLogged: 0,
        isBreak: true,
      });
    }
  }

  // Sort occupied intervals
  occupiedIntervals.sort((a, b) => a.start - b.start);

  let cursor = dayStartMinutes;
  let totalMinutesScheduled = 0;

  for (const task of sortedTasks) {
    const duration = Math.max(15, task.estimatedDuration || 45); // default min 15m
    let allocated = false;

    // Search for a gap between cursor and dayEnd
    while (cursor + duration <= dayEndMinutes) {
      const prospectiveStart = cursor;
      const prospectiveEnd = prospectiveStart + duration;

      // Check if prospective interval overlaps with any occupied interval
      const collision = occupiedIntervals.find(
        (int) => Math.max(int.start, prospectiveStart) < Math.min(int.end, prospectiveEnd)
      );

      if (collision) {
        // Move cursor to the end of collision + buffer
        cursor = collision.end + mergedConfig.bufferMinutes;
      } else {
        // Gap found!
        const blockId = `block-${task.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const block: TimeBlock = {
          id: blockId,
          taskId: task.id,
          title: task.title,
          date: targetDate,
          startTime: minutesToTime(prospectiveStart),
          endTime: minutesToTime(prospectiveEnd),
          category: task.category,
          priority: task.priority,
          status: 'scheduled',
          actualMinutesLogged: 0,
        };

        newBlocks.push(block);
        occupiedIntervals.push({
          start: prospectiveStart,
          end: prospectiveEnd,
          title: task.title,
          isFixed: true,
        });
        occupiedIntervals.sort((a, b) => a.start - b.start);

        scheduledTaskIds.push(task.id);
        totalMinutesScheduled += duration;
        cursor = prospectiveEnd + mergedConfig.bufferMinutes;
        allocated = true;
        break;
      }
    }

    if (!allocated) {
      unscheduledTasks.push(task);
    }
  }

  if (unscheduledTasks.length > 0) {
    warnings.push(
      `Daily capacity limit reached (08:00 - 22:00). ${unscheduledTasks.length} task(s) could not fit today.`
    );
  }

  return {
    blocks: newBlocks.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)),
    scheduledTaskIds,
    unscheduledTasks,
    totalMinutesScheduled,
    warnings,
  };
};

