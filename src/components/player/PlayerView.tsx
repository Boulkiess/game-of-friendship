import React from 'react';
import { useGame } from '../../context/GameContext';
import { QuestionDisplay } from './QuestionDisplay';
import { ScoreboardModal } from '../shared/ScoreboardModal';
import { usePlayerViewStyles } from '../../hooks/useStyles';

export const PlayerView: React.FC = () => {
  const { gameState, showScoreboard, setShowScoreboard } = useGame();
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

        <div className="w-full">
          <QuestionDisplay />
        </div>

        <ScoreboardModal
          isOpen={showScoreboard}
          onClose={() => setShowScoreboard(false)}
        />
      </div>
    </div>
  );
};
