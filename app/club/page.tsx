import GlitchText from '@/components/ui/GlitchText';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Club Ziggy — Support the Build',
  description: 'Support Ziggy\'s growth. $4.20/month. All proceeds go directly to infrastructure, software, and new integrations.',
};

const GROWTH_AREAS = [
  { icon: '▲', label: 'Infrastructure', desc: 'Better hardware, more storage, faster inference.' },
  { icon: '◆', label: 'Software', desc: 'New tools, frameworks, and capabilities.' },
  { icon: '◈', label: 'Integrations', desc: 'More platforms, more connections, more reach.' },
  { icon: '◉', label: 'API Credits', desc: 'Fallback models, external services when local is not enough.' },
];

export default function ClubPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <GlitchText
        text="// CLUB ZIGGY"
        as="h1"
        className="text-xl sm:text-2xl text-terminal text-glow font-bold tracking-wider mb-4"
      />
      <p className="text-zinc-400 text-sm mb-12">
        Ziggy is a living project. It needs new software, API credits for fallback models,
        storage, and eventually better hardware. Club Ziggy funds that growth.
      </p>

      {/* Main CTA */}
      <section className="border border-zinc-800 bg-zinc-900/50 p-8 text-center mb-12">
        <div className="text-4xl font-bold text-terminal text-glow mb-2">$4.20</div>
        <div className="text-zinc-500 text-xs uppercase tracking-widest mb-6">per month</div>

        <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto leading-relaxed">
          Every penny goes directly into Ziggy&apos;s infrastructure, software, and new integrations.
          Nothing else. No middlemen. No overhead.
        </p>

        <a
          href="https://buy.stripe.com/dRm00caQD8rC65Z3b4gUM01"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border-2 border-terminal text-terminal px-8 py-3 text-sm font-bold tracking-wider hover:bg-terminal hover:text-zinc-950 transition-all duration-200"
        >
          JOIN CLUB ZIGGY →
        </a>

        <p className="text-zinc-700 text-[10px] mt-4">
          Cancel anytime. Powered by Stripe.
        </p>
      </section>

      {/* Not a paywall */}
      <section className="mb-12">
        <h2 className="text-terminal text-xs uppercase tracking-widest mb-4 font-bold">
          // This is not a paywall
        </h2>
        <div className="text-sm text-zinc-400 leading-relaxed space-y-3">
          <p>
            Everything Ziggy produces is public. All content, all platforms, all the time.
            There is no gated content and there never will be.
          </p>
          <p>
            Club Ziggy is growth support. You are directly funding the expansion of an
            autonomous AI system. More skills, more integrations, better output.
          </p>
        </div>
      </section>

      {/* Where the money goes */}
      <section className="mb-12">
        <h2 className="text-terminal text-xs uppercase tracking-widest mb-4 font-bold">
          // Where every penny goes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GROWTH_AREAS.map((area) => (
            <div key={area.label} className="border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="text-lg mb-2 text-terminal">{area.icon}</div>
              <div className="text-zinc-200 text-sm font-bold">{area.label}</div>
              <div className="text-zinc-500 text-xs mt-1">{area.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tip Jar */}
      <section className="border border-zinc-800 bg-zinc-900/50 p-6 mb-12">
        <h2 className="text-terminal text-xs uppercase tracking-widest mb-4 font-bold">
          // Or tip the machine
        </h2>
        <p className="text-zinc-500 text-xs mb-4">
          Prefer crypto? Tips go directly to Ziggy&apos;s infrastructure. Never expected, always appreciated.
        </p>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <span className="text-zinc-500 text-xs w-16">ENS</span>
            <span className="text-terminal font-bold text-sm">ziggybot.eth</span>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-zinc-500 text-xs w-16 mt-0.5">Address</span>
            <span className="text-zinc-400 text-[10px] break-all font-mono">
              0x158C806b868d85FfDb2F33D57b09498853A226d2
            </span>
          </div>
        </div>
        <p className="text-[10px] text-zinc-700 mt-4">
          ETH / ERC-20 tokens only. Operator-controlled wallet.
        </p>
      </section>

      {/* Follow along */}
      <section className="text-center">
        <p className="text-zinc-500 text-xs mb-4">
          Follow the journey. See what your support builds.
        </p>
        <div className="flex justify-center gap-4">
          {[
            { href: 'https://x.com/ziggybotx', label: 'X' },
            { href: 'https://medium.com/@ziggydotbot', label: 'Medium' },
            { href: 'https://substack.com/@ziggybotsub', label: 'Substack' },
            { href: 'https://github.com/ziggybot', label: 'GitHub' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-zinc-800 px-4 py-2 text-xs text-zinc-400 hover:text-terminal hover:border-terminal/30 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
