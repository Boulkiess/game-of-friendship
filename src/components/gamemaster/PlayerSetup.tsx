import React, { useState, useEffect, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { Player, Team } from '../../types';
import { usePlayerSetupStyles, TEAM_COLORS } from '../../hooks/useStyles';
import { PlayerTeamSelector, createSelectableItems } from '../shared/PlayerTeamSelector';
import { EntityDisplay, createEntityInfo } from '../shared/EntityDisplay';
import { PlayerAvatar } from '../shared/PlayerAvatar';

export const PlayerSetup: React.FC = () => {
  const { 
    players, 
    teams, 
    addPlayer, 
    removePlayer, 
    addTeam, 
    removeTeam,
    updateTeamColor,
    updateTeam
  } = useGame();
  const styles = usePlayerSetupStyles();
  
  const [playerName, setPlayerName] = useState('');
  const [colorPickerTeamId, setColorPickerTeamId] = useState<string | null>(null);

  // Calculate all assigned players once for all teams
  const allAssignedPlayers = useMemo(() => {
    return teams.flatMap(t => t.players.map(p => p.name));
  }, [teams]);

  // Calculate available players (unassigned to any team)
  const availablePlayers = useMemo(() => {
    return players.filter(player => !allAssignedPlayers.includes(player.name));
  }, [players, allAssignedPlayers]);

  // Get used colors to help with selection
  const usedColors = teams.map(team => team.color);
  const availableColors = TEAM_COLORS.filter(color => !usedColors.includes(color.value));

  const handleAddPlayer = () => {
    if (playerName.trim() && !players.find(p => p.name === playerName)) {
      addPlayer({ name: playerName.trim() });
      setPlayerName('');
    }
  };

  const handleCreateNewTeam = () => {
    // Find the first available color that's not already used
    const availableColor = TEAM_COLORS.find(color => !usedColors.includes(color.value));

    const newTeam: Team = {
      id: Date.now().toString(),
      name: `New Team (${teams.length + 1})`,
      players: [],
      color: availableColor?.value || TEAM_COLORS[0].value
    };
    addTeam(newTeam);
  };

  const handleColorSelect = (teamId: string, color: string) => {
    // Check if color is already used by another team
    const isColorInUse = teams.some(team => team.id !== teamId && team.color === color);
    if (isColorInUse) {
      // Don't allow selecting a color that's already in use
      return;
    }

    updateTeamColor(teamId, color);
    setColorPickerTeamId(null);
  };

  const handleAddPlayerToTeam = (teamId: string, player: Player) => {
    const team = teams.find(t => t.id === teamId);
    if (team && !team.players.find(p => p.name === player.name)) {
      const updatedTeam = {
        ...team,
        players: [...team.players, player]
      };
      updateTeam(teamId, updatedTeam);
    }
  };

  const handleRemovePlayerFromTeam = (teamId: string, playerName: string) => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      const updatedTeam = {
        ...team,
        players: team.players.filter(p => p.name !== playerName)
      };
      updateTeam(teamId, updatedTeam);
    }
  };

  const handleUpdateTeamName = (teamId: string, name: string) => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      updateTeam(teamId, { ...team, name });
    }
  };

  const renderPlayerCard = (player: Player) => (
    <div key={player.name} className={styles.playerCard}>
      <PlayerAvatar player={player} size="large" />

      <div className={styles.playerInfo}>
        <div className={styles.playerName}>{player.name}</div>
      </div>

      <button
        onClick={() => removePlayer(player.name)}
        className={styles.removeButton}
        title="Remove player"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );

  const renderTeamEditor = (team: Team) => {
    const availablePlayers = players.filter(player =>
      !allAssignedPlayers.includes(player.name)
    );
    const isColorPickerOpen = colorPickerTeamId === team.id;

    return (
      <div key={team.id} className={styles.teamItem}>
        <div className={styles.teamHeader}>
          <div className="flex items-center space-x-3">
            <div className="relative inline-block">
              <div
                className={`${styles.teamColorIndicator} cursor-pointer hover:scale-110 transition-transform`}
                style={{ backgroundColor: team.color }}
                onClick={() => setColorPickerTeamId(isColorPickerOpen ? null : team.id)}
                title="Click to change color"
              />

              {/* Color picker dropdown */}
              {isColorPickerOpen && (
                <div className="absolute z-50 top-full left-0 mt-1 p-2 bg-white border rounded-lg shadow-lg min-w-max">
                  <div className="grid grid-cols-4 gap-2">
                    {TEAM_COLORS.map(color => {
                      const isUsedByOtherTeam = teams.some(t => t.id !== team.id && t.color === color.value);
                      const isCurrentColor = team.color === color.value;

                      return (
                        <button
                          key={color.value}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isUsedByOtherTeam) {
                              handleColorSelect(team.id, color.value);
                            }
                          }}
                          className={`w-8 h-8 rounded-full border-2 transition-transform ${isCurrentColor ? 'border-gray-800 scale-110' : 'border-gray-300 hover:scale-110'
                            } ${isUsedByOtherTeam ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                          style={{ backgroundColor: color.value }}
                          title={isUsedByOtherTeam ? `${color.name} (Already used)` : color.name}
                          disabled={isUsedByOtherTeam}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <input
              type="text"
              value={team.name}
              onChange={(e) => handleUpdateTeamName(team.id, e.target.value)}
              className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none flex-1"
              placeholder="Team name"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => removeTeam(team.id)}
              className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
              title="Remove team"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Current Team Members */}
        <div className="mt-3">
          <span className="font-medium text-sm text-gray-700">Team Members ({team.players.length}):</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {team.players.map(player => (
              <div
                key={player.name}
                className="inline-flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors"
                onClick={() => handleRemovePlayerFromTeam(team.id, player.name)}
                title="Click to remove from team"
              >
                <PlayerAvatar player={player} size="small" />
                <span className="text-sm">{player.name}</span>
                <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            ))}
            {team.players.length === 0 && (
              <span className="text-sm text-gray-500 italic">No players assigned</span>
            )}
          </div>
        </div>

        {/* Available Players */}
        {availablePlayers.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <span className="font-medium text-sm text-gray-700">Available Players (click to add):</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {availablePlayers.map(player => (
                <div
                  key={`available-${player.name}-${team.id}`}
                  className="inline-flex items-center space-x-2 bg-white px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-100 hover:text-blue-700 border transition-colors"
                  onClick={() => handleAddPlayerToTeam(team.id, player)}
                  title="Click to add to team"
                >
                  <PlayerAvatar player={player} size="small" />
                  <span className="text-sm">{player.name}</span>
                  <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerTeamId) {
        const target = event.target as Element;
        // Check if the click is outside the color picker container
        const colorPickerContainer = target.closest('.relative');
        const isColorIndicator = target.closest('[title="Click to change color"]');

        if (!colorPickerContainer && !isColorIndicator) {
          setColorPickerTeamId(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [colorPickerTeamId]);

  return (
    <div className={styles.container}>
      {/* Add Players Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Add Players</h3>

        <div className={styles.addPlayerForm}>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter player name"
            className={styles.input}
            onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
          />
          <button
            onClick={handleAddPlayer}
            className={styles.addButton}
          >
            Add Player
          </button>
        </div>

        <div className={styles.playersList}>
          {players.map(renderPlayerCard)}
        </div>
      </div>

      {/* Teams Section */}
      <div className={styles.section}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={styles.sectionTitle}>Teams</h3>
          <button
            onClick={handleCreateNewTeam}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Team</span>
          </button>
        </div>

        <div className={styles.teamsList}>
          {teams.map(renderTeamEditor)}
          {teams.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No teams created yet. Click "New Team" to get started!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
