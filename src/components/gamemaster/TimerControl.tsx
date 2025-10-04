import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Timer } from '../shared/Timer';
import { useTimerControlStyles } from '../../hooks/useStyles';
import { getTimerColor } from '../../utils/timerColor';

type TimerControlMode = 'full' | 'compact';

interface TimerControlProps {
  mode?: TimerControlMode;
}

export const TimerControl: React.FC<TimerControlProps> = ({ mode = 'full' }) => {
  const { currentQuestion, timerState, startTimer, setTimerInitialValue, resetTimer, pauseTimer, resumeTimer } = useGame();
  const [customTime, setCustomTime] = useState(30);
  const styles = useTimerControlStyles();

  const handleStartTimer = (seconds: number) => {
    startTimer(seconds);
  };

  const handleResumeTimer = () => {
    resumeTimer();
  };

  const handleSetTimer = (seconds: number) => {
    setTimerInitialValue(seconds);
  };

  const handlePauseTimer = () => {
    pauseTimer();
  };

  if (mode === 'compact') {
    // Use shared getTimerColor utility
    const initialTime = timerState.initialTime || 1;
    const progress = initialTime > 0 ? timerState.timeRemaining / initialTime : 0;
    const compactTimerColor = getTimerColor({ progress, isPaused: !timerState.isActive });

    return (
      <div className={styles.compactContainer}>
        <div>
          <span
            className={styles.compactTime}
            style={{ color: compactTimerColor }}
          >
            {timerState.timeRemaining}s
          </span>
        </div>
        <div className={styles.compactRow}>
          <button className={styles.compactQuickSet} onClick={() => handleSetTimer(30)}>30s</button>
          <button className={styles.compactQuickSet} onClick={() => handleSetTimer(60)}>1m</button>
          <button className={styles.compactQuickSet} onClick={() => handleSetTimer(120)}>2m</button>
          <button className={styles.compactQuickSet} onClick={() => handleSetTimer(300)}>5m</button>
          {currentQuestion?.timer && (
            <button className={styles.compactQuickSet} onClick={() => handleSetTimer(currentQuestion.timer!)}>
              Q ({currentQuestion.timer}s)
            </button>
          )}
        </div>
        <div className={styles.compactRow}>
          {timerState.isActive ? (
            <button
              className={styles.compactStart}
              onClick={handlePauseTimer}
            >
              Pause
            </button>
          ) : (
            <button
              className={styles.compactStart}
              onClick={timerState.timeRemaining > 0 ? handleResumeTimer : () => handleStartTimer(customTime)}
            >
              Start
            </button>
          )}
          <button
            className={styles.compactReset}
            onClick={resetTimer}
          >
            Reset
          </button>
          <input
            type="number"
            value={customTime}
            onChange={e => setCustomTime(parseInt(e.target.value) || 0)}
            className={styles.compactInput}
            min="1"
          />
          <button
            className={styles.compactQuickSet}
            onClick={() => handleSetTimer(customTime)}
          >
            Set
          </button>
        </div>
      </div>
    );
  }

  // Full mode
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
