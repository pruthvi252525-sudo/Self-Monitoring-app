# Self-Monitoring App

A personal productivity app for managing tasks, planning your day, and tracking focus.
to test login credentials 
Email: demo@example.com
pass: DemoPreview123!

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
