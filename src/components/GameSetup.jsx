import { useState, useMemo } from 'react';
import './GameSetup.css';
import { getSampleWords } from '../data/words';
import { useLanguage } from '../i18n/useLanguage';

function sampleWords(arr, count) {
  const copy = [...arr];
  const res = [];
  while (res.length < count && copy.length) {
    const idx = Math.floor(Math.random() * copy.length);
    res.push(copy.splice(idx, 1)[0]);
  }
  return res;
}

export default function GameSetup({ onStartGame }) {
  const { t, lang } = useLanguage();
  const baseWords = getSampleWords(lang);

  const [playerList, setPlayerList] = useState(null);
  const [newPlayer, setNewPlayer] = useState('');
  const [customWords, setCustomWords] = useState([]);
  const [newWord, setNewWord] = useState('');
  const [roundTime, setRoundTime] = useState(60);
  const [wordsToPlay, setWordsToPlay] = useState(20);

  const players = playerList ?? [t.defaultPlayer(1), t.defaultPlayer(2)];

  const wordPool = useMemo(() => {
    const base = new Set(baseWords.map((w) => w.toLowerCase()));
    const extras = customWords.filter((w) => !base.has(w.toLowerCase()));
    return [...baseWords, ...extras];
  }, [baseWords, customWords]);

  const handleAddPlayer = () => {
    if (newPlayer.trim() && players.length < 10) {
      setPlayerList([...players, newPlayer.trim()]);
      setNewPlayer('');
    }
  };

  const handleRemovePlayer = (index) => {
    if (players.length > 2) {
      setPlayerList(players.filter((_, i) => i !== index));
    }
  };

  const handleAddWord = () => {
    const value = newWord.trim().toLowerCase();
    if (!value || customWords.length >= 100) return;
    if (
      customWords.includes(value)
      || baseWords.map((w) => w.toLowerCase()).includes(value)
    ) {
      setNewWord('');
      return;
    }
    setCustomWords([...customWords, value]);
    setNewWord('');
  };

  const handleRemoveCustomWord = (index) => {
    setCustomWords(customWords.filter((_, i) => i !== index));
  };

  const handleStartGame = () => {
    if (players.length >= 2 && wordPool.length >= 3 && wordsToPlay >= 1) {
      const pickCount = Math.min(wordsToPlay, wordPool.length);
      const selected = sampleWords(wordPool, pickCount);
      onStartGame(players, selected, { roundTime: Number(roundTime) || 60 });
    }
  };

  const maxWords = wordPool.length;
  const isValidToStart = players.length >= 2 && wordPool.length >= 3 && wordsToPlay >= 1;

  return (
    <div className="game-setup">
      <div className="setup-container">
        <section className="setup-section">
          <h2>{t.players}</h2>
          <div className="player-input">
            <input
              type="text"
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
              placeholder={t.playerPlaceholder}
              maxLength={20}
            />
            <button
              type="button"
              onClick={handleAddPlayer}
              disabled={!newPlayer.trim() || players.length >= 10}
              className="add-btn"
            >
              {t.add}
            </button>
          </div>

          <div className="items-list">
            {players.map((player, index) => (
              <div key={`${player}-${index}`} className="item">
                <span>{player}</span>
                {players.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePlayer(index)}
                    className="remove-btn"
                    aria-label={player}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {players.length < 2 && <p className="error-msg">{t.minPlayers}</p>}
          {players.length >= 10 && <p className="info-msg">{t.maxPlayers}</p>}
        </section>

        <section className="setup-section">
          <h2>{t.customWords}</h2>
          <p className="info-msg">{t.customWordsHint(baseWords.length)}</p>
          <div className="word-input">
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddWord()}
              placeholder={t.customWordPlaceholder}
              maxLength={40}
            />
            <button
              type="button"
              onClick={handleAddWord}
              disabled={!newWord.trim() || customWords.length >= 100}
              className="add-btn"
            >
              {t.add}
            </button>
          </div>

          {customWords.length > 0 ? (
            <div className="items-list words-list">
              {customWords.map((word, index) => (
                <div key={`${word}-${index}`} className="item word-item">
                  <span>{word}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomWord(index)}
                    className="remove-btn"
                    aria-label={word}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-custom">{t.noCustomWords}</p>
          )}
        </section>

        <section className="setup-section setup-settings">
          <h2>{t.settings}</h2>
          <div className="settings-row">
            <label className="setting-field">
              <span>{t.roundTime}</span>
              <input
                type="number"
                min={10}
                max={600}
                value={roundTime}
                onChange={(e) => setRoundTime(e.target.value)}
              />
            </label>

            <label className="setting-field">
              <span>{t.wordsToPlay}</span>
              <input
                type="number"
                min={1}
                max={maxWords}
                value={Math.min(wordsToPlay, maxWords)}
                onChange={(e) => setWordsToPlay(Number(e.target.value))}
              />
            </label>
          </div>
          <p className="word-count">{t.wordsAvailable(maxWords)}</p>
        </section>

        <section className="setup-section rules-card">
          <h2>{t.scoringTitle}</h2>
          <ul className="rules-list">
            <li>{t.scoringRule1}</li>
            <li>{t.scoringRule2}</li>
            <li>{t.scoringRule3}</li>
          </ul>
        </section>
      </div>

      <button
        type="button"
        onClick={handleStartGame}
        disabled={!isValidToStart}
        className={`start-btn ${isValidToStart ? 'enabled' : 'disabled'}`}
      >
        {t.startGame}
      </button>
    </div>
  );
}
