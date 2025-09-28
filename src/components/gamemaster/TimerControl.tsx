import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Timer } from '../shared/Timer';
import { useTimerControlStyles } from '../../hooks/useStyles';

export const TimerControl: React.FC = () => {
  const { currentQuestion, startTimer, setTimerInitialValue } = useGame();
  const [customTime, setCustomTime] = useState(30);
  const styles = useTimerControlStyles();

  const handleStartTimer = (seconds: number) => {
    startTimer(seconds);
  };

  const handleSetTimer = (seconds: number) => {
    setTimerInitialValue(seconds);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Timer Control</h3>
      
      <div className={styles.content}>
        <div className={styles.timerDisplay}>
          <Timer showControls={true} />
        </div>

        <div className={styles.quickStartSection}>
          <h4 className={styles.quickStartTitle}>Set Timer:</h4>
          <div className={styles.allTimerButtons}>
            <button
              onClick={() => handleSetTimer(30)}
              className={styles.quickStartButton}
            >
              30s
            </button>
            <button
              onClick={() => handleSetTimer(60)}
              className={styles.quickStartButton}
            >
              1 min
            </button>
            <button
              onClick={() => handleSetTimer(120)}
              className={styles.quickStartButton}
            >
              2 min
            </button>
            <button
              onClick={() => handleSetTimer(300)}
              className={styles.quickStartButton}
            >
              5 min
            </button>
            {currentQuestion?.timer && (
              <button
                onClick={() => handleSetTimer(currentQuestion.timer!)}
                className={styles.questionTimerButton}
              >
                Question ({currentQuestion.timer}s)
              </button>
            )}
            <input
              type="number"
              value={customTime}
              onChange={(e) => setCustomTime(parseInt(e.target.value) || 0)}
              className={styles.customTimerInput}
              placeholder="Custom"
              min="1"
            />
            <button
              onClick={() => handleSetTimer(customTime)}
              className={styles.customTimerButton}
            >
              Set
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
