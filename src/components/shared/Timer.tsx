import React, { useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { CircularTimer } from './CircularTimer';
import { useTimerStyles } from '../../hooks/useStyles';

interface TimerProps {
  showControls?: boolean;
  onTimeUp?: () => void;
}

export const Timer: React.FC<TimerProps> = ({ showControls = false, onTimeUp }) => {
  const { timerState, pauseTimer, resumeTimer, resetTimer, updateTimer } = useGame();
  const styles = useTimerStyles();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerState.isActive && timerState.timeRemaining > 0) {
      interval = setInterval(() => {
        const newTime = timerState.timeRemaining - 1;
        if (newTime <= 0) {
          updateTimer(0);
          pauseTimer();
          onTimeUp?.();
        } else {
          // Use updateTimer to only update timeRemaining, not initialTime
          updateTimer(newTime);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerState.isActive, timerState.timeRemaining, pauseTimer, onTimeUp, updateTimer]);

  return (
    <div className={styles.container}>
      <div className={styles.timerDisplay}>
        <CircularTimer
          timeRemaining={timerState.timeRemaining}
          initialTime={timerState.initialTime}
          size={150}
          strokeWidth={12}
        />
      </div>

      {showControls && (
        <div className={styles.controls}>
          <button
            onClick={timerState.isActive ? pauseTimer : resumeTimer}
            className={styles.pauseResumeButton}
          >
            {timerState.isActive ? 'Pause' : 'Resume'}
          </button>
          <button
            onClick={resetTimer}
            className={styles.resetButton}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};
