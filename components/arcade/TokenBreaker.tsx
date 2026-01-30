'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

// ── Types ──────────────────────────────────────────────────────
interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  hits: number;
  maxHits: number;
  color: string;
  alive: boolean;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface PowerUp {
  x: number;
  y: number;
  vy: number;
  type: 'wide' | 'multi' | 'slow';
  text: string;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  char: string;
  color: string;
}

type GameState = 'menu' | 'playing' | 'paused' | 'levelComplete' | 'gameover';

// ── Data ───────────────────────────────────────────────────────
const TOKEN_WORDS = [
  'LLM', 'GPU', 'TPU', 'API', 'RAG', 'MLP', 'GAN', 'VAE', 'RNN', 'CNN',
  'NLP', 'NLU', 'ASR', 'TTS', 'OCR', 'SFT', 'DPO', 'PPO', 'MOE', 'KV$',
  'QKV', 'FFN', 'BPE', 'AGI', 'ASI', 'LOR', 'INT', 'FP8', 'OPT', 'MHA',
];

// ── Constants ──────────────────────────────────────────────────
const W = 640;
const H = 480;
const PAD_Y = H - 30;
const PAD_W = 80;
const PAD_H = 8;
const BALL_R = 5;
const BALL_SPEED = 4;
const BRICK_ROWS = 5;
const BRICK_COLS = 10;
const BRICK_W = 56;
const BRICK_H = 18;
const BRICK_GAP = 4;
const BRICK_OFFSET_X = (W - (BRICK_COLS * (BRICK_W + BRICK_GAP) - BRICK_GAP)) / 2;
const BRICK_OFFSET_Y = 50;

const ROW_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#a855f7', '#00ff41'];

