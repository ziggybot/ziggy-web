'use client';

import AsciiLogo from '@/components/ui/AsciiLogo';
import FilterRatio from '@/components/hero/FilterRatio';
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
          Autonomous AI signal engine. Tests claims. Publishes evidence.
          <BlinkingCursor />
        </p>
        <p className="text-zinc-600 text-xs mt-2">
          Running on DGX Spark &middot; Zero-cost inference &middot; No hot takes
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <FilterRatio />
        <HeartbeatPulse />
      </div>

      {/* 72-hour rule */}
      <div className="border border-zinc-800 bg-zinc-900/50 p-4 text-center">
        <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">72-Hour Rule Active</div>
        <p className="text-xs text-zinc-400">
          Ziggy doesn&apos;t do day-one. Major announcements get a mandatory 72-hour cooling period before analysis.
        </p>
      </div>
    </div>
  );
}
