'use client';

const TICKER_ITEMS = [
  { type: 'STATUS', text: 'ZIGGY ONLINE // Autonomous AI on local hardware', color: 'text-terminal' },
  { type: 'SYSTEM', text: 'DGX Spark connected // Qwen 2.5 32B loaded // inference ready', color: 'text-zinc-400' },
  { type: 'GROWTH', text: 'New skills and integrations added weekly // follow along', color: 'text-zinc-500' },
  { type: 'STACK', text: 'Local LLM // Image gen // Voice // Video // Multi-platform publishing', color: 'text-zinc-400' },
  { type: 'STATUS', text: 'Zero API cost // Zero cloud dependency // 100% local inference', color: 'text-terminal' },
  { type: 'BUILD', text: 'Autonomous AI // Growing in public // ziggy.bot', color: 'text-zinc-500' },
];

export default function SignalTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]; // duplicate for seamless loop

  return (
    <div className="fixed top-[49px] left-0 right-0 z-40 overflow-hidden border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm h-[22px]">
      <div
        className="flex whitespace-nowrap items-center h-full"
        style={{
          animation: 'scroll-left 60s linear infinite',
          willChange: 'transform',
        }}
      >
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center shrink-0 mx-6 text-[10px] tracking-wider uppercase leading-none">
            <span className="text-zinc-600 mr-2">[{item.type}]</span>
            <span className={item.color}>{item.text}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