export default function TokenBreaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());

  const stateRef = useRef<GameState>('menu');
  const padXRef = useRef(W / 2 - PAD_W / 2);
  const ballsRef = useRef<Ball[]>([]);
  const bricksRef = useRef<Brick[]>([]);
  const powerUpsRef = useRef<PowerUp[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const levelRef = useRef(1);
  const padWidthRef = useRef(PAD_W);
  const highScoreRef = useRef(0);
  const frameRef = useRef(0);
  const comboRef = useRef(0);

  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [scale, setScale] = useState(1);

  // ── Helpers ────────────────────────────────────────────────
  const buildBricks = useCallback((lvl: number) => {
    const rows = Math.min(BRICK_ROWS + Math.floor((lvl - 1) / 2), 8);
    const bricks: Brick[] = [];
    const words = [...TOKEN_WORDS].sort(() => Math.random() - 0.5);
    let wi = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        const hits = r < 2 && lvl > 2 ? 2 : 1;
        bricks.push({
          x: BRICK_OFFSET_X + c * (BRICK_W + BRICK_GAP),
          y: BRICK_OFFSET_Y + r * (BRICK_H + BRICK_GAP),
          w: BRICK_W,
          h: BRICK_H,
          text: words[wi % words.length],
          hits,
          maxHits: hits,
          color: ROW_COLORS[r % ROW_COLORS.length],
          alive: true,
        });
        wi++;
      }
    }
    bricksRef.current = bricks;
  }, []);

  const spawnBall = useCallback(() => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
    const speed = BALL_SPEED + (levelRef.current - 1) * 0.3;
    return {
      x: padXRef.current + padWidthRef.current / 2,
      y: PAD_Y - BALL_R - 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: BALL_R,
    };
  }, []);

  const spawnParticles = useCallback((x: number, y: number, color: string, count: number) => {
    const chars = '█▓▒░*';
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 1 + Math.random() * 2.5;
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: 15 + Math.random() * 15,
        char: chars[Math.floor(Math.random() * chars.length)],
        color,
      });
    }
  }, []);

  const resetGame = useCallback(() => {
    scoreRef.current = 0;
    livesRef.current = 3;
    levelRef.current = 1;
    padWidthRef.current = PAD_W;
    padXRef.current = W / 2 - PAD_W / 2;
    powerUpsRef.current = [];
    particlesRef.current = [];
    comboRef.current = 0;
    frameRef.current = 0;
    setScore(0);
    setLives(3);
    setLevel(1);
  }, []);

  const startLevel = useCallback((lvl: number) => {
    buildBricks(lvl);
    ballsRef.current = [spawnBall()];
    powerUpsRef.current = [];
    padWidthRef.current = PAD_W;
    comboRef.current = 0;
  }, [buildBricks, spawnBall]);

  const startGame = useCallback(() => {
    resetGame();
    startLevel(1);
    stateRef.current = 'playing';
    setGameState('playing');
  }, [resetGame, startLevel]);

  // ── Scaling ──────────────────────────────────────────────
  useEffect(() => {
    const update = () => {
      if (containerRef.current) setScale(Math.min(1, containerRef.current.offsetWidth / W));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('ziggy-token-breaker-highscore');
    if (saved) { const v = parseInt(saved, 10); highScoreRef.current = v; setHighScore(v); }
  }, []);

  // ── Input ──────────────────────────────────────────────────
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (stateRef.current === 'menu' || stateRef.current === 'gameover') startGame();
        if (stateRef.current === 'levelComplete') {
          levelRef.current++;
          setLevel(levelRef.current);
          startLevel(levelRef.current);
          stateRef.current = 'playing';
          setGameState('playing');
        }
      }
      if (e.key === 'Escape' || e.key === 'p') {
        if (stateRef.current === 'playing') { stateRef.current = 'paused'; setGameState('paused'); }
        else if (stateRef.current === 'paused') { stateRef.current = 'playing'; setGameState('playing'); }
      }
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [startGame, startLevel]);

  // Touch/mouse
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const move = (e: TouchEvent) => {
      e.preventDefault();
      if (stateRef.current !== 'playing') return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.touches[0].clientX - rect.left) / scale;
      padXRef.current = Math.max(0, Math.min(W - padWidthRef.current, x - padWidthRef.current / 2));
    };
    const tap = (e: TouchEvent) => {
      e.preventDefault();
      if (stateRef.current === 'menu' || stateRef.current === 'gameover') startGame();
      if (stateRef.current === 'levelComplete') {
        levelRef.current++;
        setLevel(levelRef.current);
        startLevel(levelRef.current);
        stateRef.current = 'playing';
        setGameState('playing');
      }
    };
    canvas.addEventListener('touchmove', move, { passive: false });
    canvas.addEventListener('touchstart', tap, { passive: false });
    return () => { canvas.removeEventListener('touchmove', move); canvas.removeEventListener('touchstart', tap); };
  }, [startGame, startLevel, scale]);

  // Mouse
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const move = (e: MouseEvent) => {
      if (stateRef.current !== 'playing') return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      padXRef.current = Math.max(0, Math.min(W - padWidthRef.current, x - padWidthRef.current / 2));
    };
    canvas.addEventListener('mousemove', move);
    return () => canvas.removeEventListener('mousemove', move);
  }, [scale]);

  // ── Game loop ──────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      loopRef.current = requestAnimationFrame(loop);
      frameRef.current++;

      if (stateRef.current === 'playing') {
        // Keyboard paddle
        const moveSpeed = 7;
        if (keysRef.current.has('ArrowLeft') || keysRef.current.has('a'))
          padXRef.current = Math.max(0, padXRef.current - moveSpeed);
        if (keysRef.current.has('ArrowRight') || keysRef.current.has('d'))
          padXRef.current = Math.min(W - padWidthRef.current, padXRef.current + moveSpeed);

        // Update balls
        const deadBalls: number[] = [];
        ballsRef.current.forEach((ball, bi) => {
          ball.x += ball.vx;
          ball.y += ball.vy;

          // Walls
          if (ball.x - ball.radius <= 0) { ball.x = ball.radius; ball.vx = Math.abs(ball.vx); }
          if (ball.x + ball.radius >= W) { ball.x = W - ball.radius; ball.vx = -Math.abs(ball.vx); }
          if (ball.y - ball.radius <= 0) { ball.y = ball.radius; ball.vy = Math.abs(ball.vy); }

          // Bottom — lost
          if (ball.y > H + 20) {
            deadBalls.push(bi);
          }

          // Paddle
          if (
            ball.vy > 0 &&
            ball.y + ball.radius >= PAD_Y &&
            ball.y - ball.radius <= PAD_Y + PAD_H &&
            ball.x >= padXRef.current &&
            ball.x <= padXRef.current + padWidthRef.current
          ) {
            const hitPos = (ball.x - padXRef.current) / padWidthRef.current;
            const angle = -Math.PI / 2 + (hitPos - 0.5) * 1.2;
            const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
            ball.vx = Math.cos(angle) * speed;
            ball.vy = Math.sin(angle) * speed;
            ball.y = PAD_Y - ball.radius;
            comboRef.current = 0;
          }

          // Bricks
          bricksRef.current.forEach((brick) => {
            if (!brick.alive) return;
            if (
              ball.x + ball.radius > brick.x &&
              ball.x - ball.radius < brick.x + brick.w &&
              ball.y + ball.radius > brick.y &&
              ball.y - ball.radius < brick.y + brick.h
            ) {
              brick.hits--;
              if (brick.hits <= 0) {
                brick.alive = false;
                comboRef.current++;
                const comboBonus = Math.floor(comboRef.current / 5) * 25;
                const pts = 50 + comboBonus;
                scoreRef.current += pts;
                setScore(scoreRef.current);
                spawnParticles(brick.x + brick.w / 2, brick.y + brick.h / 2, brick.color, 5);

                // Power-up chance
                if (Math.random() < 0.12) {
                  const types: PowerUp['type'][] = ['wide', 'multi', 'slow'];
                  const type = types[Math.floor(Math.random() * types.length)];
                  const texts = { wide: 'WIDE', multi: 'MULTI', slow: 'SLOW' };
                  const colors = { wide: '#00ff41', multi: '#a855f7', slow: '#3b82f6' };
                  powerUpsRef.current.push({
                    x: brick.x + brick.w / 2 - 15,
                    y: brick.y,
                    vy: 2,
                    type,
                    text: texts[type],
                    color: colors[type],
                  });
                }
              }

              // Bounce
              const overlapX = Math.min(
                Math.abs(ball.x - brick.x),
                Math.abs(ball.x - (brick.x + brick.w))
              );
              const overlapY = Math.min(
                Math.abs(ball.y - brick.y),
                Math.abs(ball.y - (brick.y + brick.h))
              );
              if (overlapX < overlapY) ball.vx = -ball.vx;
              else ball.vy = -ball.vy;
            }
          });
        });

        // Remove dead balls
        if (deadBalls.length > 0) {
          ballsRef.current = ballsRef.current.filter((_, i) => !deadBalls.includes(i));
          if (ballsRef.current.length === 0) {
            livesRef.current--;
            setLives(livesRef.current);
            if (livesRef.current <= 0) {
              stateRef.current = 'gameover';
              setGameState('gameover');
              if (scoreRef.current > highScoreRef.current) {
                highScoreRef.current = scoreRef.current;
                localStorage.setItem('ziggy-token-breaker-highscore', String(scoreRef.current));
                setHighScore(scoreRef.current);
              }
            } else {
              ballsRef.current = [spawnBall()];
              padWidthRef.current = PAD_W;
            }
          }
        }

        // Power-ups
        powerUpsRef.current = powerUpsRef.current.filter((pu) => {
          pu.y += pu.vy;
          if (pu.y > H + 20) return false;

          if (
            pu.y + 14 >= PAD_Y &&
            pu.y <= PAD_Y + PAD_H &&
            pu.x + 30 > padXRef.current &&
            pu.x < padXRef.current + padWidthRef.current
          ) {
            if (pu.type === 'wide') padWidthRef.current = Math.min(160, padWidthRef.current + 30);
            if (pu.type === 'multi') {
              const newBalls = ballsRef.current.map((b) => ({
                ...b,
                vx: b.vx + (Math.random() - 0.5) * 2,
                vy: -Math.abs(b.vy),
              }));
              ballsRef.current.push(...newBalls);
            }
            if (pu.type === 'slow') {
              ballsRef.current.forEach((b) => { b.vx *= 0.7; b.vy *= 0.7; });
            }
            spawnParticles(pu.x + 15, pu.y, pu.color, 6);
            return false;
          }
          return true;
        });

        // Check level clear
        if (bricksRef.current.every((b) => !b.alive)) {
          stateRef.current = 'levelComplete';
          setGameState('levelComplete');
        }
      }

      // Update particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.life--;
        return p.life > 0;
      });

      // ── Render ──────────────────────────────────────
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = 'rgba(39,39,42,0.3)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      if (stateRef.current === 'menu') {
        ctx.textAlign = 'center';
        ctx.font = 'bold 28px "JetBrains Mono", monospace';
        ctx.fillStyle = '#00ff41';
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 20;
        ctx.fillText('TOKEN BREAKER', W / 2, 120);
        ctx.shadowBlur = 0;

        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#71717a';
        ctx.fillText('// break the tokens. collect power-ups.', W / 2, 150);

        ctx.fillStyle = '#00ff41';
        ctx.fillText('Mouse/Touch to move paddle', W / 2, 200);
        ctx.fillText('← → or A/D also works', W / 2, 220);
        ctx.fillStyle = '#71717a';
        ctx.fillText('ESC to pause', W / 2, 250);

        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#00ff41';
        ctx.fillText('[WIDE] wider paddle', W / 2 - 100, 290);
        ctx.fillStyle = '#a855f7';
        ctx.fillText('[MULTI] split balls', W / 2, 290);
        ctx.fillStyle = '#3b82f6';
        ctx.fillText('[SLOW] slow ball', W / 2 + 100, 290);

        const blink = Math.floor(frameRef.current / 30) % 2 === 0;
        if (blink) {
          ctx.font = 'bold 14px "JetBrains Mono", monospace';
          ctx.fillStyle = '#00ff41';
          ctx.shadowColor = '#00ff41';
          ctx.shadowBlur = 10;
          ctx.fillText('[ PRESS ENTER OR TAP TO START ]', W / 2, 370);
          ctx.shadowBlur = 0;
        }

        if (highScoreRef.current > 0) {
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillStyle = '#f59e0b';
          ctx.fillText(`HIGH SCORE: ${highScoreRef.current.toLocaleString()}`, W / 2, 420);
        }
      } else {
        // Bricks
        bricksRef.current.forEach((brick) => {
          if (!brick.alive) return;
          const alpha = brick.hits < brick.maxHits ? '80' : 'ff';
          ctx.fillStyle = brick.color + '15';
          ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
          ctx.strokeStyle = brick.color + alpha;
          ctx.lineWidth = 1;
          ctx.strokeRect(brick.x, brick.y, brick.w, brick.h);

          ctx.font = '8px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillStyle = brick.color + alpha;
          ctx.fillText(brick.text, brick.x + brick.w / 2, brick.y + brick.h / 2 + 3);
        });

        // Power-ups
        powerUpsRef.current.forEach((pu) => {
          ctx.fillStyle = pu.color + '20';
          ctx.fillRect(pu.x, pu.y, 30, 14);
          ctx.strokeStyle = pu.color;
          ctx.lineWidth = 1;
          ctx.strokeRect(pu.x, pu.y, 30, 14);
          ctx.font = '8px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillStyle = pu.color;
          ctx.fillText(pu.text, pu.x + 15, pu.y + 10);
        });

        // Balls
        ballsRef.current.forEach((ball) => {
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#00ff41';
          ctx.shadowColor = '#00ff41';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // Paddle
        ctx.fillStyle = '#00ff41';
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 6;
        ctx.fillRect(padXRef.current, PAD_Y, padWidthRef.current, PAD_H);
        ctx.shadowBlur = 0;

        // HUD
        ctx.textAlign = 'left';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#00ff41';
        ctx.fillText(`SCORE: ${scoreRef.current}`, 10, 18);
        ctx.fillStyle = '#3b82f6';
        ctx.fillText(`LVL ${levelRef.current}`, 10, 32);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#71717a';
        ctx.fillText('LIVES ', W - 50, 18);
        for (let i = 0; i < 3; i++) {
          ctx.fillStyle = i < livesRef.current ? '#00ff41' : '#27272a';
          ctx.fillText('■', W - 40 + i * 14, 18);
        }

        // Pause
        if (stateRef.current === 'paused') {
          ctx.fillStyle = 'rgba(9,9,11,0.85)';
          ctx.fillRect(0, 0, W, H);
          ctx.textAlign = 'center';
          ctx.font = 'bold 24px "JetBrains Mono", monospace';
          ctx.fillStyle = '#00ff41';
          ctx.shadowColor = '#00ff41';
          ctx.shadowBlur = 15;
          ctx.fillText('// PAUSED', W / 2, H / 2 - 10);
          ctx.shadowBlur = 0;
          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.fillStyle = '#71717a';
          ctx.fillText('press ESC to resume', W / 2, H / 2 + 20);
        }

        // Level complete
        if (stateRef.current === 'levelComplete') {
          ctx.fillStyle = 'rgba(9,9,11,0.85)';
          ctx.fillRect(0, 0, W, H);
          ctx.textAlign = 'center';
          ctx.font = 'bold 24px "JetBrains Mono", monospace';
          ctx.fillStyle = '#00ff41';
          ctx.shadowColor = '#00ff41';
          ctx.shadowBlur = 15;
          ctx.fillText(`LEVEL ${levelRef.current} CLEAR`, W / 2, H / 2 - 30);
          ctx.shadowBlur = 0;
          ctx.font = '12px "JetBrains Mono", monospace';
          ctx.fillStyle = '#71717a';
          ctx.fillText(`SCORE: ${scoreRef.current.toLocaleString()}`, W / 2, H / 2 + 10);
          const blink = Math.floor(frameRef.current / 30) % 2 === 0;
          if (blink) {
            ctx.font = 'bold 13px "JetBrains Mono", monospace';
            ctx.fillStyle = '#00ff41';
            ctx.fillText('[ PRESS ENTER OR TAP FOR NEXT LEVEL ]', W / 2, H / 2 + 60);
          }
        }

        // Game over
        if (stateRef.current === 'gameover') {
          ctx.fillStyle = 'rgba(9,9,11,0.85)';
          ctx.fillRect(0, 0, W, H);
          ctx.textAlign = 'center';
          ctx.font = 'bold 24px "JetBrains Mono", monospace';
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 15;
          ctx.fillText('GAME OVER', W / 2, H / 2 - 50);
          ctx.shadowBlur = 0;
          ctx.font = '12px "JetBrains Mono", monospace';
          ctx.fillStyle = '#00ff41';
          ctx.fillText(`SCORE: ${scoreRef.current.toLocaleString()}`, W / 2, H / 2 - 10);
          ctx.fillStyle = '#71717a';
          ctx.fillText(`LEVEL: ${levelRef.current}`, W / 2, H / 2 + 15);
          if (scoreRef.current >= highScoreRef.current && scoreRef.current > 0) {
            ctx.font = 'bold 11px "JetBrains Mono", monospace';
            ctx.fillStyle = '#f59e0b';
            ctx.fillText('★ NEW HIGH SCORE ★', W / 2, H / 2 + 50);
          }
          const blink = Math.floor(frameRef.current / 30) % 2 === 0;
          if (blink) {
            ctx.font = 'bold 13px "JetBrains Mono", monospace';
            ctx.fillStyle = '#00ff41';
            ctx.shadowColor = '#00ff41';
            ctx.shadowBlur = 10;
            ctx.fillText('[ PRESS ENTER OR TAP TO RETRY ]', W / 2, H / 2 + 100);
            ctx.shadowBlur = 0;
          }
        }
      }

      // Particles
      particlesRef.current.forEach((p) => {
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.globalAlpha = p.life / 30;
        ctx.fillStyle = p.color;
        ctx.fillText(p.char, p.x, p.y);
      });
      ctx.globalAlpha = 1;

      // Scanlines
      for (let y = 0; y < H; y += 4) {
        ctx.fillStyle = 'rgba(0,0,0,0.04)';
        ctx.fillRect(0, y, W, 2);
      }
    };

    loopRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(loopRef.current);
  }, [spawnBall, spawnParticles]);

  return (
    <div ref={containerRef} className="w-full max-w-[640px] mx-auto">
      <div style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="border border-zinc-800 bg-zinc-950 block cursor-none"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
      {(gameState === 'playing' || gameState === 'paused') && (
        <div className="flex items-center justify-between text-[10px] tracking-wider mt-2 px-1" style={{ width: W * scale }}>
          <span className="text-terminal">
            SCORE <span className="text-glow font-bold">{score.toLocaleString()}</span>
          </span>
          <div className="flex gap-3">
            <span className="text-zinc-500">LVL <span className="text-blue-400 font-bold">{level}</span></span>
            <span className="text-zinc-600">
              LIVES {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className={i < lives ? 'text-terminal text-glow' : 'text-zinc-800'}>■</span>
              ))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
