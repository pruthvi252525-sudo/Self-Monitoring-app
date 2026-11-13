import React, { useEffect, useState } from 'react';
import {
  ArrowDownToLine,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  Share,
  KeyRound,
  Mail,
  MoreVertical,
  Pencil,
  ShieldCheck,
  Smartphone,
  UserRound,
  X,
} from 'lucide-react';
import type { User } from 'firebase/auth';
import { getFirebaseErrorMessage } from '../../lib/firebase';
import { useAppStore } from '../../store/useAppStore';

interface ProfilePageProps {
  user: User;
  displayName: string;
  onDisplayNameUpdate: (displayName: string) => Promise<void>;
  onPasswordReset: () => Promise<void>;
  onExportData: () => void;
  onSignOut: () => void;
}

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  displayName,
  onDisplayNameUpdate,
  onPasswordReset,
  onExportData,
  onSignOut,
}) => {
  const tasks = useAppStore((state) => state.tasks);
  const [isEditing, setIsEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(displayName);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallInstructions, setShowInstallInstructions] = useState(false);
  const [installError, setInstallError] = useState<string | null>(null);
  const completedTasks = tasks.filter((task) => task.status === 'completed').length;
  const activeTasks = tasks.filter((task) => task.status !== 'completed').length;
  const completionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const fullName = displayName || 'Your name';
  const initials = (displayName || user.email || 'U')
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
  const providers = [...new Set(user.providerData.map((provider) => {
    if (provider.providerId === 'google.com') return 'Google';
    if (provider.providerId === 'password') return 'Email and password';
    return provider.providerId;
  }))];
  const hasPasswordProvider = user.providerData.some((provider) => provider.providerId === 'password');
  const createdAt = user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Not available';

  useEffect(() => {
    const displayMode = window.matchMedia('(display-mode: standalone)');
    const isStandalone = () =>
      displayMode.matches ||
      ('standalone' in window.navigator &&
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true);
    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setShowInstallInstructions(false);
    };

    setIsInstalled(isStandalone());
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    setInstallError(null);
    if (!installPrompt) {
      setShowInstallInstructions((visible) => !visible);
      return;
    }

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      setInstallPrompt(null);
      if (outcome === 'accepted') setIsInstalled(true);
      else setShowInstallInstructions(true);
    } catch {
      setInstallError('The install prompt could not be opened. Use your browser menu to install this app.');
      setShowInstallInstructions(true);
    }
  };

  const handleSaveName = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = nameDraft.trim();
    if (!trimmedName) {
      setError('Enter a name to continue.');
      return;
    }

    setIsSavingName(true);
    setError(null);
    setMessage(null);
    try {
      await onDisplayNameUpdate(trimmedName);
      setNameDraft(trimmedName);
      setIsEditing(false);
      setMessage('Your profile name has been updated.');
    } catch (saveError) {
      setError(getFirebaseErrorMessage(saveError));
    } finally {
      setIsSavingName(false);
    }
  };

  const handlePasswordReset = async () => {
    setIsSendingReset(true);
    setError(null);
    setMessage(null);
    try {
      await onPasswordReset();
      setMessage(`Password reset link sent to ${user.email}.`);
    } catch (resetError) {
      setError(getFirebaseErrorMessage(resetError));
    } finally {
      setIsSendingReset(false);
    }
  };

  const cancelNameEdit = () => {
    setNameDraft(displayName);
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5 sm:space-y-7">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-indigo-300">Account</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
          Your profile
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
          Keep your account details up to date and see the progress you have made.
        </p>
      </div>

      <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-indigo-500/[0.14] via-[#171821] to-teal-400/[0.07] p-5 sm:p-7">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          {user.photoURL ? (
            <img
              alt=""
              className="h-16 w-16 shrink-0 rounded-2xl border border-white/10 object-cover sm:h-20 sm:w-20"
              referrerPolicy="no-referrer"
              src={user.photoURL}
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-indigo-300/20 bg-indigo-400/10 text-xl font-semibold text-indigo-100 sm:h-20 sm:w-20 sm:text-2xl">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold text-white sm:text-2xl">{fullName}</h2>
            <p className="mt-1 truncate text-sm text-slate-400">{user.email || 'No email address'}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-2.5 py-1 text-[11px] font-medium text-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {user.emailVerified ? 'Email verified' : 'Email not verified'}
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Your productivity summary" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <SummaryCard icon={CheckCircle2} label="Tasks completed" value={completedTasks} tone="text-emerald-300" />
        <SummaryCard icon={Clock3} label="Open tasks" value={activeTasks} tone="text-indigo-300" />
        <SummaryCard icon={Check} label="Completion rate" value={`${completionRate}%`} tone="text-teal-300" />
      </section>

      <section className="rounded-2xl border border-indigo-300/15 bg-gradient-to-br from-indigo-400/[0.08] to-teal-300/[0.04] p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-300/10 text-indigo-200">
              <Smartphone className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-slate-100">Use Self-Monitor as an app</h2>
              <p className="mt-1 max-w-xl text-xs leading-5 text-slate-400">
                Add it to your phone’s home screen for an app-like experience. It’s free and stays
                connected to your account.
              </p>
            </div>
          </div>
          <button
            aria-expanded={showInstallInstructions}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-default disabled:opacity-70"
            disabled={isInstalled}
            onClick={() => void handleInstallApp()}
            type="button"
          >
            {isInstalled ? <CheckCircle2 className="h-4 w-4" /> : <Download className="h-4 w-4" />}
            {isInstalled ? 'App installed' : 'Download app'}
          </button>
        </div>
        {showInstallInstructions && !isInstalled && (
          <div className="mt-4 rounded-xl border border-white/[0.07] bg-black/10 p-4 text-sm text-slate-300">
            <p className="font-medium text-slate-100">Install from your browser</p>
            <ul className="mt-2 space-y-2 text-xs leading-5 text-slate-400">
              <li className="flex items-start gap-2">
                <Share className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                <span>
                  <strong className="font-medium text-slate-200">iPhone or iPad:</strong> open this
                  page in Safari, tap Share, then choose “Add to Home Screen”.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MoreVertical className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                <span>
                  <strong className="font-medium text-slate-200">Android:</strong> open this page in
                  Chrome, tap the menu, then choose “Install app” or “Add to Home screen”.
                </span>
              </li>
            </ul>
            {installError && (
              <p className="mt-3 text-xs text-rose-200" role="alert">{installError}</p>
            )}
            <p className="mt-3 text-[11px] leading-5 text-slate-500">
              Installation requires the website to be served securely over HTTPS. An internet
              connection is still needed to sign in and sync your data.
            </p>
          </div>
        )}
      </section>

      {(message || error) && (
        <div
          aria-live="polite"
          className={`rounded-xl border px-4 py-3 text-sm ${
            error
              ? 'border-rose-300/20 bg-rose-300/[0.07] text-rose-200'
              : 'border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-200'
          }`}
          role={error ? 'alert' : 'status'}
        >
          {error || message}
        </div>
      )}

      <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-100">Personal information</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">Your name is shown in your workspace.</p>
          </div>
          {!isEditing && (
            <button
              className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl border border-white/10 px-3 text-xs font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
              onClick={() => {
                setNameDraft(displayName);
                setMessage(null);
                setError(null);
                setIsEditing(true);
              }}
              type="button"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit name
            </button>
          )}
        </div>

        {isEditing ? (
          <form className="mt-5 space-y-3" onSubmit={handleSaveName}>
            <label className="block text-xs font-medium text-slate-300" htmlFor="profile-display-name">
              Display name
            </label>
            <input
              autoComplete="name"
              autoFocus
              className="welcome-input min-h-11 w-full rounded-xl border px-3.5 text-sm text-slate-100 outline-none focus:border-indigo-400/50"
              id="profile-display-name"
              maxLength={60}
              onChange={(event) => setNameDraft(event.target.value)}
              placeholder="Your full name"
              value={nameDraft}
            />
            <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                onClick={cancelNameEdit}
                type="button"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSavingName || !nameDraft.trim()}
                type="submit"
              >
                <Check className="h-4 w-4" />
                {isSavingName ? 'Saving…' : 'Save name'}
              </button>
            </div>
          </form>
        ) : (
          <dl className="mt-5 grid gap-4 border-t border-white/[0.07] pt-5 sm:grid-cols-2">
            <Detail icon={UserRound} label="Display name" value={fullName} />
            <Detail icon={Mail} label="Email address" value={user.email || 'Not available'} />
          </dl>
        )}
      </section>

      <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-400/10 text-indigo-200">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-100">Account & security</h2>
            <p className="mt-1 text-xs text-slate-500">Your sign-in details and account information.</p>
          </div>
        </div>
        <dl className="mt-5 grid gap-4 border-t border-white/[0.07] pt-5 sm:grid-cols-2">
          <Detail icon={KeyRound} label="Sign-in method" value={providers.join(', ') || 'Not available'} />
          <Detail icon={CalendarDays} label="Member since" value={createdAt} />
        </dl>
        <div className="mt-5 flex flex-col gap-2 border-t border-white/[0.07] pt-5 sm:flex-row sm:flex-wrap">
          {hasPasswordProvider && user.email && (
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-60"
              disabled={isSendingReset}
              onClick={() => void handlePasswordReset()}
              type="button"
            >
              <KeyRound className="h-4 w-4" />
              {isSendingReset ? 'Sending link…' : 'Reset password'}
            </button>
          )}
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
            onClick={onExportData}
            type="button"
          >
            <ArrowDownToLine className="h-4 w-4" />
            Backup & export
          </button>
        </div>
      </section>

      <div className="flex justify-center pb-2 sm:justify-end">
        <button
          className="min-h-11 rounded-xl px-4 text-sm text-slate-500 transition hover:bg-rose-300/[0.06] hover:text-rose-200"
          onClick={onSignOut}
          type="button"
        >
          Sign out of your account
        </button>
      </div>
    </div>
  );
};

const SummaryCard: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  tone: string;
}> = ({ icon: Icon, label, value, tone }) => (
  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
    <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] ${tone}`}>
      <Icon className="h-[18px] w-[18px]" />
    </div>
    <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-100">{value}</p>
    <p className="mt-1 text-xs text-slate-500">{label}</p>
  </div>
);

const Detail: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}> = ({ icon: Icon, label, value }) => (
  <div className="flex min-w-0 items-start gap-3">
    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
    <div className="min-w-0">
      <dt className="text-[11px] text-slate-500">{label}</dt>
      <dd className="mt-1 break-words text-sm text-slate-200">{value}</dd>
    </div>
  </div>
);
