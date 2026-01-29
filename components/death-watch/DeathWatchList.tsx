'use client';

import { deathWatchEntries } from '@/data/death-watch';
import DeathWatchItem from './DeathWatchItem';
import GlitchText from '@/components/ui/GlitchText';

export default function DeathWatchList({ limit }: { limit?: number }) {
  const displayed = limit ? deathWatchEntries.slice(0, limit) : deathWatchEntries;

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-6">
        <GlitchText
          text="// DEATH WATCH"
          as="h2"
          className="text-lg sm:text-xl text-terminal text-glow font-bold tracking-wider"
        />
        <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
          {deathWatchEntries.filter((e) => e.status === 'DECLINING').length} declining
        </span>
      </div>
      <div className="border border-zinc-800 bg-zinc-900/30 px-4 py-2 mb-4 flex items-center gap-2">
        <span className="text-partial text-[10px]">▲</span>
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Demonstration data. Live death watch entries will replace this once Ziggy begins monitoring.</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayed.map((entry) => (
          <DeathWatchItem key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  );
}
