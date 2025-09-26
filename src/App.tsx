import React, { useState } from 'react';
import { GameProvider } from './context/GameContext';
import { PlayerView } from './components/player/PlayerView';
import { GameMasterView } from './components/gamemaster/GameMasterView';
import { useAppStyles } from './hooks/useStyles';
import './App.css';

type ViewType = 'player' | 'gamemaster';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('gamemaster');
  const styles = useAppStyles();

  return (
    <GameProvider>
      <div className="app">
        <nav className={styles.nav}>
          <div className={styles.navContainer}>
            <h1 className={styles.navTitle}>Quiz Game of Friendship</h1>

            <div className={styles.navButtons}>
              <button
                onClick={() => setCurrentView('player')}
                className={styles.getNavButton(currentView === 'player')}
              >
                Player View
              </button>
              <button
                onClick={() => setCurrentView('gamemaster')}
                className={styles.getNavButtonGameMaster(currentView === 'gamemaster')}
              >
                Game Master
              </button>
            </div>
          </div>
        </nav>

        <main>
          {currentView === 'player' && <PlayerView />}
          {currentView === 'gamemaster' && <GameMasterView />}
        </main>
      </div>
    </GameProvider>
  );
}

export default App;
