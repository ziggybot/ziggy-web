'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

// ── Types ──────────────────────────────────────────────────────
interface Signal {
  x: number;
  y: number;
  text: string;
  speed: number;
  isNoise: boolean;
  width: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  char: string;
  color: string;
}

type GameState = 'menu' | 'playing' | 'paused' | 'gameover';

// ── Signal data ────────────────────────────────────────────────
const REAL_SIGNALS = [
  'GPT-5 LEAKED',
  'QWEN 3 RELEASE',
  'LLAMA 4 BENCH',
  'FLUX 2.0 LAUNCH',
  'DEEPSEEK R2',
  'CLAUDE OPUS 4',
  'MIXTRAL 9X22B',
  'GEMINI 3 ULTRA',
  'SORA V2 PUBLIC',
  'STABLE DIFF 4',
  'MIDJOURNEY V7',
  'OPENAI O3-PRO',
  'LOCAL LLM WINS',
  'VRAM 256GB GPU',
  'OLLAMA 2.0',
  'COMFYUI 3.0',
  'TRANSFORMERS 5',
  'PYTORCH 3.0',
  'CUDA 14 LAUNCH',
  'AGENT PROTOCOL',
  'MCP STANDARD',
  'ROBOTICS LEAP',
  'NEUROMORPHIC AI',
  'SPARSE MOE 1T',
  'RAG BENCHMARK',
  'RLHF REPLACED',
  'CONTEXT 1M TOK',
  'VOICE CLONE AI',
  'CODE AUTOPILOT',
  'AI CHIP RECORD',
];

const NOISE_SIGNALS = [
  'BUY CRYPTO NOW',
  'AI IS DEAD',
  '10X YOUR MONEY',
  'GURU SAYS SELL',
  'CLICK HERE FREE',
  'NFT COMEBACK',
  'GUARANTEED ROI',
  'HYPE NO PROOF',
  'SPAM SPAM SPAM',
  'FAKE BENCHMARK',
  'TRUST ME BRO',
  'BUZZWORD ALERT',
  'NOTHING BURGER',
  'PAID PROMO',
  'RAGE BAIT',
  'VAPORWARE 3.0',
  'SCAM WARNING',
  'FUD DETECTED',
  'NOT A SIGNAL',
  'PURE NOISE',
];

