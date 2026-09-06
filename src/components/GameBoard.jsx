import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import './GameBoard.css';
import { playTimerEndSound, vibrateTimerEnd } from '../utils/feedback';
import { useLanguage } from '../i18n/useLanguage';

export default function GameBoard({ gameData, onGameUpdate, onGameEnd }) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState('pass'); // pass | playing
  const [targetIndex, setTargetIndex] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(gameData.settings?.roundTime ?? 60);
  const [isLastWord, setIsLastWord] = useState(false);
  const [showScores, setShowScores] = useState(false);
  const [showGuessed, setShowGuessed] = useState(false);

  const timerRef = useRef(null);
  const wakeLockRef = useRef(null);
  const stateRef = useRef(gameData);

  useEffect(() => {
    stateRef.current = gameData;
  }, [gameData]);

  const currentPlayer = gameData.players[gameData.currentPlayerIndex];
  const targetPlayer =
    targetIndex !== null ? gameData.players[targetIndex] : null;
  const currentWord = gameData.hat[0] ?? null;
  const totalWords = gameData.hat.length + gameData.guessed.length;
  const guessedCount = gameData.guessed.length;

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
      } catch {
        // ignore
      }
      wakeLockRef.current = null;
    }
  }, []);

  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
      }
    } catch {
      // ignore — not supported / denied
    }
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => {
    clearTimer();
    releaseWakeLock();
  }, [clearTimer, releaseWakeLock]);

  const pickRandomTarget = useCallback((playerIndex, players) => {
    const n = players.length;
    if (n <= 1) return 0;
    let idx = playerIndex;
    while (idx === playerIndex) {
      idx = Math.floor(Math.random() * n);
    }
    return idx;
  }, []);

  const finishGame = useCallback((data) => {
    clearTimer();
    releaseWakeLock();
    onGameEnd(data);
  }, [clearTimer, releaseWakeLock, onGameEnd]);

  const endTurn = useCallback((data) => {
    clearTimer();
    releaseWakeLock();
    setIsLastWord(false);
    setPhase('pass');
    setTargetIndex(null);

    const nextPlayerIndex = (data.currentPlayerIndex + 1) % data.players.length;
    let roundsCompleted = data.roundsCompleted;
    if (nextPlayerIndex === 0) {
      roundsCompleted += 1;
    }

    if (data.hat.length === 0) {
      finishGame({ ...data, roundsCompleted });
      return;
    }

    const next = {
      ...data,
      currentPlayerIndex: nextPlayerIndex,
      roundsCompleted,
    };
    onGameUpdate(next);
    setSecondsLeft(next.settings?.roundTime ?? 60);
  }, [clearTimer, releaseWakeLock, finishGame, onGameUpdate]);

  const startTurn = () => {
    const data = stateRef.current;
    if (data.hat.length === 0) {
      finishGame(data);
      return;
    }
    const t = pickRandomTarget(data.currentPlayerIndex, data.players);
    setTargetIndex(t);
    setIsLastWord(false);
    setSecondsLeft(data.settings?.roundTime ?? 60);
    setPhase('playing');
    requestWakeLock();
  };

  // Timer while playing
  useEffect(() => {
    if (phase !== 'playing') return undefined;

    clearTimer();
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsLastWord(true);
          playTimerEndSound();
          vibrateTimerEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [phase, clearTimer]);

  const handleWordGuessed = () => {
    if (phase !== 'playing' || !currentWord || targetIndex === null) return;

    const data = stateRef.current;
    const explainerIdx = data.currentPlayerIndex;
    const guesserIdx = targetIndex;
    const word = data.hat[0];

    const players = data.players.map((p, i) => {
      if (i === explainerIdx || i === guesserIdx) {
        return { ...p, score: p.score + 1 };
      }
      return p;
    });

    const next = {
      ...data,
      players,
      hat: data.hat.slice(1),
      guessed: [
        ...data.guessed,
        {
          word,
          explainedBy: data.players[explainerIdx].name,
          guessedBy: data.players[guesserIdx].name,
          round: data.roundsCompleted + 1,
        },
      ],
    };

    onGameUpdate(next);

    if (next.hat.length === 0 || isLastWord) {
      endTurn(next);
    }
  };

  const handleWordSkipped = () => {
    if (phase !== 'playing' || !currentWord) return;

    const data = stateRef.current;

    if (isLastWord) {
      endTurn(data);
      return;
    }

    if (data.hat.length <= 1) {
      // единственное слово — оставляем в шляпе, ход продолжается
      return;
    }

    const [first, ...rest] = data.hat;
    const next = { ...data, hat: [...rest, first] };
    onGameUpdate(next);
  };

  const handleEndGame = () => {
    finishGame(stateRef.current);
  };

  const handleSkipTurn = () => {
    if (phase !== 'playing') return;
    endTurn(stateRef.current);
  };

  const sortedPlayers = useMemo(
    () =>
      [...gameData.players]
        .map((p, idx) => ({ ...p, originalIndex: idx }))
        .sort((a, b) => b.score - a.score),
    [gameData.players],
  );

  const leaderPreview = sortedPlayers.slice(0, 3);

  const timerClass = isLastWord
    ? 'timer-bar last-word'
    : secondsLeft <= 10
      ? 'timer-bar urgent'
      : 'timer-bar';

  return (
    <div className="game-board">
      <div className="board-top">
        <div className="progress-pill">
          {guessedCount}/{totalWords}
        </div>
        <div className="round-pill">{t.round(gameData.roundsCompleted + 1)}</div>
        <button
          type="button"
          className="icon-btn"
          onClick={() => setShowScores(true)}
          aria-label={t.scores}
        >
          {t.scores}
        </button>
      </div>

      <button
        type="button"
        className="score-strip"
        onClick={() => setShowScores(true)}
      >
        {leaderPreview.map((player, idx) => (
          <span key={player.originalIndex} className="score-strip-item">
            <span className="score-strip-name">
              {idx === 0 ? '🥇 ' : ''}{player.name}
            </span>
            <span className="score-strip-score">{player.score}</span>
          </span>
        ))}
        {sortedPlayers.length > 3 && (
          <span className="score-strip-more">{t.more}</span>
        )}
      </button>

      {phase === 'pass' && (
        <div className="pass-screen">
          <p className="pass-label">{t.passLabel}</p>
          <p className="pass-explainer">{currentPlayer.name}</p>
          <p className="pass-hint">{t.passHint}</p>
          <p className="pass-scoring">{t.passScoring}</p>
          <button type="button" className="btn-ready" onClick={startTurn}>
            {t.ready}
          </button>
          <button type="button" className="btn-end-subtle" onClick={handleEndGame}>
            {t.endGame}
          </button>
        </div>
      )}

      {phase === 'playing' && (
        <div className="play-screen">
          <div className={timerClass}>
            {isLastWord ? t.lastWord : t.seconds(secondsLeft)}
          </div>

          <div className="pair-line">
            <span className="pair-role">
              <strong>{currentPlayer.name}</strong> → {targetPlayer?.name}
            </span>
          </div>

          <div className="word-stage">
            <p className="word-label">{t.wordLabel}</p>
            <p className="word">{currentWord}</p>
            <p className="word-hint">{t.wordHint}</p>
          </div>

          <div className="action-buttons">
            <button type="button" onClick={handleWordGuessed} className="btn-guessed">
              {t.guessed}
            </button>
            <button
              type="button"
              onClick={handleWordSkipped}
              className="btn-skip"
              disabled={gameData.hat.length <= 1 && !isLastWord}
            >
              {t.skip}
            </button>
          </div>

          <button type="button" className="btn-skip-turn" onClick={handleSkipTurn}>
            {t.endTurn}
          </button>

          <div className="play-footer">
            <button
              type="button"
              className="link-btn"
              onClick={() => setShowGuessed(true)}
            >
              {t.guessedList(guessedCount)}
            </button>
            <button type="button" className="link-btn danger" onClick={handleEndGame}>
              {t.endGame}
            </button>
          </div>
        </div>
      )}

      {showScores && (
        <div className="sheet-overlay" onClick={() => setShowScores(false)} role="presentation">
          <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog">
            <h2>{t.scoresTitle}</h2>
            <p className="sheet-note top-note">{t.scoresNote}</p>
            <div className="scores-list">
              {sortedPlayers.map((player, idx) => (
                <div
                  key={player.originalIndex}
                  className={`score-item ${
                    player.originalIndex === gameData.currentPlayerIndex ? 'active' : ''
                  }`}
                >
                  <span className="rank">#{idx + 1}</span>
                  <span className="name">{player.name}</span>
                  <span className="score">{player.score}</span>
                </div>
              ))}
            </div>
            <button type="button" className="btn-close" onClick={() => setShowScores(false)}>
              {t.close}
            </button>
          </div>
        </div>
      )}

      {showGuessed && (
        <div className="sheet-overlay" onClick={() => setShowGuessed(false)} role="presentation">
          <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog">
            <h2>{t.guessedWordsTitle}</h2>
            <div className="guessed-words-list">
              {gameData.guessed.length === 0 && (
                <p className="empty-hint">{t.emptyGuessed}</p>
              )}
              {[...gameData.guessed].reverse().map((entry, idx) => (
                <div key={`${entry.word}-${idx}`} className="guessed-word">
                  <span className="word-text">{entry.word}</span>
                  <span className="guessed-by">
                    {entry.explainedBy} → {entry.guessedBy}
                  </span>
                </div>
              ))}
            </div>
            <button type="button" className="btn-close" onClick={() => setShowGuessed(false)}>
              {t.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
