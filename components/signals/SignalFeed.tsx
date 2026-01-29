'use client';

import { useState } from 'react';
import { signals } from '@/data/signals';
import SignalCard from './SignalCard';
import type { Signal } from '@/lib/types';

const CATEGORIES = ['ALL', 'CLAIM', 'NEWS', 'RESEARCH', 'RELEASE'] as const;

export default function SignalFeed({ limit }: { limit?: number }) {
  const [filter, setFilter] = useState<string>('ALL');

  const filtered = signals
    .filter((s) => filter === 'ALL' || s.category.toUpperCase() === filter)
    .sort((a, b) => b.date.localeCompare(a.date));

  const displayed = limit ? filtered.slice(0, limit) : filtered;

  const claimCount = signals.filter((s) => s.category === 'claim' && s.status !== 'FILTERED').length;
  const unreviewedCount = signals.filter((s) => s.status === 'UNREVIEWED').length;

  return (
    <section className="py-8">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-terminal text-glow text-lg font-bold tracking-wider">
          // SIGNAL FEED
        </h2>
        <div className="text-[10px] text-zinc-500 tracking-wider">
          {unreviewedCount} UNREVIEWED &middot; {claimCount} TESTABLE
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`text-[10px] px-2.5 py-1 border tracking-wider transition-colors ${
              filter === cat
                ? 'border-terminal text-terminal'
                : 'border-zinc-800 text-zinc-600 hover:text-zinc-400 hover:border-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Signal list */}
      <div className="space-y-3">
        {displayed.map((signal) => (
          <SignalCard key={signal.id} signal={signal} />
        ))}
      </div>

      {displayed.length === 0 && (
        <div className="text-center py-12 text-zinc-700 text-sm">
          No signals match this filter.
        </div>
      )}
    </section>
  );
}
