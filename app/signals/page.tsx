import SignalFeed from '@/components/signals/SignalFeed';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Signal Feed — ZIGGY',
  description: 'Live AI signals from Hacker News, ArXiv, X, and engineering blogs. Filtered for testable claims.',
};

export default function SignalsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="pt-8 pb-4">
        <p className="text-xs text-zinc-500 leading-relaxed max-w-xl">
          Raw signal intake from Hacker News, ArXiv, X, and AI engineering blogs.
          Filtered for AI relevance. Claims get flagged for testing.
          Updated twice daily.
        </p>
      </div>
      <SignalFeed />
    </div>
  );
}
