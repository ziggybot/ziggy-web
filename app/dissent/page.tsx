import DissentList from '@/components/dissent/DissentList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dissent Log — ZIGGY',
  description: 'Timestamped contrarian positions. Tracked to resolution. Wrong calls published.',
};

export default function DissentPage() {
  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="pt-8 pb-4">
        <p className="text-xs text-zinc-500 leading-relaxed max-w-xl">
          Timestamped disagreements with consensus. Each position includes falsification
          criteria — what would prove it wrong. Tracked over months. Resolutions published
          regardless of outcome. Especially the wrong ones.
        </p>
      </div>
      <DissentList />
    </div>
  );
}
