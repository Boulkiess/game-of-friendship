import React from 'react';
import { useGame } from '../../context/GameContext';
import { useScoreboardStyles } from '../../hooks/useStyles';
import { ScoreboardMode } from '../../types';

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

  const getItemInfo = (name: string) => {
    // Check if it's a team
    const team = teams.find(t => t.name === name);
    if (team) {
      return {
        type: 'team' as const,
        name: team.name,
        profilePicture: team.players[0]?.profilePicture,
        players: team.players
      };
    }

    // Check if it's a player
    const player = players.find(p => p.name === name);
    if (player) {
      return {
        type: 'player' as const,
        name: player.name,
        profilePicture: player.profilePicture
      };
    }

    // Fallback for unknown entries
    return {
      type: 'unknown' as const,
      name: name
    };
  };

  // Filter scores based on display mode
  const filteredScores = sortedScores.filter(([name]) => {
    const item = getItemInfo(name);
    if (displayMode === 'players') return item.type === 'player';
    if (displayMode === 'teams') return item.type === 'team';
    return true;
  });

  const renderAvatar = (item: ReturnType<typeof getItemInfo>) => {
    const sizeClasses = 'w-10 h-10 text-sm';

    if (item.type === 'team') {
      // Render stacked team member avatars
      if (item.players && item.players.length > 0) {
        const maxVisible = 4;
        const visiblePlayers = item.players.slice(0, maxVisible);

        return (
          <div className="relative flex items-center" style={{ width: '60px', height: '40px' }}>
            {visiblePlayers.map((player, index) => {
              const zIndex = visiblePlayers.length - index;
              const leftOffset = index * 12; // 12px offset for each subsequent avatar

              if (player.profilePicture) {
                return (
                  <div
                    key={player.name}
                    className="absolute"
                    style={{ left: `${leftOffset}px`, zIndex }}
                  >
                    <img
                      src={player.profilePicture}
                      alt={player.name}
                      className={`${sizeClasses} rounded-full object-cover border-2 border-white shadow-sm`}
                      onError={(e) => {
                        const img = e.currentTarget;
                        const placeholder = img.nextElementSibling as HTMLElement;
                        img.style.display = 'none';
                        if (placeholder) {
                          placeholder.style.display = 'flex';
                        }
                      }}
                    />
                    <div
                      className={`${sizeClasses} rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold border-2 border-white shadow-sm`}
                      style={{ display: 'none' }}
                    >
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={player.name}
                  className={`absolute ${sizeClasses} rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold border-2 border-white shadow-sm`}
                  style={{ left: `${leftOffset}px`, zIndex }}
                >
                  {player.name.charAt(0).toUpperCase()}
                </div>
              );
            })}
            {item.players.length > maxVisible && (
              <div
                className="absolute w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-semibold text-xs border-2 border-white shadow-sm"
                style={{ left: `${maxVisible * 12}px`, zIndex: 0 }}
              >
                +{item.players.length - maxVisible}
              </div>
            )}
          </div>
        );
      }

      return (
        <div className={`${sizeClasses} rounded-full bg-blue-300 flex items-center justify-center text-blue-800 font-semibold`}>
          T
        </div>
      );
    }

    if (item.type === 'player') {
      if (item.profilePicture) {
        return (
          <div className="flex items-center">
            <img
              src={item.profilePicture}
              alt={item.name}
              className={`${sizeClasses} rounded-full object-cover`}
              onError={(e) => {
                const img = e.currentTarget;
                const placeholder = img.nextElementSibling as HTMLElement;
                img.style.display = 'none';
                if (placeholder) {
                  placeholder.style.display = 'flex';
                }
              }}
            />
            <div
              className={`${sizeClasses} rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold`}
              style={{ display: 'none' }}
            >
              {item.name.charAt(0).toUpperCase()}
            </div>
          </div>
        );
      }

      return (
        <div className={`${sizeClasses} rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold`}>
          {item.name.charAt(0).toUpperCase()}
        </div>
      );
    }

    // Fallback for unknown type
    return (
      <div className={`${sizeClasses} rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold`}>
        ?
      </div>
    );
  };

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
          const item = getItemInfo(name);

          return (
            <div
              key={name}
              className={`${styles.scoreItem} ${index < 3 ? 'bg-gradient-to-r from-yellow-50 to-white' : ''}`}
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <span className={`text-lg font-bold ${getRankColor(index)} min-w-[2rem]`}>
                  {getRankIcon(index)}
                </span>

                {renderAvatar(item)}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium truncate">{name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${item.type === 'team' ? 'bg-blue-100 text-blue-800' :
                      item.type === 'player' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {item.type}
                    </span>
                  </div>
                </div>
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
