# Self-Monitoring App (Productivity Operating System)

A modular, high-productivity web application designed to organize academic coursework, coding projects, and daily scheduling.

---

## 🚀 Core Architecture & Windows

### 1. Window 1: Task Command Center
- **Attributes:** Title, description, category (`Academic`, `Dev Project`, `Personal`), priority (`P1 Urgent-Important`, `P2 High`, `P3 Medium`, `P4 Low`), estimated duration, and strict deadline timestamp.
- **3 Dynamic Views:** Sortable Table List (with live countdown urgency badges), Eisenhower Matrix (4-quadrant decision view), and Kanban Board (4-stage workflow).
- **Filtering & Search:** Instant keyword search and filter chips for priority, category, and status.

### 2. Window 2: Dynamic Workspace (Context Hub)
- **Task Attachment Hub:**
  - **Task Switcher:** Navigate between tasks without context switching.
  - **Markdown Notes Editor:** Split-pane & live preview editor with code syntax formatting and auto-save.
  - **Resource Links Manager:** URL cards with domain categorizations (GitHub, Docs, Papers, Videos) and copy/launch tools.
  - **Visual Asset Gallery:** Screenshot & diagram gallery with local file upload and lightbox modal.
  - **Subtask Checklist:** Action items with live progress percentage bar.

### 3. Window 3: Smart Daily Scheduler & Calendar Automation
- **Auto-Schedule Engine ("Auto-Plan My Day"):** One-click non-overlapping algorithm that allocates pending tasks between 08:00 and 22:00, with 10-minute buffers and a 45-minute lunch break reservation.
- **Interactive Calendar:** Hour-by-hour day view (with `+15m` / `-15m` block adjustments) and 7-day week view.
- **Pomodoro Focus Engine:** Circular countdown ring with Focus (25m), Short Break (5m), and Long Break (15m) modes that logs actual focus time to tasks and daily metrics.

### 4. Window 4: Performance & Accountability Analytics
- **Productivity Score:** Dynamic calculation based on weighted priority completion ($P1: 40\%$, $P2: 30\%$, $P3: 20\%$, $P4: 10\%$).
- **Task Velocity:** Total tasks vs on-time vs in-progress vs rolled over.
- **Streak & Focus Hours:** Consecutive active days and category time breakdown.
- **Daily Review & Reflection:** 1-5 star assessment and journaling prompt for wins, blockers, and plans.

---

## 🛠️ Tech Stack

- **Framework:** React 18 + Vite 6 + TypeScript (Strict mode)
- **Styling:** Tailwind CSS (modern dark theme, glassmorphism, contrast-compliant tokens)
- **State & Persistence:** Zustand 5 with `persist` middleware (`localStorage`, zero data loss on refresh)
- **Icons & UI:** `lucide-react`, `canvas-confetti`

---

## 💻 Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```