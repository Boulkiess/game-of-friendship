import React, { useEffect, useState } from 'react';
import { GameContext, Question } from '../types';
import { useMessageBasedPlayerViewStyles } from '../hooks/useStyles';
import { EntityDisplay, createEntityInfo } from './shared/EntityDisplay';

export const PlayerView: React.FC = () => {
  const [gameState, setGameState] = useState<GameContext | null>(null);
  const styles = useMessageBasedPlayerViewStyles();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'GAME_STATE_UPDATE') {
        setGameState(event.data.payload);
      }
    };

    window.addEventListener('message', handleMessage);

    // Notify parent window that player view is ready
    if (window.opener) {
      window.opener.postMessage({ type: 'PLAYER_VIEW_READY' }, window.location.origin);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  if (!gameState) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <h1 className={styles.loadingTitle}>Player View</h1>
          <p className={styles.loadingText}>Waiting for game to start...</p>
        </div>
      </div>
    );
  }

  const renderScoreboard = () => {
    if (gameState.scoreboardMode === 'hidden') return null;

    const entries = Array.from(gameState.scores.entries()).sort((a, b) => b[1] - a[1]);

    // Filter scores based on display mode
    const filteredScores = entries.filter(([name]) => {
      const entity = createEntityInfo(name, gameState.players, gameState.teams);
      if (gameState.scoreboardMode === 'players') return entity.type === 'player';
      if (gameState.scoreboardMode === 'teams') return entity.type === 'team';
      return true;
    });

    const getRankColor = (index: number) => {
      switch (index) {
        case 0: return 'text-yellow-600'; // Gold
        case 1: return 'text-gray-500'; // Silver
        case 2: return 'text-orange-600'; // Bronze
        default: return 'text-gray-600';
      }
    };

    const getRankIcon = (index: number) => {
      switch (index) {
        case 0: return '🥇';
        case 1: return '🥈';
        case 2: return '🥉';
        default: return `#${index + 1}`;
      }
    };

    const getTitle = () => {
      return gameState.scoreboardMode === 'players' ? 'Player Leaderboard' : 'Team Leaderboard';
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">{getTitle()}</h2>
            <button
              onClick={() => window.opener?.postMessage({ type: 'HIDE_SCOREBOARD' }, window.location.origin)}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <div className="p-4 overflow-y-auto">
            <div className="space-y-3">
              {filteredScores.map(([name, score], index) => {
                const entity = createEntityInfo(name, gameState.players, gameState.teams);

                return (
                  <div
                    key={name}
                    className={`flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors ${index < 3 ? 'bg-gradient-to-r from-yellow-50 to-white' : ''
                      }`}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <span className={`text-lg font-bold ${getRankColor(index)} min-w-[2rem]`}>
                        {getRankIcon(index)}
                      </span>

                      <EntityDisplay entity={entity} showType={false} />
                    </div>

                    <span className={`text-xl font-bold text-blue-600 ${index === 0 ? 'text-yellow-600' : ''}`}>
                      {score}
                    </span>
                  </div>
                );
              })}

              {filteredScores.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No {gameState.scoreboardMode === 'players' ? 'player' : 'team'} scores yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentQuestion = () => {
    if (!gameState.displayedQuestion) return null;

    return (
      <div className={styles.questionContainer}>
        <h2 className={styles.questionTitle}>Current Question</h2>
        <p className={styles.questionSubtitle}>{gameState.displayedQuestion.title}</p>
        <p className={styles.questionContent}>{gameState.displayedQuestion.content}</p>
      </div>
    );
  };

  const renderTimer = () => {
    // Only show timer if there's a displayed question and timer is active or has remaining time
    if (!gameState.displayedQuestion) return null;
    if (!gameState.timerState.isActive && gameState.timerState.timeRemaining === 0) return null;

    return (
      <div className={styles.timerContainer}>
        <h2 className={styles.timerTitle}>Timer</h2>
        <div className={styles.getTimerDisplay(gameState.timerState.timeRemaining)}>
          {gameState.timerState.timeRemaining}
        </div>
        <p className={styles.timerStatus}>
          {gameState.timerState.isActive ? 'Time remaining' : 'Paused'}
        </p>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <h1 className={styles.headerTitle}>Game of Friendship</h1>
          <p className={styles.headerSubtitle}>Player View</p>
          {gameState.selectedAnswerer && (
            <p className={styles.answererInfo}>
              Current Answerer: <strong className={styles.answererName}>{gameState.selectedAnswerer}</strong>
            </p>
          )}
        </header>

        {gameState.gameState === 'setup' && (
          <div className={styles.setupContainer}>
            <p className={styles.setupText}>Game is being set up...</p>
          </div>
        )}

        {gameState.gameState === 'ongoing' && (
          <>
            {renderTimer()}
            {!gameState.displayedQuestion && (
              <div className={styles.waitingContainer}>
                <h2 className={styles.waitingTitle}>Waiting for next question...</h2>
                <p className={styles.waitingText}>The Game Master will send the next question shortly.</p>
              </div>
            )}
            {renderCurrentQuestion()}
            {renderScoreboard()}
          </>
        )}

        {gameState.gameState === 'completed' && (
          <div className={styles.completedContainer}>
            <h2 className={styles.completedTitle}>Game Finished!</h2>
            {renderScoreboard()}
          </div>
        )}
      </div>
    </div>
  );
};
