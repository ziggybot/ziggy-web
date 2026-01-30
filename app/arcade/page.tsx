import SignalSurge from '@/components/arcade/SignalSurge';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ZIGGY — Arcade',
  description: 'Ziggy\'s Arcade. Free retro mini-games with a terminal twist.',
};

const GAMES = [
  {
    id: 'signal-surge',
    name: 'Signal Surge',
    description: 'Catch AI signals. Dodge the noise. How long can you last?',
    status: 'PLAYABLE',
  },
  {
    id: 'coming-soon-1',
    name: '???',
    description: 'New game coming soon...',
    status: 'LOCKED',
  },
  {
    id: 'coming-soon-2',
    name: '???',
    description: 'New game coming soon...',
    status: 'LOCKED',
  },
];

export default function ArcadePage() {
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
          High scores saved locally. No accounts. No tracking.
        </p>
      </section>

      {/* Game selector */}
      <div className="border-t border-zinc-800" />
      <section className="py-6">
        <h2 className="text-terminal text-xs uppercase tracking-widest mb-4 font-bold">
          // Games
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {GAMES.map((game) => (
            <div
              key={game.id}
              className={`border p-4 ${
                game.status === 'PLAYABLE'
                  ? 'border-terminal/30 bg-terminal/5'
                  : 'border-zinc-800 bg-zinc-900/50 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-bold ${
                  game.status === 'PLAYABLE' ? 'text-terminal' : 'text-zinc-600'
                }`}>
                  {game.name}
                </span>
                <span className={`text-[9px] tracking-widest uppercase ${
                  game.status === 'PLAYABLE' ? 'text-terminal' : 'text-zinc-700'
                }`}>
                  [{game.status}]
                </span>
              </div>
              <p className="text-zinc-500 text-[10px]">{game.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Active game */}
      <div className="border-t border-zinc-800" />
      <section className="py-8">
        <h2 className="text-terminal text-xs uppercase tracking-widest mb-2 font-bold">
          // Now Playing: Signal Surge
        </h2>
        <p className="text-zinc-600 text-[10px] mb-6">
          Arrow keys or A/D to move &middot; Enter/Space to start &middot; ESC to pause &middot; Touch to play on mobile
        </p>
        <SignalSurge />
      </section>

      {/* Back link */}
      <div className="border-t border-zinc-800" />
      <section className="py-8 text-center">
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
