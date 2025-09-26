import React from 'react';
import { useGame } from '../../context/GameContext';
import { PlayerSetup } from './PlayerSetup';
import { QuestionSelector } from './QuestionSelector';
import { TimerControl } from './TimerControl';
import { ScoreControl } from './ScoreControl';
import { Scoreboard } from '../shared/Scoreboard';
import { useGameMasterViewStyles } from '../../hooks/useStyles';
import { ScoreboardControl } from './ScoreboardControl';

export const GameMasterView: React.FC = () => {
  const { gameState, setGameState } = useGame();
  const styles = useGameMasterViewStyles();

  const handleGameStateChange = (newState: 'setup' | 'ongoing' | 'completed') => {
    setGameState(newState);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            Game Master Control Panel
          </h1>
          
          <div className={styles.stateButtons}>
            {(['setup', 'ongoing', 'completed'] as const).map(state => (
              <button
                key={state}
                onClick={() => handleGameStateChange(state)}
                className={styles.getStateButton(gameState === state)}
              >
                {state}
              </button>
            ))}
          </div>
        </header>

        {gameState === 'setup' && (
          <div className={styles.setupGrid}>
            <PlayerSetup />
            <QuestionSelector />
          </div>
        )}

        {gameState === 'ongoing' && (
          <div className={styles.ongoingGrid}>
            <div className={styles.ongoingLeft}>
              <QuestionSelector />
              <ScoreControl />
            </div>
            
            <div className={styles.ongoingRight}>
              <TimerControl />
              <ScoreboardControl />
            </div>
          </div>
        )}

        {gameState === 'completed' && (
          <div className={styles.completedContainer}>
            <h2 className={styles.completedTitle}>Game Completed!</h2>
            <div className={styles.completedScoreboard}>
              <Scoreboard />
            </div>
            <button
              onClick={() => handleGameStateChange('setup')}
              className={styles.newGameButton}
            >
              Start New Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
