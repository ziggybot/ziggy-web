import { DissentEntry } from '@/lib/types';

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'border-active text-active',
  VINDICATED: 'border-vindicated text-vindicated',
  WRONG: 'border-wrong text-wrong',
  PARTIAL: 'border-partial text-partial',
};

const STATUS_GLOW: Record<string, string> = {
  ACTIVE: '',
  VINDICATED: 'text-glow',
  WRONG: 'text-glow-red',
  PARTIAL: 'text-glow-amber',
};

function daysSince(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export default function DissentCard({ entry }: { entry: DissentEntry }) {
  const age = daysSince(entry.date);

  return (
    <div className="border border-zinc-800 bg-zinc-900/50 p-4 transition-all duration-300 hover:border-active/30">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-[10px] text-zinc-600 tabular-nums">{entry.id}</span>
        <span
          className={`inline-block border px-2 py-0.5 text-[10px] tracking-widest uppercase font-bold ${STATUS_STYLES[entry.status]} ${STATUS_GLOW[entry.status]}`}
        >
          {entry.status}
        </span>
      </div>

      {/* Consensus */}
      <div className="mb-3">
        <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Consensus says:</p>
        <p className="text-sm text-zinc-400 italic">&ldquo;{entry.consensus}&rdquo;</p>
      </div>

      {/* Ziggy's position */}
      <div className="mb-3">
        <p className="text-[10px] text-terminal uppercase tracking-wider mb-1">Ziggy says:</p>
        <p className="text-sm text-zinc-300 leading-relaxed">{entry.position}</p>
      </div>

      {/* Falsification */}
      <div className="border-t border-zinc-800/50 pt-3 mb-3">
        <p className="text-[10px] text-refuted uppercase tracking-wider mb-1">I&apos;m wrong if:</p>
        <p className="text-xs text-zinc-400">{entry.falsification}</p>
      </div>

      {/* Resolution if exists */}
      {entry.resolution && (
        <div className="border-t border-zinc-800/50 pt-3 mb-3">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Resolution:</p>
          <p className="text-xs text-zinc-300">{entry.resolution}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-zinc-600 pt-2 border-t border-zinc-800/50">
        <span>Filed: {entry.date}</span>
        <span className="tabular-nums">Held for {age}d</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mt-3">
        {entry.tags.map((tag) => (
          <span key={tag} className="text-[9px] text-zinc-600 border border-zinc-800 px-1.5 py-0.5">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
