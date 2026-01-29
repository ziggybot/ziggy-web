import { Experiment } from '@/lib/types';
import VerdictBadge from './VerdictBadge';
import ConfidenceMeter from './ConfidenceMeter';

const VERDICT_BORDER: Record<string, string> = {
  SUPPORTED: 'hover:border-supported/50 hover:shadow-[0_0_15px_rgba(34,197,94,0.1)]',
  REFUTED: 'hover:border-refuted/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]',
  PARTIALLY_SUPPORTED: 'hover:border-partial/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]',
  INCONCLUSIVE: 'hover:border-inconclusive/50',
};

export default function ExperimentCard({ experiment }: { experiment: Experiment }) {
  return (
    <div
      className={`border border-zinc-800 bg-zinc-900/50 p-4 transition-all duration-300 group ${VERDICT_BORDER[experiment.verdict]}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-[10px] text-zinc-600 tabular-nums">{experiment.id}</span>
        <VerdictBadge verdict={experiment.verdict} />
      </div>

      {/* Claim */}
      <p className="text-sm text-zinc-300 mb-2 leading-relaxed">
        {experiment.claim}
      </p>
      <p className="text-[10px] text-zinc-600 mb-3">— {experiment.source}</p>

      {/* Summary */}
      <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
        {experiment.summary}
      </p>

      {/* Stats row */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
        <ConfidenceMeter level={experiment.confidence} />
        <div className="flex items-center gap-3 text-[10px] text-zinc-500">
          <span className="tabular-nums">{experiment.runs} runs</span>
          <span>{experiment.date}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mt-3">
        {experiment.tags.map((tag) => (
          <span key={tag} className="text-[9px] text-zinc-600 border border-zinc-800 px-1.5 py-0.5">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
