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
    setSelectedAnswerer
  } = useGame();
  const styles = useScoreControlStyles();
  
  const [customPoints, setCustomPoints] = useState(1);
  const [selectedPlayer, setSelectedPlayer] = useState('');

  const handleAnswerModeChange = (mode: 'individual' | 'duel' | 'teams') => {
    setAnswerMode(mode);
    setSelectedAnswerer('');
  };

  const handleSelectAnswerer = (name: string) => {
    setSelectedAnswerer(name);
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
      default:
        return [];
    }
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
          {(['individual', 'duel', 'teams'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => handleAnswerModeChange(mode)}
              className={styles.getModeButton(answerMode === mode)}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Answerer Selection */}
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

      {/* Score Award Section */}
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
              onClick={() => selectedAnswerer && awardPoints(selectedAnswerer, currentQuestion.difficulty)}
              disabled={!selectedAnswerer}
              className={styles.correctButton}
            >
              Correct (+{currentQuestion.difficulty})
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
