# Development guide

This guide describes how the app works today and where to look when you want to change it. The app uses Firebase Authentication for email/password and Google sign-in, Cloud Firestore for app data, and Firebase Storage for uploaded workspace images.

## 1. Start the app

Run these commands from the project folder:

```bash
npm install
npm run dev
```

Vite serves the app at the local address it prints (normally `http://localhost:3000`). To check that the production bundle compiles, run `npm run build`.

The browser entry point is `src/main.tsx`. It finds the `root` element in `index.html`, then renders `App` inside React's `StrictMode`.

## 2. Follow the app flow

```text
index.html
  -> src/main.tsx
    -> src/App.tsx
      -> WelcomePage (email/password or Google sign-in, verification, and password reset)
        -> Firebase Authentication
          -> per-user Firestore data
      -> Sidebar + Header + mobile navigation + task notifications + the selected app section
         -> Tasks | Workspace | Scheduler | Analytics
      -> shared modals
```

`App.tsx` listens for Firebase Authentication state, loads the signed-in user's Firestore data before showing the workspace, and signs the user out through Firebase. A missing Firestore user document is initialized from the earlier browser-only data when available, or starter data otherwise.

## 3. Understand how data moves

Most app data follows this path:

```text
User action in a component
  -> component calls an action from useAppStore
    -> action updates Zustand state with set(...)
      -> subscribed components render the new state
      -> App.tsx debounces changes and saves tasks, time blocks, and metrics to Firestore
```

- `src/store/useAppStore.ts` defines app state and actions.
- `src/lib/firebase.ts` initializes Firebase from Vite environment variables and provides email/password and Google authentication, email verification, and password reset.
- `src/lib/cloudData.ts` reads and writes the per-user Firestore document and imports data from the old `self_monitoring_app_storage_v1` local-storage key once.
- `firestore.rules` restricts each user's Firestore document to that user's Firebase UID.
- `storage.rules` restricts uploaded images to their owning user and limits image size to less than 10 MB.
- Uploaded visual assets are stored in Firebase Storage; their download URLs are saved with the task in Firestore.
- `src/store/seedData.ts` supplies starter tasks, schedule blocks, and metrics for a new account and for the reset action.
- `src/types/` defines the shape of tasks, schedule blocks, focus sessions, and other shared data.
- `src/utils/` contains reusable calculations, date helpers, and export formatting.

For example, a task edit starts in a task UI component, calls `updateTask` in `useAppStore`, and updates the matching task in the `tasks` array. Components reading that task then show the changed value, and `App.tsx` saves the updated app data to Firestore.

Database reads and writes belong in `src/lib/cloudData.ts`, rather than individual UI components.

## Firebase configuration

Copy `.env.example` to `.env.local` and enter the Firebase web app configuration. Enable Email/Password and Google in Firebase Authentication, configure the email verification and password reset templates, create Firestore and Storage, add development/production authorized domains, and publish `firestore.rules` and `storage.rules` from the Firebase Console. Email/password accounts must verify their email before entering the workspace; Google sign-in uses the provider's verified account. For Vercel, add all `VITE_FIREBASE_*` variables in the project settings for Preview and Production, then redeploy. Do not add Admin SDK credentials to the frontend. Google sign-in uses Firebase Authentication's browser SDK and does not require a separate server-side token-verification endpoint.

## Task reminders and mobile navigation

The mobile layout replaces the desktop sidebar with a fixed bottom navigation bar. The notification center reports task status/checklist progress and checks incomplete task deadlines while the app is open. It can also use browser notifications after the user grants permission. Browsers do not run these client-side deadline checks after the app is closed; delivering alerts in the background requires a service worker and a trusted server-side scheduling/push setup.

## 4. Find the feature you want to change

