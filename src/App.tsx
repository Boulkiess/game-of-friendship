import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { PlayerView } from './components/player/PlayerView';
import { GameMasterView } from './components/gamemaster/GameMasterView';
import { useAppStyles } from './hooks/useStyles';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Slideshow } from '@mui/icons-material';
import { GameProvider } from './context/GameContext';

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
            onClick={openPlayerView}
            className={styles.getNavButton(location.pathname === '/player-view')}
          >
            <Slideshow />
          </button>
        </div>
      </div>
    </nav>
  );
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GameProvider>
        <Router>
          <Routes>
            <Route path="/" element={
              <Container maxWidth="xl">
                <Box sx={{ py: 4 }}>
                  <Box>
                    <Navigation />
                    <main>
                      <GameMasterView />
                    </main>
                  </Box>
                </Box>
              </Container>
            } />
            <Route path="/player-view" element={
              <Box component="main" sx={{ width: '100vw', height: '100vh', p: 0, m: 0 }}>
                <PlayerView />
              </Box>
            } />
          </Routes>
        </Router>
      </GameProvider>
    </ThemeProvider>
  );
}

export default App;
