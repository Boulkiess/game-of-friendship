import React, { useState, useEffect } from 'react';
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
    updateTeamColor
  } = useGame();
  const styles = usePlayerSetupStyles();
  
  const [playerName, setPlayerName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState(TEAM_COLORS[0].value);

  // Get used colors to help with selection
  const usedColors = teams.map(team => team.color);
  const availableColors = TEAM_COLORS.filter(color => !usedColors.includes(color.value));
  const suggestedColor = availableColors.length > 0 ? availableColors[0].value : TEAM_COLORS[0].value;

  // Update suggested color when teams change
  useEffect(() => {
    if (!usedColors.includes(selectedColor)) return;
    const nextAvailable = availableColors[0]?.value || TEAM_COLORS[0].value;
    setSelectedColor(nextAvailable);
  }, [teams]);

  const handleAddPlayer = () => {
    if (playerName.trim() && !players.find(p => p.name === playerName)) {
      addPlayer({ name: playerName.trim() });
      setPlayerName('');
    }
  };

  const handleCreateTeam = () => {
    if (teamName.trim() && selectedPlayers.length > 0) {
      const teamPlayers = players.filter(p => selectedPlayers.includes(p.name));
      const team: Team = {
        id: Date.now().toString(),
        name: teamName.trim(),
        players: teamPlayers,
        color: selectedColor
      };
      addTeam(team);
      setTeamName('');
      setSelectedPlayers([]);
      // Auto-select next available color
      const nextAvailable = TEAM_COLORS.find(color =>
        !usedColors.includes(color.value) && color.value !== selectedColor
      );
      if (nextAvailable) {
        setSelectedColor(nextAvailable.value);
      }
    }
  };

  const togglePlayerSelection = (playerName: string) => {
    setSelectedPlayers(prev => 
      prev.includes(playerName)
        ? prev.filter(name => name !== playerName)
        : [...prev, playerName]
    );
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

      {/* Create Teams Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Create Teams</h3>
        
        <div className={styles.playerSelection}>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter team name"
            className={styles.teamInput}
          />

          <div className="mb-4">
            <p className={styles.selectionLabel}>Select team color:</p>
            <div className={styles.colorPalette}>
              {TEAM_COLORS.map(color => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={selectedColor === color.value ? styles.selectedColorOption : styles.colorOption}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                  disabled={usedColors.includes(color.value)}
                />
              ))}
            </div>
          </div>

          <div className={styles.playerSelection}>
            <p className={styles.selectionLabel}>Select players for team:</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {players.map(player => {
                const isSelected = selectedPlayers.includes(player.name);

                return (
                  <label
                    key={player.name}
                    className={`flex items-center p-2 border rounded cursor-pointer transition-colors ${isSelected ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => togglePlayerSelection(player.name)}
                      className="mr-3"
                    />
                    <EntityDisplay
                      entity={createEntityInfo(player.name, players, teams)}
                      showType={false}
                      avatarSize="small"
                    />
                  </label>
                );
              })}
            </div>
          </div>
          
          <button
            onClick={handleCreateTeam}
            disabled={!teamName.trim() || selectedPlayers.length === 0}
            className={styles.createTeamButton}
          >
            Create Team
          </button>
        </div>

        <div className={styles.teamsList}>
          {teams.map(team => (
            <div key={team.id} className={styles.teamItem}>
              <div className={styles.teamHeader}>
                <div className="flex items-center space-x-3">
                  <div
                    className={styles.teamColorIndicator}
                    style={{ backgroundColor: team.color }}
                  />
                  <EntityDisplay
                    entity={createEntityInfo(team.name, players, teams)}
                    showType={false}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={team.color}
                    onChange={(e) => updateTeamColor(team.id, e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    {TEAM_COLORS.map(color => (
                      <option
                        key={color.value}
                        value={color.value}
                        disabled={usedColors.includes(color.value) && color.value !== team.color}
                      >
                        {color.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeTeam(team.id)}
                    className={styles.removeButton}
                  >
                    Remove Team
                  </button>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Members:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {team.players.map(player => (
                    <span key={player.name} className="inline-flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded text-xs">
                      <PlayerAvatar player={player} size="small" />
                      <span>{player.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
