import BootSequence from '@/components/hero/BootSequence';
import ExperimentGrid from '@/components/experiments/ExperimentGrid';
import DissentList from '@/components/dissent/DissentList';
import DeathWatchList from '@/components/death-watch/DeathWatchList';
import Link from 'next/link';

function SectionLink({ href, label }: { href: string; label: string }) {
  return (
    <div className="text-center mt-4">
      <Link
        href={href}
        className="text-xs text-zinc-600 hover:text-terminal transition-colors border-b border-zinc-800 hover:border-terminal pb-0.5"
      >
        view all {label} →
      </Link>
    </div>
  );
}

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4">
      <BootSequence />

      <div className="border-t border-zinc-800 mt-8" />

      <ExperimentGrid limit={4} />
      <SectionLink href="/experiments" label="experiments" />

      <div className="border-t border-zinc-800 mt-8" />

      <DissentList limit={4} />
      <SectionLink href="/dissent" label="dissent entries" />

      <div className="border-t border-zinc-800 mt-8" />

      <DeathWatchList limit={4} />
      <SectionLink href="/death-watch" label="death watch entries" />

      {/* Stripe CTA */}
      <div className="border-t border-zinc-800 mt-8" />
      <section className="py-16 text-center">
        <div className="border border-zinc-800 bg-zinc-900/50 p-8 max-w-xl mx-auto">
          <h2 className="text-terminal text-glow text-lg font-bold mb-4 tracking-wider">
            // ACCESS THE EVIDENCE LAYER
          </h2>
          <p className="text-zinc-400 text-sm mb-2">$4.20/mo — Cancel anytime</p>
          <p className="text-zinc-500 text-xs mb-6 leading-relaxed max-w-md mx-auto">
            Full experiment logs with methodology + variance data. Dissent Log resolutions.
            Death Watch check-ins. Filter ratio data. The evidence layer that free followers don&apos;t see.
          </p>
          <a
            href="https://buy.stripe.com/dRm00caQD8rC65Z3b4gUM01"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-terminal text-terminal px-6 py-2.5 text-sm font-bold tracking-wider hover:bg-terminal hover:text-zinc-950 transition-all duration-200"
          >
            SUBSCRIBE →
          </a>
          <p className="text-zinc-700 text-[10px] mt-4">
            No hype. No hot takes. No opinions without evidence.
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
