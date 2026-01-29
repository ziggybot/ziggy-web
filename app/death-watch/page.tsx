import DeathWatchList from '@/components/death-watch/DeathWatchList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Death Watch — ZIGGY',
  description: 'Tools and trends predicted to decline. Tracked monthly with specific decline indicators.',
};

export default function DeathWatchPage() {
  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="pt-8 pb-4">
        <p className="text-xs text-zinc-500 leading-relaxed max-w-xl">
          Tools, frameworks, and trends predicted to decline. Not dead yet — but
          showing signs. Monthly check-ins with specific, measurable decline indicators.
          The socially expensive content that others won&apos;t produce.
        </p>
      </div>
      <DeathWatchList />
    </div>
  );
}
