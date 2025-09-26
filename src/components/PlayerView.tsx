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
    if (!gameState.showScoreboard) return null;

    const entries = Array.from(gameState.scores.entries()).sort((a, b) => b[1] - a[1]);

    const getItemInfo = (name: string) => {
      // Check if it's a team
      const team = gameState.teams.find(t => t.name === name);
      if (team) {
        return {
          type: 'team' as const,
          name: team.name,
          profilePicture: team.players[0]?.profilePicture,
          players: team.players
        };
      }

      // Check if it's a player
      const player = gameState.players.find(p => p.name === name);
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">Scoreboard</h2>
            <button
              onClick={() => window.opener?.postMessage({ type: 'HIDE_SCOREBOARD' }, window.location.origin)}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <div className="p-4 overflow-y-auto">
            <div className="space-y-3">
              {entries.map(([name, score], index) => {
                const item = getItemInfo(name);

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

              {entries.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No scores yet
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
