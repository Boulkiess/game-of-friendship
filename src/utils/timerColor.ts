// Utility to get timer color based on progress and pause state
export function getTimerColor({ progress, isPaused }: { progress: number; isPaused: boolean }): string {
    if (isPaused) return '#9ca3af'; // gray-400
    const percentage = progress * 100;
    if (percentage <= 25) return '#dc2626'; // red-600
    if (percentage <= 50) return '#d97706'; // amber-600
    return '#16a34a'; // green-600
}