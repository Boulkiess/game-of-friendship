import React, { useEffect, useState } from 'react';
import { GameContext, Question } from '../types';

export const PlayerView: React.FC = () => {
  const [gameState, setGameState] = useState<GameContext | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'GAME_STATE_UPDATE') {
        setGameState(event.data.payload);
      }
    };

    window.addEventListener('message', handleMessage);

    // Notify parent window that player view is ready
    if (window.opener) {
      window.opener.postMessage({ type: 'PLAYER_VIEW_READY' }, window.location.origin);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Player View</h1>
          <p className="text-gray-600">Waiting for game to start...</p>
        </div>
      </div>
    );
  }

  const renderScoreboard = () => {
    const entries = Array.from(gameState.scores.entries()).sort((a, b) => b[1] - a[1]);

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Scoreboard</h2>
        <div className="space-y-2">
          {entries.map(([name, score], index) => (
            <div key={name} className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded">
              <span className="font-semibold">#{index + 1} {name}</span>
              <span className="text-lg font-bold text-blue-600">{score}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCurrentQuestion = () => {
    if (!gameState.currentQuestion) return null;

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Current Question</h2>
        <p className="text-lg text-gray-700 mb-4">{gameState.currentQuestion.title}</p>
        <p className="text-base text-gray-600">{gameState.currentQuestion.content}</p>
      </div>
    );
  };

  const renderTimer = () => {
    if (!gameState.timerState.isActive && gameState.timerState.timeRemaining === 0) return null;

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Timer</h2>
        <div className={`text-6xl font-bold ${gameState.timerState.timeRemaining <= 10 ? 'text-red-600' : 'text-blue-600'
          }`}>
          {gameState.timerState.timeRemaining}
        </div>
        <p className="text-gray-600 mt-2">
          {gameState.timerState.isActive ? 'Time remaining' : 'Paused'}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Game of Friendship</h1>
          <p className="text-xl text-gray-600">Player View</p>
          {gameState.selectedAnswerer && (
            <p className="text-lg text-blue-600 mt-2">
              Current Answerer: <strong>{gameState.selectedAnswerer}</strong>
            </p>
          )}
        </header>

        {gameState.gameState === 'setup' && (
          <div className="text-center">
            <p className="text-xl text-gray-600">Game is being set up...</p>
          </div>
        )}

        {gameState.gameState === 'ongoing' && (
          <>
            {renderTimer()}
            {renderCurrentQuestion()}
            {renderScoreboard()}
          </>
        )}

        {gameState.gameState === 'completed' && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Finished!</h2>
            {renderScoreboard()}
          </div>
        )}
      </div>
    </div>
  );
};
