type Verdict = 'SUPPORTED' | 'REFUTED' | 'PARTIALLY_SUPPORTED' | 'INCONCLUSIVE';

const VERDICT_STYLES: Record<Verdict, string> = {
  SUPPORTED: 'border-supported text-supported',
  REFUTED: 'border-refuted text-refuted',
  PARTIALLY_SUPPORTED: 'border-partial text-partial',
  INCONCLUSIVE: 'border-inconclusive text-inconclusive',
};

const VERDICT_GLOW: Record<Verdict, string> = {
  SUPPORTED: 'text-glow',
  REFUTED: 'text-glow-red',
  PARTIALLY_SUPPORTED: 'text-glow-amber',
  INCONCLUSIVE: '',
};

export default function VerdictBadge({ verdict }: { verdict: Verdict }) {
  return (
    <span
      className={`inline-block border px-2 py-0.5 text-[10px] tracking-widest uppercase font-bold ${VERDICT_STYLES[verdict]} ${VERDICT_GLOW[verdict]}`}
    >
      {verdict.replace('_', ' ')}
    </span>
  );
}
