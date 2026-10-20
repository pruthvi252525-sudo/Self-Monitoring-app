import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useAppStore } from './store/useAppStore';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { TaskModal } from './components/tasks/TaskModal';
import { OverdueRolloverModal } from './components/layout/OverdueRolloverModal';
import { ExportModal } from './components/layout/ExportModal';
import { TaskCommandCenter } from './components/tasks/TaskCommandCenter';
import { DynamicWorkspace } from './components/workspace/DynamicWorkspace';
import { SmartScheduler } from './components/scheduler/SmartScheduler';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { WelcomePage } from './components/auth/WelcomePage';
import {
  auth,
  getFirebaseErrorMessage,
  isFirebaseConfigured,
  signInWithGoogle,
  signOut,
} from './lib/firebase';
import {
  clearLegacyAppData,
  loadUserAppData,
  prepareAppDataForCloud,
  readLegacyAppData,
  saveUserAppData,
  type AppDataSnapshot,
} from './lib/cloudData';

const getCurrentAppData = (): AppDataSnapshot => {
  const { tasks, timeBlocks, dailyMetrics } = useAppStore.getState();
  return { tasks, timeBlocks, dailyMetrics };
};

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [appDataReady, setAppDataReady] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const {
    activeWindow,
    setActiveWindow,
    quickTaskModalOpen,
    setQuickTaskModalOpen,
    checkAndPromptOverdueTasks,
    setRolloverModalOpen,
    restoreFromBackup,
  } = useAppStore();

  useEffect(() => {
    if (!auth) {
      setAuthReady(true);
      return;
    }

    return onAuthStateChanged(
      auth,
      (nextUser) => {
        setAppDataReady(false);
        setSyncError(null);
        setAuthError(null);
        setUser(nextUser);
        setAuthReady(true);
      },
      (error) => {
        setAuthError(getFirebaseErrorMessage(error));
        setAuthReady(true);
      }
    );
  }, []);

  useEffect(() => {
    if (!user) {
      setAppDataReady(false);
      return;
    }

    let active = true;
    setAppDataReady(false);
    setSyncError(null);

    const loadData = async () => {
      try {
        const savedData = await loadUserAppData(user.uid);
        if (!active) return;

        if (savedData) {
          restoreFromBackup(savedData);
        } else {
          const legacyData = readLegacyAppData();
          const initialData = legacyData ?? getCurrentAppData();
          const preparedData = await prepareAppDataForCloud(user.uid, initialData);
          if (!active) return;
          await saveUserAppData(user.uid, preparedData);
          if (legacyData) clearLegacyAppData();
          restoreFromBackup(preparedData);
        }

        if (active) setAppDataReady(true);
      } catch (error) {
        if (active) setSyncError(getFirebaseErrorMessage(error));
      }
    };

    void loadData();
    return () => {
      active = false;
    };
  }, [loadAttempt, restoreFromBackup, user]);

  useEffect(() => {
    if (!user || !appDataReady) return;

    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let saveChain = Promise.resolve();

    const unsubscribe = useAppStore.subscribe((state, previousState) => {
      if (
        state.tasks === previousState.tasks &&
        state.timeBlocks === previousState.timeBlocks &&
        state.dailyMetrics === previousState.dailyMetrics
      ) {
        return;
      }

      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        saveChain = saveChain
          .then(async () => {
            if (!active) return;
            const data = await prepareAppDataForCloud(user.uid, getCurrentAppData());
            if (!active) return;
            await saveUserAppData(user.uid, data);
            if (active) setSyncError(null);
          })
          .catch((error: unknown) => {
            if (active) setSyncError(getFirebaseErrorMessage(error));
          });
      }, 500);
    });

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
      unsubscribe();
    };
  }, [appDataReady, user]);

  useEffect(() => {
    if (!user || !appDataReady) return;
    const overdue = checkAndPromptOverdueTasks();
    if (overdue.length > 0) {
      const timer = setTimeout(() => setRolloverModalOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, [appDataReady, checkAndPromptOverdueTasks, setRolloverModalOpen, user]);

  useEffect(() => {
    if (!user || !appDataReady) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((event.target as HTMLElement)?.tagName)) {
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setActiveWindow('tasks');
        setQuickTaskModalOpen(true);
      } else if (event.key === '1') {
        setActiveWindow('tasks');
      } else if (event.key === '2') {
        setActiveWindow('workspace');
      } else if (event.key === '3') {
        setActiveWindow('scheduler');
      } else if (event.key === '4') {
        setActiveWindow('analytics');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appDataReady, setActiveWindow, setQuickTaskModalOpen, user]);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      setAuthError(getFirebaseErrorMessage(error));
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setAuthError(null);
    try {
      await signOut();
    } catch (error) {
      setAuthError(getFirebaseErrorMessage(error));
    }
  };

  if (!authReady) {
    return <LoadingScreen message="Connecting to Firebase…" />;
  }

  if (!user) {
    return (
      <WelcomePage
        error={authError}
        firebaseConfigured={isFirebaseConfigured}
        isLoading={isSigningIn}
        onGoogleSignIn={handleGoogleSignIn}
      />
    );
  }

  if (!appDataReady) {
    return (
      <LoadingScreen
        error={syncError}
        message="Loading your saved workspace…"
        onRetry={() => setLoadAttempt((attempt) => attempt + 1)}
        onSignOut={handleSignOut}
      />
    );
  }

  return (
    <div className="app-shell flex min-h-screen bg-dark-950 font-sans text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Sidebar onSignOut={handleSignOut} userName={user.displayName || user.email || 'Google user'} />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
        {(syncError || authError) && (
          <div
            aria-live="polite"
            className="border-b border-amber-300/20 bg-amber-300/[0.08] px-5 py-2 text-center text-xs text-amber-100"
            role="alert"
          >
            {syncError
              ? `Cloud sync failed: ${syncError} Your changes may not be saved online.`
              : authError}
          </div>
        )}
        <Header />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {activeWindow === 'tasks' && <TaskCommandCenter />}
          {activeWindow === 'workspace' && <DynamicWorkspace />}
          {activeWindow === 'scheduler' && <SmartScheduler />}
          {activeWindow === 'analytics' && <AnalyticsDashboard />}
        </main>
      </div>

      <TaskModal
        isOpen={quickTaskModalOpen}
        onClose={() => setQuickTaskModalOpen(false)}
      />
      <OverdueRolloverModal />
      <ExportModal />
    </div>
  );
};

const LoadingScreen: React.FC<{
  message: string;
  error?: string | null;
  onRetry?: () => void;
  onSignOut?: () => void;
}> = ({ message, error, onRetry, onSignOut }) => (
  <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-dark-950 px-6 text-center text-slate-200">
    <p className="text-sm">{error || message}</p>
    {error && onRetry && (
      <div className="flex gap-3">
        <button
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
          onClick={onRetry}
          type="button"
        >
          Try again
        </button>
        {onSignOut && (
          <button
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
            onClick={onSignOut}
            type="button"
          >
            Sign out
          </button>
        )}
      </div>
    )}
  </main>
);

export default App;
