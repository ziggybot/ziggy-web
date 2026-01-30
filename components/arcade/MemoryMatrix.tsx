'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ── Types ──────────────────────────────────────────────────────
interface Card {
  id: number;
  pairId: number;
  text: string;
  flipped: boolean;
  matched: boolean;
}

type GameState = 'menu' | 'playing' | 'levelComplete' | 'gameover';

// ── AI concept pairs ───────────────────────────────────────────
const CONCEPT_PAIRS = [
  ['TRANSFORMER', 'ATTENTION'],
  ['GRADIENT', 'DESCENT'],
  ['ENCODER', 'DECODER'],
  ['NEURAL', 'NETWORK'],
  ['BACK', 'PROPAGATION'],
  ['LOSS', 'FUNCTION'],
  ['BATCH', 'NORMALIZE'],
  ['CONV', 'POOLING'],
  ['RECURRENT', 'MEMORY'],
  ['LATENT', 'SPACE'],
  ['EMBEDDING', 'VECTOR'],
  ['SOFTMAX', 'LOGITS'],
  ['DROPOUT', 'REGULARIZE'],
  ['FINE', 'TUNE'],
  ['REWARD', 'MODEL'],
  ['TOKEN', 'SEQUENCE'],
  ['PROMPT', 'COMPLETION'],
  ['WEIGHT', 'BIAS'],
  ['EPOCH', 'ITERATION'],
  ['SPARSE', 'DENSE'],
  ['INFERENCE', 'TRAINING'],
  ['QUANTIZE', 'COMPRESS'],
  ['MIXTURE', 'EXPERTS'],
  ['CONTEXT', 'WINDOW'],
  ['CHAIN', 'THOUGHT'],
  ['RESIDUAL', 'CONNECTION'],
  ['MULTI', 'HEAD'],
  ['LAYER', 'NORM'],
  ['CROSS', 'ENTROPY'],
  ['BEAM', 'SEARCH'],
];

const GLITCH_CHARS = '!@#$%^&*_+-=|;:<>?/~';

