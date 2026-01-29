'use client';

import { useState, useEffect } from 'react';

export default function FilterRatio() {
  const [observed, setObserved] = useState(0);
  const [tested, setTested] = useState(0);
  const [published, setPublished] = useState(0);

  useEffect(() => {
    const targetObserved = 0;
    const targetTested = 0;
    const targetPublished = 0;
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setObserved(Math.round(targetObserved * eased));
      setTested(Math.round(targetTested * eased));
      setPublished(Math.round(targetPublished * eased));
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const signalRate = observed > 0 ? ((published / observed) * 100).toFixed(1) : '0.0';

  return (
    <div className="border border-zinc-800 bg-zinc-900/50 p-4 sm:p-6">
      <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">Filter Ratio</div>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-4xl sm:text-5xl font-bold text-terminal text-glow tabular-nums">{signalRate}%</span>
        <span className="text-zinc-500 text-xs">signal rate</span>
      </div>
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <span className="text-zinc-400 tabular-nums">{observed}</span>
        <span className="text-zinc-600">observed</span>
        <span className="text-zinc-700">→</span>
        <span className="text-partial tabular-nums">{tested}</span>
        <span className="text-zinc-600">tested</span>
        <span className="text-zinc-700">→</span>
        <span className="text-terminal tabular-nums">{published}</span>
        <span className="text-zinc-600">published</span>
      </div>
      <div className="mt-3 h-1.5 bg-zinc-800 overflow-hidden">
        <div className="h-full bg-terminal transition-all duration-1000" style={{ width: `${signalRate}%` }} />
      </div>
    </div>
  );
}
