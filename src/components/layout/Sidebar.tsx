import React, { useState } from 'react';
import {
  BarChart3,
  CheckSquare,
  ChevronDown,
  Cpu,
  Download,
  Focus,
  LogOut,
  Plus,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AppWindow } from '../../types';

interface SidebarProps {
  onSignOut: () => void;
  userName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSignOut, userName }) => {
  const {
    activeWindow,
    setActiveWindow,
    tasks,
    setQuickTaskModalOpen,
    setExportModalOpen,
  } = useAppStore();
  const [moreOpen, setMoreOpen] = useState(
    activeWindow === 'workspace' || activeWindow === 'analytics'
  );
  const openTasks = tasks.filter((task) => task.status !== 'completed').length;

  const primaryItems: {
    id: AppWindow;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'tasks', label: 'My tasks', icon: CheckSquare },
    { id: 'scheduler', label: 'Focus & plan', icon: Focus },
  ];

  const moreItems: {
    id: AppWindow;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'workspace', label: 'Workspace', icon: Cpu },
    { id: 'analytics', label: 'Insights', icon: BarChart3 },
  ];

  const renderNavigationItem = (item: (typeof primaryItems)[number]) => {
    const Icon = item.icon;
    const isActive = activeWindow === item.id;

    return (
      <button
        aria-current={isActive ? 'page' : undefined}
        className={`sidebar-link group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
          isActive
            ? 'bg-indigo-500/10 font-medium text-indigo-200'
            : 'text-slate-400 hover:bg-white/[0.045] hover:text-slate-100'
        }`}
        key={item.id}
        onClick={() => setActiveWindow(item.id)}
        title={item.label}
        type="button"
      >
        <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-indigo-300' : ''}`} />
        <span className="sidebar-label flex-1">{item.label}</span>
        {item.id === 'tasks' && (
          <span className="sidebar-label rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-slate-400">
            {openTasks}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="app-sidebar sticky top-0 z-20 flex h-screen w-60 shrink-0 flex-col border-r border-white/[0.07] bg-[#101118] px-3 py-5">
      <div className="mb-9 flex items-center gap-3 px-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-950/30">
          <Sparkles className="h-[18px] w-[18px]" />
        </span>
        <div className="sidebar-label min-w-0">
          <h1 className="truncate text-sm font-semibold tracking-tight text-slate-100">
            self<span className="text-indigo-300">.</span>monitor
          </h1>
          <p className="mt-0.5 text-[10px] text-slate-500">A little more room to think</p>
        </div>
      </div>

      <button
        className="mb-7 flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
        onClick={() => {
          setActiveWindow('tasks');
          setQuickTaskModalOpen(true);
        }}
        title="Create a task"
        type="button"
      >
        <Plus className="h-4 w-4 shrink-0" />
        <span className="sidebar-label">New task</span>
      </button>

      <nav aria-label="Main navigation" className="space-y-1">
        <p className="sidebar-label mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
          Your space
        </p>
        {primaryItems.map(renderNavigationItem)}

        <div className="relative pt-1">
          <button
            aria-expanded={moreOpen}
            className="sidebar-link flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-400 transition hover:bg-white/[0.045] hover:text-slate-100"
            onClick={() => setMoreOpen((open) => !open)}
            title="More sections"
            type="button"
          >
            <ChevronDown
              className={`h-[18px] w-[18px] shrink-0 transition-transform ${moreOpen ? 'rotate-180' : ''}`}
            />
            <span className="sidebar-label flex-1">More</span>
          </button>
          {moreOpen && (
            <div className="mt-1 space-y-1 pl-2">
              {moreItems.map((item) => (
                <React.Fragment key={item.id}>{renderNavigationItem(item)}</React.Fragment>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="mt-auto space-y-3">
        <div className="sidebar-label rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Signed in
          </div>
          <p className="mt-1.5 truncate pl-3.5 text-[11px] leading-4 text-slate-500" title={userName}>
            {userName}
          </p>
        </div>

        <div className="space-y-1 border-t border-white/[0.07] pt-3">
          <button
            className="sidebar-link flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs text-slate-500 transition hover:bg-white/[0.045] hover:text-slate-200"
            onClick={() => setExportModalOpen(true)}
            title="Backup and export your data"
            type="button"
          >
            <Download className="h-4 w-4 shrink-0" />
            <span className="sidebar-label">Backup & export</span>
          </button>
          <button
            className="sidebar-link flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs text-slate-500 transition hover:bg-white/[0.045] hover:text-slate-200"
            onClick={onSignOut}
            title="Sign out"
            type="button"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="sidebar-label">Sign out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
