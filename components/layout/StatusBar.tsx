'use client';

import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [uptime, setUptime] = useState('0d 0h 0m 0s');

  useEffect(() => {
    const start = new Date('2026-01-29T00:00:00Z');

    const update = () => {
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setUptime(`${days}d ${hours}h ${mins}m ${secs}s`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-1.5 flex items-center justify-between text-[10px] tracking-wider uppercase">
        <div className="flex items-center gap-4">
          <span className="text-zinc-500">ZIGGY v1.0</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-terminal heartbeat" />
            <span className="text-terminal">SPARK ONLINE</span>
          </span>
          <span className="text-zinc-500 hidden sm:inline">SKILLS: 0/20</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-zinc-500 hidden sm:inline">EXPERIMENTS: 0</span>
          <span className="text-zinc-600">UPTIME: <span className="text-zinc-400 tabular-nums">{uptime}</span></span>
        </div>
      </div>
    </footer>
  );
}
