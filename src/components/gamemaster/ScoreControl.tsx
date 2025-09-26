import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useScoreControlStyles } from '../../hooks/useStyles';

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
    clearSelectedOpponents
  } = useGame();
  const styles = useScoreControlStyles();
  
  const [customPoints, setCustomPoints] = useState(1);
  const [selectedPlayer, setSelectedPlayer] = useState('');

  const handleAnswerModeChange = (mode: 'individual' | 'duel' | 'teams' | 'teams-duel') => {
    setAnswerMode(mode);
    setSelectedAnswerer('');
    clearSelectedOpponents();
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

  const awardPoints = (playerOrTeamName: string, points: number) => {
    updateScore(playerOrTeamName, points);
  };

  const getAvailableAnswerers = () => {
    switch (answerMode) {
      case 'individual':
        return players
          .filter(p => !currentQuestion?.targets?.includes(p.name))
          .map(p => ({ name: p.name, type: 'player' }));
      case 'teams':
        return teams.map(t => ({ name: t.name, type: 'team' }));
      case 'duel':
        return players
          .filter(p => !currentQuestion?.targets?.includes(p.name))
          .map(p => ({ name: p.name, type: 'player' }));
      case 'teams-duel':
        return teams.map(t => ({ name: t.name, type: 'team' }));
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
              {selectedOpponent1 && <div>Opponent 1: {selectedOpponent1}</div>}
              {selectedOpponent2 && <div>Opponent 2: {selectedOpponent2}</div>}
            </div>
          </div>
        )}

        <div className={styles.duelContainer}>
          <div className={styles.duelColumn}>
            <div className={styles.duelColumnTitle}>Opponent 1</div>
            <div className={styles.duelOpponentList}>
              {availableOptions.map(({ name, type }) => (
                <label key={`opp1-${name}`} className={styles.getDuelOpponentLabel(selectedOpponent1 === name)}>
                  <input
                    type="radio"
                    name="opponent1"
                    value={name}
                    checked={selectedOpponent1 === name}
                    onChange={() => handleSelectOpponent(1, name)}
                    className={styles.duelRadioInput}
                  />
                  {name} ({type})
                </label>
              ))}
            </div>
          </div>

          <div className={styles.duelColumn}>
            <div className={styles.duelColumnTitle}>Opponent 2</div>
            <div className={styles.duelOpponentList}>
              {availableOptions
                .filter(({ name }) => name !== selectedOpponent1)
                .map(({ name, type }) => (
                  <label key={`opp2-${name}`} className={styles.getDuelOpponentLabel(selectedOpponent2 === name)}>
                    <input
                      type="radio"
                      name="opponent2"
                      value={name}
                      checked={selectedOpponent2 === name}
                      onChange={() => handleSelectOpponent(2, name)}
                      className={styles.duelRadioInput}
                    />
                    {name} ({type})
                  </label>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRegularAnswererSelection = () => {
    const isRegularMode = answerMode === 'individual' || answerMode === 'teams';
    if (!isRegularMode) return null;

    return (
      <div>
        <h4 className={styles.sectionTitle}>Who's Answering:</h4>
        <div className={styles.answererList}>
          {getAvailableAnswerers().map(({ name, type }) => (
            <label key={name} className={styles.answererLabel}>
              <input
                type="radio"
                name="answerer"
                value={name}
                checked={selectedAnswerer === name}
                onChange={() => handleSelectAnswerer(name)}
                className={styles.radioInput}
              />
              {name} ({type})
            </label>
          ))}
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
          {(['individual', 'duel', 'teams', 'teams-duel'] as const).map(mode => (
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

      {/* Answerer/Opponent Selection */}
      {renderRegularAnswererSelection()}
      {renderDuelSelection()}

      {/* Score Award Section */}
      {renderScoreButtons()}

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
