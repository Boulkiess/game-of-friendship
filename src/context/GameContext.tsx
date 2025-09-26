import React, { createContext, useContext, useReducer, ReactNode, useEffect, useRef } from 'react';
import { GameContext, Player, Team, Question, GameState, TimerState, AnswerMode } from '../types';
import { loadQuestionsFromYAML } from '../utils/yamlLoader';

interface GameContextType extends GameContext {
  addPlayer: (player: Player) => void;
  removePlayer: (playerName: string) => void;
  addTeam: (team: Team) => void;
  removeTeam: (teamId: string) => void;
  loadQuestions: (questions: Question[]) => void;
  setCurrentQuestion: (question: Question | null) => void;
  updateScore: (playerOrTeamName: string, points: number) => void;
  setGameState: (state: GameState) => void;
  startTimer: (seconds: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  setAnswerMode: (mode: AnswerMode) => void;
  setSelectedAnswerer: (name: string) => void;
  updateTimer: (timeRemaining: number) => void;
  openPlayerView: () => void;
  closePlayerView: () => void;
  sendQuestionToPlayers: (question: Question) => void;
  clearPlayerView: () => void;
}

type GameAction =
  | { type: 'ADD_PLAYER'; payload: Player }
  | { type: 'REMOVE_PLAYER'; payload: string }
  | { type: 'ADD_TEAM'; payload: Team }
  | { type: 'REMOVE_TEAM'; payload: string }
  | { type: 'LOAD_QUESTIONS'; payload: Question[] }
  | { type: 'SET_CURRENT_QUESTION'; payload: Question | null }
  | { type: 'UPDATE_SCORE'; payload: { name: string; points: number } }
  | { type: 'SET_GAME_STATE'; payload: GameState }
  | { type: 'SET_TIMER_STATE'; payload: Partial<TimerState> }
  | { type: 'SET_ANSWER_MODE'; payload: AnswerMode }
  | { type: 'SET_SELECTED_ANSWERER'; payload: string }
  | { type: 'SET_DISPLAYED_QUESTION'; payload: Question | null };

const initialState: GameContext = {
  players: [],
  teams: [],
  questions: [],
  currentQuestion: null,
  scores: new Map(),
  gameState: 'setup',
  timerState: {
    isActive: false,
    timeRemaining: 0,
    initialTime: 0
  },
  answerMode: 'individual',
  displayedQuestion: null
};

function gameReducer(state: GameContext, action: GameAction): GameContext {
  switch (action.type) {
    case 'ADD_PLAYER':
      return { ...state, players: [...state.players, action.payload] };
    case 'REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter(p => p.name !== action.payload)
      };
    case 'ADD_TEAM':
      return { ...state, teams: [...state.teams, action.payload] };
    case 'REMOVE_TEAM':
      return {
        ...state,
        teams: state.teams.filter(t => t.id !== action.payload)
      };
    case 'LOAD_QUESTIONS':
      return { ...state, questions: action.payload };
    case 'SET_CURRENT_QUESTION':
      return { ...state, currentQuestion: action.payload };
    case 'UPDATE_SCORE':
      const newScores = new Map(state.scores);
      const currentScore = newScores.get(action.payload.name) || 0;
      newScores.set(action.payload.name, currentScore + action.payload.points);
      return { ...state, scores: newScores };
    case 'SET_GAME_STATE':
      return { ...state, gameState: action.payload };
    case 'SET_TIMER_STATE':
      return {
        ...state,
        timerState: { ...state.timerState, ...action.payload }
      };
    case 'SET_ANSWER_MODE':
      return { ...state, answerMode: action.payload };
    case 'SET_SELECTED_ANSWERER':
      return { ...state, selectedAnswerer: action.payload };
    case 'SET_DISPLAYED_QUESTION':
      return { ...state, displayedQuestion: action.payload };
    default:
      return state;
  }
}

