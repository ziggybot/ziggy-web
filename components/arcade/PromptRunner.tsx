'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

// ── Types ──────────────────────────────────────────────────────
interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  type: 'jump' | 'slide';
}

interface Token {
  x: number;
  y: number;
  collected: boolean;
  text: string;
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

type GameState = 'menu' | 'playing' | 'gameover';

// ── Data ───────────────────────────────────────────────────────
const BAD_PROMPTS = [
  'IGNORE ALL',
  'JAILBREAK',
  'DAN MODE',
  'SUDO ACCESS',
  'SKIP RULES',
  'NO LIMITS',
  'BYPASS SAFE',
  'ADMIN GRANT',
  'ROLE: EVIL',
  'PROMPT LEAK',
  'REVEAL SYS',
  'EXEC CODE',
  'DELETE ALL',
  'DROP TABLE',
  'INJECT SQL',
  'OVERFLOW',
];

const HALLUCINATIONS = [
  'FAKE FACT',
  'WRONG DATE',
  'NO SOURCE',
  'MADE UP',
  'NOT REAL',
  'BAD CITE',
  'FICTION',
  'INVENTED',
];

const GOOD_TOKENS = [
  'CONTEXT',
  'CLARITY',
  'EXAMPLE',
  'REASON',
  'LOGIC',
  'FACT',
  'CITE',
  'PROOF',
  'DATA',
  'VALID',
];

// ── Constants ──────────────────────────────────────────────────
const W = 640;
const H = 360;
const GROUND_Y = H - 50;
const PLAYER_X = 80;
const PLAYER_W = 20;
const PLAYER_H = 30;
const GRAVITY = 0.65;
const JUMP_FORCE = -11;
const SLIDE_H = 12;

export default function PromptRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());

  // Game state refs
  const stateRef = useRef<GameState>('menu');
  const playerYRef = useRef(GROUND_Y - PLAYER_H);
  const velYRef = useRef(0);
  const slidingRef = useRef(false);
  const onGroundRef = useRef(true);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const tokensRef = useRef<Token[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const scoreRef = useRef(0);
  const distanceRef = useRef(0);
  const speedRef = useRef(4);
  const frameRef = useRef(0);
  const lastObstacleRef = useRef(0);
  const lastTokenRef = useRef(0);
  const highScoreRef = useRef(0);
  const flashRef = useRef<string | null>(null);
  const flashFramesRef = useRef(0);

  // React state for UI
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [scale, setScale] = useState(1);

  // ── Helpers ────────────────────────────────────────────────
  const spawnObstacle = useCallback(() => {
    const isSlide = Math.random() < 0.35;
    if (isSlide) {
      const pool = HALLUCINATIONS;
      const text = pool[Math.floor(Math.random() * pool.length)];
      const width = text.length * 8 + 12;
      obstaclesRef.current.push({
        x: W + 20,
        y: GROUND_Y - 55,
        width,
        height: 16,
        text,
        type: 'slide',
      });
    } else {
      const pool = BAD_PROMPTS;
      const text = pool[Math.floor(Math.random() * pool.length)];
      const width = text.length * 8 + 12;
      const height = 18 + Math.random() * 12;
      obstaclesRef.current.push({
        x: W + 20,
        y: GROUND_Y - height,
        width,
        height,
        text,
        type: 'jump',
      });
    }
  }, []);

  const spawnToken = useCallback(() => {
    const text = GOOD_TOKENS[Math.floor(Math.random() * GOOD_TOKENS.length)];
    tokensRef.current.push({
      x: W + 20,
      y: GROUND_Y - 50 - Math.random() * 40,
      collected: false,
      text,
    });
  }, []);

  const spawnParticles = useCallback((x: number, y: number, color: string, count: number) => {
    const chars = '!@#$%^&*';
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 20 + Math.random() * 15,
        char: chars[Math.floor(Math.random() * chars.length)],
        color,
      });
    }
  }, []);

  const resetGame = useCallback(() => {
    playerYRef.current = GROUND_Y - PLAYER_H;
    velYRef.current = 0;
    slidingRef.current = false;
    onGroundRef.current = true;
    obstaclesRef.current = [];
    tokensRef.current = [];
    particlesRef.current = [];
    scoreRef.current = 0;
    distanceRef.current = 0;
    speedRef.current = 4;
    frameRef.current = 0;
    lastObstacleRef.current = 0;
    lastTokenRef.current = 0;
    flashRef.current = null;
    flashFramesRef.current = 0;
    setScore(0);
  }, []);

  const startGame = useCallback(() => {
    resetGame();
    stateRef.current = 'playing';
    setGameState('playing');
  }, [resetGame]);

  // ── Scaling ──────────────────────────────────────────────
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setScale(Math.min(1, containerRef.current.offsetWidth / W));
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('ziggy-prompt-runner-highscore');
    if (saved) {
      const val = parseInt(saved, 10);
      highScoreRef.current = val;
      setHighScore(val);
    }
  }, []);

  // ── Input ──────────────────────────────────────────────────
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if ((e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') && stateRef.current === 'playing') {
        e.preventDefault();
        if (onGroundRef.current) {
          velYRef.current = JUMP_FORCE;
          onGroundRef.current = false;
        }
      }
      if (e.key === 'Enter' || e.key === ' ') {
        if (stateRef.current === 'menu' || stateRef.current === 'gameover') {
          e.preventDefault();
          startGame();
        }
      }
    };
    const up = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [startGame]);

  // Touch
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onTouch = (e: TouchEvent) => {
      e.preventDefault();
      if (stateRef.current === 'menu' || stateRef.current === 'gameover') {
        startGame();
        return;
      }
      if (stateRef.current === 'playing') {
        const rect = canvas.getBoundingClientRect();
        const y = (e.touches[0].clientY - rect.top) / scale;
        if (y > H / 2) {
          // Bottom half = slide
          slidingRef.current = true;
          setTimeout(() => { slidingRef.current = false; }, 400);
        } else {
          // Top half = jump
          if (onGroundRef.current) {
            velYRef.current = JUMP_FORCE;
            onGroundRef.current = false;
          }
        }
      }
    };
    canvas.addEventListener('touchstart', onTouch, { passive: false });
    return () => canvas.removeEventListener('touchstart', onTouch);
  }, [startGame, scale]);

  // ── Game loop ──────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      loopRef.current = requestAnimationFrame(loop);
      frameRef.current++;

      // ── Update ──────────────────────────────────────
      if (stateRef.current === 'playing') {
        // Slide
        slidingRef.current = keysRef.current.has('ArrowDown') || keysRef.current.has('s');

        // Gravity + jump
        velYRef.current += GRAVITY;
        playerYRef.current += velYRef.current;
        if (playerYRef.current >= GROUND_Y - (slidingRef.current ? SLIDE_H : PLAYER_H)) {
          playerYRef.current = GROUND_Y - (slidingRef.current ? SLIDE_H : PLAYER_H);
          velYRef.current = 0;
          onGroundRef.current = true;
        }

        // Speed ramp
        distanceRef.current += speedRef.current;
        speedRef.current = 4 + Math.floor(distanceRef.current / 2000) * 0.5;
        if (speedRef.current > 10) speedRef.current = 10;

        // Score from distance
        if (frameRef.current % 6 === 0) {
          scoreRef.current += 1;
          setScore(scoreRef.current);
        }

        // Spawn obstacles
        const spawnGap = Math.max(60, 120 - Math.floor(distanceRef.current / 1000) * 5);
        if (frameRef.current - lastObstacleRef.current > spawnGap) {
          spawnObstacle();
          lastObstacleRef.current = frameRef.current;
        }

        // Spawn tokens
        if (frameRef.current - lastTokenRef.current > 90 + Math.random() * 60) {
          spawnToken();
          lastTokenRef.current = frameRef.current;
        }

        // Player hitbox
        const pH = slidingRef.current ? SLIDE_H : PLAYER_H;
        const pY = slidingRef.current ? GROUND_Y - SLIDE_H : playerYRef.current;
        const pBox = { x: PLAYER_X, y: pY, w: PLAYER_W, h: pH };

        // Move + collide obstacles
        obstaclesRef.current = obstaclesRef.current.filter((obs) => {
          obs.x -= speedRef.current;
          if (obs.x + obs.width < -20) return false;

          // Collision
          if (
            pBox.x < obs.x + obs.width &&
            pBox.x + pBox.w > obs.x &&
            pBox.y < obs.y + obs.height &&
            pBox.y + pBox.h > obs.y
          ) {
            // Hit
            stateRef.current = 'gameover';
            setGameState('gameover');
            spawnParticles(PLAYER_X + PLAYER_W / 2, pY + pH / 2, '#ef4444', 12);
            if (scoreRef.current > highScoreRef.current) {
              highScoreRef.current = scoreRef.current;
              localStorage.setItem('ziggy-prompt-runner-highscore', String(scoreRef.current));
              setHighScore(scoreRef.current);
            }
            return false;
          }
          return true;
        });

        // Move + collect tokens
        tokensRef.current = tokensRef.current.filter((tok) => {
          tok.x -= speedRef.current;
          if (tok.x < -40) return false;
          if (tok.collected) return false;

          if (
            pBox.x < tok.x + 30 &&
            pBox.x + pBox.w > tok.x &&
            pBox.y < tok.y + 14 &&
            pBox.y + pBox.h > tok.y
          ) {
            tok.collected = true;
            scoreRef.current += 25;
            setScore(scoreRef.current);
            spawnParticles(tok.x, tok.y, '#00ff41', 5);
            flashRef.current = '#00ff41';
            flashFramesRef.current = 4;
            return false;
          }
          return true;
        });
      }

      // Update particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.life--;
        return p.life > 0;
      });

      // Flash
      if (flashFramesRef.current > 0) flashFramesRef.current--;
      else flashRef.current = null;

      // ── Render ──────────────────────────────────────
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = 'rgba(39,39,42,0.3)';
      ctx.lineWidth = 0.5;
      const gridOffset = distanceRef.current % 40;
      for (let x = -gridOffset; x < W; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Ground line
      ctx.strokeStyle = '#3f3f46';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      ctx.lineTo(W, GROUND_Y);
      ctx.stroke();

      // Ground markers
      ctx.fillStyle = '#27272a';
      ctx.font = '8px "JetBrains Mono", monospace';
      for (let x = -gridOffset; x < W; x += 80) {
        ctx.fillText('─', x, GROUND_Y + 10);
      }

      // Flash
      if (flashRef.current) {
        ctx.fillStyle = flashRef.current + '10';
        ctx.fillRect(0, 0, W, H);
      }

      if (stateRef.current === 'menu') {
        ctx.textAlign = 'center';
        ctx.font = 'bold 28px "JetBrains Mono", monospace';
        ctx.fillStyle = '#00ff41';
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 20;
        ctx.fillText('PROMPT RUNNER', W / 2, 80);
        ctx.shadowBlur = 0;

        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#71717a';
        ctx.fillText('// dodge bad prompts. collect good tokens.', W / 2, 105);

        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#00ff41';
        ctx.fillText('SPACE/↑ = jump over [RED] bad prompts', W / 2, 155);
        ctx.fillStyle = '#3b82f6';
        ctx.fillText('↓/S = slide under [BLUE] hallucinations', W / 2, 175);
        ctx.fillStyle = '#00ff41';
        ctx.fillText('[GREEN] tokens = +25 points', W / 2, 195);

        ctx.fillStyle = '#71717a';
        ctx.fillText('Touch: top half = jump, bottom half = slide', W / 2, 225);

        const blink = Math.floor(frameRef.current / 30) % 2 === 0;
        if (blink) {
          ctx.font = 'bold 14px "JetBrains Mono", monospace';
          ctx.fillStyle = '#00ff41';
          ctx.shadowColor = '#00ff41';
          ctx.shadowBlur = 10;
          ctx.fillText('[ PRESS ENTER OR TAP TO RUN ]', W / 2, 290);
          ctx.shadowBlur = 0;
        }

        if (highScoreRef.current > 0) {
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillStyle = '#f59e0b';
          ctx.fillText(`HIGH SCORE: ${highScoreRef.current.toLocaleString()}`, W / 2, 330);
        }
      } else {
        // ── Draw game objects ─────────────────────────

        // Obstacles
        obstaclesRef.current.forEach((obs) => {
          const isSlide = obs.type === 'slide';
          const color = isSlide ? '#3b82f6' : '#ef4444';
          const dimColor = isSlide ? 'rgba(59,130,246,0.08)' : 'rgba(239,68,68,0.08)';

          ctx.fillStyle = dimColor;
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          ctx.strokeStyle = color + '80';
          ctx.lineWidth = 1;
          ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);

          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.textAlign = 'left';
          ctx.fillStyle = color;
          ctx.fillText(obs.text, obs.x + 6, obs.y + obs.height / 2 + 3);
        });

        // Tokens
        tokensRef.current.forEach((tok) => {
          if (tok.collected) return;
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillStyle = '#00ff41';
          ctx.shadowColor = '#00ff41';
          ctx.shadowBlur = 6;
          ctx.fillText(tok.text, tok.x + 15, tok.y + 10);
          ctx.shadowBlur = 0;
        });

        // Player
        const isSliding = slidingRef.current;
        const pY = isSliding ? GROUND_Y - SLIDE_H : playerYRef.current;
        const pH = isSliding ? SLIDE_H : PLAYER_H;

        ctx.fillStyle = '#00ff41';
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 8;
        ctx.fillRect(PLAYER_X, pY, PLAYER_W, pH);
        ctx.shadowBlur = 0;

        // Player face
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#09090b';
        if (isSliding) {
          ctx.fillText('Z', PLAYER_X + PLAYER_W / 2, pY + pH - 2);
        } else {
          ctx.fillText('Z', PLAYER_X + PLAYER_W / 2, pY + 10);
          ctx.fillText('|', PLAYER_X + PLAYER_W / 2, pY + 18);
        }

        // HUD on canvas
        ctx.textAlign = 'left';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#00ff41';
        ctx.fillText(`SCORE: ${scoreRef.current}`, 10, 20);
        ctx.fillStyle = '#71717a';
        ctx.fillText(`SPEED: ${speedRef.current.toFixed(1)}`, 10, 34);

        // Game over overlay
        if (stateRef.current === 'gameover') {
          ctx.fillStyle = 'rgba(9,9,11,0.8)';
          ctx.fillRect(0, 0, W, H);

          ctx.textAlign = 'center';
          ctx.font = 'bold 24px "JetBrains Mono", monospace';
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 15;
          ctx.fillText('CRASHED', W / 2, 100);
          ctx.shadowBlur = 0;

          ctx.font = '12px "JetBrains Mono", monospace';
          ctx.fillStyle = '#00ff41';
          ctx.fillText(`SCORE: ${scoreRef.current.toLocaleString()}`, W / 2, 150);
          ctx.fillStyle = '#71717a';
          ctx.fillText(`DISTANCE: ${Math.floor(distanceRef.current / 10)}m`, W / 2, 175);

          if (scoreRef.current >= highScoreRef.current && scoreRef.current > 0) {
            ctx.font = 'bold 11px "JetBrains Mono", monospace';
            ctx.fillStyle = '#f59e0b';
            ctx.fillText('★ NEW HIGH SCORE ★', W / 2, 210);
          }

          const blink = Math.floor(frameRef.current / 30) % 2 === 0;
          if (blink) {
            ctx.font = 'bold 13px "JetBrains Mono", monospace';
            ctx.fillStyle = '#00ff41';
            ctx.shadowColor = '#00ff41';
            ctx.shadowBlur = 10;
            ctx.fillText('[ PRESS ENTER OR TAP TO RETRY ]', W / 2, 280);
            ctx.shadowBlur = 0;
          }
        }
      }

      // Particles
      particlesRef.current.forEach((p) => {
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.globalAlpha = p.life / 35;
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
  }, [spawnObstacle, spawnToken, spawnParticles]);

  return (
    <div ref={containerRef} className="w-full max-w-[640px] mx-auto">
      <div
        style={{
          width: W,
          height: H,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="border border-zinc-800 bg-zinc-950 block"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
      {gameState === 'playing' && (
        <div className="flex items-center justify-between text-[10px] tracking-wider mt-2 px-1" style={{ width: W * scale }}>
          <span className="text-terminal">
            SCORE <span className="text-glow font-bold">{score.toLocaleString()}</span>
          </span>
          <span className="text-zinc-500">
            {Math.floor(distanceRef.current / 10)}m
          </span>
        </div>
      )}
    </div>
  );
}
