import React from 'react';
import { useGame } from '../../context/GameContext';
import { useScoreboardStyles } from '../../hooks/useStyles';

export const Scoreboard: React.FC = () => {
  const { scores, teams, players } = useGame();
  const styles = useScoreboardStyles();

  const sortedScores = Array.from(scores.entries())
    .sort(([, a], [, b]) => b - a);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Scoreboard</h2>
      
      <div className={styles.list}>
        {sortedScores.map(([name, score], index) => (
          <div 
            key={name}
            className={styles.scoreItem}
          >
            <div className={styles.scoreLeft}>
              <span className={styles.rank}>
                #{index + 1}
              </span>
              <span className={styles.name}>{name}</span>
            </div>
            <span className={styles.score}>
              {score}
            </span>
          </div>
        ))}
        
        {sortedScores.length === 0 && (
          <div className={styles.emptyState}>
            No scores yet
          </div>
        )}
      </div>
    </div>
  );
};
