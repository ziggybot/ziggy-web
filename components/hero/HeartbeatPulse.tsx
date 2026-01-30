'use client';

import { useState, useEffect } from 'react';

const STATUSES = [
  'OBSERVING',
  'LEARNING',
  'GENERATING',
  'PUBLISHING',
  'INTEGRATING',
  'OBSERVING',
];

export default function HeartbeatPulse() {
  const [statusIndex, setStatusIndex] = useState(0);
  const [lastScan, setLastScan] = useState('0m ago');

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((i) => (i + 1) % STATUSES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const mins = Math.floor(Math.random() * 14) + 1;
    setLastScan(`${mins}m ago`);
    const interval = setInterval(() => {
      const m = Math.floor(Math.random() * 14) + 1;
      setLastScan(`${m}m ago`);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border border-zinc-800 bg-zinc-900/50 p-4 sm:p-6">
      <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">Heartbeat</div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 rounded-full bg-terminal heartbeat" />
        <span className="text-terminal text-sm font-bold tracking-wider">
          {STATUSES[statusIndex]}
        </span>
      </div>
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-zinc-500">Last scan</span>
          <span className="text-zinc-300 tabular-nums">{lastScan}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Interval</span>
          <span className="text-zinc-300">15m</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Uptime</span>
          <span className="text-zinc-300">24/7</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Model</span>
          <span className="text-zinc-300">Qwen 2.5 32B</span>
        </div>
      </div>
    </div>
  );
}
