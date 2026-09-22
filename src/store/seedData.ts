import { Task, TimeBlock, DailyReview, DailyMetric } from '../types';
import { getTodayDateString } from '../utils/dateUtils';

const today = getTodayDateString();

export const SEED_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'CS 641: Raft Consensus Protocol Implementation',
    description: 'Implement leader election, log replication, and RPC heartbeat mechanisms for distributed state machines.',
    category: 'Academic',
    priority: 'P1',
    estimatedDuration: 90,
    actualDuration: 45,
    deadline: `${today}T18:00:00`,
    status: 'in-progress',
    createdAt: `${today}T08:00:00`,
    order: 0,
    checklist: [
      { id: 'c1', text: 'Implement RequestVote RPC handler and randomized timer', completed: true },
      { id: 'c2', text: 'Handle AppendEntries heartbeat logic', completed: true },
      { id: 'c3', text: 'Simulate network partition recovery scenario', completed: false },
      { id: 'c4', text: 'Write stress unit tests with concurrent candidate elections', completed: false },
    ],
    resources: [
      {
        id: 'r1',
        title: 'In Search of an Understandable Consensus (Ongaro & Ousterhout)',
        url: 'https://raft.github.io/raft.pdf',
        category: 'paper',
        note: 'Sections 5.1 and 5.2 are crucial for state transitions.',
        createdAt: `${today}T08:00:00`,
      },
      {
        id: 'r2',
        title: 'Secret Teaching Lab Raft Visualizer',
        url: 'https://thesecretlivesofdata.com/raft/',
        category: 'docs',
        note: 'Interactive visualizer for edge case debugging.',
        createdAt: `${today}T08:10:00`,
      },
    ],
    assets: [
      {
        id: 'a1',
        name: 'raft-state-machine.svg',
        url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
        type: 'diagram',
        size: '142 KB',
        createdAt: `${today}T08:15:00`,
      },
    ],
    notes: `### Implementation Notes: Raft Consensus
- **Node States:** Follower -> Candidate -> Leader.
- **Heartbeat Interval:** 50ms. Election timeout: randomized between 150ms and 300ms to avert split votes.
- **Critical Safety Invariant:** Election restriction (candidate's log must be at least as up-to-date as receiver's log).

\`\`\`go
type RequestVoteArgs struct {
    Term         int
    CandidateId  int
    LastLogIndex int
    LastLogTerm  int
}
\`\`\`
`,
  },
  {
    id: 'task-2',
    title: 'Self-Monitoring App: Auto-Schedule Engine Refactor',
    description: 'Optimize bin-packing scheduling logic for 08:00 - 22:00 timeline with dynamic buffer insertion.',
    category: 'Dev Project',
    priority: 'P1',
    estimatedDuration: 60,
    actualDuration: 60,
    deadline: `${today}T20:30:00`,
    status: 'in-progress',
    createdAt: `${today}T08:30:00`,
    order: 1,
    checklist: [
      { id: 'c2-1', text: 'Define non-overlapping time interval math', completed: true },
      { id: 'c2-2', text: 'Preserve user fixed calendar events', completed: true },
      { id: 'c2-3', text: 'Integrate dynamic lunch hour gap allocation', completed: true },
      { id: 'c2-4', text: 'Trigger audio alert on active block expiry', completed: false },
    ],
    resources: [
      {
        id: 'r2-1',
        title: 'Interval Scheduling Algorithm & Greedy Strategy',
        url: 'https://en.wikipedia.org/wiki/Interval_scheduling',
        category: 'docs',
        note: 'O(n log n) sorting by priority and deadline',
        createdAt: `${today}T08:35:00`,
      },
      {
        id: 'r2-2',
        title: 'GitHub Repo PR #4: Scheduling Store',
        url: 'https://github.com/pruthvi252525-sudo/Self-Monitoring-app',
        category: 'github',
        createdAt: `${today}T08:40:00`,
      },
    ],
    assets: [],
    notes: `### Algorithm Optimization Strategy
1. Filter only active pending tasks.
2. Rank tasks by Weighted Priority (P1 > P2 > P3 > P4) then earliest deadline.
3. Search for open slot >= task.estimatedDuration + buffer.
4. Auto-insert lunch at 12:30.
`,
  },
  {
    id: 'task-3',
    title: 'MATH 420: Convex Optimization Problem Set 4',
    description: 'Solve problems on Karush-Kuhn-Tucker (KKT) optimality conditions and duality gap.',
    category: 'Academic',
    priority: 'P2',
    estimatedDuration: 75,
    deadline: `${today}T23:59:00`,
    status: 'todo',
    createdAt: `${today}T09:00:00`,
    order: 2,
    checklist: [
      { id: 'c3-1', text: 'Prove strong duality under Slater constraint qualification', completed: false },
      { id: 'c3-2', text: 'Derive dual problem for Support Vector Machine objective', completed: false },
      { id: 'c3-3', text: 'Typeset solutions in LaTeX and export PDF', completed: false },
    ],
    resources: [
      {
        id: 'r3-1',
        title: 'Convex Optimization - Boyd & Vandenberghe (Chapter 5)',
        url: 'https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf',
        category: 'paper',
        note: 'Review Theorem 5.3.2 for complementary slackness',
        createdAt: `${today}T09:10:00`,
      },
    ],
    assets: [],
    notes: `### Key Formulas to Reference
- **Lagrangian:** $L(x, \lambda, \nu) = f_0(x) + \sum \lambda_i f_i(x) + \sum \nu_i h_i(x)$
- **Primal Feasibility:** $f_i(x^*) \le 0, h_i(x^*) = 0$
- **Complementary Slackness:** $\lambda_i^* f_i(x^*) = 0$
`,
  },
  {
    id: 'task-4',
    title: 'Code Review: Auth Token Rotation & Session Revocation',
    description: 'Review and benchmark security PR for sliding expiration tokens and Redis blacklist.',
    category: 'Dev Project',
    priority: 'P2',
    estimatedDuration: 45,
    deadline: `${today}T21:00:00`,
    status: 'todo',
    createdAt: `${today}T09:15:00`,
    order: 3,
    checklist: [
      { id: 'c4-1', text: 'Verify atomic token invalidation in Redis pipeline', completed: false },
      { id: 'c4-2', text: 'Check edge cases for cross-tab token refresh race conditions', completed: false },
    ],
    resources: [
      {
        id: 'r4-1',
        title: 'RFC 6749 - OAuth 2.0 Token Refresh Best Practices',
        url: 'https://datatracker.ietf.org/doc/html/rfc6749#section-6',
        category: 'docs',
        createdAt: `${today}T09:20:00`,
      },
    ],
    assets: [],
    notes: 'Confirm tokens are cryptographically signed with Ed25519.',
  },
  {
    id: 'task-5',
    title: '30-Minute Deep Stretch & Ergonomic Mobility',
    description: 'Postural reset, hamstring stretches, and shoulder mobility after long keyboard sprint.',
    category: 'Personal',
    priority: 'P3',
    estimatedDuration: 30,
    deadline: `${today}T19:30:00`,
    status: 'todo',
    createdAt: `${today}T09:30:00`,
    order: 4,
    checklist: [
      { id: 'c5-1', text: 'Thoracic extension with foam roller', completed: false },
      { id: 'c5-2', text: 'Hip flexor stretch 2 mins each side', completed: false },
    ],
    resources: [],
    assets: [],
    notes: 'Hydrate with electrolytes.',
  },
  {
    id: 'task-6',
    title: 'Read Systems Architecture Paper (Google Spanner / TrueTime)',
    description: 'Study how synchronized atomic clocks and GPS receivers enable linearizable distributed transactions.',
    category: 'Academic',
    priority: 'P3',
    estimatedDuration: 45,
    deadline: `${today}T22:00:00`,
    status: 'completed',
    createdAt: `${today}T07:30:00`,
    completedAt: `${today}T08:15:00`,
    order: 5,
    checklist: [
      { id: 'c6-1', text: 'Read TrueTime uncertainty bounds [earliest, latest]', completed: true },
      { id: 'c6-2', text: 'Take structured atomic notes in markdown', completed: true },
    ],
    resources: [
      {
        id: 'r6-1',
        title: 'Spanner: Google’s Globally-Distributed Database',
        url: 'https://research.google/pubs/pub39966/',
        category: 'paper',
        createdAt: `${today}T07:30:00`,
      },
    ],
    assets: [],
    notes: 'TrueTime guarantees: if $t_{start} > t_{end}$, then transaction $T_2$ sees commit of $T_1$.',
  },
];

