import React from 'react';
import { useGame } from '../../context/GameContext';
import { useScoreboardStyles } from '../../hooks/useStyles';
import { ScoreboardMode } from '../../types';
import { EntityDisplay, createEntityInfo } from './EntityDisplay';

interface ScoreboardProps {
  mode?: ScoreboardMode; // If provided, shows specific mode; otherwise uses context scoreboardMode
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ mode }) => {
  const { scores, teams, players, scoreboardMode } = useGame();
  const styles = useScoreboardStyles();

  const displayMode = mode || scoreboardMode;

  if (displayMode === 'hidden') return null;

  const sortedScores = Array.from(scores.entries())
    .sort(([, a], [, b]) => b - a);

  // Filter scores based on display mode
  const filteredScores = sortedScores.filter(([name]) => {
    const item = createEntityInfo(name, players, teams);
    if (displayMode === 'players') return item.type === 'player';
    if (displayMode === 'teams') return item.type === 'team';
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
    if (mode) {
      return mode === 'players' ? 'Individual Players' : 'Teams';
    }
    return displayMode === 'players' ? 'Player Leaderboard' : 'Team Leaderboard';
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{getTitle()}</h2>
      
      <div className={styles.list}>
        {filteredScores.map(([name, score], index) => {
          const entity = createEntityInfo(name, players, teams);

          return (
            <div
              key={name}
              className={`${styles.scoreItem} ${index < 3 ? 'bg-gradient-to-r from-yellow-50 to-white' : ''}`}
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <span className={`text-lg font-bold ${getRankColor(index)} min-w-[2rem]`}>
                  {getRankIcon(index)}
                </span>

                <EntityDisplay entity={entity} showType={true} />
              </div>

              <span className={`text-xl font-bold text-blue-600 ${index === 0 ? 'text-yellow-600' : ''}`}>
                {score}
              </span>
            </div>
          );
        })}
        
        {filteredScores.length === 0 && (
          <div className={styles.emptyState}>
            No {displayMode === 'players' ? 'player' : 'team'} scores yet
          </div>
        )}
      </div>
    </div>
  );
};
