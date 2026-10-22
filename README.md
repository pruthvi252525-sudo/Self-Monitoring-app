# Self-Monitor

A calmer workspace for managing tasks, planning your day, and tracking focus.

## Firebase setup

The app uses Firebase Authentication for email/password and Google sign-in, Cloud Firestore for tasks, schedules, and focus metrics, and Firebase Storage for uploaded workspace images.

1. In Firebase Console, enable **Email/Password** and **Google** under Authentication → Sign-in method.
2. Create a Cloud Firestore database and a Storage bucket.
3. Add `localhost` and your production hostname under Authentication → Settings → Authorized domains.
4. Publish the repository's `firestore.rules` and `storage.rules` in the corresponding Firebase Console Rules tabs.
5. Copy `.env.example` to `.env.local` and fill in the web app configuration from Firebase Project settings. The local `.env.local` is ignored by Git. Restart Vite after changing it.
6. Run the app, create an account with an email address and password, or sign in with Google. If a browser-only workspace exists from the earlier version, it is imported into the first account that signs in on that browser; later accounts do not inherit it.

Firebase web configuration is included in the browser bundle, so it is not a private credential. Protect user data with the supplied Firebase security rules and apply API key restrictions in Google Cloud where appropriate. Never put Firebase Admin SDK credentials or service-account keys in this app.

The Terms of Use and Privacy Notice in the app are draft disclosures, not legal advice or a guarantee of compliance. Update them to reflect the deployed service, operator, retention and deletion process, and applicable jurisdictions before public launch.

### Deploying to Vercel

Add all six `VITE_FIREBASE_*` values from `.env.example` under the Vercel project's **Settings → Environment Variables** for each environment you deploy (Preview and Production). Trigger a new deployment after changing them. These are Firebase web-app settings and are included in the browser bundle; never add Firebase Admin credentials or service-account keys.

For Google sign-in, enable the Google provider in Firebase Authentication and add the exact Vercel deployment hostname to Firebase's authorized domains. For email/password, enable that provider as well. This app uses Firebase Authentication directly in the browser, so it does not require a separate server-side Google token-verification endpoint. The Firebase project, enabled provider, authorized domain, and deployment environment variables must all match.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create a production build, run:

```bash
npm run build
```

## Understand and change the code

Start with the [beginner-friendly development guide](./DEVELOPMENT_GUIDE.md). It explains how the app starts, how a UI action changes and saves data, where each feature lives, and how to make common changes.

## Project layout

```text
src/
  App.tsx                 App shell and navigation
  components/
    analytics/            Productivity and focus summaries
    common/               Shared buttons and modals
    layout/               Header, sidebar, and export tools
    scheduler/            Calendar and Pomodoro timer
    tasks/                Task list, board, and task editor
    workspace/            Notes, links, checklists, and attachments
  store/                  App state, actions, and starter data
  types/                  Task, schedule, and analytics types
  lib/                    Firebase setup and cloud data migration
  utils/                  Scheduling, date, and export helpers
  main.tsx                Browser entry point
```

## App sections

- **Tasks:** Create and organize tasks in list, Kanban, or Eisenhower views.
- **Workspace:** Keep notes, links, checklists, and attachments with each task.
- **Scheduler:** Plan time blocks and track focus with the Pomodoro timer.
- **Analytics:** Review task progress and focus metrics; export reports and backups.

App data syncs to the signed-in user's Firebase account. Use **Export** to download a backup before switching accounts or making major changes.
