import { useState, useEffect, useCallback } from 'react';
import './App.css';
import GameSetup from './components/GameSetup';
import GameBoard from './components/GameBoard';
import GameResults from './components/GameResults';
import { loadSavedGame, saveGame, clearSavedGame } from './utils/storage';
import { useLanguage } from './i18n/useLanguage';
import { useTheme } from './theme/useTheme';

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function hasResumableSave() {
  const saved = loadSavedGame();
  return Boolean(saved?.gameState === 'playing' && saved?.gameData);
}

function App() {
  const { t, lang, toggleLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [gameState, setGameState] = useState('setup');
  const [gameData, setGameData] = useState(null);
  const [hasSaved, setHasSaved] = useState(hasResumableSave);

  useEffect(() => {
    if (gameState === 'playing' && gameData) {
      saveGame({ gameState, gameData });
    }
  }, [gameState, gameData]);

  const handleStartGame = (playerList, wordList, settings) => {
    clearSavedGame();
    setHasSaved(false);

    const initialGameData = {
      players: playerList.map((name) => ({ name, score: 0 })),
      hat: shuffle(wordList),
      guessed: [],
      currentPlayerIndex: 0,
      roundsCompleted: 0,
      settings: {
        roundTime: settings?.roundTime ?? 60,
        lang,
      },
    };

    setGameData(initialGameData);
    setGameState('playing');
  };

  const handleGameUpdate = useCallback((nextData) => {
    setGameData(nextData);
  }, []);

  const handleGameEnd = (finalGameData) => {
    clearSavedGame();
    setHasSaved(false);
    setGameData(finalGameData);
    setGameState('results');
  };

  const handlePlayAgain = () => {
    clearSavedGame();
    setHasSaved(false);
    setGameState('setup');
    setGameData(null);
  };

  const handleResume = () => {
    const saved = loadSavedGame();
    if (saved?.gameData) {
      setGameData(saved.gameData);
      setGameState('playing');
      setHasSaved(false);
    }
  };

  const handleDiscardSaved = () => {
    clearSavedGame();
    setHasSaved(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <img
          className="app-logo"
          src={`${import.meta.env.BASE_URL}assets/ushanka-logo-${lang}.png`}
          alt={t.brand}
        />
        <div className="header-toggles">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? t.themeToDarkAria : t.themeToLightAria}
            title={theme === 'light' ? t.themeToDarkAria : t.themeToLightAria}
          >
            {theme === 'light' ? '☾' : '☀'}
          </button>
          <button
            type="button"
            className="lang-toggle"
            onClick={toggleLang}
            aria-label={t.langToggleAria}
          >
            {t.langToggle}
          </button>
        </div>
      </header>

      {gameState === 'setup' && (
        <>
          {hasSaved && (
            <div className="resume-banner">
              <p>{t.resumeTitle}</p>
              <div className="resume-actions">
                <button type="button" className="btn-resume" onClick={handleResume}>
                  {t.resumeContinue}
                </button>
                <button type="button" className="btn-discard" onClick={handleDiscardSaved}>
                  {t.resumeNew}
                </button>
              </div>
            </div>
          )}
          <GameSetup onStartGame={handleStartGame} />
        </>
      )}

      {gameState === 'playing' && gameData && (
        <GameBoard
          gameData={gameData}
          onGameUpdate={handleGameUpdate}
          onGameEnd={handleGameEnd}
        />
      )}

      {gameState === 'results' && gameData && (
        <GameResults gameData={gameData} onPlayAgain={handlePlayAgain} />
      )}
    </div>
  );
}

export default App;
