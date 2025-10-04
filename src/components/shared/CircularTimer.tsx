import React from 'react';
import { getTimerColor } from '../../utils/timerColor';

interface CircularTimerProps {
    timeRemaining: number;
    initialTime: number;
    size?: number;
    strokeWidth?: number;
    isPaused?: boolean;
}

export const CircularTimer: React.FC<CircularTimerProps> = ({
    timeRemaining,
    initialTime,
    size = 120,
    strokeWidth = 8,
    isPaused = false
}) => {
    const center = size / 2;
    const radius = center - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    const progress = initialTime > 0 ? timeRemaining / initialTime : 0;
    // Invert the progress so it starts full and empties clockwise
    const strokeDashoffset = circumference * (1 - progress);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };


    const shouldPulse = progress <= 0.25 && timeRemaining > 0;

    return (
        <div className={`relative inline-flex items-center justify-center ${shouldPulse ? 'timer-critical' : ''}`}>
            <svg
                width={size}
                height={size}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="#e5e7eb"
                    strokeWidth={strokeWidth}
                    fill="none"
                />

                {/* Progress circle - starts full and empties clockwise */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={getTimerColor({ progress, isPaused })}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-linear"
                    style={{
                        transformOrigin: 'center'
                    }}
                />
            </svg>

            {/* Timer text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span
                    className="text-2xl font-bold"
                    style={{ color: getTimerColor({ progress, isPaused }) }}
                >
                    {formatTime(timeRemaining)}
                </span>
            </div>
        </div>
    );
};
