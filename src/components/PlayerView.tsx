import React, { useEffect, useState } from 'react';
import { GameContext, Question } from '../types';
import { useMessageBasedPlayerViewStyles } from '../hooks/useStyles';

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
    const entries = Array.from(gameState.scores.entries()).sort((a, b) => b[1] - a[1]);

    return (
      <div className={styles.scoreboardContainer}>
        <h2 className={styles.scoreboardTitle}>Scoreboard</h2>
        <div className={styles.scoreboardList}>
          {entries.map(([name, score], index) => (
            <div key={name} className={styles.scoreboardItem}>
              <span className={styles.scoreboardRank}>#{index + 1} {name}</span>
              <span className={styles.scoreboardScore}>{score}</span>
            </div>
          ))}
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
