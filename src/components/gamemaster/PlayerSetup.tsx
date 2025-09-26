import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Player, Team } from '../../types';
import { usePlayerSetupStyles } from '../../hooks/useStyles';
import { PlayerTeamSelector, createSelectableItems } from '../shared/PlayerTeamSelector';

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
      {player.profilePicture ? (
        <>
          <img
            src={player.profilePicture}
            alt={player.name}
            className={styles.playerAvatar}
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
            className={styles.playerAvatarPlaceholder}
            style={{ display: 'none' }}
          >
            {player.name.charAt(0).toUpperCase()}
          </div>
        </>
      ) : (
        <div className={styles.playerAvatarPlaceholder}>
          {player.name.charAt(0).toUpperCase()}
        </div>
      )}

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
            <PlayerTeamSelector
              items={createSelectableItems(players, [], false)}
              selectedItems={selectedPlayers}
              onToggleSelection={togglePlayerSelection}
              selectionMode="multiple"
              showType={false}
              className="max-h-48 overflow-y-auto"
            />
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
                <span className={styles.teamName}>{team.name}</span>
                <button
                  onClick={() => removeTeam(team.id)}
                  className={styles.removeButton}
                >
                  Remove Team
                </button>
              </div>
              <div className={styles.teamPlayers}>
                Players: {team.players.map(p => p.name).join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
