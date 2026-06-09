import type { PillarSlug } from './quiz';

export interface AIPlan {
  userId: string;
  dominant: PillarSlug;
  secondary: PillarSlug;
  tertiary: PillarSlug;
  sprints: Sprint[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Sprint {
  id: string;
  week: number;
  category: 'economic' | 'spiritual' | 'mental' | 'celebration';
  title: string;
  description: string;
  tasks: Task[];
  completed: boolean;
  completedAt?: Date;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  metric?: string;
}

export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIChatSession {
  userId: string;
  messages: AIChatMessage[];
  createdAt: Date;
}
