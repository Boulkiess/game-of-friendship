import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Player, Team } from '../../types';
import { usePlayerSetupStyles } from '../../hooks/useStyles';
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
    removeTeam 
  } = useGame();
  const styles = usePlayerSetupStyles();
  
  const [playerName, setPlayerName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

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
        players: teamPlayers
      };
      addTeam(team);
      setTeamName('');
      setSelectedPlayers([]);
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
                <EntityDisplay
                  entity={createEntityInfo(team.name, players, teams)}
                  showType={false}
                />
                <button
                  onClick={() => removeTeam(team.id)}
                  className={styles.removeButton}
                >
                  Remove Team
                </button>
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
