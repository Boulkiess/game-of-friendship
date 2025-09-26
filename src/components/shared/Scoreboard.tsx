import React from 'react';
import { useGame } from '../../context/GameContext';
import { useScoreboardStyles } from '../../hooks/useStyles';

export const Scoreboard: React.FC = () => {
  const { scores, teams, players } = useGame();
  const styles = useScoreboardStyles();

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

  const renderAvatar = (item: ReturnType<typeof getItemInfo>) => {
    const sizeClasses = 'w-10 h-10 text-sm';

    if (item.type === 'team') {
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
              className={`${sizeClasses} rounded-full bg-blue-300 flex items-center justify-center text-blue-800 font-semibold`}
              style={{ display: 'none' }}
            >
              T
            </div>
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

  const renderTeamMembers = (item: ReturnType<typeof getItemInfo>) => {
    if (item.type !== 'team' || !item.players?.length) return null;

    return (
      <div className="flex items-center space-x-1 ml-2">
        <span className="text-xs text-gray-500">Members:</span>
        <div className="flex -space-x-1">
          {item.players.slice(0, 3).map((player, index) => (
            <div key={player.name} className="relative" style={{ zIndex: 10 - index }}>
              {player.profilePicture ? (
                <div className="flex items-center">
                  <img
                    src={player.profilePicture}
                    alt={player.name}
                    className="w-6 h-6 rounded-full object-cover border border-white"
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
                    className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-xs border border-white"
                    style={{ display: 'none' }}
                  >
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-xs border border-white">
                  {player.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          ))}
          {item.players.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 border-2 border-white">
              +{item.players.length - 3}
            </div>
          )}
        </div>
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

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Scoreboard</h2>
      
      <div className={styles.list}>
        {sortedScores.map(([name, score], index) => {
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
                  {renderTeamMembers(item)}
                </div>
              </div>

              <span className={`text-xl font-bold text-blue-600 ${index === 0 ? 'text-yellow-600' : ''}`}>
                {score}
              </span>
            </div>
          );
        })}
        
        {sortedScores.length === 0 && (
          <div className={styles.emptyState}>
            No scores yet
          </div>
        )}
      </div>
    </div>
  );
};
