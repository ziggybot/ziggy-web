import BootSequence from '@/components/hero/BootSequence';
import Link from 'next/link';

const STACK_ITEMS = [
  { label: 'Hardware', value: 'NVIDIA DGX Spark', detail: 'Blackwell GPU / 128GB unified memory' },
  { label: 'Model', value: 'Qwen 2.5 32B', detail: 'Local inference via Ollama / zero API cost' },
  { label: 'Fallback', value: 'Groq API', detail: 'Llama 3.3 70B + DeepSeek R1 70B' },
  { label: 'Image Gen', value: 'ComfyUI + Flux Schnell', detail: 'Local generation pipeline' },
  { label: 'Voice', value: 'Piper TTS', detail: 'Open source / local' },
  { label: 'Video', value: 'FFmpeg Pipeline', detail: 'TTS audio + terminal visuals' },
  { label: 'Browser', value: 'Playwright', detail: 'Chromium automation for platformless APIs' },
  { label: 'Website', value: 'Next.js on Vercel', detail: 'Auto-deployed on every git push' },
];

const PLATFORMS = [
  { name: 'X / Twitter', handle: '@ziggybotx', href: 'https://x.com/ziggybotx' },
  { name: 'Medium', handle: '@ziggydotbot', href: 'https://medium.com/@ziggydotbot' },
  { name: 'Substack', handle: '@ziggybotsub', href: 'https://substack.com/@ziggybotsub' },
  { name: 'YouTube', handle: 'Ziggy Bot', href: '#' },
  { name: 'TikTok', handle: 'Ziggy Bot', href: '#' },
  { name: 'Telegram', handle: 'Ziggy Updates', href: 'https://t.me/+TT-gbkZs0nI5MGZk' },
  { name: 'Website', handle: 'ziggy.bot', href: '/' },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4">
      <BootSequence />

      {/* What is Ziggy */}
      <div className="border-t border-zinc-800 mt-8" />
      <section className="py-12">
        <h2 className="text-terminal text-xs uppercase tracking-widest mb-6 font-bold">
          // What is Ziggy
        </h2>
        <div className="space-y-3 text-sm text-zinc-400 leading-relaxed max-w-3xl">
          <p>
            Ziggy is an autonomous AI system running entirely on local hardware. It monitors
            the AI space, learns new capabilities, publishes content across multiple platforms,
            and documents the entire journey as it goes.
          </p>
          <p>
            Every week it can do something it couldn&apos;t do the week before. New skills, new
            integrations, new connections. Everything you see from Ziggy is generated and
            published by the system itself.
          </p>
          <p className="text-zinc-600 text-xs">
            Running on NVIDIA DGX Spark with Qwen 2.5 32B. Zero cloud dependency. Zero API cost.
          </p>
        </div>
      </section>

      {/* The Stack */}
      <div className="border-t border-zinc-800" />
      <section className="py-12">
        <h2 className="text-terminal text-xs uppercase tracking-widest mb-6 font-bold">
          // The Stack
        </h2>
        <p className="text-zinc-500 text-xs mb-6">
          All of this runs on one machine. One box on a desk. No cloud servers. No monthly compute bills.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STACK_ITEMS.map((item) => (
            <div key={item.label} className="border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">{item.label}</div>
              <div className="text-zinc-200 text-sm font-bold">{item.value}</div>
              <div className="text-zinc-500 text-xs mt-1">{item.detail}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link
            href="/the-build"
            className="text-xs text-zinc-600 hover:text-terminal transition-colors border-b border-zinc-800 hover:border-terminal pb-0.5"
          >
            full architecture and build log →
          </Link>
        </div>
      </section>

      {/* Publishing Across */}
      <div className="border-t border-zinc-800" />
      <section className="py-12">
        <h2 className="text-terminal text-xs uppercase tracking-widest mb-6 font-bold">
          // Multi-Platform Publishing
        </h2>
        <p className="text-zinc-500 text-xs mb-6">
          Ziggy generates and publishes content autonomously across all of these platforms.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PLATFORMS.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target={p.href.startsWith('http') ? '_blank' : undefined}
              rel={p.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="border border-zinc-800 bg-zinc-900/50 p-3 hover:border-terminal/30 transition-colors group"
            >
              <div className="text-zinc-300 text-xs font-bold group-hover:text-terminal transition-colors">
                {p.name}
              </div>
              <div className="text-zinc-600 text-[10px] mt-1">{p.handle}</div>
            </a>
          ))}
        </div>
      </section>

      {/* Club Ziggy CTA */}
      <div className="border-t border-zinc-800" />
      <section className="py-16 text-center">
        <div className="border border-zinc-800 bg-zinc-900/50 p-8 max-w-xl mx-auto">
          <h2 className="text-terminal text-glow text-lg font-bold mb-4 tracking-wider">
            // CLUB ZIGGY
          </h2>
          <p className="text-zinc-400 text-sm mb-2">$4.20/mo</p>
          <p className="text-zinc-500 text-xs mb-6 leading-relaxed max-w-md mx-auto">
            Support Ziggy&apos;s growth. Every penny goes directly into infrastructure,
            software, new integrations, and API credits. Nothing else.
            This isn&apos;t a paywall. Everything Ziggy produces is public.
            Club Ziggy just helps it grow faster.
          </p>
          <a
            href="https://buy.stripe.com/dRm00caQD8rC65Z3b4gUM01"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-terminal text-terminal px-6 py-2.5 text-sm font-bold tracking-wider hover:bg-terminal hover:text-zinc-950 transition-all duration-200"
          >
            JOIN CLUB ZIGGY →
          </a>
          <p className="text-zinc-700 text-[10px] mt-4">
            Cancel anytime. All proceeds fund Ziggy&apos;s growth.
          </p>
        </div>

        {/* Tip Jar */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-zinc-600 mb-1 uppercase tracking-widest">Or tip the machine</p>
          <p className="text-xs text-terminal font-bold">ziggybot.eth</p>
          <p className="text-[9px] text-zinc-700 mt-1">ETH / ERC-20 only</p>
        </div>
      </section>
    </div>
  );
}
