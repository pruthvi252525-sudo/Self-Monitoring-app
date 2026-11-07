import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  Plus,
  Sparkles,
} from 'lucide-react';
import { Task } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { getTodayDateString } from '../../utils/dateUtils';
import { TaskModal } from '../tasks/TaskModal';

const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const getTaskDate = (task: Task) => {
  if (!task.deadline) return '';
  const date = new Date(task.deadline);
  return Number.isNaN(date.getTime()) ? '' : dateKey(date);
};

const shiftMonth = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth() + amount, 1);

const formatTaskTime = (deadline: string) => {
  const date = new Date(deadline);
  return Number.isNaN(date.getTime())
    ? 'No time set'
    : new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(date);
};

const priorityColors: Record<Task['priority'], string> = {
  P1: 'bg-rose-400',
  P2: 'bg-amber-300',
  P3: 'bg-sky-300',
  P4: 'bg-emerald-300',
};

export const CreativeCalendar: React.FC = () => {
  const { tasks, selectedDate, setSelectedDate, toggleTaskStatus } = useAppStore();
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const [year, month] = selectedDate.split('-').map(Number);
    return new Date(year, month - 1, 1);
  });
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const monthLabel = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    year: 'numeric',
  }).format(visibleMonth);
  const today = getTodayDateString();
  const tasksByDate = useMemo(() => {
    const grouped = new Map<string, Task[]>();
    tasks.forEach((task) => {
      const date = getTaskDate(task);
      if (!date) return;
      const dayTasks = grouped.get(date) ?? [];
      dayTasks.push(task);
      grouped.set(date, dayTasks);
    });
    grouped.forEach((dayTasks) =>
      dayTasks.sort((a, b) => a.deadline.localeCompare(b.deadline))
    );
    return grouped;
  }, [tasks]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const gridStart = new Date(firstDay);
    gridStart.setDate(firstDay.getDate() - firstDay.getDay());
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);
      return date;
    });
  }, [visibleMonth]);

  const selectedTasks = tasksByDate.get(selectedDate) ?? [];
  const openNewTask = () => {
    setTaskToEdit(null);
    setTaskModalOpen(true);
  };
  const openTask = (task: Task) => {
    setTaskToEdit(task);
    setTaskModalOpen(true);
  };
  const navigateMonth = (amount: number) => {
    const month = shiftMonth(visibleMonth, amount);
    setVisibleMonth(month);
    setSelectedDate(dateKey(month));
  };

  return (
    <div className="space-y-5 pb-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-indigo-950/70 via-[#171829] to-[#102226] p-5 sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-indigo-200">
              <Sparkles className="h-4 w-4" />
              Your time, thoughtfully arranged
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {monthLabel}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {tasks.length ? 'See what’s coming and make room for what matters.' : 'Add a task to start shaping your month.'}
            </p>
          </div>
          <button
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-500 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-950/40 transition hover:bg-indigo-400 active:scale-[0.98]"
            onClick={openNewTask}
            type="button"
          >
            <Plus className="h-4 w-4" />
            Add task
          </button>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                aria-label="Previous month"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                onClick={() => navigateMonth(-1)}
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                aria-label="Next month"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                onClick={() => navigateMonth(1)}
                type="button"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <span className="ml-1 text-sm font-semibold text-slate-100">{monthLabel}</span>
            </div>
            <button
              className="min-h-10 rounded-xl border border-indigo-300/15 px-3 text-xs font-medium text-indigo-200 transition hover:bg-indigo-300/10"
              onClick={() => {
                const now = new Date();
                setVisibleMonth(new Date(now.getFullYear(), now.getMonth(), 1));
                setSelectedDate(today);
              }}
              type="button"
            >
              Today
            </button>
          </div>

          <div className="grid grid-cols-7 border-b border-white/[0.07] pb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div className="py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs" key={day}>
                <span className="sm:hidden">{day.slice(0, 1)}</span>
                <span className="hidden sm:inline">{day}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((date) => {
              const key = dateKey(date);
              const dayTasks = tasksByDate.get(key) ?? [];
              const inMonth = date.getMonth() === visibleMonth.getMonth();
              const isSelected = key === selectedDate;
              const isToday = key === today;
              return (
                <button
                  aria-label={`${date.toLocaleDateString(undefined, { dateStyle: 'full' })}, ${dayTasks.length} tasks`}
                  aria-pressed={isSelected}
                  className={`group relative flex min-h-[4.25rem] min-w-0 flex-col items-center border-b border-r border-white/[0.055] px-0.5 py-2 text-center transition sm:min-h-[6.25rem] sm:items-stretch sm:px-2 sm:py-2.5 ${
                    isSelected ? 'bg-indigo-400/[0.12]' : 'hover:bg-white/[0.045]'
                  } ${!inMonth ? 'opacity-35' : ''}`}
                  key={key}
                  onClick={() => setSelectedDate(key)}
                  type="button"
                >
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs sm:h-8 sm:w-8 sm:text-sm ${
                    isToday
                      ? 'bg-indigo-400 font-semibold text-white'
                      : isSelected
                        ? 'font-semibold text-indigo-100'
                        : 'text-slate-300'
                  }`}>
                    {date.getDate()}
                  </span>
                  <span className="mt-1 hidden min-w-0 space-y-1 sm:block">
                    {dayTasks.slice(0, 2).map((task) => (
                      <span
                        className={`block truncate rounded-md px-1.5 py-0.5 text-left text-[10px] ${
                          task.status === 'completed'
                            ? 'bg-emerald-400/10 text-emerald-200/70 line-through'
                            : 'bg-white/[0.055] text-slate-300'
                        }`}
                        key={task.id}
                      >
                        <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${priorityColors[task.priority]}`} />
                        {task.title}
                      </span>
                    ))}
                    {dayTasks.length > 2 && (
                      <span className="block text-left text-[10px] text-slate-500">+{dayTasks.length - 2} more</span>
                    )}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="mt-1 flex items-center gap-0.5 sm:hidden" aria-hidden="true">
                      {dayTasks.slice(0, 3).map((task) => (
                        <span className={`h-1 w-1 rounded-full ${priorityColors[task.priority]}`} key={task.id} />
                      ))}
                      {dayTasks.length > 3 && <span className="text-[8px] text-slate-400">+</span>}
                    </span>
                  )}
                  {isSelected && <span className="absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-indigo-300 sm:inset-x-2" />}
                </button>
              );
            })}
          </div>
          <p className="mt-3 flex items-center gap-2 px-1 text-[10px] leading-4 text-slate-500 sm:text-xs">
            <Circle className="h-2.5 w-2.5 fill-indigo-300 text-indigo-300" />
            Select a day to see its tasks. On larger screens, task titles appear in the calendar.
          </p>
        </section>

        <aside className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-indigo-200">
                {selectedDate === today ? 'Today' : new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(new Date(`${selectedDate}T12:00:00`))}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-white">
                {new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric' }).format(new Date(`${selectedDate}T12:00:00`))}
              </h2>
            </div>
            <CalendarDays className="mt-1 h-5 w-5 text-slate-500" />
          </div>

          <div className="mt-4 flex items-center justify-between border-b border-white/[0.07] pb-3">
            <span className="text-xs text-slate-400">{selectedTasks.length} {selectedTasks.length === 1 ? 'task' : 'tasks'}</span>
            <button
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-indigo-200 transition hover:bg-indigo-300/10"
              onClick={openNewTask}
              type="button"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>

          {selectedTasks.length === 0 ? (
            <div className="flex min-h-44 flex-col items-center justify-center px-3 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.045] text-slate-500">
                <CalendarDays className="h-5 w-5" />
              </span>
              <p className="mt-3 text-sm font-medium text-slate-300">A little breathing room</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">No tasks on this day yet. Add one when you’re ready.</p>
              <button
                className="mt-3 inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-white/[0.09] px-3 text-xs text-slate-300 transition hover:bg-white/[0.06]"
                onClick={openNewTask}
                type="button"
              >
                Plan this day <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <ul className="mt-2 space-y-2">
              {selectedTasks.map((task) => (
                <li className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3" key={task.id}>
                  <button
                    aria-label={task.status === 'completed' ? `Reopen ${task.title}` : `Complete ${task.title}`}
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                      task.status === 'completed'
                        ? 'border-emerald-400 bg-emerald-400 text-[#101118]'
                        : 'border-slate-600 text-transparent hover:border-indigo-300 hover:text-indigo-200'
                    }`}
                    onClick={() => toggleTaskStatus(task.id)}
                    type="button"
                  >
                    {task.status === 'completed' ? <Check className="h-3 w-3" /> : <Circle className="h-2 w-2 fill-current" />}
                  </button>
                  <button className="min-w-0 flex-1 text-left" onClick={() => openTask(task)} type="button">
                    <span className={`block break-words text-sm font-medium ${
                      task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-200'
                    }`}>
                      {task.title}
                    </span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-500">
                      <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" />{formatTaskTime(task.deadline)}</span>
                      <span>{task.category}</span>
                    </span>
                  </button>
                  <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${priorityColors[task.priority]}`} title={`${task.priority} priority`} />
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 border-t border-white/[0.07] pt-3 text-[10px] leading-4 text-slate-600">
            Reminders use your task deadline and appear in-app; browser notifications need permission and the app open.
          </p>
        </aside>
      </div>

      <TaskModal
        initialDate={selectedDate}
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};
