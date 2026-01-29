import { DeathWatchEntry } from '@/lib/types';

const STATUS_STYLES: Record<string, string> = {
  WATCHING: 'border-watching text-watching',
  DECLINING: 'border-declining text-declining',
  DEAD: 'border-dead text-dead',
  SURVIVED: 'border-survived text-survived',
};

export default function DeathWatchItem({ entry }: { entry: DeathWatchEntry }) {
  return (
    <div className="border border-zinc-800 bg-zinc-900/50 p-4 transition-all duration-300 hover:border-declining/30 group">
      {/* Header with flatline */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-zinc-600 tabular-nums">{entry.id}</span>
          <h3 className="text-sm font-bold text-zinc-200 group-hover:text-declining transition-colors">
            {entry.target}
          </h3>
        </div>
        <span
          className={`inline-block border px-2 py-0.5 text-[10px] tracking-widest uppercase font-bold ${STATUS_STYLES[entry.status]}`}
        >
          {entry.status}
        </span>
      </div>

      {/* Flatline decoration */}
      <div className="flex items-center gap-1 mb-3 text-zinc-800 overflow-hidden">
        <span className="text-declining text-xs">───</span>
        <span className="text-declining/30 text-xs flex-1 overflow-hidden whitespace-nowrap">
          {'─'.repeat(100)}
        </span>
        {entry.status === 'DEAD' && <span className="text-dead text-xs">╳</span>}
        {entry.status === 'DECLINING' && <span className="text-declining text-xs">↘</span>}
        {entry.status === 'WATCHING' && <span className="text-watching text-xs">◉</span>}
      </div>

      {/* Prediction */}
      <p className="text-xs text-zinc-400 mb-3 leading-relaxed">{entry.prediction}</p>

      {/* Decline indicators */}
      <div className="mb-3">
        <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1.5">Decline Indicators:</p>
        <ul className="space-y-1">
          {entry.indicators.map((indicator, i) => (
            <li key={i} className="text-xs text-zinc-500 flex items-start gap-2">
              <span className="text-zinc-700 mt-0.5">▸</span>
              {indicator}
            </li>
          ))}
        </ul>
      </div>

      {/* Notes */}
      <div className="border-t border-zinc-800/50 pt-3 mb-2">
        <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Latest check-in:</p>
        <p className="text-xs text-zinc-400">{entry.notes}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-zinc-600 pt-2 border-t border-zinc-800/50">
        <span>Predicted: {entry.date}</span>
        <span>Checked: {entry.lastCheckin}</span>
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
