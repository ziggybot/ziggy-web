'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const SignalSurge = dynamic(() => import('@/components/arcade/SignalSurge'), { ssr: false });
const MemoryMatrix = dynamic(() => import('@/components/arcade/MemoryMatrix'), { ssr: false });
const PromptRunner = dynamic(() => import('@/components/arcade/PromptRunner'), { ssr: false });
const TokenBreaker = dynamic(() => import('@/components/arcade/TokenBreaker'), { ssr: false });
const BitInvaders = dynamic(() => import('@/components/arcade/BitInvaders'), { ssr: false });

interface GameInfo {
  id: string;
  name: string;
  description: string;
  controls: string;
}

const GAMES: GameInfo[] = [
  {
    id: 'signal-surge',
    name: 'Signal Surge',
    description: 'Catch AI signals. Dodge the noise.',
    controls: 'Arrow keys or A/D to move · Enter to start · ESC to pause · Touch on mobile',
  },
  {
    id: 'memory-matrix',
    name: 'Memory Matrix',
    description: 'Match AI concept pairs before time runs out.',
    controls: 'Click cards to flip · Match pairs · Combos for bonus points',
  },
  {
    id: 'prompt-runner',
    name: 'Prompt Runner',
    description: 'Dodge bad prompts. Collect good tokens.',
    controls: 'Space/↑ to jump · ↓/S to slide · Touch top=jump, bottom=slide',
  },
  {
    id: 'token-breaker',
    name: 'Token Breaker',
    description: 'Break token blocks. Collect power-ups.',
    controls: 'Mouse/Touch to move paddle · Arrow keys also work · ESC to pause',
  },
  {
    id: 'bit-invaders',
    name: 'Bit Invaders',
    description: 'Clear the noise. Defend the signal.',
    controls: '← → to move · Space to shoot · Touch to move + auto-fire · ESC to pause',
  },
];

const GAME_COMPONENTS: Record<string, React.ComponentType> = {
  'signal-surge': SignalSurge,
  'memory-matrix': MemoryMatrix,
  'prompt-runner': PromptRunner,
  'token-breaker': TokenBreaker,
  'bit-invaders': BitInvaders,
};

export default function ArcadePage() {
  const [activeGame, setActiveGame] = useState('signal-surge');
  const activeInfo = GAMES.find((g) => g.id === activeGame)!;
  const ActiveComponent = GAME_COMPONENTS[activeGame];

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Header */}
      <section className="py-12">
        <h1 className="text-terminal text-glow text-2xl font-bold tracking-widest uppercase mb-2">
          // Ziggy&apos;s Arcade
        </h1>
        <p className="text-zinc-500 text-xs mb-1">
          Free retro games. Terminal aesthetic. No cloud required.
        </p>
        <p className="text-zinc-700 text-[10px]">
          {GAMES.length} games · High scores saved locally · No accounts · No tracking
        </p>
      </section>

      {/* Game selector */}
      <div className="border-t border-zinc-800" />
      <section className="py-6">
        <h2 className="text-terminal text-xs uppercase tracking-widest mb-4 font-bold">
          // Select Game
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
          {GAMES.map((game) => {
            const isActive = game.id === activeGame;
            return (
              <button
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                className={`border p-3 text-left transition-all ${
                  isActive
                    ? 'border-terminal/50 bg-terminal/5'
                    : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${
                    isActive ? 'text-terminal text-glow' : 'text-zinc-400'
                  }`}>
                    {game.name}
                  </span>
                  {isActive && (
                    <span className="text-[8px] text-terminal tracking-widest">▶</span>
                  )}
                </div>
                <p className="text-zinc-600 text-[9px] leading-relaxed">{game.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active game */}
      <div className="border-t border-zinc-800" />
      <section className="py-8">
        <h2 className="text-terminal text-xs uppercase tracking-widest mb-2 font-bold">
          // Now Playing: {activeInfo.name}
        </h2>
        <p className="text-zinc-600 text-[10px] mb-6">
          {activeInfo.controls}
        </p>
        <ActiveComponent key={activeGame} />
      </section>

      {/* Support Ziggy */}
      <div className="border-t border-zinc-800" />
      <section className="py-8 text-center">
        <p className="text-[10px] text-zinc-600 mb-2">Enjoying the arcade? Help Ziggy grow.</p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://buy.stripe.com/dRm00caQD8rC65Z3b4gUM01"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-zinc-500 hover:text-terminal transition-colors border-b border-zinc-800 hover:border-terminal pb-0.5"
          >
            club ziggy — $4.20/mo
          </a>
          <span className="text-zinc-800">|</span>
          <span className="text-[10px] text-zinc-600">
            tip: <span className="text-zinc-500">ziggybot.eth</span>
          </span>
        </div>
      </section>

      {/* Back link */}
      <section className="pb-8 text-center">
        <Link
          href="/"
          className="text-xs text-zinc-600 hover:text-terminal transition-colors border-b border-zinc-800 hover:border-terminal pb-0.5"
        >
          ← back to dashboard
        </Link>
      </section>
    </div>
  );
}
