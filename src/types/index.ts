export interface Player {
  name: string; // Unique identifier
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
}

export interface Question {
  title: string; // Unique identifier
  content: string;
  answer: string;
  difficulty: 1 | 2 | 3;
  tags: string[];
  targets?: string[]; // Player names who cannot answer
  timer?: number; // Seconds
  photo?: string; // Optional photo URL
}

export type GameState = 'setup' | 'ongoing' | 'completed';

export interface TimerState {
  isActive: boolean;
  timeRemaining: number;
  initialTime: number;
}

export type AnswerMode = 'individual' | 'duel' | 'teams';

export interface GameContext {
  players: Player[];
  teams: Team[];
  questions: Question[];
  currentQuestion: Question | null;
  scores: Map<string, number>; // Player/Team name -> score
  gameState: GameState;
  timerState: TimerState;
  answerMode: AnswerMode;
  selectedAnswerer?: string; // Player or team name
}

export interface QuestionFilters {
  tags: string[];
  difficulties: (1 | 2 | 3)[];
  targets: string[];
}
