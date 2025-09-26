import React, { createContext, useContext, useReducer, ReactNode, useEffect, useRef } from 'react';
import { GameContext, Player, Team, Question, GameState, TimerState, AnswerMode, ScoreboardMode } from '../types';
import { loadQuestionsFromYAML, loadGameDataFromYAML } from '../utils/yamlLoader';

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
  setSelectedOpponents: (opponent1: string, opponent2: string) => void;
  clearSelectedOpponents: () => void;
  setSelectedChampions: (teamName: string, champions: string[]) => void;
  clearSelectedChampions: () => void;
  setScoreboardMode: (mode: ScoreboardMode) => void;
}

type GameAction =
  | { type: 'ADD_PLAYER'; payload: Player }
  | { type: 'REMOVE_PLAYER'; payload: string }
  | { type: 'ADD_TEAM'; payload: Team }
  | { type: 'REMOVE_TEAM'; payload: string }
  | { type: 'LOAD_QUESTIONS'; payload: Question[] }
  | { type: 'LOAD_INITIAL_PLAYERS'; payload: Player[] }
  | { type: 'SET_CURRENT_QUESTION'; payload: Question | null }
  | { type: 'UPDATE_SCORE'; payload: { name: string; points: number } }
  | { type: 'SET_GAME_STATE'; payload: GameState }
  | { type: 'SET_TIMER_STATE'; payload: Partial<TimerState> }
  | { type: 'SET_ANSWER_MODE'; payload: AnswerMode }
  | { type: 'SET_SELECTED_ANSWERER'; payload: string }
  | { type: 'SET_DISPLAYED_QUESTION'; payload: Question | null }
  | { type: 'SET_SELECTED_OPPONENTS'; payload: { opponent1: string; opponent2: string } }
  | { type: 'CLEAR_SELECTED_OPPONENTS' }
  | { type: 'SET_SELECTED_CHAMPIONS'; payload: { teamName: string; champions: string[] } }
  | { type: 'CLEAR_SELECTED_CHAMPIONS' }
  | { type: 'SET_SCOREBOARD_MODE'; payload: ScoreboardMode };

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
  displayedQuestion: null,
  selectedOpponent1: undefined,
  selectedOpponent2: undefined,
  selectedChampions: undefined,
  scoreboardMode: 'hidden'
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
    case 'LOAD_INITIAL_PLAYERS':
      // Merge with existing players, avoiding duplicates
      const existingPlayerNames = state.players.map(p => p.name);
      const newPlayers = action.payload.filter(p => !existingPlayerNames.includes(p.name));
      return { ...state, players: [...state.players, ...newPlayers] };
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
    case 'SET_SELECTED_OPPONENTS':
      return {
        ...state,
        selectedOpponent1: action.payload.opponent1,
        selectedOpponent2: action.payload.opponent2
      };
    case 'CLEAR_SELECTED_OPPONENTS':
      return {
        ...state,
        selectedOpponent1: undefined,
        selectedOpponent2: undefined
      };
    case 'SET_SELECTED_CHAMPIONS':
      const newChampions = new Map(state.selectedChampions);
      newChampions.set(action.payload.teamName, action.payload.champions);
      return { ...state, selectedChampions: newChampions };
    case 'CLEAR_SELECTED_CHAMPIONS':
      return { ...state, selectedChampions: undefined };
    case 'SET_SCOREBOARD_MODE':
      return { ...state, scoreboardMode: action.payload };
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

  // Load game data from game.yaml file on initialization
  useEffect(() => {
    const loadGameDataFromFile = async () => {
      try {
        console.log('Attempting to load game data from /game.yaml');
        const response = await fetch('/game.yaml');

        if (response.ok) {
          const yamlContent = await response.text();
          console.log('YAML content loaded:', yamlContent.substring(0, 100) + '...');

          const gameData = await loadGameDataFromYAML(yamlContent);
          console.log(`Loaded ${gameData.questions.length} questions and ${gameData.players?.length || 0} players`);

          dispatch({ type: 'LOAD_QUESTIONS', payload: gameData.questions });
          if (gameData.players && gameData.players.length > 0) {
            dispatch({ type: 'LOAD_INITIAL_PLAYERS', payload: gameData.players });
          }
        } else {
          console.warn(`game.yaml file not found. Status: ${response.status}.`);
        }
      } catch (error) {
        console.error('Failed to load game data from file:', error);
      }
    };

    loadGameDataFromFile();
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

  const setSelectedOpponents = (opponent1: string, opponent2: string) => {
    dispatch({ type: 'SET_SELECTED_OPPONENTS', payload: { opponent1, opponent2 } });
  };

  const clearSelectedOpponents = () => {
    dispatch({ type: 'CLEAR_SELECTED_OPPONENTS' });
  };

  const setSelectedChampions = (teamName: string, champions: string[]) => {
    dispatch({ type: 'SET_SELECTED_CHAMPIONS', payload: { teamName, champions } });
  };

  const clearSelectedChampions = () => {
    dispatch({ type: 'CLEAR_SELECTED_CHAMPIONS' });
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

  const setScoreboardMode = (mode: ScoreboardMode) => {
    dispatch({ type: 'SET_SCOREBOARD_MODE', payload: mode });
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
    clearPlayerView,
    setSelectedOpponents,
    clearSelectedOpponents,
    setSelectedChampions,
    clearSelectedChampions,
    setScoreboardMode
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
