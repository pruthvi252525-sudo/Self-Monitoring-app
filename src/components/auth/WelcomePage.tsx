import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Focus,
  Sparkles,
  X,
} from 'lucide-react';

type LegalDocument = 'terms' | 'privacy';

interface WelcomePageProps {
  onGoogleSignIn: () => void;
  onEmailPasswordSignIn: (email: string, password: string) => void;
  onEmailPasswordRegister: (email: string, password: string) => void;
  firebaseConfigured: boolean;
  isLoading: boolean;
  error: string | null;
}

const legalContent: Record<
  LegalDocument,
  { title: string; intro: string; sections: { heading: string; body: string }[] }
> = {
  terms: {
    title: 'Terms of use',
    intro:
      'Draft for team review · Effective date: October 13, 2026 · This prototype is not a production service.',
    sections: [
      {
        heading: 'Using this prototype',
        body:
          'Self-Monitoring is a personal productivity tool for organizing tasks, notes, schedules, and focus sessions. Use it lawfully and do not rely on it for emergency communications, medical or mental-health advice, workplace surveillance, or decisions that require guaranteed accuracy.',
      },
      {
        heading: 'Your content and your device',
        body:
          'You retain responsibility for the information you enter. When signed in, your tasks, notes, schedules, focus data, and uploaded images are stored in Firebase services under your account. Do not enter sensitive, confidential, financial, health, or other high-risk personal information.',
      },
      {
        heading: 'Availability and changes',
        body:
          'This prototype is provided for demonstration and evaluation. Features, saved data, and availability may change or be removed; no backup or uninterrupted availability is guaranteed. Export important information regularly.',
      },
      {
        heading: 'Acceptable use and safety',
        body:
          'Do not use the app to unlawfully monitor another person, infringe rights, upload harmful content, or interfere with the service. Respect other people’s privacy and obtain any permission required before recording their information.',
      },
      {
        heading: 'Production review required',
        body:
          'These draft terms do not establish a governing law, create a complete contract, or guarantee legal compliance. Before public release, the service operator must identify itself, provide valid contact details, select applicable jurisdictions, and have qualified counsel review the terms.',
      },
    ],
  },
  privacy: {
    title: 'Privacy notice',
    intro:
      'Draft for team review · Effective date: October 13, 2026 · Describes Firebase sign-in and cloud storage.',
    sections: [
      {
        heading: 'Who operates this service',
        body:
          'The service operator and privacy contact have not yet been identified. Before public release, replace this notice with the responsible organization’s legal name, privacy contact, and applicable jurisdiction-specific disclosures.',
      },
      {
        heading: 'Information and storage',
        body:
            'Tasks, notes, schedule entries, and focus data are stored in Cloud Firestore under your Firebase account. Uploaded workspace images are stored in Firebase Storage. Firebase Authentication processes sign-in and account information. Review the relevant provider privacy information and the project operator’s final data-handling policy before production use.',
      },
      {
        heading: 'Sign-in and third parties',
        body:
            'Google and email/password sign-in are provided by Firebase Authentication. This app does not receive or store your Google or email account password; Firebase Authentication manages credentials. Google and Firebase may process technical and account information as described in their terms and privacy notices. No Firebase Analytics service is initialized by this app.',
      },
      {
        heading: 'Your choices and data deletion',
        body:
          'You can export app data using Backup. Signing out does not delete cloud data. Account data deletion must be performed by the service operator or by an account deletion feature if one is added. Exports are downloaded to your device and are not encrypted by this app.',
      },
      {
        heading: 'Security, retention, and children',
        body:
          'Firebase Security Rules restrict access to the signed-in account. The app operator remains responsible for rules, retention, backups, and deletion. This prototype is not designed for children; do not use it to collect children’s information.',
      },
      {
        heading: 'Before production',
        body:
          'A production launch requires a verified data-flow and vendor review, an accurate retention/deletion process, a real privacy contact, and a jurisdiction-specific legal review. This draft is informational and cannot guarantee compliance or prevent legal claims.',
      },
    ],
  },
};

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onGoogleSignIn,
  onEmailPasswordSignIn,
  onEmailPasswordRegister,
  firebaseConfigured,
  isLoading,
  error,
}) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [legalDocument, setLegalDocument] = useState<LegalDocument | null>(null);
  const [authMode, setAuthMode] = useState<'sign-in' | 'register'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailPasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (authMode === 'register') {
      onEmailPasswordRegister(email, password);
    } else {
      onEmailPasswordSignIn(email, password);
    }
  };

  return (
    <main className="welcome-page min-h-screen px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-3" aria-label="Self-Monitoring home">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-950/40">
              <Focus className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold tracking-wide text-white">
              self<span className="text-indigo-300">.</span>monitor
            </span>
          </a>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-400">
            Firebase account
          </span>
        </header>

        <div className="grid flex-1 items-center gap-14 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:py-16">
          <section className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-300/15 bg-indigo-300/[0.07] px-3.5 py-2 text-xs font-medium text-indigo-200">
              <Sparkles className="h-3.5 w-3.5" />
              A little more room to think
            </div>
            <h1 className="text-4xl font-semibold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.65rem]">
              Make space for
              <br />
              <span className="welcome-gradient-text">what matters.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-base leading-7 text-slate-400 lg:mx-0">
              A calmer place for your tasks, focused time, and the progress you
              make along the way.
            </p>

            <div className="welcome-preview-card mt-10 hidden overflow-hidden rounded-3xl border border-white/[0.08] p-5 text-left sm:block">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400">YOUR DAY, AT A GLANCE</p>
                  <p className="mt-1 text-sm font-medium text-slate-100">One step at a time</p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                  <Check className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 rounded-xl bg-white/[0.035] px-3.5 py-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md border border-emerald-300/50 text-emerald-300">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="flex-1 text-sm text-slate-400 line-through decoration-slate-600">
                    Review project notes
                  </span>
                  <span className="text-[11px] text-slate-500">Done</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-indigo-300/10 bg-indigo-300/[0.055] px-3.5 py-3">
                  <span className="h-5 w-5 rounded-md border border-indigo-300/40" />
                  <span className="flex-1 text-sm text-slate-200">Make progress on the important thing</span>
                  <span className="rounded-md bg-indigo-300/10 px-2 py-1 text-[10px] font-medium text-indigo-200">
                    Next
                  </span>
                </div>
                <div className="flex items-center gap-3 px-3.5 py-2">
                  <span className="h-5 w-5 rounded-md border border-slate-700" />
                  <span className="flex-1 text-sm text-slate-500">Take a moment to reset</span>
                  <span className="text-[11px] text-slate-600">Later</span>
                </div>
              </div>
            </div>

            <p className="mt-5 hidden items-center gap-2 text-xs text-slate-500 sm:flex">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Your workspace syncs to Firebase
            </p>
          </section>

          <section className="mx-auto w-full max-w-md">
            <div className="welcome-form-card rounded-3xl border border-white/[0.09] p-6 shadow-2xl shadow-black/25 sm:p-9">
              <div className="mb-7">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06] text-indigo-200">
                  <Focus className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Sign in to your space and pick up where you left off.
                </p>
              </div>

              <label className="mb-5 flex cursor-pointer items-start gap-2.5">
                <input
                  checked={acceptedTerms}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-indigo-400"
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                  type="checkbox"
                />
                <span className="text-xs leading-5 text-slate-400">
                  I agree to the{' '}
                  <button
                    className="text-indigo-300 underline decoration-indigo-300/30 underline-offset-2 hover:text-indigo-200"
                    onClick={(event) => {
                      event.preventDefault();
                      setLegalDocument('terms');
                    }}
                    type="button"
                  >
                    Terms of use
                  </button>{' '}
                  and acknowledge the{' '}
                  <button
                    className="text-indigo-300 underline decoration-indigo-300/30 underline-offset-2 hover:text-indigo-200"
                    onClick={(event) => {
                      event.preventDefault();
                      setLegalDocument('privacy');
                    }}
                    type="button"
                  >
                    Privacy notice
                  </button>
                  .
                </span>
              </label>

              <form className="space-y-4" onSubmit={handleEmailPasswordSubmit}>
                <label className="block text-xs font-medium text-slate-300">
                  Email
                  <input
                    autoComplete="email"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20"
                    disabled={!firebaseConfigured || isLoading}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                    type="email"
                    value={email}
                  />
                </label>
                <label className="block text-xs font-medium text-slate-300">
                  Password
                  <input
                    autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20"
                    disabled={!firebaseConfigured || isLoading}
                    minLength={authMode === 'register' ? 6 : undefined}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 6 characters"
                    required
                    type="password"
                    value={password}
                  />
                </label>
                <button
                  className="w-full rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300/60 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={!firebaseConfigured || !acceptedTerms || isLoading}
                  type="submit"
                >
                  {isLoading
                    ? 'Connecting…'
                    : authMode === 'register'
                      ? 'Create account'
                      : 'Sign in with email'}
                </button>
              </form>

              <p className="mt-3 text-center text-xs text-slate-500">
                {authMode === 'register' ? 'Already registered?' : 'New to Self-Monitor?'}{' '}
                <button
                  className="font-medium text-indigo-300 hover:text-indigo-200"
                  disabled={isLoading}
                  onClick={() =>
                    setAuthMode((mode) => (mode === 'register' ? 'sign-in' : 'register'))
                  }
                  type="button"
                >
                  {authMode === 'register' ? 'Sign in' : 'Create an account'}
                </button>
              </p>

              <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-widest text-slate-600">
                <span className="h-px flex-1 bg-white/[0.08]" />
                or
                <span className="h-px flex-1 bg-white/[0.08]" />
              </div>

              <button
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/[0.075] focus:outline-none focus:ring-2 focus:ring-indigo-400/60 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!firebaseConfigured || !acceptedTerms || isLoading}
                onClick={onGoogleSignIn}
                type="button"
              >
                <GoogleMark />
                {isLoading ? 'Connecting…' : 'Continue with Google'}
              </button>

              {!firebaseConfigured && (
                <p className="mt-4 rounded-xl border border-amber-300/15 bg-amber-300/[0.06] px-3.5 py-3 text-xs leading-5 text-amber-100/80">
                  Firebase is not configured. Add the Firebase web app settings to <code>.env.local</code> and restart the app.
                </p>
              )}
              {error && (
                <p
                  aria-live="polite"
                  className="mt-4 rounded-xl border border-amber-300/15 bg-amber-300/[0.06] px-3.5 py-3 text-xs leading-5 text-amber-100/80"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <p className="mt-5 text-center text-[11px] leading-5 text-slate-500">
                Your workspace is saved to Firebase and available when you sign in again.
              </p>
            </div>
          </section>
        </div>

        <footer className="flex flex-col items-center justify-between gap-2 border-t border-white/[0.06] py-5 text-center text-[11px] text-slate-500 sm:flex-row sm:text-left">
          <span>© 2026 Self-Monitor</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400/70" />
            Email or Google sign-in · Firebase cloud storage
          </span>
        </footer>
      </div>

      {legalDocument && (
        <LegalModal
          document={legalContent[legalDocument]}
          onClose={() => setLegalDocument(null)}
        />
      )}
    </main>
  );
};

