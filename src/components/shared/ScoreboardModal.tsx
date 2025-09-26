import React from 'react';
import { useGame } from '../../context/GameContext';
import { Scoreboard } from './Scoreboard';

interface ScoreboardModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ScoreboardModal: React.FC<ScoreboardModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Scoreboard</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>
                <div className="p-4 overflow-y-auto">
                    <Scoreboard />
                </div>
            </div>
        </div>
    );
};
