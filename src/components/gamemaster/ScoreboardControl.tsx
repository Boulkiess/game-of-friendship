import React from 'react';
import { useGame } from '../../context/GameContext';
import { Scoreboard } from '../shared/Scoreboard';

export const ScoreboardControl: React.FC = () => {
    const { showScoreboard, setShowScoreboard } = useGame();

    return (
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
            <h3 className="text-xl font-semibold">Scoreboard Control</h3>

            <div className="flex items-center space-x-2">
                <button
                    onClick={() => setShowScoreboard(!showScoreboard)}
                    className={`px-4 py-2 rounded font-medium transition-colors ${showScoreboard
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                >
                    {showScoreboard ? 'Hide Scoreboard' : 'Show Scoreboard'}
                </button>
                <span className="text-sm text-gray-600">
                    {showScoreboard ? 'Players can see scoreboard' : 'Scoreboard hidden from players'}
                </span>
            </div>

            <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Current Scores:</h4>
                <Scoreboard />
            </div>
        </div>
    );
};
