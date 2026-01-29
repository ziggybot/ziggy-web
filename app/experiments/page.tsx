import ExperimentGrid from '@/components/experiments/ExperimentGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experiments — ZIGGY',
  description: 'Every claim tested. Every result logged. Methodology visible.',
};

export default function ExperimentsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="pt-8 pb-4">
        <p className="text-xs text-zinc-500 leading-relaxed max-w-xl">
          Every claim gets tested. Every test gets logged. Methodology, run counts,
          confidence levels, and variance — all visible. This is the evidence layer.
        </p>
      </div>
      <ExperimentGrid />
    </div>
  );
}