export const SEED_BLOCKS: TimeBlock[] = [
  {
    id: 'b-1',
    taskId: 'task-6',
    title: 'Read Systems Architecture Paper (Spanner)',
    date: today,
    startTime: '08:00',
    endTime: '08:45',
    category: 'Academic',
    priority: 'P3',
    status: 'completed',
    actualMinutesLogged: 45,
  },
  {
    id: 'b-2',
    taskId: 'task-1',
    title: 'CS 641: Raft Consensus Protocol Implementation',
    date: today,
    startTime: '09:00',
    endTime: '10:30',
    category: 'Academic',
    priority: 'P1',
    status: 'active',
    actualMinutesLogged: 45,
  },
  {
    id: 'b-3',
    taskId: 'task-2',
    title: 'Self-Monitoring App: Auto-Schedule Engine Refactor',
    date: today,
    startTime: '10:45',
    endTime: '11:45',
    category: 'Dev Project',
    priority: 'P1',
    status: 'scheduled',
    actualMinutesLogged: 0,
  },
  {
    id: 'b-lunch',
    title: '🍽️ Lunch & Mental Reset',
    date: today,
    startTime: '12:30',
    endTime: '13:15',
    category: 'Personal',
    priority: 'P4',
    status: 'scheduled',
    actualMinutesLogged: 0,
    isBreak: true,
  },
  {
    id: 'b-4',
    taskId: 'task-3',
    title: 'MATH 420: Convex Optimization Problem Set 4',
    date: today,
    startTime: '14:00',
    endTime: '15:15',
    category: 'Academic',
    priority: 'P2',
    status: 'scheduled',
    actualMinutesLogged: 0,
  },
];

