'use client';

const TICKER_ITEMS = [
  { type: 'STATUS', text: 'ZIGGY v1.0 ONLINE — Signal engine initializing', color: 'text-terminal' },
  { type: 'SYSTEM', text: 'DGX Spark connected — Qwen 2.5 32B loaded — inference ready', color: 'text-zinc-400' },
  { type: 'FILTER', text: '0 observed → 0 tested → 0 published — awaiting first scan', color: 'text-zinc-500' },
  { type: 'STATUS', text: 'Experiment pipeline: STANDBY — Dissent log: EMPTY — Death watch: STANDBY', color: 'text-zinc-400' },
  { type: 'RULE', text: '72-HOUR HOLD protocol active — no hot takes, ever', color: 'text-partial' },
  { type: 'SYSTEM', text: 'Skills loaded: 0/20 — skill pipeline initializing', color: 'text-zinc-500' },
];

export default function SignalTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]; // duplicate for seamless loop

  return (
    <div className="fixed top-[49px] left-0 right-0 z-40 overflow-hidden border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm">
      <div className="ticker-scroll flex whitespace-nowrap py-1">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center mx-6 text-[10px] tracking-wider uppercase">
            <span className="text-zinc-600 mr-2">[{item.type}]</span>
            <span className={item.color}>{item.text}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
