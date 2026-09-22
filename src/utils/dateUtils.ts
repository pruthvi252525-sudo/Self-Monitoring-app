export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateDisplay = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const formatTimeDisplay = (timeStr: string): string => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return timeStr;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
};

export const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
};

export const minutesToTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = Math.floor(totalMinutes % 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export const addMinutesToTime = (timeStr: string, minutesToAdd: number): string => {
  const currentMinutes = timeToMinutes(timeStr);
  return minutesToTime(currentMinutes + minutesToAdd);
};

export const isOverdue = (deadlineStr: string): boolean => {
  if (!deadlineStr) return false;
  const deadline = new Date(deadlineStr).getTime();
  const now = new Date().getTime();
  return deadline < now;
};

export const isDueToday = (deadlineStr: string): boolean => {
  if (!deadlineStr) return false;
  const d = new Date(deadlineStr);
  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
};

export const formatDeadlineRemaining = (deadlineStr: string): { label: string; isUrgent: boolean; isLate: boolean } => {
  if (!deadlineStr) return { label: 'No deadline', isUrgent: false, isLate: false };
  
  const deadline = new Date(deadlineStr).getTime();
  const now = new Date().getTime();
  const diffMs = deadline - now;
  
  if (diffMs < 0) {
    const absDiffMinutes = Math.floor(Math.abs(diffMs) / (1000 * 60));
    if (absDiffMinutes < 60) {
      return { label: `Overdue by ${absDiffMinutes}m`, isUrgent: true, isLate: true };
    }
    const absDiffHours = Math.floor(absDiffMinutes / 60);
    if (absDiffHours < 24) {
      return { label: `Overdue by ${absDiffHours}h`, isUrgent: true, isLate: true };
    }
    const absDiffDays = Math.floor(absDiffHours / 24);
    return { label: `Overdue by ${absDiffDays}d`, isUrgent: true, isLate: true };
  }
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 60) {
    return { label: `Due in ${diffMinutes}m`, isUrgent: true, isLate: false };
  }
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return { label: `Due in ${diffHours}h ${diffMinutes % 60}m`, isUrgent: diffHours <= 6, isLate: false };
  }
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) {
    return { label: 'Due tomorrow', isUrgent: false, isLate: false };
  }
  
  return { label: `Due in ${diffDays} days`, isUrgent: false, isLate: false };
};

export const getWeekDates = (baseDateStr?: string): { date: string; dayName: string; dayNumber: number; isToday: boolean }[] => {
  const base = baseDateStr ? new Date(baseDateStr) : new Date();
  const dayOfWeek = base.getDay(); // 0 = Sunday, 1 = Monday, ...
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const monday = new Date(base);
  monday.setDate(base.getDate() + mondayOffset);
  
  const days = [];
  const todayStr = getTodayDateString();
  
  for (let i = 0; i < 7; i++) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    days.push({
      date: dateStr,
      dayName: current.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: current.getDate(),
      isToday: dateStr === todayStr,
    });
  }
  
  return days;
};

