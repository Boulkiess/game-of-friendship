import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useScoreControlStyles } from '../../hooks/useStyles';
import { PlayerTeamSelector, createSelectableItems } from '../shared/PlayerTeamSelector';
import { EntityDisplay, createEntityInfo } from '../shared/EntityDisplay';

export const ScoreControl: React.FC = () => {
  const { 
    currentQuestion, 
    players, 
    teams, 
    updateScore, 
    answerMode,
    setAnswerMode,
    selectedAnswerer,
    setSelectedAnswerer,
    selectedOpponent1,
    selectedOpponent2,
    setSelectedOpponents,
    clearSelectedOpponents,
    selectedChampions,
    setSelectedChampions,
    clearSelectedChampions
  } = useGame();
  const styles = useScoreControlStyles();
  
  const [customPoints, setCustomPoints] = useState(1);
  const [selectedPlayer, setSelectedPlayer] = useState('');

  const handleAnswerModeChange = (mode: 'individual' | 'duel' | 'teams' | 'teams-duel' | 'champions') => {
    setAnswerMode(mode);
    setSelectedAnswerer('');
    clearSelectedOpponents();
    clearSelectedChampions();
  };

  const handleSelectAnswerer = (name: string) => {
    setSelectedAnswerer(name);
  };

  const handleSelectOpponent = (opponentNumber: 1 | 2, name: string) => {
    if (opponentNumber === 1) {
      setSelectedOpponents(name, selectedOpponent2 || '');
    } else {
      setSelectedOpponents(selectedOpponent1 || '', name);
    }
  };

  const handleChampionToggle = (teamName: string, playerName: string) => {
    const currentTeamChampions = selectedChampions?.get(teamName) || [];
    let newChampions: string[];

    if (currentTeamChampions.includes(playerName)) {
      newChampions = currentTeamChampions.filter(name => name !== playerName);
    } else {
      newChampions = [...currentTeamChampions, playerName];
    }

    setSelectedChampions(teamName, newChampions);
  };

  const awardPoints = (playerOrTeamName: string, points: number) => {
    updateScore(playerOrTeamName, points);
  };

  const getAvailableAnswerers = () => {
    switch (answerMode) {
      case 'individual':
        return createSelectableItems(
          players.filter(p => !currentQuestion?.targets?.includes(p.name)),
          [],
          false
        );
      case 'teams':
        return createSelectableItems([], teams, true).filter(item => item.type === 'team');
      case 'duel':
        return createSelectableItems(
          players.filter(p => !currentQuestion?.targets?.includes(p.name)),
          [],
          false
        );
      case 'teams-duel':
        return createSelectableItems([], teams, true).filter(item => item.type === 'team');
      default:
        return [];
    }
  };

  const renderDuelSelection = () => {
    const availableOptions = getAvailableAnswerers();
    const isDuel = answerMode === 'duel' || answerMode === 'teams-duel';

    if (!isDuel) return null;

    return (
      <div>
        <h4 className={styles.sectionTitle}>Select Opponents:</h4>

        {(selectedOpponent1 || selectedOpponent2) && (
          <div className={styles.selectedOpponentsInfo}>
            <div className={styles.selectedOpponentsTitle}>Selected Opponents:</div>
            <div className={styles.selectedOpponentsList}>
              {selectedOpponent1 && (
                <div className="mb-2">
                  <span className="text-sm text-gray-600">Opponent 1:</span>
                  <div className="mt-1">
                    <EntityDisplay
                      entity={createEntityInfo(selectedOpponent1, players, teams)}
                      showType={false}
                      avatarSize="small"
                    />
                  </div>
                </div>
              )}
              {selectedOpponent2 && (
                <div>
                  <span className="text-sm text-gray-600">Opponent 2:</span>
                  <div className="mt-1">
                    <EntityDisplay
                      entity={createEntityInfo(selectedOpponent2, players, teams)}
                      showType={false}
                      avatarSize="small"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className={styles.duelContainer}>
          <div className={styles.duelColumn}>
            <div className={styles.duelColumnTitle}>Opponent 1</div>
            <div className="space-y-2">
              {availableOptions.map(item => {
                const isSelected = selectedOpponent1 === item.name;
                const isDisabled = selectedOpponent2 === item.name;
                const entity = createEntityInfo(item.name, players, teams);

                return (
                  <label
                    key={item.name}
                    className={`flex items-center p-2 border rounded cursor-pointer transition-colors ${isSelected ? 'bg-blue-100 border-blue-500' :
                      isDisabled ? 'opacity-50 cursor-not-allowed' :
                        'hover:bg-gray-50'
                      }`}
                  >
                    <input
                      type="radio"
                      name="opponent1"
                      checked={isSelected}
                      onChange={() => !isDisabled && handleSelectOpponent(1, item.name)}
                      disabled={isDisabled}
                      className="mr-3"
                    />
                    <EntityDisplay entity={entity} showType={false} />
                  </label>
                );
              })}
            </div>
          </div>

          <div className={styles.duelColumn}>
            <div className={styles.duelColumnTitle}>Opponent 2</div>
            <div className="space-y-2">
              {availableOptions.map(item => {
                const isSelected = selectedOpponent2 === item.name;
                const isDisabled = selectedOpponent1 === item.name;
                const entity = createEntityInfo(item.name, players, teams);

                return (
                  <label
                    key={item.name}
                    className={`flex items-center p-2 border rounded cursor-pointer transition-colors ${isSelected ? 'bg-blue-100 border-blue-500' :
                      isDisabled ? 'opacity-50 cursor-not-allowed' :
                        'hover:bg-gray-50'
                      }`}
                  >
                    <input
                      type="radio"
                      name="opponent2"
                      checked={isSelected}
                      onChange={() => !isDisabled && handleSelectOpponent(2, item.name)}
                      disabled={isDisabled}
                      className="mr-3"
                    />
                    <EntityDisplay entity={entity} showType={false} />
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRegularAnswererSelection = () => {
    const isRegularMode = answerMode === 'individual' || answerMode === 'teams';
    if (!isRegularMode) return null;

    const availableOptions = getAvailableAnswerers();

    return (
      <div>
        <h4 className={styles.sectionTitle}>Who's Answering:</h4>
        <div className="space-y-2">
          {availableOptions.map(item => {
            const isSelected = selectedAnswerer === item.name;
            const entity = createEntityInfo(item.name, players, teams);

            return (
              <label
                key={item.name}
                className={`flex items-center p-2 border rounded cursor-pointer transition-colors ${isSelected ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'
                  }`}
              >
                <input
                  type="radio"
                  name="answerer"
                  checked={isSelected}
                  onChange={() => handleSelectAnswerer(item.name)}
                  className="mr-3"
                />
                <EntityDisplay entity={entity} showType={false} />
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  const renderChampionsSelection = () => {
    if (answerMode !== 'champions') return null;

    const teamChampionCounts = teams.map(team => {
      const teamChampions = selectedChampions?.get(team.name) || [];
      return {
        teamName: team.name,
        count: teamChampions.length,
        champions: teamChampions,
        teamPlayerCount: team.players.length
      };
    });

    // Find the maximum possible champions (minimum team size)
    const maxPossibleChampions = Math.min(...teams.map(team => team.players.length));

    if (maxPossibleChampions === 0) {
      return (
        <div>
          <h4 className={styles.sectionTitle}>Select Champions:</h4>
          <div className="text-center text-gray-500 py-4">
            No teams available for champions mode.
          </div>
        </div>
      );
    }

    // Check if we have a valid champions setup (same logic as scoring buttons)
    const teamsWithChampions = teamChampionCounts.filter(team => team.count > 0);
    const hasValidSetup = teamsWithChampions.length >= 2 &&
      teamsWithChampions.every(team => team.count === teamsWithChampions[0].count);

    // Create champion level options (1 to maxPossibleChampions)
    const championLevels = Array.from({ length: maxPossibleChampions }, (_, i) => i + 1);

    // For each champion level, find which teams can participate and check their status
    const levelStatus = championLevels.map(level => {
      const eligibleTeams = teamChampionCounts.filter(team => team.teamPlayerCount >= level);
      const teamsWithCorrectCount = eligibleTeams.filter(team => team.count === level);
      const isReady = eligibleTeams.length >= 2 && teamsWithCorrectCount.length === eligibleTeams.length && level > 0;

      return {
        level,
        eligibleTeams,
        teamsWithCorrectCount,
        isReady,
        canUse: eligibleTeams.length >= 2
      };
    });

    return (
      <div>
        <h4 className={styles.sectionTitle}>Select Champions:</h4>

        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-2">Championship Status:</p>
            {hasValidSetup ? (
              <p className="text-green-700">
                ✅ Ready for {teamsWithChampions[0].count} champion{teamsWithChampions[0].count !== 1 ? 's' : ''} mode!
                ({teamsWithChampions.length} teams participating)
              </p>
            ) : (
              <div>
                  <p className="text-orange-700 mb-2">
                    ⚠️ Select equal numbers of champions for teams to compete
                </p>
                  <div className="text-xs space-y-2">
                    {levelStatus.filter(s => s.canUse).map(status => (
                      <div key={status.level}>
                        <span className="font-medium">
                          {status.level} Champion{status.level !== 1 ? 's' : ''} Mode:
                        </span>
                        <div className="ml-2 space-y-1">
                          {status.eligibleTeams.map(team => (
                            <div key={team.teamName} className={`${team.count === status.level ? 'text-green-600' : 'text-orange-600'}`}>
                              {team.teamName}: {team.count}/{status.level} selected
                            </div>
                          ))}
                          {teamChampionCounts.filter(team => team.teamPlayerCount < status.level).length > 0 && (
                            <div className="text-gray-500 italic">
                              Excluded: {teamChampionCounts.filter(team => team.teamPlayerCount < status.level).map(team => team.teamName).join(', ')} (not enough players)
                            </div>
                          )}
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {teams.map(team => {
            const teamChampions = selectedChampions?.get(team.name) || [];

            return (
              <div key={team.id} className="border rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <EntityDisplay
                    entity={createEntityInfo(team.name, players, teams)}
                    showType={false}
                    avatarSize="small"
                  />
                  <span className="text-sm text-gray-600">
                    ({teamChampions.length} champion{teamChampions.length !== 1 ? 's' : ''} selected)
                    <span className="ml-2 text-xs">
                      Can send up to {team.players.length} champion{team.players.length !== 1 ? 's' : ''}
                    </span>
                  </span>
                </div>

                <div className="space-y-2">
                  {team.players.map(player => {
                    const isSelected = teamChampions.includes(player.name);

                    return (
                      <label
                        key={player.name}
                        className={`flex items-center p-2 border rounded cursor-pointer transition-colors ${isSelected ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleChampionToggle(team.name, player.name)}
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
            );
          })}
        </div>
      </div>
    );
  };

  const renderScoreButtons = () => {
    const isDuelMode = answerMode === 'duel' || answerMode === 'teams-duel';

    if (isDuelMode) {
      return (
        <div>
          <h4 className={styles.sectionTitle}>Award Points to Winner:</h4>

          <div className={styles.pointsContainer}>
            <input
              type="number"
              value={customPoints}
              onChange={(e) => setCustomPoints(parseInt(e.target.value) || 0)}
              className={styles.pointsInput}
              min="0"
            />
            <span>points</span>
          </div>

          <div className={styles.actionButtons}>
            <div className={styles.buttonRow}>
              <button
                onClick={() => selectedOpponent1 && currentQuestion && awardPoints(selectedOpponent1, currentQuestion.difficulty)}
                disabled={!selectedOpponent1}
                className={styles.correctButton}
              >
                {selectedOpponent1} Wins (+{currentQuestion?.difficulty})
              </button>
              <button
                onClick={() => selectedOpponent2 && currentQuestion && awardPoints(selectedOpponent2, currentQuestion.difficulty)}
                disabled={!selectedOpponent2}
                className={styles.correctButton}
              >
                {selectedOpponent2} Wins (+{currentQuestion?.difficulty})
              </button>
            </div>

            <div className={styles.buttonRow}>
              <button
                onClick={() => selectedOpponent1 && awardPoints(selectedOpponent1, customPoints)}
                disabled={!selectedOpponent1}
                className={styles.customButton}
              >
                {selectedOpponent1} Custom (+{customPoints})
              </button>
              <button
                onClick={() => selectedOpponent2 && awardPoints(selectedOpponent2, customPoints)}
                disabled={!selectedOpponent2}
                className={styles.customButton}
              >
                {selectedOpponent2} Custom (+{customPoints})
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Regular scoring for individual/teams modes
    return (
      <div>
        <h4 className={styles.sectionTitle}>Award Points:</h4>
        
        <div className={styles.pointsContainer}>
          <input
            type="number"
            value={customPoints}
            onChange={(e) => setCustomPoints(parseInt(e.target.value) || 0)}
            className={styles.pointsInput}
            min="0"
          />
          <span>points</span>
        </div>

        <div className={styles.actionButtons}>
          <div className={styles.buttonRow}>
            <button
              onClick={() => selectedAnswerer && currentQuestion && awardPoints(selectedAnswerer, currentQuestion.difficulty)}
              disabled={!selectedAnswerer}
              className={styles.correctButton}
            >
              Correct (+{currentQuestion?.difficulty})
            </button>
            <button
              onClick={() => selectedAnswerer && awardPoints(selectedAnswerer, -1)}
              disabled={!selectedAnswerer}
              className={styles.wrongButton}
            >
              Wrong (-1)
            </button>
          </div>
          
          <button
            onClick={() => selectedAnswerer && awardPoints(selectedAnswerer, customPoints)}
            disabled={!selectedAnswerer}
            className={styles.customButton}
          >
            Custom Points (+{customPoints})
          </button>
        </div>
      </div>
    );
  };

  const renderChampionsScoreButtons = () => {
    if (answerMode !== 'champions') return null;

    const teamChampionCounts = teams.map(team => {
      const teamChampions = selectedChampions?.get(team.name) || [];
      return {
        teamName: team.name,
        count: teamChampions.length,
        champions: teamChampions,
        teamPlayerCount: team.players.length
      };
    });

    // Find teams that have at least one champion selected
    const teamsWithChampions = teamChampionCounts.filter(team => team.count > 0);

    // Check if we have at least 2 teams and all have the same number of champions
    const hasValidSetup = teamsWithChampions.length >= 2 &&
      teamsWithChampions.every(team => team.count === teamsWithChampions[0].count);

    if (!hasValidSetup) {
      return (
        <div>
          <h4 className={styles.sectionTitle}>Award Points to Team:</h4>
          <div className="text-center text-gray-500 py-4">
            Select the same number of champions from at least 2 teams to proceed
          </div>

          <div className={styles.pointsContainer}>
            <input
              type="number"
              value={customPoints}
              onChange={(e) => setCustomPoints(parseInt(e.target.value) || 0)}
              className={styles.pointsInput}
              min="0"
              disabled
            />
            <span>points</span>
          </div>

          <div className={styles.actionButtons}>
            <div className="grid grid-cols-1 gap-2">
              {teams.map(team => (
                <div key={team.id} className="flex space-x-2">
                  <button
                    disabled
                    className={`${styles.correctButton} opacity-50 cursor-not-allowed`}
                  >
                    {team.name} Correct (+{currentQuestion?.difficulty})
                  </button>
                  <button
                    disabled
                    className={`${styles.wrongButton} opacity-50 cursor-not-allowed`}
                  >
                    {team.name} Wrong (-1)
                  </button>
                  <button
                    disabled
                    className={`${styles.customButton} opacity-50 cursor-not-allowed`}
                  >
                    {team.name} Custom (+{customPoints})
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    const championCount = teamsWithChampions[0].count;

    return (
      <div>
        <h4 className={styles.sectionTitle}>Award Points to Team:</h4>

        <div className="mb-6">
          <h5 className="font-medium mb-3 text-blue-700">
            {championCount} Champion{championCount !== 1 ? 's' : ''} Mode
            ({teamsWithChampions.length} teams participating)
          </h5>

          <div className={styles.pointsContainer}>
            <input
              type="number"
              value={customPoints}
              onChange={(e) => setCustomPoints(parseInt(e.target.value) || 0)}
              className={styles.pointsInput}
              min="0"
            />
            <span>points</span>
          </div>

          <div className={styles.actionButtons}>
            <div className="grid grid-cols-1 gap-2">
              {teamsWithChampions.map(team => (
                <div key={team.teamName} className="flex space-x-2">
                  <button
                    onClick={() => currentQuestion && awardPoints(team.teamName, currentQuestion.difficulty)}
                    className={styles.correctButton}
                  >
                    {team.teamName} Correct (+{currentQuestion?.difficulty})
                  </button>
                  <button
                    onClick={() => awardPoints(team.teamName, -1)}
                    className={styles.wrongButton}
                  >
                    {team.teamName} Wrong (-1)
                  </button>
                  <button
                    onClick={() => awardPoints(team.teamName, customPoints)}
                    className={styles.customButton}
                  >
                    {team.teamName} Custom (+{customPoints})
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 bg-gray-50 p-3 rounded">
            <h6 className="font-semibold mb-2">Selected Champions:</h6>
            <div className="space-y-1 text-sm">
              {teamsWithChampions.map(team => (
                <div key={team.teamName}>
                  <span className="font-medium text-blue-700">{team.teamName}:</span> {team.champions.join(', ')}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!currentQuestion) {
    return (
      <div className={styles.noQuestionContainer}>
        <h3 className={styles.noQuestionTitle}>Score Control</h3>
        <p className={styles.noQuestionText}>No question selected</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Score Control</h3>

      {/* Current Question Info */}
      <div className={styles.questionInfo}>
        <h4 className={styles.questionTitle}>{currentQuestion.title}</h4>
        <p className={styles.questionContent}>{currentQuestion.content}</p>
        <div className={styles.answerBox}>
          <strong>Answer:</strong> {currentQuestion.answer}
        </div>
      </div>

      {/* Answer Mode Selection */}
      <div>
        <h4 className={styles.sectionTitle}>Answer Mode:</h4>
        <div className={styles.answerModeButtons}>
          {(['individual', 'duel', 'teams', 'teams-duel', 'champions'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => handleAnswerModeChange(mode)}
              className={styles.getModeButton(answerMode === mode)}
            >
              {mode.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Answerer/Opponent/Champion Selection */}
      {renderRegularAnswererSelection()}
      {renderDuelSelection()}
      {renderChampionsSelection()}

      {/* Score Award Section */}
      {answerMode === 'champions' ? renderChampionsScoreButtons() : renderScoreButtons()}

      {/* Manual Score Adjustment */}
      <div>
        <h4 className={styles.sectionTitle}>Manual Score Adjustment:</h4>
        <div className={styles.manualAdjustment}>
          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className={styles.select}
          >
            <option value="">Select player/team</option>
            {players.map(p => (
              <option key={p.name} value={p.name}>{p.name} (Player)</option>
            ))}
            {teams.map(t => (
              <option key={t.id} value={t.name}>{t.name} (Team)</option>
            ))}
          </select>
          <input
            type="number"
            value={customPoints}
            onChange={(e) => setCustomPoints(parseInt(e.target.value) || 0)}
            className={styles.manualInput}
          />
          <button
            onClick={() => selectedPlayer && awardPoints(selectedPlayer, customPoints)}
            disabled={!selectedPlayer}
            className={styles.applyButton}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
