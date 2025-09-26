import React, { useState } from 'react';
import { GameProvider } from './context/GameContext';
import { PlayerView } from './components/player/PlayerView';
import { PlayerView as MessageBasedPlayerView } from './components/PlayerView';
import { GameMasterView } from './components/gamemaster/GameMasterView';
import { useAppStyles } from './hooks/useStyles';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const styles = useAppStyles();

  const openPlayerView = () => {
    window.open('/player-view', 'playerView', 'width=800,height=600,scrollbars=yes,resizable=yes');
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <h1 className={styles.navTitle}>Quiz Game of Friendship</h1>
        <div className={styles.navButtons}>
          <button
            onClick={() => navigate('/')}
            className={styles.getNavButtonGameMaster(location.pathname === '/')}
          >
            Game Master
          </button>
          <button
            onClick={openPlayerView}
            className={styles.getNavButton(location.pathname === '/player-view')}
          >
            Open Player View
          </button>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <GameProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={
              <>
                <Navigation />
                <main>
                  <GameMasterView />
                </main>
              </>
            } />
            <Route path="/player-view" element={
              <main>
                <MessageBasedPlayerView />
              </main>
            } />
          </Routes>
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;