const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:<>?/~`';

// ── Game constants ─────────────────────────────────────────────
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;
const PLAYER_WIDTH = 80;
const PLAYER_HEIGHT = 14;
const BASE_SPAWN_INTERVAL = 1200;
const MIN_SPAWN_INTERVAL = 400;
const BASE_SPEED = 1.2;
const SPEED_INCREMENT = 0.15;
const POINTS_PER_SIGNAL = 100;
const NOISE_PENALTY = 150;
const STARTING_LIVES = 3;
const LEVEL_UP_SCORE = 1000;

export default function SignalSurge() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());

  // Game state refs (for the game loop)
  const stateRef = useRef<GameState>('menu');
  const playerXRef = useRef(CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2);
  const signalsRef = useRef<Signal[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const scoreRef = useRef(0);
  const livesRef = useRef(STARTING_LIVES);
  const levelRef = useRef(1);
  const comboRef = useRef(0);
  const maxComboRef = useRef(0);
  const caughtRef = useRef(0);
  const missedRef = useRef(0);
  const noiseCaughtRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const frameCountRef = useRef(0);
  const highScoreRef = useRef(0);
  const flashRef = useRef<{ color: string; frames: number } | null>(null);
  const shakeRef = useRef(0);

  // React state (for UI overlay)
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [finalStats, setFinalStats] = useState({ score: 0, caught: 0, missed: 0, noiseCaught: 0, maxCombo: 0, level: 1 });
  const [scale, setScale] = useState(1);

  // ── Helpers ────────────────────────────────────────────────
  const spawnSignal = useCallback(() => {
    const isNoise = Math.random() < 0.3;
    const pool = isNoise ? NOISE_SIGNALS : REAL_SIGNALS;
    const text = pool[Math.floor(Math.random() * pool.length)];
    const width = text.length * 9 + 16;
    const x = Math.random() * (CANVAS_WIDTH - width);
    const speed = BASE_SPEED + (levelRef.current - 1) * SPEED_INCREMENT + Math.random() * 0.5;

    signalsRef.current.push({ x, y: -20, text, speed, isNoise, width });
  }, []);

  const spawnParticles = useCallback((x: number, y: number, color: string, count: number) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 1 + Math.random() * 3;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 30 + Math.random() * 20,
        maxLife: 50,
        char: GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)],
        color,
      });
    }
  }, []);

  const resetGame = useCallback(() => {
    playerXRef.current = CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2;
    signalsRef.current = [];
    particlesRef.current = [];
    scoreRef.current = 0;
    livesRef.current = STARTING_LIVES;
    levelRef.current = 1;
    comboRef.current = 0;
    maxComboRef.current = 0;
    caughtRef.current = 0;
    missedRef.current = 0;
    noiseCaughtRef.current = 0;
    lastSpawnRef.current = 0;
    frameCountRef.current = 0;
    flashRef.current = null;
    shakeRef.current = 0;

    setScore(0);
    setLives(STARTING_LIVES);
    setLevel(1);
    setCombo(0);
  }, []);

  // ── Start / Pause ────────────────────────────────────────
  const startGame = useCallback(() => {
    resetGame();
    stateRef.current = 'playing';
    setGameState('playing');
  }, [resetGame]);

  const togglePause = useCallback(() => {
    if (stateRef.current === 'playing') {
      stateRef.current = 'paused';
      setGameState('paused');
    } else if (stateRef.current === 'paused') {
      stateRef.current = 'playing';
      setGameState('playing');
    }
  }, []);

  // ── Responsive scaling ─────────────────────────────────
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newScale = Math.min(1, containerWidth / CANVAS_WIDTH);
        setScale(newScale);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // ── Load high score ────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('ziggy-signal-surge-highscore');
    if (saved) {
      const val = parseInt(saved, 10);
      highScoreRef.current = val;
      setHighScore(val);
    }
  }, []);

  // ── Keyboard input ─────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (stateRef.current === 'menu' || stateRef.current === 'gameover') {
          startGame();
        }
      }
      if (e.key === 'Escape' || e.key === 'p') {
        if (stateRef.current === 'playing' || stateRef.current === 'paused') {
          togglePause();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [startGame, togglePause]);

  // ── Touch input ────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      if (stateRef.current !== 'playing') return;

      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = (touch.clientX - rect.left) / scale;
      playerXRef.current = Math.max(0, Math.min(CANVAS_WIDTH - PLAYER_WIDTH, x - PLAYER_WIDTH / 2));
    };

    const handleTap = (e: TouchEvent) => {
      e.preventDefault();
      if (stateRef.current === 'menu' || stateRef.current === 'gameover') {
        startGame();
      }
    };

    canvas.addEventListener('touchmove', handleTouch, { passive: false });
    canvas.addEventListener('touchstart', handleTap, { passive: false });
    return () => {
      canvas.removeEventListener('touchmove', handleTouch);
      canvas.removeEventListener('touchstart', handleTap);
    };
  }, [startGame, scale]);

  // ── Main game loop ─────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      gameLoopRef.current = requestAnimationFrame(loop);
      frameCountRef.current++;

      // ── Update ────────────────────────────────────────
      if (stateRef.current === 'playing') {
        // Player movement
        const moveSpeed = 6;
        if (keysRef.current.has('ArrowLeft') || keysRef.current.has('a')) {
          playerXRef.current = Math.max(0, playerXRef.current - moveSpeed);
        }
        if (keysRef.current.has('ArrowRight') || keysRef.current.has('d')) {
          playerXRef.current = Math.min(CANVAS_WIDTH - PLAYER_WIDTH, playerXRef.current + moveSpeed);
        }

        // Spawn signals
        const spawnInterval = Math.max(MIN_SPAWN_INTERVAL, BASE_SPAWN_INTERVAL - (levelRef.current - 1) * 80);
        if (frameCountRef.current - lastSpawnRef.current > spawnInterval / 16.67) {
          spawnSignal();
          lastSpawnRef.current = frameCountRef.current;
        }

        // Update signals
        const playerY = CANVAS_HEIGHT - 40;
        const px = playerXRef.current;

        signalsRef.current = signalsRef.current.filter((sig) => {
          sig.y += sig.speed;

          // Check catch
          if (
            sig.y + 14 >= playerY &&
            sig.y <= playerY + PLAYER_HEIGHT &&
            sig.x + sig.width > px &&
            sig.x < px + PLAYER_WIDTH
          ) {
            if (sig.isNoise) {
              // Caught noise — bad
              scoreRef.current = Math.max(0, scoreRef.current - NOISE_PENALTY);
              comboRef.current = 0;
              noiseCaughtRef.current++;
              livesRef.current--;
              flashRef.current = { color: '#ef4444', frames: 8 };
              shakeRef.current = 6;
              spawnParticles(sig.x + sig.width / 2, sig.y, '#ef4444', 8);

              setScore(scoreRef.current);
              setLives(livesRef.current);
              setCombo(0);

              if (livesRef.current <= 0) {
                // Game over
                stateRef.current = 'gameover';
                if (scoreRef.current > highScoreRef.current) {
                  highScoreRef.current = scoreRef.current;
                  localStorage.setItem('ziggy-signal-surge-highscore', String(scoreRef.current));
                  setHighScore(scoreRef.current);
                }
                setFinalStats({
                  score: scoreRef.current,
                  caught: caughtRef.current,
                  missed: missedRef.current,
                  noiseCaught: noiseCaughtRef.current,
                  maxCombo: maxComboRef.current,
                  level: levelRef.current,
                });
                setGameState('gameover');
              }
            } else {
              // Caught real signal — good
              comboRef.current++;
              if (comboRef.current > maxComboRef.current) maxComboRef.current = comboRef.current;
              const comboBonus = Math.floor(comboRef.current / 5) * 50;
              scoreRef.current += POINTS_PER_SIGNAL + comboBonus;
              caughtRef.current++;
              flashRef.current = { color: '#00ff41', frames: 4 };
              spawnParticles(sig.x + sig.width / 2, sig.y, '#00ff41', 6);

              // Level up
              const newLevel = Math.floor(scoreRef.current / LEVEL_UP_SCORE) + 1;
              if (newLevel > levelRef.current) {
                levelRef.current = newLevel;
                setLevel(newLevel);
                flashRef.current = { color: '#3b82f6', frames: 12 };
              }

              setScore(scoreRef.current);
              setCombo(comboRef.current);
            }
            return false;
          }

          // Missed signal (fell off screen)
          if (sig.y > CANVAS_HEIGHT + 20) {
            if (!sig.isNoise) {
              missedRef.current++;
              comboRef.current = 0;
              setCombo(0);
            }
            return false;
          }

          return true;
        });
      }

      // Update particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.life--;
        return p.life > 0;
      });

      // Update flash
      if (flashRef.current) {
        flashRef.current.frames--;
        if (flashRef.current.frames <= 0) flashRef.current = null;
      }

      // Update shake
      if (shakeRef.current > 0) shakeRef.current--;

      // ── Render ────────────────────────────────────────
      ctx.save();

      // Screen shake
      if (shakeRef.current > 0) {
        const intensity = shakeRef.current;
        ctx.translate(
          (Math.random() - 0.5) * intensity * 2,
          (Math.random() - 0.5) * intensity * 2
        );
      }

      // Background
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Grid lines
      ctx.strokeStyle = 'rgba(39, 39, 42, 0.5)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < CANVAS_WIDTH; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y < CANVAS_HEIGHT; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
      }

      // Screen flash
      if (flashRef.current) {
        ctx.fillStyle = flashRef.current.color + '15';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      if (stateRef.current === 'menu') {
        // ── Menu screen ──────────────────────────────
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Title
        ctx.font = 'bold 28px "JetBrains Mono", monospace';
        ctx.fillStyle = '#00ff41';
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 20;
        ctx.fillText('SIGNAL SURGE', CANVAS_WIDTH / 2, 120);
        ctx.shadowBlur = 0;

        // Subtitle
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#71717a';
        ctx.fillText('// catch the signals. dodge the noise.', CANVAS_WIDTH / 2, 155);

        // ASCII art receiver
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillStyle = '#3f3f46';
        const art = [
          '     ╔══════════╗',
          '     ║  ZIGGY   ║',
          '     ║ RECEIVER ║',
          '     ╚════╤═════╝',
          '          │',
          '      ════╧════',
        ];
        art.forEach((line, i) => {
          ctx.fillText(line, CANVAS_WIDTH / 2, 200 + i * 16);
        });

        // Instructions
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#00ff41';
        ctx.fillText('[GREEN] = real signal → catch it (+100)', CANVAS_WIDTH / 2, 320);
        ctx.fillStyle = '#ef4444';
        ctx.fillText('[RED] = noise → avoid it (-150, -1 life)', CANVAS_WIDTH / 2, 340);
        ctx.fillStyle = '#71717a';
        ctx.fillText('← → or A/D to move', CANVAS_WIDTH / 2, 370);
        ctx.fillText('ESC to pause', CANVAS_WIDTH / 2, 388);

        // Start prompt
        const blink = Math.floor(frameCountRef.current / 30) % 2 === 0;
        if (blink) {
          ctx.font = 'bold 14px "JetBrains Mono", monospace';
          ctx.fillStyle = '#00ff41';
          ctx.shadowColor = '#00ff41';
          ctx.shadowBlur = 10;
          ctx.fillText('[ PRESS ENTER OR TAP TO START ]', CANVAS_WIDTH / 2, 430);
          ctx.shadowBlur = 0;
        }

        // High score
        if (highScoreRef.current > 0) {
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillStyle = '#f59e0b';
          ctx.fillText(`HIGH SCORE: ${highScoreRef.current.toLocaleString()}`, CANVAS_WIDTH / 2, 460);
        }
      } else if (stateRef.current === 'playing' || stateRef.current === 'paused') {
        // ── Game rendering ───────────────────────────
        // Signals
        signalsRef.current.forEach((sig) => {
          const isNoise = sig.isNoise;
          const baseColor = isNoise ? '#ef4444' : '#00ff41';
          const dimColor = isNoise ? '#7f1d1d' : '#14532d';

          // Signal box
          ctx.fillStyle = isNoise ? 'rgba(239,68,68,0.08)' : 'rgba(0,255,65,0.06)';
          ctx.fillRect(sig.x, sig.y, sig.width, 18);

          // Border
          ctx.strokeStyle = baseColor + '60';
          ctx.lineWidth = 1;
          ctx.strokeRect(sig.x, sig.y, sig.width, 18);

          // Prefix
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = dimColor;
          ctx.fillText(isNoise ? '!' : '>', sig.x + 4, sig.y + 9);

          // Text
          ctx.fillStyle = baseColor;
          ctx.fillText(sig.text, sig.x + 14, sig.y + 9);
        });

        // Player (receiver dish)
        const playerY = CANVAS_HEIGHT - 40;
        const px = playerXRef.current;

        // Receiver glow
        ctx.fillStyle = 'rgba(0,255,65,0.05)';
        ctx.fillRect(px - 10, playerY - 8, PLAYER_WIDTH + 20, PLAYER_HEIGHT + 16);

        // Receiver body
        ctx.fillStyle = '#00ff41';
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 8;
        ctx.fillRect(px, playerY, PLAYER_WIDTH, 3);
        ctx.shadowBlur = 0;

        // Antenna
        const cx = px + PLAYER_WIDTH / 2;
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, playerY);
        ctx.lineTo(cx, playerY - 10);
        ctx.stroke();

        // Dish
        ctx.beginPath();
        ctx.moveTo(cx - 12, playerY - 6);
        ctx.quadraticCurveTo(cx, playerY - 14, cx + 12, playerY - 6);
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Receiver label
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#14532d';
        ctx.fillText('ZIGGY', cx, playerY + 12);

        // Pause overlay
        if (stateRef.current === 'paused') {
          ctx.fillStyle = 'rgba(9,9,11,0.85)';
          ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

          ctx.textAlign = 'center';
          ctx.font = 'bold 24px "JetBrains Mono", monospace';
          ctx.fillStyle = '#00ff41';
          ctx.shadowColor = '#00ff41';
          ctx.shadowBlur = 15;
          ctx.fillText('// PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);
          ctx.shadowBlur = 0;

          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.fillStyle = '#71717a';
          ctx.fillText('press ESC to resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
        }
      } else if (stateRef.current === 'gameover') {
        // ── Game over screen ─────────────────────────
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Title
        ctx.font = 'bold 24px "JetBrains Mono", monospace';
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 15;
        ctx.fillText('SIGNAL LOST', CANVAS_WIDTH / 2, 100);
        ctx.shadowBlur = 0;

        // Stats
        ctx.font = '11px "JetBrains Mono", monospace';
        const stats = [
          { label: 'SCORE', value: `${scoreRef.current.toLocaleString()}`, color: '#00ff41' },
          { label: 'LEVEL', value: `${levelRef.current}`, color: '#3b82f6' },
          { label: 'CAUGHT', value: `${caughtRef.current}`, color: '#00ff41' },
          { label: 'MISSED', value: `${missedRef.current}`, color: '#f59e0b' },
          { label: 'NOISE HIT', value: `${noiseCaughtRef.current}`, color: '#ef4444' },
          { label: 'BEST COMBO', value: `${maxComboRef.current}x`, color: '#a855f7' },
        ];

        stats.forEach((stat, i) => {
          const y = 170 + i * 28;
          ctx.fillStyle = '#52525b';
          ctx.textAlign = 'right';
          ctx.fillText(stat.label, CANVAS_WIDTH / 2 - 10, y);
          ctx.fillStyle = stat.color;
          ctx.textAlign = 'left';
          ctx.fillText(stat.value, CANVAS_WIDTH / 2 + 10, y);
        });

        // New high score
        if (scoreRef.current >= highScoreRef.current && scoreRef.current > 0) {
          ctx.textAlign = 'center';
          ctx.font = 'bold 12px "JetBrains Mono", monospace';
          ctx.fillStyle = '#f59e0b';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 10;
          ctx.fillText('★ NEW HIGH SCORE ★', CANVAS_WIDTH / 2, 370);
          ctx.shadowBlur = 0;
        }

        // Restart prompt
        const blink = Math.floor(frameCountRef.current / 30) % 2 === 0;
        if (blink) {
          ctx.textAlign = 'center';
          ctx.font = 'bold 13px "JetBrains Mono", monospace';
          ctx.fillStyle = '#00ff41';
          ctx.shadowColor = '#00ff41';
          ctx.shadowBlur = 10;
          ctx.fillText('[ PRESS ENTER OR TAP TO RETRY ]', CANVAS_WIDTH / 2, 420);
          ctx.shadowBlur = 0;
        }
      }

      // ── Particles (always render) ──────────────────
      particlesRef.current.forEach((p) => {
        const alpha = p.life / p.maxLife;
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillText(p.char, p.x, p.y);
      });
      ctx.globalAlpha = 1;

      // ── Scanline overlay (subtle) ──────────────────
      for (let y = 0; y < CANVAS_HEIGHT; y += 4) {
        ctx.fillStyle = 'rgba(0,0,0,0.04)';
        ctx.fillRect(0, y, CANVAS_WIDTH, 2);
      }

      ctx.restore();
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [spawnSignal, spawnParticles]);

  // ── HUD ────────────────────────────────────────────────
  const renderHUD = () => {
    if (gameState !== 'playing' && gameState !== 'paused') return null;

    return (
      <div className="flex items-center justify-between text-[10px] tracking-wider mt-2 px-1">
        <div className="flex gap-4">
          <span className="text-terminal">
            SCORE <span className="text-glow font-bold">{score.toLocaleString()}</span>
          </span>
          <span className="text-zinc-500">
            LVL <span className="text-blue-400 font-bold">{level}</span>
          </span>
          {combo > 2 && (
            <span className="text-purple-400">
              COMBO <span className="font-bold">{combo}x</span>
            </span>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-zinc-600">LIVES</span>
          {Array.from({ length: STARTING_LIVES }).map((_, i) => (
            <span
              key={i}
              className={i < lives ? 'text-terminal text-glow' : 'text-zinc-800'}
            >
              ■
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="w-full max-w-[640px] mx-auto">
      <div
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border border-zinc-800 bg-zinc-950 block"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
      <div style={{ width: CANVAS_WIDTH * scale }}>
        {renderHUD()}
      </div>
    </div>
  );
}