| Feature | Main files |
| --- | --- |
| App startup and section selection | `src/main.tsx`, `src/App.tsx` |
| Welcome screen and sign-in/registration UI | `src/components/auth/WelcomePage.tsx`, `src/lib/firebase.ts` |
| Sidebar, header, shared dialogs, and backup controls | `src/components/layout/` |
| Task list, filters, task form, Kanban, and priority matrix | `src/components/tasks/` |
| Task notes, checklist, resource links, and assets | `src/components/workspace/` |
| Day/week calendar, manual blocks, and focus timer UI | `src/components/scheduler/` |
| Analytics cards and charts | `src/components/analytics/` |
| Shared state and actions | `src/store/useAppStore.ts` |
| Sample data | `src/store/seedData.ts` |
| Shared data shapes | `src/types/` |
| Auto-planning and date calculations | `src/utils/autoPlanner.ts`, `src/utils/dateUtils.ts` |
| JSON and Markdown export formatting | `src/utils/exportUtils.ts` |

Components usually render UI and respond to user input. Shared state changes belong in store actions. Pure calculations that do not need React or browser UI belong in `src/utils/`.

## 5. Common change: add a field to a task

Use this sequence as a checklist:

1. Add the field and its TypeScript type to `Task` in `src/types/task.ts`.
2. Give starter tasks a sensible value in `src/store/seedData.ts`.
3. Add an input to `src/components/tasks/TaskModal.tsx` if users should edit the field when creating or editing a task.
4. Add or update an action in `src/store/useAppStore.ts` if the field needs behavior beyond the existing `addTask` and `updateTask` actions.
5. Display or edit the field in the relevant task/workspace component.
6. Check whether the field should appear in exports in `src/utils/exportUtils.ts`.
7. Run `npm run build` and manually try creating, editing, refreshing, exporting, and restoring a task.

Existing browser data and old backup files may not contain a newly added field. When reading a field that might be absent in old data, provide a safe default in the UI or migrate the stored data deliberately. TypeScript types alone do not update old data already saved in a browser.

## 6. Common change: add a new app section

1. Create the section component under `src/components/`.
2. Add its section name to the `AppWindow` union in `src/types/index.ts`.
3. Add a navigation control in `src/components/layout/Sidebar.tsx`.
4. Add a matching conditional render in `src/App.tsx`.
5. Run `npm run build` and click through the new navigation in the browser.

The navigation value is shared state, so keep the spelling identical in the type, sidebar, and `App.tsx`.

## 7. Things to know before relying on the prototype

- Sign-in and registration use Firebase Authentication's email/password flow or Google popup flow; the app does not handle provider passwords.
- Tasks, notes, schedule blocks, and focus data sync to the signed-in user's Firestore document. Workspace image uploads use Firebase Storage.
- Existing browser-only data is imported into the first Firebase account signed in on that browser when that account has no saved Firestore document. If the saved Firestore data cannot be written, the old browser data is retained.
- The JSON export includes tasks, time blocks, and daily metrics. Restore is a basic prototype flow, not a validated database migration; only restore a backup you trust.
- Some analytics are demonstration values. For example, the current streak is fixed in `getStreakStats` in `src/store/useAppStore.ts`; it is not calculated from a user's real history.
- Auto-planning is a heuristic in `src/utils/autoPlanner.ts`. The store replaces the selected day's blocks with the planner's generated result. Although existing blocks are considered when finding free time, they are not included in that generated result, so review the day's blocks before relying on auto-plan alongside manually created blocks.
- The Terms and Privacy text on the welcome screen is draft prototype copy, not production legal documentation.

## 8. A safe editing routine

1. Find the screen component that owns the control you want to change.
2. Trace the action it calls into `src/store/useAppStore.ts`.
3. Check the relevant type and starter data before changing state shape.
4. Make one related change at a time and run `npm run build`.
5. Verify the behavior in the browser, including refresh and backup/restore when the change affects saved data.

If the build reports a TypeScript error, follow the referenced file and line. The compiler catches many mismatches between components, store actions, and shared types before the app is deployed.
