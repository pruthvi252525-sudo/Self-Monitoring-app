import { Task, TimeBlock, DailyReview, DailyMetric } from '../types';

export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportAppStateAsJson = (data: {
  tasks: Task[];
  timeBlocks: TimeBlock[];
  dailyMetrics: DailyMetric[];
  dailyReviews: DailyReview[];
  exportedAt: string;
}) => {
  const jsonString = JSON.stringify(data, null, 2);
  const dateStr = new Date().toISOString().split('T')[0];
  downloadFile(jsonString, `self-monitoring-backup-${dateStr}.json`, 'application/json');
};

export const exportTaskWorkspaceAsMarkdown = (task: Task) => {
  const lines: string[] = [
    `# ${task.title}`,
    ``,
    `**Category:** ${task.category}  `,
    `**Priority:** ${task.priority}  `,
    `**Status:** ${task.status}  `,
    `**Estimated Duration:** ${task.estimatedDuration} mins  `,
    `**Deadline:** ${task.deadline || 'None'}  `,
    `**Created:** ${task.createdAt}  `,
    ``,
    `## Description`,
    task.description || '_No description provided._',
    ``,
    `## Checklist / Action Items`,
  ];

  if (task.checklist && task.checklist.length > 0) {
    task.checklist.forEach((item) => {
      lines.push(`- [${item.completed ? 'x' : ' '}] ${item.text}`);
    });
  } else {
    lines.push(`_No checklist items._`);
  }

  lines.push(``, `## Resource Links`);
  if (task.resources && task.resources.length > 0) {
    task.resources.forEach((r) => {
      lines.push(`- [${r.title}](${r.url}) ${r.category ? `\`[${r.category}]\`` : ''}${r.note ? ` - ${r.note}` : ''}`);
    });
  } else {
    lines.push(`_No resource links attached._`);
  }

  lines.push(``, `## Workspace Notes`);
  lines.push(task.notes || '_No notes recorded yet._');

  const md = lines.join('\n');
  const filename = `${task.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30)}-notes.md`;
  downloadFile(md, filename, 'text/markdown');
};

export const exportDailySummaryAsMarkdown = (
  date: string,
  tasks: Task[],
  blocks: TimeBlock[],
  review?: DailyReview
) => {
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const pendingTasks = tasks.filter((t) => t.status !== 'completed');

  const lines: string[] = [
    `# Daily Productivity & Accountability Report - ${date}`,
    ``,
    `## Summary Statistics`,
    `- **Tasks Completed:** ${completedTasks.length}`,
    `- **Pending Tasks:** ${pendingTasks.length}`,
    `- **Scheduled Time Blocks:** ${blocks.length}`,
    review ? `- **Day Rating:** ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)} (${review.rating}/5)` : '',
    ``,
    `## Completed Tasks`,
  ];

  if (completedTasks.length > 0) {
    completedTasks.forEach((t) => {
      lines.push(`- [x] **[${t.priority}]** ${t.title} _(${t.category}, ~${t.estimatedDuration}m)_`);
    });
  } else {
    lines.push(`_No tasks marked complete today._`);
  }

  lines.push(``, `## Pending / Carried Over`);
  if (pendingTasks.length > 0) {
    pendingTasks.forEach((t) => {
      lines.push(`- [ ] **[${t.priority}]** ${t.title} _(${t.category}, ~${t.estimatedDuration}m)_`);
    });
  } else {
    lines.push(`_All tasks clear!_`);
  }

  lines.push(``, `## Time Blocks Executed`);
  if (blocks.length > 0) {
    blocks.forEach((b) => {
      lines.push(`- \`${b.startTime} - ${b.endTime}\` **${b.title}** _[${b.status}]_`);
    });
  } else {
    lines.push(`_No time blocks scheduled._`);
  }

  if (review) {
    lines.push(``, `## Daily Reflection`);
    lines.push(`### Wins of the Day`);
    lines.push(review.wins || '_None specified_');
    lines.push(``, `### Blockers Encountered`);
    lines.push(review.blockers || '_None specified_');
    lines.push(``, `### Key Takeaways / Notes`);
    lines.push(review.notes || '_None specified_');
  }

  const md = lines.join('\n');
  downloadFile(md, `daily-summary-${date}.md`, 'text/markdown');
};

