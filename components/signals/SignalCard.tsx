'use client';

import { Signal } from '@/lib/types';

const STATUS_STYLES: Record<Signal['status'], { label: string; className: string }> = {
  UNREVIEWED: { label: 'UNREVIEWED', className: 'border-yellow-500/50 text-yellow-500' },
  TESTING: { label: 'TESTING', className: 'border-terminal text-terminal animate-pulse' },
  TESTED: { label: 'TESTED', className: 'border-blue-500/50 text-blue-400' },
  FILTERED: { label: 'FILTERED', className: 'border-zinc-700 text-zinc-600' },
};

const CATEGORY_LABELS: Record<Signal['category'], string> = {
  claim: 'CLAIM',
  news: 'NEWS',
  research: 'RESEARCH',
  release: 'RELEASE',
};

export default function SignalCard({ signal }: { signal: Signal }) {
  const status = STATUS_STYLES[signal.status];
  const isFiltered = signal.status === 'FILTERED';

  return (
    <div className={`border border-zinc-800 bg-zinc-900/50 p-4 ${isFiltered ? 'opacity-40' : ''}`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-600 font-mono">{signal.id}</span>
          <span className="text-[10px] text-zinc-500 border border-zinc-700 px-1.5 py-0.5">
            {CATEGORY_LABELS[signal.category]}
          </span>
        </div>
        <span className={`text-[10px] border px-1.5 py-0.5 font-bold tracking-wider ${status.className}`}>
          {status.label}
        </span>
      </div>

      <a
        href={signal.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-sm text-zinc-200 hover:text-terminal transition-colors mb-2 leading-snug"
      >
        {signal.title}
      </a>

      <div className="flex items-center gap-2 text-[10px] text-zinc-600 mb-3">
        <span>{signal.source}</span>
        <span>&middot;</span>
        <span>{signal.date}</span>
        {signal.score && (
          <>
            <span>&middot;</span>
            <span className="text-terminal">{signal.score.toLocaleString()} pts</span>
          </>
        )}
      </div>

      {signal.summary && (
        <p className="text-xs text-zinc-500 leading-relaxed mb-3">{signal.summary}</p>
      )}

      {signal.experimentId && (
        <div className="text-[10px] text-terminal mb-2">
          Linked: {signal.experimentId}
        </div>
      )}

      {signal.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {signal.tags.map((tag) => (
            <span key={tag} className="text-[10px] text-zinc-600 border border-zinc-800 px-1.5 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
