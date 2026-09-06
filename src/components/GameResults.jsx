import './GameResults.css';
import { useLanguage } from '../i18n/useLanguage';

export default function GameResults({ gameData, onPlayAgain }) {
  const { t } = useLanguage();

  const sortedPlayers = [...gameData.players]
    .map((p, idx) => ({ ...p, originalIndex: idx }))
    .sort((a, b) => b.score - a.score);

  const winner = sortedPlayers[0];
  const guessedWords = gameData.guessed ?? [];
  const remainingWords = gameData.hat ?? [];
  const total = guessedWords.length + remainingWords.length;
  const completion = total ? Math.round((guessedWords.length / total) * 100) : 0;

  return (
    <div className="game-results">
      <div className="results-container">
        <div className="winner-section">
          <h2>{t.gameOver}</h2>
          <div className="winner-card">
            <h3 className="winner-title">{t.winner}</h3>
            <p className="winner-name">{winner.name}</p>
            <p className="winner-score">{t.points(winner.score)}</p>
          </div>
        </div>

        <div className="final-standings">
          <h3>{t.standings}</h3>
          <div className="standings-list">
            {sortedPlayers.map((player, idx) => (
              <div key={player.originalIndex} className="standing-item">
                <span className="medal">
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '•'}
                </span>
                <span className="rank">#{idx + 1}</span>
                <span className="name">{player.name}</span>
                <span className="score">{player.score}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="game-statistics">
          <div className="stat-card">
            <h4>{t.statGuessed}</h4>
            <p className="stat-number">{guessedWords.length}</p>
          </div>
          <div className="stat-card">
            <h4>{t.statInHat}</h4>
            <p className="stat-number">{remainingWords.length}</p>
          </div>
          <div className="stat-card">
            <h4>{t.statRounds}</h4>
            <p className="stat-number">{gameData.roundsCompleted}</p>
          </div>
          <div className="stat-card">
            <h4>{t.statProgress}</h4>
            <p className="stat-number">{completion}%</p>
          </div>
        </div>

        {remainingWords.length > 0 && (
          <div className="remaining-words">
            <h3>{t.notGuessed}</h3>
            <div className="words-list">
              {remainingWords.map((word, idx) => (
                <span key={`${word}-${idx}`} className="word-badge">
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        {guessedWords.length > 0 && (
          <div className="guessed-summary">
            <h3>{t.guessedSummary}</h3>
            <div className="guessed-table">
              {guessedWords.map((entry, idx) => (
                <div key={`${entry.word}-${idx}`} className="guessed-row">
                  <span className="word">{entry.word}</span>
                  <span className="by-player">
                    {entry.explainedBy} → {entry.guessedBy}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="results-actions">
          <button type="button" onClick={onPlayAgain} className="play-again-btn">
            {t.playAgain}
          </button>
        </div>
      </div>
    </div>
  );
}
