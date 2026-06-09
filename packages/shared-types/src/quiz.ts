export interface Question {
  id: number;
  axis: 'F' | 'I' | 'C' | 'A'; // Focalización, Indagación, Confrontación, Acción
  text: string;
  options: Option[];
}

export interface Option {
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
  scores: Record<PillarSlug, number>; // Cada opción suma puntos a 2 pilares
}

export type PillarSlug =
  | 'arquitecto-sonico'
  | 'alienigena-cameleon'
  | 'chaman-tribu'
  | 'nobel-errante'
  | 'forajido-duelo'
  | 'iconoclasta-satirico'
  | 'resistencia-obrera'
  | 'canalla-dionisiaco';

export interface QuizResult {
  userId?: string;
  answers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  scores: Record<PillarSlug, number>;
  dominant: PillarSlug;
  secondary: PillarSlug;
  tertiary: PillarSlug;
  completedAt: Date;
}

export interface QuizState {
  currentQuestion: number;
  answers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  isComplete: boolean;
}
