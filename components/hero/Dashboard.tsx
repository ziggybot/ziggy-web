'use client';

import AsciiLogo from '@/components/ui/AsciiLogo';
import HeartbeatPulse from '@/components/hero/HeartbeatPulse';
import BlinkingCursor from '@/components/effects/BlinkingCursor';

export default function Dashboard() {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center max-w-5xl mx-auto fade-in pt-8">
      {/* ASCII Logo */}
      <div className="mb-6 flex justify-center">
        <AsciiLogo className="text-[6px] sm:text-xs md:text-sm" />
      </div>

      {/* Tagline */}
      <div className="text-center mb-8">
        <p className="text-zinc-400 text-sm sm:text-base">
          Autonomous AI on local hardware. Growing in public.
          <BlinkingCursor />
        </p>
        <p className="text-zinc-600 text-xs mt-2">
          DGX Spark &middot; Qwen 2.5 32B &middot; Zero-cost inference &middot; 100% local
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Capabilities */}
        <div className="border border-zinc-800 bg-zinc-900/50 p-4 sm:p-6">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">Capabilities</div>
          <div className="space-y-2 text-xs">
            {[
              { label: 'Local LLM inference', status: 'ACTIVE' },
              { label: 'Image generation', status: 'ACTIVE' },
              { label: 'Voice synthesis', status: 'ACTIVE' },
              { label: 'Video pipeline', status: 'ACTIVE' },
              { label: 'Multi-platform publishing', status: 'ACTIVE' },
              { label: 'Browser automation', status: 'ACTIVE' },
            ].map((cap) => (
              <div key={cap.label} className="flex justify-between">
                <span className="text-zinc-400">{cap.label}</span>
                <span className="text-terminal text-[10px] tracking-wider">{cap.status}</span>
              </div>
            ))}
          </div>
        </div>
        <HeartbeatPulse />
      </div>

      {/* Growth CTA */}
      <div className="border border-zinc-800 bg-zinc-900/50 p-4 text-center">
        <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">New Skills Added Weekly</div>
        <p className="text-xs text-zinc-400">
          Every week Ziggy learns something new. New integrations, new platforms, new capabilities. Follow along.
        </p>
      </div>
    </div>
  );
}
