export interface Player {
  name: string; // Unique identifier
  profilePicture?: string; // Optional profile picture URL/path
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

export type AnswerMode = 'individual' | 'duel' | 'teams' | 'teams-duel' | 'champions';

export type ScoreboardMode = 'players' | 'teams' | 'hidden';

export interface GameContext {
  players: Player[];
  teams: Team[];
  questions: Question[];
  currentQuestion: Question | null;
  displayedQuestion: Question | null; // Question shown to players (can be different from currentQuestion)
  scores: Map<string, number>; // Player/Team name -> score
  gameState: GameState;
  timerState: TimerState;
  answerMode: AnswerMode;
  selectedAnswerer?: string; // Player or team name
  selectedOpponent1?: string; // First opponent in duel modes
  selectedOpponent2?: string; // Second opponent in duel modes
  selectedChampions?: Map<string, string[]>; // Team name -> selected champions
  scoreboardMode: ScoreboardMode; // Which scoreboard to show to players
}

export interface QuestionFilters {
  tags: string[];
  difficulties: (1 | 2 | 3)[];
  targets: string[];
}