export const SEED_REVIEWS: DailyReview[] = [
  {
    id: 'rev-yesterday',
    date: '2026-09-21',
    rating: 5,
    wins: 'Finished the Distributed Systems midterm prep and completed 4 high-priority PRs without context switching.',
    blockers: 'Wi-Fi disconnect in the afternoon cost 15 minutes, but offline notes worked flawlessly.',
    notes: 'Keep morning focus blocks uninterrupted. Avoid opening social media before 12:00.',
    createdAt: '2026-09-21T21:45:00',
  },
];

export const SEED_METRICS: DailyMetric[] = [
  {
    date: '2026-09-19',
    tasksPlanned: 6,
    tasksCompleted: 5,
    tasksOverdue: 0,
    tasksRolledOver: 1,
    focusMinutes: 240,
    productivityScore: 88,
    categoryBreakdown: { Academic: 120, 'Dev Project': 90, Personal: 30 },
  },
  {
    date: '2026-09-20',
    tasksPlanned: 5,
    tasksCompleted: 4,
    tasksOverdue: 1,
    tasksRolledOver: 0,
    focusMinutes: 195,
    productivityScore: 82,
    categoryBreakdown: { Academic: 75, 'Dev Project': 90, Personal: 30 },
  },
  {
    date: '2026-09-21',
    tasksPlanned: 7,
    tasksCompleted: 7,
    tasksOverdue: 0,
    tasksRolledOver: 0,
    focusMinutes: 285,
    productivityScore: 96,
    categoryBreakdown: { Academic: 135, 'Dev Project': 120, Personal: 30 },
  },
];

