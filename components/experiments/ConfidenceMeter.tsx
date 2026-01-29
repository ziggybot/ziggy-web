export default function ConfidenceMeter({ level }: { level: number }) {
  const filled = level;
  const empty = 10 - level;

  const color =
    level >= 8 ? 'text-terminal' :
    level >= 5 ? 'text-partial' :
    'text-refuted';

  return (
    <span className={`text-xs font-mono ${color}`}>
      [{'█'.repeat(filled)}{'░'.repeat(empty)}] {level}/10
    </span>
  );
}
