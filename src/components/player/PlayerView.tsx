import React from 'react';
import { useGame } from '../../context/GameContext';
import { Scoreboard } from '../shared/Scoreboard';
import { QuestionDisplay } from './QuestionDisplay';
import { usePlayerViewStyles } from '../../hooks/useStyles';

export const PlayerView: React.FC = () => {
  const { gameState } = useGame();
  const styles = usePlayerViewStyles();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            Quiz Game
          </h1>
          <p className={styles.status}>
            Game Status: {gameState}
          </p>
        </header>

        <div className={styles.grid}>
          <div className={styles.questionSection}>
            <QuestionDisplay />
          </div>
          
          <div className={styles.scoreboardSection}>
            <Scoreboard />
          </div>
        </div>
      </div>
    </div>
  );
};
