export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: Priority;
  dueDate: string;
  dueTime?: string;
  isCompleted: boolean;
  completedAt?: string;
  source: string;
  sourceDetail?: string;
  confidence?: number;
  context?: string;
  createdAt: string;
}

export interface ExtractedTask {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: string;
  dueDate: string;
  dueTime?: string;
  matchConfidence: number;
  checked: boolean;
  source: string;
  context?: string;
}

export interface ExtractionResult {
  detectedFormat: string;
  parsingModel: string;
  extractionTime: string;
  confidence: number;
  resolution: string;
  sourceName: string;
  imageUrl?: string;
  tasks: ExtractedTask[];
}

export type TabType = 'dashboard' | 'extract' | 'tasks' | 'settings';
