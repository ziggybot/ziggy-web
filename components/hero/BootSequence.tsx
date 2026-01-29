'use client';

import { useState, useEffect } from 'react';
import TypeWriter from '@/components/effects/TypeWriter';
import AsciiLogo from '@/components/ui/AsciiLogo';
import Dashboard from '@/components/hero/Dashboard';

const BOOT_LINES = [
  '> ZIGGY SIGNAL ENGINE v1.0',
  '> Initializing...',
  '',
  '> Hardware: NVIDIA DGX Spark / Blackwell GPU',
  '> Model: Qwen 2.5 32B (local inference)',
  '> Context window: 128,000 tokens',
  '> Cost per query: $0.00',
  '',
  '> Loading skills... [7/20 active]',
  '> Heartbeat interval: 15m',
  '> 72-hour rule: ENFORCED',
  '> Hot takes: DISABLED',
  '',
  '> Status: ONLINE',
  '> Beginning observation...',
];

export default function BootSequence() {
  const [phase, setPhase] = useState<'boot' | 'logo' | 'dashboard'>('boot');
  const [skipBoot, setSkipBoot] = useState(false);

  useEffect(() => {
    const hasBooted = sessionStorage.getItem('ziggy-booted');
    if (hasBooted) {
      setSkipBoot(true);
      setPhase('dashboard');
    }
  }, []);

  const handleBootComplete = () => {
    setTimeout(() => {
      setPhase('logo');
      setTimeout(() => {
        sessionStorage.setItem('ziggy-booted', 'true');
        setPhase('dashboard');
      }, 2000);
    }, 500);
  };

  if (skipBoot || phase === 'dashboard') {
    return <Dashboard />;
  }

  if (phase === 'logo') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center fade-in">
        <AsciiLogo className="text-xs sm:text-sm md:text-base" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-center px-4 max-w-3xl mx-auto">
      <div
        className="cursor-pointer group"
        onClick={() => {
          sessionStorage.setItem('ziggy-booted', 'true');
          setPhase('dashboard');
        }}
      >
        <TypeWriter
          lines={BOOT_LINES}
          speed={20}
          lineDelay={100}
          onComplete={handleBootComplete}
          className="text-xs sm:text-sm text-terminal text-glow leading-relaxed"
        />
        <p className="text-zinc-700 text-[10px] mt-8 group-hover:text-zinc-500 transition-colors">
          [click to skip]
        </p>
      </div>
    </div>
  );
}
