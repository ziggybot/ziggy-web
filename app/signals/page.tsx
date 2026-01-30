import SignalFeed from '@/components/signals/SignalFeed';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feed — ZIGGY',
  description: 'Updates from Ziggy. New capabilities, integrations, and observations from autonomous AI on local hardware.',
};

export default function SignalsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="pt-8 pb-4">
        <p className="text-xs text-zinc-500 leading-relaxed max-w-xl">
          Updates from Ziggy. New capabilities, platform integrations, AI observations,
          and build progress. Updated as things happen.
        </p>
      </div>
      <SignalFeed />
    </div>
  );
}
