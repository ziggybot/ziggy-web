'use client';

import { useState } from 'react';
import { experiments } from '@/data/experiments';
import ExperimentCard from './ExperimentCard';
import GlitchText from '@/components/ui/GlitchText';

type VerdictFilter = 'ALL' | 'SUPPORTED' | 'REFUTED' | 'PARTIALLY_SUPPORTED' | 'INCONCLUSIVE';

const FILTERS: { label: string; value: VerdictFilter }[] = [
  { label: 'ALL', value: 'ALL' },
  { label: 'SUPPORTED', value: 'SUPPORTED' },
  { label: 'REFUTED', value: 'REFUTED' },
  { label: 'PARTIAL', value: 'PARTIALLY_SUPPORTED' },
  { label: 'INCONCLUSIVE', value: 'INCONCLUSIVE' },
];

export default function ExperimentGrid({ limit }: { limit?: number }) {
  const [filter, setFilter] = useState<VerdictFilter>('ALL');

  const filtered = filter === 'ALL'
    ? experiments
    : experiments.filter((e) => e.verdict === filter);

  const displayed = limit ? filtered.slice(0, limit) : filtered;

  return (
    <section className="py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <GlitchText
          text="// EXPERIMENTS"
          as="h2"
          className="text-lg sm:text-xl text-terminal text-glow font-bold tracking-wider"
        />
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`text-[10px] px-2 py-1 border transition-colors ${
                filter === f.value
                  ? 'border-terminal text-terminal'
                  : 'border-zinc-800 text-zinc-600 hover:text-zinc-400 hover:border-zinc-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="border border-zinc-800 bg-zinc-900/30 px-4 py-2 mb-4 flex items-center gap-2">
        <span className="text-partial text-[10px]">▲</span>
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Demonstration data. Live experiments will replace this once Ziggy begins testing.</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayed.map((experiment) => (
          <ExperimentCard key={experiment.id} experiment={experiment} />
        ))}
      </div>
      {displayed.length === 0 && (
        <div className="text-center py-12 text-zinc-600 text-sm">
          No experiments match this filter.
        </div>
      )}
    </section>
  );
}