// ── Level configs ──────────────────────────────────────────────
const LEVELS = [
  { pairs: 4, cols: 4, rows: 2, time: 60 },
  { pairs: 6, cols: 4, rows: 3, time: 75 },
  { pairs: 8, cols: 4, rows: 4, time: 90 },
  { pairs: 10, cols: 5, rows: 4, time: 100 },
  { pairs: 12, cols: 6, rows: 4, time: 110 },
  { pairs: 15, cols: 6, rows: 5, time: 120 },
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MemoryMatrix() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [level, setLevel] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lockBoard, setLockBoard] = useState(false);
  const [glitchCard, setGlitchCard] = useState<number | null>(null);
  const [peekPhase, setPeekPhase] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('ziggy-memory-matrix-highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Timer
  useEffect(() => {
    if (gameState === 'playing' && !peekPhase) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setGameState('gameover');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [gameState, peekPhase]);

  const buildLevel = useCallback((lvl: number) => {
    const config = LEVELS[Math.min(lvl, LEVELS.length - 1)];
    const selected = shuffleArray(CONCEPT_PAIRS).slice(0, config.pairs);
    const cardData: Card[] = [];
    selected.forEach((pair, pairId) => {
      cardData.push({ id: pairId * 2, pairId, text: pair[0], flipped: false, matched: false });
      cardData.push({ id: pairId * 2 + 1, pairId, text: pair[1], flipped: false, matched: false });
    });
    const shuffled = shuffleArray(cardData).map((c, i) => ({ ...c, id: i }));
    setCards(shuffled);
    setFlippedIds([]);
    setMoves(0);
    setMatches(0);
    setScore(0);
    setCombo(0);
    setTimeLeft(config.time);
    setLockBoard(true);
    setPeekPhase(true);

    // Peek: show all cards briefly
    setTimeout(() => {
      setCards((prev) => prev.map((c) => ({ ...c, flipped: true })));
    }, 100);
    setTimeout(() => {
      setCards((prev) => prev.map((c) => ({ ...c, flipped: false })));
      setLockBoard(false);
      setPeekPhase(false);
    }, 1500);
  }, []);

  const startGame = useCallback(() => {
    setLevel(0);
    setTotalScore(0);
    setGameState('playing');
    buildLevel(0);
  }, [buildLevel]);

  const nextLevel = useCallback(() => {
    const next = level + 1;
    if (next >= LEVELS.length) {
      // Won the game
      const finalScore = totalScore + score;
      if (finalScore > highScore) {
        localStorage.setItem('ziggy-memory-matrix-highscore', String(finalScore));
        setHighScore(finalScore);
      }
      setTotalScore(finalScore);
      setGameState('gameover');
      return;
    }
    setLevel(next);
    setTotalScore((prev) => prev + score);
    setGameState('playing');
    buildLevel(next);
  }, [level, score, totalScore, highScore, buildLevel]);

  const handleCardClick = useCallback((id: number) => {
    if (lockBoard) return;
    if (gameState !== 'playing') return;

    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;
    if (flippedIds.includes(id)) return;

    const newFlipped = [...flippedIds, id];
    setCards((prev) => prev.map((c) => c.id === id ? { ...c, flipped: true } : c));
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setLockBoard(true);

      const [first, second] = newFlipped;
      const cardA = cards.find((c) => c.id === first)!;
      const cardB = cards.find((c) => c.id === second)!;

      if (cardA.pairId === cardB.pairId) {
        // Match
        const newCombo = combo + 1;
        setCombo(newCombo);
        const comboBonus = Math.floor(newCombo / 3) * 50;
        const timeBonus = Math.floor(timeLeft / 10) * 10;
        const points = 200 + comboBonus + timeBonus;
        setScore((s) => s + points);
        const newMatches = matches + 1;
        setMatches(newMatches);

        setTimeout(() => {
          setCards((prev) => prev.map((c) =>
            c.pairId === cardA.pairId ? { ...c, matched: true } : c
          ));
          setFlippedIds([]);
          setLockBoard(false);

          const config = LEVELS[Math.min(level, LEVELS.length - 1)];
          if (newMatches >= config.pairs) {
            if (timerRef.current) clearInterval(timerRef.current);
            setGameState('levelComplete');
          }
        }, 400);
      } else {
        // No match
        setCombo(0);
        setGlitchCard(first);
        setTimeout(() => setGlitchCard(second), 100);

        setTimeout(() => {
          setCards((prev) => prev.map((c) =>
            newFlipped.includes(c.id) ? { ...c, flipped: false } : c
          ));
          setFlippedIds([]);
          setLockBoard(false);
          setGlitchCard(null);
        }, 700);
      }
    }
  }, [cards, flippedIds, lockBoard, gameState, combo, matches, level, timeLeft]);

  // ── Glitch text effect ───────────────────────────────────
  const [glitchTexts, setGlitchTexts] = useState<Record<number, string>>({});
  useEffect(() => {
    if (glitchCard === null) return;
    const card = cards.find((c) => c.id === glitchCard);
    if (!card) return;
    let iterations = 0;
    const interval = setInterval(() => {
      setGlitchTexts((prev) => ({
        ...prev,
        [glitchCard]: card.text.split('').map(() =>
          GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        ).join(''),
      }));
      iterations++;
      if (iterations > 8) {
        clearInterval(interval);
        setGlitchTexts((prev) => { const n = { ...prev }; delete n[glitchCard]; return n; });
      }
    }, 40);
    return () => clearInterval(interval);
  }, [glitchCard, cards]);

  // ── Render ───────────────────────────────────────────────
  const config = LEVELS[Math.min(level, LEVELS.length - 1)];

  if (gameState === 'menu') {
    return (
      <div className="w-full max-w-[600px] mx-auto text-center py-8">
        <h2 className="text-terminal text-glow text-2xl font-bold mb-2">MEMORY MATRIX</h2>
        <p className="text-zinc-500 text-xs mb-1">// match AI concept pairs</p>
        <p className="text-zinc-600 text-[10px] mb-8">find the matching pairs before time runs out</p>

        <div className="border border-zinc-800 bg-zinc-900/50 p-6 mb-6 text-left max-w-sm mx-auto">
          <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-3">How to play</div>
          <div className="space-y-2 text-xs text-zinc-400">
            <p>&#x25B8; Click cards to flip them</p>
            <p>&#x25B8; Match concept pairs (e.g. TRANSFORMER + ATTENTION)</p>
            <p>&#x25B8; Cards peek briefly at the start of each level</p>
            <p>&#x25B8; Consecutive matches build combo bonus</p>
            <p>&#x25B8; 6 levels, grids get larger each time</p>
          </div>
        </div>

        {highScore > 0 && (
          <p className="text-[10px] text-amber-500 mb-4">HIGH SCORE: {highScore.toLocaleString()}</p>
        )}

        <button
          onClick={startGame}
          className="border border-terminal text-terminal px-6 py-2 text-sm font-bold tracking-wider hover:bg-terminal hover:text-zinc-950 transition-all"
        >
          START GAME
        </button>
      </div>
    );
  }

  if (gameState === 'levelComplete') {
    return (
      <div className="w-full max-w-[600px] mx-auto text-center py-8">
        <h2 className="text-terminal text-glow text-xl font-bold mb-2">LEVEL {level + 1} CLEAR</h2>
        <div className="space-y-2 text-xs my-6">
          <p className="text-zinc-400">Moves: <span className="text-zinc-200 font-bold">{moves}</span></p>
          <p className="text-zinc-400">Time left: <span className="text-zinc-200 font-bold">{timeLeft}s</span></p>
          <p className="text-zinc-400">Level score: <span className="text-terminal font-bold">{score.toLocaleString()}</span></p>
          <p className="text-zinc-400">Total: <span className="text-terminal font-bold">{(totalScore + score).toLocaleString()}</span></p>
        </div>
        <button
          onClick={nextLevel}
          className="border border-terminal text-terminal px-6 py-2 text-sm font-bold tracking-wider hover:bg-terminal hover:text-zinc-950 transition-all"
        >
          {level + 1 >= LEVELS.length ? 'VIEW RESULTS' : `LEVEL ${level + 2} →`}
        </button>
      </div>
    );
  }

  if (gameState === 'gameover') {
    const finalScore = totalScore + score;
    const isNewHigh = finalScore >= highScore && finalScore > 0;
    return (
      <div className="w-full max-w-[600px] mx-auto text-center py-8">
        <h2 className={`text-xl font-bold mb-2 ${timeLeft <= 0 ? 'text-red-500' : 'text-terminal text-glow'}`}>
          {timeLeft <= 0 ? 'TIME EXPIRED' : 'MATRIX COMPLETE'}
        </h2>
        <div className="space-y-2 text-xs my-6">
          <p className="text-zinc-400">Final score: <span className="text-terminal font-bold text-base">{finalScore.toLocaleString()}</span></p>
          <p className="text-zinc-400">Levels cleared: <span className="text-blue-400 font-bold">{timeLeft <= 0 ? level : level + 1}</span></p>
        </div>
        {isNewHigh && (
          <p className="text-amber-500 text-xs font-bold mb-4">★ NEW HIGH SCORE ★</p>
        )}
        <button
          onClick={startGame}
          className="border border-terminal text-terminal px-6 py-2 text-sm font-bold tracking-wider hover:bg-terminal hover:text-zinc-950 transition-all"
        >
          PLAY AGAIN
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[600px] mx-auto">
      {/* HUD */}
      <div className="flex items-center justify-between text-[10px] tracking-wider mb-4 px-1">
        <div className="flex gap-4">
          <span className="text-terminal">
            SCORE <span className="text-glow font-bold">{(totalScore + score).toLocaleString()}</span>
          </span>
          <span className="text-zinc-500">
            LVL <span className="text-blue-400 font-bold">{level + 1}</span>
          </span>
          {combo > 1 && (
            <span className="text-purple-400">
              COMBO <span className="font-bold">{combo}x</span>
            </span>
          )}
        </div>
        <div className="flex gap-4">
          <span className="text-zinc-500">
            MOVES <span className="text-zinc-300 font-bold">{moves}</span>
          </span>
          <span className={timeLeft <= 10 ? 'text-red-500' : 'text-zinc-500'}>
            TIME <span className="font-bold">{timeLeft}s</span>
          </span>
        </div>
      </div>

      {/* Card grid */}
      <div
        className="grid gap-2 mx-auto"
        style={{
          gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
          maxWidth: Math.min(config.cols * 100, 600),
        }}
      >
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`
              relative aspect-[3/2] border text-[10px] sm:text-xs font-bold tracking-wider
              transition-all duration-200 select-none
              ${card.matched
                ? 'border-terminal/30 bg-terminal/10 text-terminal/50'
                : card.flipped
                  ? 'border-terminal bg-terminal/5 text-terminal text-glow'
                  : 'border-zinc-700 bg-zinc-900 text-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50 cursor-pointer'
              }
            `}
            disabled={card.matched || card.flipped || lockBoard}
          >
            {card.flipped || card.matched ? (
              <span className={glitchCard === card.id ? 'opacity-70' : ''}>
                {glitchTexts[card.id] || card.text}
              </span>
            ) : (
              <span className="text-zinc-700 text-lg">?</span>
            )}
          </button>
        ))}
      </div>

      {/* Pair hint */}
      <div className="text-center mt-4">
        <p className="text-[9px] text-zinc-700 uppercase tracking-widest">
          {config.pairs - matches} pairs remaining
        </p>
      </div>
    </div>
  );
}
