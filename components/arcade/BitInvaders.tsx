'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

// ── Types ──────────────────────────────────────────────────────
interface Invader {
  x: number;
  y: number;
  text: string;
  alive: boolean;
  row: number;
  col: number;
}

interface Bullet {
  x: number;
  y: number;
  vy: number;
  isEnemy: boolean;
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

type GameState = 'menu' | 'playing' | 'paused' | 'waveComplete' | 'gameover';

// ── Noise data ─────────────────────────────────────────────────
const NOISE_WORDS = [
  'SPAM', 'FAKE', 'HYPE', 'SCAM', 'FUD_', 'BAIT', 'BUZZ', 'PUMP',
  'SHILL', 'RAGE', 'COPE', 'GRIFT', 'FOMO', 'LIES', 'JUNK', 'NULL',
  'ERR_', 'BUG_', 'LEAK', 'VOID', 'DEAD', 'FAIL', 'LOSS', 'DENY',
];

// ── Constants ──────────────────────────────────────────────────
const W = 640;
const H = 480;
const PLAYER_Y = H - 40;
const PLAYER_W = 30;
const PLAYER_H = 14;
const INVADER_W = 40;
const INVADER_H = 18;
const INVADER_GAP_X = 8;
const INVADER_GAP_Y = 6;
const BULLET_SPEED = 6;
const ENEMY_BULLET_SPEED = 3;

export default function BitInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());

  const stateRef = useRef<GameState>('menu');
  const playerXRef = useRef(W / 2 - PLAYER_W / 2);
  const invadersRef = useRef<Invader[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const invDirRef = useRef(1);
  const invSpeedRef = useRef(0.5);
  const invDropRef = useRef(false);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const waveRef = useRef(1);
  const frameRef = useRef(0);
  const lastShotRef = useRef(0);
  const lastEnemyShotRef = useRef(0);
  const highScoreRef = useRef(0);
  const shakeRef = useRef(0);

  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [scale, setScale] = useState(1);

  // ── Helpers ────────────────────────────────────────────────
  const buildWave = useCallback((waveNum: number) => {
    const rows = Math.min(3 + Math.floor((waveNum - 1) / 2), 6);
    const cols = Math.min(8 + Math.floor((waveNum - 1) / 3), 12);
    const invaders: Invader[] = [];
    const words = [...NOISE_WORDS].sort(() => Math.random() - 0.5);
    let wi = 0;
    const totalW = cols * (INVADER_W + INVADER_GAP_X) - INVADER_GAP_X;
    const startX = (W - totalW) / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        invaders.push({
          x: startX + c * (INVADER_W + INVADER_GAP_X),
          y: 50 + r * (INVADER_H + INVADER_GAP_Y),
          text: words[wi % words.length],
          alive: true,
          row: r,
          col: c,
        });
        wi++;
      }
    }
    invadersRef.current = invaders;
    invDirRef.current = 1;
    invSpeedRef.current = 0.5 + (waveNum - 1) * 0.2;
    invDropRef.current = false;
  }, []);

  const spawnParticles = useCallback((x: number, y: number, color: string, count: number) => {
    const chars = '!@#$%*█▓';
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 1 + Math.random() * 3;
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
    playerXRef.current = W / 2 - PLAYER_W / 2;
    bulletsRef.current = [];
    particlesRef.current = [];
    scoreRef.current = 0;
    livesRef.current = 3;
    waveRef.current = 1;
    frameRef.current = 0;
    lastShotRef.current = 0;
    lastEnemyShotRef.current = 0;
    shakeRef.current = 0;
    setScore(0);
    setLives(3);
    setWave(1);
  }, []);

  const startGame = useCallback(() => {
    resetGame();
    buildWave(1);
    stateRef.current = 'playing';
    setGameState('playing');
  }, [resetGame, buildWave]);

  const nextWave = useCallback(() => {
    waveRef.current++;
    setWave(waveRef.current);
    bulletsRef.current = [];
    buildWave(waveRef.current);
    stateRef.current = 'playing';
    setGameState('playing');
  }, [buildWave]);

  // Scaling
  useEffect(() => {
    const update = () => {
      if (containerRef.current) setScale(Math.min(1, containerRef.current.offsetWidth / W));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // High score
  useEffect(() => {
    const saved = localStorage.getItem('ziggy-bit-invaders-highscore');
    if (saved) { const v = parseInt(saved, 10); highScoreRef.current = v; setHighScore(v); }
  }, []);

  // ── Input ──────────────────────────────────────────────────
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (stateRef.current === 'playing') {
          if (frameRef.current - lastShotRef.current > 12) {
            bulletsRef.current.push({
              x: playerXRef.current + PLAYER_W / 2,
              y: PLAYER_Y - 4,
              vy: -BULLET_SPEED,
              isEnemy: false,
            });
            lastShotRef.current = frameRef.current;
          }
        }
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (stateRef.current === 'menu' || stateRef.current === 'gameover') startGame();
        if (stateRef.current === 'waveComplete') nextWave();
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
  }, [startGame, nextWave]);

  // Touch
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const touch = (e: TouchEvent) => {
      e.preventDefault();
      if (stateRef.current === 'menu' || stateRef.current === 'gameover') { startGame(); return; }
      if (stateRef.current === 'waveComplete') { nextWave(); return; }
      if (stateRef.current === 'playing') {
        const rect = canvas.getBoundingClientRect();
        const x = (e.touches[0].clientX - rect.left) / scale;
        playerXRef.current = Math.max(0, Math.min(W - PLAYER_W, x - PLAYER_W / 2));
        // Auto-shoot on touch
        if (frameRef.current - lastShotRef.current > 12) {
          bulletsRef.current.push({
            x: playerXRef.current + PLAYER_W / 2,
            y: PLAYER_Y - 4,
            vy: -BULLET_SPEED,
            isEnemy: false,
          });
          lastShotRef.current = frameRef.current;
        }
      }
    };
    const move = (e: TouchEvent) => {
      e.preventDefault();
      if (stateRef.current !== 'playing') return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.touches[0].clientX - rect.left) / scale;
      playerXRef.current = Math.max(0, Math.min(W - PLAYER_W, x - PLAYER_W / 2));
    };
    canvas.addEventListener('touchstart', touch, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    return () => { canvas.removeEventListener('touchstart', touch); canvas.removeEventListener('touchmove', move); };
  }, [startGame, nextWave, scale]);

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
        // Player movement
        const speed = 5;
        if (keysRef.current.has('ArrowLeft') || keysRef.current.has('a'))
          playerXRef.current = Math.max(0, playerXRef.current - speed);
        if (keysRef.current.has('ArrowRight') || keysRef.current.has('d'))
          playerXRef.current = Math.min(W - PLAYER_W, playerXRef.current + speed);

        // Move invaders
        const alive = invadersRef.current.filter((inv) => inv.alive);
        if (alive.length > 0) {
          let hitEdge = false;
          alive.forEach((inv) => {
            inv.x += invSpeedRef.current * invDirRef.current;
            if (inv.x <= 5 || inv.x + INVADER_W >= W - 5) hitEdge = true;
          });

          if (hitEdge) {
            invDirRef.current *= -1;
            alive.forEach((inv) => { inv.y += 12; });
            // Speed up as fewer remain
            invSpeedRef.current += 0.05;
          }

          // Check if invaders reached player
          if (alive.some((inv) => inv.y + INVADER_H >= PLAYER_Y - 10)) {
            stateRef.current = 'gameover';
            setGameState('gameover');
            if (scoreRef.current > highScoreRef.current) {
              highScoreRef.current = scoreRef.current;
              localStorage.setItem('ziggy-bit-invaders-highscore', String(scoreRef.current));
              setHighScore(scoreRef.current);
            }
          }

          // Enemy shooting
          const shootInterval = Math.max(30, 90 - waveRef.current * 5);
          if (frameRef.current - lastEnemyShotRef.current > shootInterval) {
            // Pick a random alive invader from bottom row
            const cols: Record<number, Invader> = {};
            alive.forEach((inv) => {
              if (!cols[inv.col] || inv.row > cols[inv.col].row) cols[inv.col] = inv;
            });
            const shooters = Object.values(cols);
            if (shooters.length > 0) {
              const shooter = shooters[Math.floor(Math.random() * shooters.length)];
              bulletsRef.current.push({
                x: shooter.x + INVADER_W / 2,
                y: shooter.y + INVADER_H,
                vy: ENEMY_BULLET_SPEED + (waveRef.current - 1) * 0.3,
                isEnemy: true,
              });
              lastEnemyShotRef.current = frameRef.current;
            }
          }
        }

        // Update bullets
        bulletsRef.current = bulletsRef.current.filter((bullet) => {
          bullet.y += bullet.vy;
          if (bullet.y < -10 || bullet.y > H + 10) return false;

          if (!bullet.isEnemy) {
            // Player bullet vs invaders
            for (const inv of invadersRef.current) {
              if (!inv.alive) continue;
              if (
                bullet.x > inv.x &&
                bullet.x < inv.x + INVADER_W &&
                bullet.y > inv.y &&
                bullet.y < inv.y + INVADER_H
              ) {
                inv.alive = false;
                const rowPoints = (5 - inv.row) * 10 + 10;
                scoreRef.current += rowPoints;
                setScore(scoreRef.current);
                spawnParticles(inv.x + INVADER_W / 2, inv.y + INVADER_H / 2, '#ef4444', 6);
                return false;
              }
            }
          } else {
            // Enemy bullet vs player
            if (
              bullet.x > playerXRef.current &&
              bullet.x < playerXRef.current + PLAYER_W &&
              bullet.y > PLAYER_Y &&
              bullet.y < PLAYER_Y + PLAYER_H
            ) {
              livesRef.current--;
              setLives(livesRef.current);
              shakeRef.current = 8;
              spawnParticles(playerXRef.current + PLAYER_W / 2, PLAYER_Y, '#ef4444', 8);

              if (livesRef.current <= 0) {
                stateRef.current = 'gameover';
                setGameState('gameover');
                if (scoreRef.current > highScoreRef.current) {
                  highScoreRef.current = scoreRef.current;
                  localStorage.setItem('ziggy-bit-invaders-highscore', String(scoreRef.current));
                  setHighScore(scoreRef.current);
                }
              }
              return false;
            }
          }
          return true;
        });

        // Check wave clear
        if (invadersRef.current.every((inv) => !inv.alive)) {
          stateRef.current = 'waveComplete';
          setGameState('waveComplete');
        }
      }

      // Update particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.life--;
        return p.life > 0;
      });

      if (shakeRef.current > 0) shakeRef.current--;

      // ── Render ──────────────────────────────────────
      ctx.save();
      if (shakeRef.current > 0) {
        ctx.translate((Math.random() - 0.5) * shakeRef.current * 2, (Math.random() - 0.5) * shakeRef.current * 2);
      }

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
        ctx.fillText('BIT INVADERS', W / 2, 100);
        ctx.shadowBlur = 0;

        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#71717a';
        ctx.fillText('// clear the noise. defend the signal.', W / 2, 130);

        // Draw sample invaders
        ctx.font = '9px "JetBrains Mono", monospace';
        const sampleWords = ['SPAM', 'FAKE', 'HYPE', 'SCAM', 'FUD_'];
        sampleWords.forEach((word, i) => {
          const sx = W / 2 - 120 + i * 56;
          ctx.fillStyle = 'rgba(239,68,68,0.1)';
          ctx.fillRect(sx, 170, 44, 18);
          ctx.strokeStyle = '#ef444480';
          ctx.strokeRect(sx, 170, 44, 18);
          ctx.fillStyle = '#ef4444';
          ctx.textAlign = 'center';
          ctx.fillText(word, sx + 22, 183);
        });

        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#00ff41';
        ctx.fillText('← → or A/D to move', W / 2, 230);
        ctx.fillText('SPACE to shoot', W / 2, 250);
        ctx.fillStyle = '#71717a';
        ctx.fillText('Touch to move + auto-fire', W / 2, 280);
        ctx.fillText('ESC to pause', W / 2, 298);

        const blink = Math.floor(frameRef.current / 30) % 2 === 0;
        if (blink) {
          ctx.font = 'bold 14px "JetBrains Mono", monospace';
          ctx.fillStyle = '#00ff41';
          ctx.shadowColor = '#00ff41';
          ctx.shadowBlur = 10;
          ctx.fillText('[ PRESS ENTER OR TAP TO START ]', W / 2, 380);
          ctx.shadowBlur = 0;
        }

        if (highScoreRef.current > 0) {
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillStyle = '#f59e0b';
          ctx.fillText(`HIGH SCORE: ${highScoreRef.current.toLocaleString()}`, W / 2, 430);
        }
      } else {
        // Invaders
        invadersRef.current.forEach((inv) => {
          if (!inv.alive) return;
          const rowAlpha = ['ff', 'dd', 'bb', 'aa', '88', '77'][inv.row % 6];
          ctx.fillStyle = `rgba(239,68,68,0.08)`;
          ctx.fillRect(inv.x, inv.y, INVADER_W, INVADER_H);
          ctx.strokeStyle = `#ef4444${rowAlpha}`;
          ctx.lineWidth = 1;
          ctx.strokeRect(inv.x, inv.y, INVADER_W, INVADER_H);

          ctx.font = '8px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillStyle = `#ef4444${rowAlpha}`;
          ctx.fillText(inv.text, inv.x + INVADER_W / 2, inv.y + INVADER_H / 2 + 3);
        });

        // Bullets
        bulletsRef.current.forEach((b) => {
          if (b.isEnemy) {
            ctx.fillStyle = '#ef4444';
            ctx.shadowColor = '#ef4444';
          } else {
            ctx.fillStyle = '#00ff41';
            ctx.shadowColor = '#00ff41';
          }
          ctx.shadowBlur = 6;
          ctx.fillRect(b.x - 1, b.y, 2, 8);
          ctx.shadowBlur = 0;
        });

        // Player
        ctx.fillStyle = '#00ff41';
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 8;
        ctx.fillRect(playerXRef.current, PLAYER_Y, PLAYER_W, PLAYER_H);
        ctx.shadowBlur = 0;

        // Player dish
        const cx = playerXRef.current + PLAYER_W / 2;
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, PLAYER_Y);
        ctx.lineTo(cx, PLAYER_Y - 6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - 8, PLAYER_Y - 3);
        ctx.quadraticCurveTo(cx, PLAYER_Y - 10, cx + 8, PLAYER_Y - 3);
        ctx.stroke();

        // HUD
        ctx.textAlign = 'left';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#00ff41';
        ctx.fillText(`SCORE: ${scoreRef.current}`, 10, 20);
        ctx.fillStyle = '#3b82f6';
        ctx.fillText(`WAVE ${waveRef.current}`, 10, 34);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#71717a';
        ctx.fillText('LIVES ', W - 50, 20);
        for (let i = 0; i < 3; i++) {
          ctx.fillStyle = i < livesRef.current ? '#00ff41' : '#27272a';
          ctx.fillText('■', W - 40 + i * 14, 20);
        }

        // Overlays
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

        if (stateRef.current === 'waveComplete') {
          ctx.fillStyle = 'rgba(9,9,11,0.85)';
          ctx.fillRect(0, 0, W, H);
          ctx.textAlign = 'center';
          ctx.font = 'bold 24px "JetBrains Mono", monospace';
          ctx.fillStyle = '#00ff41';
          ctx.shadowColor = '#00ff41';
          ctx.shadowBlur = 15;
          ctx.fillText(`WAVE ${waveRef.current} CLEARED`, W / 2, H / 2 - 30);
          ctx.shadowBlur = 0;
          ctx.font = '12px "JetBrains Mono", monospace';
          ctx.fillStyle = '#71717a';
          ctx.fillText(`SCORE: ${scoreRef.current.toLocaleString()}`, W / 2, H / 2 + 10);
          const blink = Math.floor(frameRef.current / 30) % 2 === 0;
          if (blink) {
            ctx.font = 'bold 13px "JetBrains Mono", monospace';
            ctx.fillStyle = '#00ff41';
            ctx.fillText('[ PRESS ENTER OR TAP FOR NEXT WAVE ]', W / 2, H / 2 + 60);
          }
        }

        if (stateRef.current === 'gameover') {
          ctx.fillStyle = 'rgba(9,9,11,0.85)';
          ctx.fillRect(0, 0, W, H);
          ctx.textAlign = 'center';
          ctx.font = 'bold 24px "JetBrains Mono", monospace';
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 15;
          ctx.fillText('SIGNAL LOST', W / 2, H / 2 - 50);
          ctx.shadowBlur = 0;
          ctx.font = '12px "JetBrains Mono", monospace';
          ctx.fillStyle = '#00ff41';
          ctx.fillText(`SCORE: ${scoreRef.current.toLocaleString()}`, W / 2, H / 2 - 10);
          ctx.fillStyle = '#71717a';
          ctx.fillText(`WAVES: ${waveRef.current}`, W / 2, H / 2 + 15);
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

      ctx.restore();
    };

    loopRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(loopRef.current);
  }, [spawnParticles]);

  return (
    <div ref={containerRef} className="w-full max-w-[640px] mx-auto">
      <div style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="border border-zinc-800 bg-zinc-950 block"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
      {(gameState === 'playing' || gameState === 'paused') && (
        <div className="flex items-center justify-between text-[10px] tracking-wider mt-2 px-1" style={{ width: W * scale }}>
          <span className="text-terminal">
            SCORE <span className="text-glow font-bold">{score.toLocaleString()}</span>
          </span>
          <div className="flex gap-3">
            <span className="text-zinc-500">WAVE <span className="text-blue-400 font-bold">{wave}</span></span>
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