const GoogleMark: React.FC = () => (
  <svg aria-hidden="true" className="h-[18px] w-[18px]" viewBox="0 0 48 48">
    <path
      d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.5 9.5 0 0 1-4.1 6.2v5h6.6c3.9-3.6 6.1-8.8 6.1-14.9Z"
      fill="#4285F4"
    />
    <path
      d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.5H5.8V33A20 20 0 0 0 24 44Z"
      fill="#34A853"
    />
    <path
      d="M12.6 27.7a12 12 0 0 1 0-7.4v-5H5.8a20 20 0 0 0 0 17.4l6.8-5Z"
      fill="#FBBC05"
    />
    <path
      d="M24 11.8c3 0 5.7 1 7.8 3l5.8-5.8A19.4 19.4 0 0 0 24 4 20 20 0 0 0 5.8 15.3l6.8 5C14.2 15.4 18.7 11.8 24 11.8Z"
      fill="#EA4335"
    />
  </svg>
);

interface LegalModalProps {
  document: (typeof legalContent)[LegalDocument];
  onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ document, onClose }) => (
  <div
    aria-labelledby="legal-modal-title"
    aria-modal="true"
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    role="dialog"
  >
    <section className="welcome-form-card max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 p-6 shadow-2xl sm:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white" id="legal-modal-title">
            {document.title}
          </h2>
          <p className="mt-2 text-xs leading-5 text-amber-200/75">{document.intro}</p>
        </div>
        <button
          aria-label="Close"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
          onClick={onClose}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-5">
        {document.sections.map((section) => (
          <section key={section.heading}>
            <h3 className="text-sm font-semibold text-slate-200">{section.heading}</h3>
            <p className="mt-1.5 text-sm leading-6 text-slate-400">{section.body}</p>
          </section>
        ))}
      </div>
    </section>
  </div>
);
