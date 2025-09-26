import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Timer } from '../shared/Timer';
import { useTimerControlStyles } from '../../hooks/useStyles';

export const TimerControl: React.FC = () => {
  const { currentQuestion, startTimer } = useGame();
  const [customTime, setCustomTime] = useState(30);
  const styles = useTimerControlStyles();

  const handleStartTimer = (seconds: number) => {
    startTimer(seconds);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Timer Control</h3>
      
      <div className={styles.content}>
        <div className={styles.timerDisplay}>
          <Timer showControls={true} />
        </div>

        <div className={styles.quickStartSection}>
          <h4 className={styles.quickStartTitle}>Quick Start:</h4>
          <div className={styles.quickStartButtons}>
            <button
              onClick={() => handleStartTimer(30)}
              className={styles.quickStartButton}
            >
              30s
            </button>
            <button
              onClick={() => handleStartTimer(60)}
              className={styles.quickStartButton}
            >
              1 min
            </button>
            <button
              onClick={() => handleStartTimer(120)}
              className={styles.quickStartButton}
            >
              2 min
            </button>
            <button
              onClick={() => handleStartTimer(300)}
              className={styles.quickStartButton}
            >
              5 min
            </button>
          </div>
        </div>

        {currentQuestion?.timer && (
          <div>
            <button
              onClick={() => handleStartTimer(currentQuestion.timer!)}
              className={styles.questionTimerButton}
            >
              Start Question Timer ({currentQuestion.timer}s)
            </button>
          </div>
        )}

        <div className={styles.customTimerContainer}>
          <input
            type="number"
            value={customTime}
            onChange={(e) => setCustomTime(parseInt(e.target.value) || 0)}
            className={styles.customTimerInput}
            placeholder="Custom time (seconds)"
            min="1"
          />
          <button
            onClick={() => handleStartTimer(customTime)}
            className={styles.customTimerButton}
          >
            Start Custom
          </button>
        </div>
      </div>
    </div>
  );
};
