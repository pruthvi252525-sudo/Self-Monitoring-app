import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Bell, BellRing, CheckCheck, Clock3, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Task } from '../../types';

interface TaskNotification {
  id: string;
  title: string;
  message: string;
  createdAt: number;
  read: boolean;
}

interface TaskNotificationCenterProps {
  userId: string;
}

export const TaskNotificationCenter: React.FC<TaskNotificationCenterProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<TaskNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(() =>
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission
  );
  const [browserError, setBrowserError] = useState<string | null>(null);
  const seenReminders = useRef(new Set<string>());
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const publish = useCallback(
    (id: string, title: string, message: string) => {
      setNotifications((current) => [
        { id, title, message, createdAt: Date.now(), read: false },
        ...current.filter((notification) => notification.id !== id),
      ].slice(0, 20));

      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        try {
          const browserNotification = new Notification(title, { body: message, tag: id });
          browserNotification.onclick = () => {
            window.focus();
            useAppStore.getState().setActiveWindow('tasks');
            setIsOpen(true);
            browserNotification.close();
          };
        } catch (error) {
          setBrowserError(
            error instanceof Error
              ? `Browser alert failed: ${error.message}`
              : 'Browser alert could not be displayed.'
          );
        }
      }
    },
    []
  );

  useEffect(() => {
    const isReminderSeen = (key: string) => {
      if (seenReminders.current.has(key)) return true;
      try {
        if (localStorage.getItem(key)) {
          seenReminders.current.add(key);
          return true;
        }
      } catch {
        return false;
      }
      return false;
    };

    const markReminderSeen = (key: string) => {
      seenReminders.current.add(key);
      try {
        localStorage.setItem(key, String(Date.now()));
      } catch {
        // In-memory deduplication still prevents repeats for this app session.
      }
    };

    const checkDeadlines = (tasks: Task[]) => {
      const now = Date.now();
      const hour = 60 * 60 * 1000;
      const day = 24 * hour;

      tasks.forEach((task) => {
        if (task.status === 'completed' || !task.deadline) return;
        const deadline = new Date(task.deadline).getTime();
        if (!Number.isFinite(deadline)) return;

        const reminder = deadline <= now
          ? { key: 'overdue', message: 'This task is past its deadline.' }
          : deadline - now <= hour
            ? { key: 'one-hour', message: 'This task is due within the next hour.' }
            : deadline - now <= day
              ? { key: 'one-day', message: 'This task is due within the next 24 hours.' }
              : null;
        if (!reminder) return;

        const key = `self-monitor:reminder:${userId}:${task.id}:${task.deadline}:${reminder.key}`;
        if (isReminderSeen(key)) return;
        markReminderSeen(key);
        publish(`${task.id}:${reminder.key}`, 'Task deadline', `${task.title}: ${reminder.message}`);
      });
    };

    checkDeadlines(useAppStore.getState().tasks);
    const timer = window.setInterval(() => checkDeadlines(useAppStore.getState().tasks), 60_000);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkDeadlines(useAppStore.getState().tasks);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let previousTasks = useAppStore.getState().tasks;
    const unsubscribe = useAppStore.subscribe((state) => {
      checkDeadlines(state.tasks);
      if (state.tasks === previousTasks) return;

      const previousById = new Map(previousTasks.map((task) => [task.id, task]));
      state.tasks.forEach((task) => {
        const previous = previousById.get(task.id);
        if (!previous) return;
        if (task.status !== previous.status && task.status === 'completed') {
          publish(`progress:${task.id}:${task.status}:${task.completedAt ?? ''}`, 'Task completed', task.title);
        } else if (task.status !== previous.status && task.status === 'in-progress') {
          publish(`progress:${task.id}:${task.status}:${Date.now()}`, 'Task in progress', task.title);
        } else {
          const previousDone = (previous.checklist ?? []).filter((item) => item.completed).length;
          const currentDone = (task.checklist ?? []).filter((item) => item.completed).length;
          if (currentDone > previousDone) {
            publish(
              `progress:${task.id}:checklist:${Date.now()}`,
              'Task progress updated',
              `${task.title}: ${currentDone} of ${(task.checklist ?? []).length} steps complete.`
            );
          }
        }
      });
      previousTasks = state.tasks;
    });

    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      unsubscribe();
    };
  }, [publish, userId]);

  const enableBrowserAlerts = async () => {
    setBrowserError(null);
    if (typeof Notification === 'undefined') {
      setPermission('unsupported');
      return;
    }
    try {
      setPermission(await Notification.requestPermission());
    } catch (error) {
      setBrowserError(
        error instanceof Error
          ? `Could not enable browser alerts: ${error.message}`
          : 'Could not enable browser alerts.'
      );
    }
  };

  return (
    <div className="notification-center relative">
      <button
        aria-expanded={isOpen}
        aria-label={unreadCount > 0 ? `${unreadCount} new notifications` : 'Notifications'}
        className="relative rounded-xl border border-white/[0.07] bg-white/[0.035] p-2 text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
        onClick={() => {
          setIsOpen((open) => !open);
          setNotifications((current) =>
            current.map((notification) => ({ ...notification, read: true }))
          );
        }}
        title="Notifications"
        type="button"
      >
        {permission === 'granted' ? <BellRing className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-500 px-1 text-[9px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <section
          aria-label="Task notifications"
          className="notification-panel absolute right-0 top-12 z-40 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-[#171821] shadow-2xl shadow-black/40"
        >
          <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Notifications</h3>
              <p className="mt-0.5 text-[11px] text-slate-500">Task progress and deadlines</p>
            </div>
            <button
              aria-label="Close notifications"
              className="rounded-lg p-1.5 text-slate-500 hover:bg-white/[0.06] hover:text-slate-200"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-slate-500">
                You’re all caught up. Deadline and progress alerts will appear here.
              </p>
            ) : (
              <ul className="divide-y divide-white/[0.06]">
                {notifications.map((notification) => (
                  <li className="flex gap-3 px-4 py-3" key={notification.id}>
                    <span className="mt-0.5 text-indigo-300">
                      {notification.title === 'Task deadline'
                        ? <Clock3 className="h-4 w-4" />
                        : <CheckCheck className="h-4 w-4" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-200">{notification.title}</p>
                      <p className="mt-1 break-words text-xs leading-5 text-slate-400">
                        {notification.message}
                      </p>
                      <time className="mt-1 block text-[10px] text-slate-600">
                        {new Intl.DateTimeFormat(undefined, {
                          hour: 'numeric',
                          minute: '2-digit',
                        }).format(notification.createdAt)}
                      </time>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-white/[0.07] px-4 py-3">
            {permission === 'granted' ? (
              <p className="text-[11px] text-emerald-300">Browser alerts are enabled.</p>
            ) : permission === 'denied' ? (
              <p className="text-[11px] leading-4 text-amber-200">
                Browser alerts are blocked. Allow them in your browser’s site settings.
              </p>
            ) : permission === 'unsupported' ? (
              <p className="text-[11px] leading-4 text-slate-500">
                Browser alerts aren’t supported here; in-app alerts still work.
              </p>
            ) : (
              <button
                className="text-xs font-medium text-indigo-300 hover:text-indigo-200"
                onClick={() => void enableBrowserAlerts()}
                type="button"
              >
                Enable browser alerts
              </button>
            )}
            <p className="mt-2 text-[10px] leading-4 text-slate-600">
              Deadline checks run while the app is open. Alerts cannot arrive after you close it.
            </p>
            {browserError && (
              <p aria-live="polite" className="mt-2 text-[11px] leading-4 text-amber-200" role="alert">
                {browserError}
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