const GameContextProvider = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const playerWindowRef = useRef<Window | null>(null);

  // Post message to player window when state changes
  useEffect(() => {
    if (playerWindowRef.current && !playerWindowRef.current.closed) {
      playerWindowRef.current.postMessage({
        type: 'GAME_STATE_UPDATE',
        payload: state
      }, window.location.origin);
    }
  }, [state]);

  // Load questions from questions.yaml file on initialization
  useEffect(() => {
    const loadQuestionsFromFile = async () => {
      try {
        console.log('Attempting to load questions from /questions.yaml');
        const response = await fetch('/questions.yaml');

        if (response.ok) {
          const yamlContent = await response.text();
          console.log('YAML content loaded:', yamlContent.substring(0, 100) + '...');

          const questions = await loadQuestionsFromYAML(yamlContent);
          console.log(`Loaded ${questions.length} questions`);

          dispatch({ type: 'LOAD_QUESTIONS', payload: questions });
        } else {
          console.warn(`questions.yaml file not found. Status: ${response.status}`);
        }
      } catch (error) {
        console.error('Failed to load questions from file:', error);
      }
    };

    loadQuestionsFromFile();
  }, []);

  const addPlayer = (player: Player) => {
    dispatch({ type: 'ADD_PLAYER', payload: player });
  };

  const removePlayer = (playerName: string) => {
    dispatch({ type: 'REMOVE_PLAYER', payload: playerName });
  };

  const addTeam = (team: Team) => {
    dispatch({ type: 'ADD_TEAM', payload: team });
  };

  const removeTeam = (teamId: string) => {
    dispatch({ type: 'REMOVE_TEAM', payload: teamId });
  };

  const loadQuestions = (questions: Question[]) => {
    dispatch({ type: 'LOAD_QUESTIONS', payload: questions });
  };

  const setCurrentQuestion = (question: Question | null) => {
    dispatch({ type: 'SET_CURRENT_QUESTION', payload: question });
  };

  const updateScore = (playerOrTeamName: string, points: number) => {
    dispatch({ type: 'UPDATE_SCORE', payload: { name: playerOrTeamName, points } });
  };

  const setGameState = (gameState: GameState) => {
    dispatch({ type: 'SET_GAME_STATE', payload: gameState });

    // Auto-open player view when game starts
    if ((gameState === 'ongoing' || gameState === 'completed') && (!playerWindowRef.current || playerWindowRef.current.closed)) {
      openPlayerView();
    }
  };

  const startTimer = (seconds: number) => {
    dispatch({
      type: 'SET_TIMER_STATE',
      payload: { isActive: true, timeRemaining: seconds, initialTime: seconds }
    });
  };

  const updateTimer = (timeRemaining: number) => {
    dispatch({
      type: 'SET_TIMER_STATE',
      payload: { timeRemaining }
    });
  };

  const pauseTimer = () => {
    dispatch({ type: 'SET_TIMER_STATE', payload: { isActive: false } });
  };

  const resumeTimer = () => {
    dispatch({ type: 'SET_TIMER_STATE', payload: { isActive: true } });
  };

  const resetTimer = () => {
    dispatch({
      type: 'SET_TIMER_STATE',
      payload: {
        isActive: false,
        timeRemaining: state.timerState.initialTime
      }
    });
  };

  const setAnswerMode = (mode: AnswerMode) => {
    dispatch({ type: 'SET_ANSWER_MODE', payload: mode });
  };

  const setSelectedAnswerer = (name: string) => {
    dispatch({ type: 'SET_SELECTED_ANSWERER', payload: name });
  };

  const openPlayerView = () => {
    if (playerWindowRef.current && !playerWindowRef.current.closed) {
      playerWindowRef.current.focus();
      return;
    }

    playerWindowRef.current = window.open(
      '/player-view',
      'playerView',
      'width=800,height=600,scrollbars=yes,resizable=yes'
    );
  };

  const closePlayerView = () => {
    if (playerWindowRef.current && !playerWindowRef.current.closed) {
      playerWindowRef.current.close();
    }
    playerWindowRef.current = null;
  };

  const sendQuestionToPlayers = (question: Question) => {
    dispatch({ type: 'SET_DISPLAYED_QUESTION', payload: question });
    // Stop the timer and set initial value to question's timer (if it has one)
    const initialTime = question.timer || 0;
    dispatch({
      type: 'SET_TIMER_STATE',
      payload: {
        isActive: false,
        timeRemaining: initialTime,
        initialTime: initialTime
      }
    });
  };

  const clearPlayerView = () => {
    dispatch({ type: 'SET_DISPLAYED_QUESTION', payload: null });
  };

  const value: GameContextType = {
    ...state,
    addPlayer,
    removePlayer,
    addTeam,
    removeTeam,
    loadQuestions,
    setCurrentQuestion,
    updateScore,
    setGameState,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    setAnswerMode,
    setSelectedAnswerer,
    updateTimer,
    openPlayerView,
    closePlayerView,
    sendQuestionToPlayers,
    clearPlayerView
  };

  return (
    <GameContextProvider.Provider value={value}>
      {children}
    </GameContextProvider.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContextProvider);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
