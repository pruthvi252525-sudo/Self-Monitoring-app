export type TaskPriority = 'P1' | 'P2' | 'P3' | 'P4';
// P1: Urgent-Important, P2: High, P3: Medium, P4: Low

export type TaskCategory = 'Academic' | 'Dev Project' | 'Personal';

export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'rolled-over';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ResourceLink {
  id: string;
  title: string;
  url: string;
  category?: 'github' | 'docs' | 'paper' | 'video' | 'general';
  note?: string;
  createdAt: string;
}

export interface WorkspaceAsset {
  id: string;
  name: string;
  url: string; // data URL or web image URL
  type: 'image' | 'diagram' | 'slide' | 'doc';
  size?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  estimatedDuration: number; // in minutes
  actualDuration?: number; // in minutes logged
  deadline: string; // ISO 8601 string
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
  notes: string; // Markdown notes
  checklist: ChecklistItem[];
  resources: ResourceLink[];
  assets: WorkspaceAsset[];
  order?: number;
}

