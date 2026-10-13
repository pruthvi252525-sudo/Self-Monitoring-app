# Self-Monitor

A calmer workspace for managing tasks, planning your day, and tracking focus.

## Team preview

The sign-in page and legal notices are presentation prototypes. The email/password form accepts demo input only: it does not authenticate, send, or save credentials. Google sign-in is not connected. The app stores task and focus data in browser local storage on the current device; it has no account service, server-side storage, or cloud sync.

### Demo sign-in

Use these placeholder values to enter the preview:

- **Email:** `demo@example.com`
- **Password:** `DemoPreview123!`

The form accepts any valid email address and any non-empty password; these example values are not real account credentials and are not checked or saved. Check the Terms of Use and Privacy Notice box to enable **Enter demo**. Never use a real password here.

The Terms of Use and Privacy Notice shown in the app are draft disclosures for this prototype, not legal advice or a guarantee of compliance. Before any public launch, connect a real authentication provider with server-side verification, document actual data flows and service providers, add a responsible organization and privacy contact, and have counsel review the notices for the jurisdictions where the service will operate. Do not enter real passwords or sensitive personal information in the preview.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create a production build, run:

```bash
npm run build
```

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
  store/                  App state, persistence, and starter data
  types/                  Task, schedule, and analytics types
  utils/                  Scheduling, date, and export helpers
  main.tsx                Browser entry point
```

## App sections

- **Tasks:** Create and organize tasks in list, Kanban, or Eisenhower views.
- **Workspace:** Keep notes, links, checklists, and attachments with each task.
- **Scheduler:** Plan time blocks and track focus with the Pomodoro timer.
- **Analytics:** Review task progress and focus metrics; export reports and backups.

App data is saved in this browser. Use **Export** to download a backup before clearing browser data or switching devices.
