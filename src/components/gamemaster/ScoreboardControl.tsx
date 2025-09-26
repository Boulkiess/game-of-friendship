import React from 'react';
import { useGame } from '../../context/GameContext';
import { Scoreboard } from '../shared/Scoreboard';
import { ScoreboardMode } from '../../types';

export const ScoreboardControl: React.FC = () => {
    const { scoreboardMode, setScoreboardMode } = useGame();

    const handleModeChange = (mode: ScoreboardMode) => {
        setScoreboardMode(mode);
    };

    const getModeButtonClass = (mode: ScoreboardMode) => {
        return `px-4 py-2 rounded font-medium transition-colors ${scoreboardMode === mode
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`;
    };

    const getModeDescription = () => {
        switch (scoreboardMode) {
            case 'players': return 'Players can see individual player scores';
            case 'teams': return 'Players can see team scores';
            case 'hidden': return 'Scoreboard hidden from players';
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
            <h3 className="text-xl font-semibold">Scoreboard Control</h3>

            <div className="space-y-3">
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleModeChange('players')}
                        className={getModeButtonClass('players')}
                    >
                        Show Players
                    </button>
                    <button
                        onClick={() => handleModeChange('teams')}
                        className={getModeButtonClass('teams')}
                    >
                        Show Teams
                    </button>
                    <button
                        onClick={() => handleModeChange('hidden')}
                        className={getModeButtonClass('hidden')}
                    >
                        Hide Scoreboard
                    </button>
                </div>
                <p className="text-sm text-gray-600">
                    {getModeDescription()}
                </p>
            </div>

            <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Current Scores:</h4>
                <div className="space-y-4">
                    <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Individual Players</h5>
                        <Scoreboard mode="players" />
                    </div>
                    <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Teams</h5>
                        <Scoreboard mode="teams" />
                    </div>
                </div>
            </div>
        </div>
    );
};
