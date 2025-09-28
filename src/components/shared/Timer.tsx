import React, { useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { CircularTimer } from './CircularTimer';
import { useTimerStyles } from '../../hooks/useStyles';
import { IconButton } from '@mui/material';
import { PlayArrow, Pause, Refresh } from '@mui/icons-material';

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
          isPaused={!timerState.isActive}
        />
      </div>

      {showControls && (
        <div className={styles.controls}>
          <IconButton
            onClick={timerState.isActive ? pauseTimer : resumeTimer}
            className={styles.pauseResumeButton}
            size="large"
            sx={{
              backgroundColor: timerState.isActive ? '#ef4444' : '#22c55e',
              color: 'white',
              '&:hover': {
                backgroundColor: timerState.isActive ? '#dc2626' : '#16a34a',
              },
              width: 56,
              height: 56,
            }}
          >
            {timerState.isActive ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton
            onClick={resetTimer}
            className={styles.resetButton}
            size="large"
            sx={{
              backgroundColor: '#6b7280',
              color: 'white',
              '&:hover': {
                backgroundColor: '#4b5563',
              },
              width: 56,
              height: 56,
            }}
          >
            <Refresh />
          </IconButton>
        </div>
      )}
    </div>
  );
};
