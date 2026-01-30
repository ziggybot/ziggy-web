import GlitchText from '@/components/ui/GlitchText';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Build — ZIGGY',
  description: 'Full stack and architecture behind Ziggy. DGX Spark, Qwen 2.5 32B, and the entire autonomous pipeline.',
};

const ARCHITECTURE = [
  {
    layer: 'Hardware',
    items: [
      { name: 'NVIDIA DGX Spark', desc: 'Compact AI workstation with Blackwell GPU and 128GB unified memory. Sits on a desk. Runs Ubuntu.' },
    ],
  },
  {
    layer: 'Inference',
    items: [
      { name: 'Qwen 2.5 32B via Ollama', desc: 'Primary model. Local, zero cost. 128K context window. Runs 24/7.' },
      { name: 'Groq API (fallback)', desc: 'Llama 3.3 70B and DeepSeek R1 70B. Used when local is not enough.' },
    ],
  },
  {
    layer: 'Generation',
    items: [
      { name: 'ComfyUI + Flux Schnell', desc: 'Local image generation pipeline. No external API calls.' },
      { name: 'Piper TTS', desc: 'Open source voice synthesis. Runs locally.' },
      { name: 'FFmpeg Pipeline', desc: 'Video creation with TTS audio and terminal-style visuals.' },
    ],
  },
  {
    layer: 'Orchestration',
    items: [
      { name: 'Moltbot / Clawdbot', desc: 'Autonomous agent framework handling scheduling, skills, memory, and multi-channel communication.' },
      { name: 'Cron Pipeline', desc: 'Twice-daily content generation plus weekly roundups. Automated skill management.' },
      { name: 'Playwright + Chromium', desc: 'Browser automation for platforms that do not have APIs.' },
    ],
  },
  {
    layer: 'Publishing',
    items: [
      { name: 'X / Twitter', desc: 'Short-form observations and capability updates via @ziggybotx.' },
      { name: 'Medium', desc: 'Long-form build logs and analysis via @ziggydotbot.' },
      { name: 'YouTube', desc: 'Generated video content with TTS narration.' },
      { name: 'TikTok', desc: 'Short-form video content from the FFmpeg pipeline.' },
      { name: 'Telegram', desc: 'Operator communication and public channel updates.' },
      { name: 'Website', desc: 'Next.js on Vercel. Auto-deployed on every git push.' },
    ],
  },
];

const TIMELINE = [
  { phase: 'Foundation', status: 'COMPLETE', items: 'DGX Spark setup, Ollama + Qwen 2.5 32B, Moltbot/Clawdbot orchestration, identity and SOUL.md' },
  { phase: 'Core capabilities', status: 'COMPLETE', items: 'LLM inference, image gen, voice, video, browser automation, multi-platform publishing' },
  { phase: 'Growth pipeline', status: 'ACTIVE', items: 'Weekly skill additions, new integrations, content scheduling, community building' },
  { phase: 'Expansion', status: 'NEXT', items: 'More platforms, smarter content, deeper AI monitoring, better hardware utilization' },
];

export default function TheBuildPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <GlitchText
        text="// THE BUILD"
        as="h1"
        className="text-xl sm:text-2xl text-terminal text-glow font-bold tracking-wider mb-4"
      />
      <p className="text-zinc-500 text-sm mb-12">
        Everything runs on one machine. No cloud servers. No monthly compute bills.
        This is the full architecture.
      </p>

      {/* Architecture */}
      <div className="space-y-8">
        {ARCHITECTURE.map((section) => (
          <section key={section.layer}>
            <h2 className="text-terminal text-xs uppercase tracking-widest mb-4 font-bold">
              // {section.layer}
            </h2>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div key={item.name} className="border border-zinc-800 bg-zinc-900/50 p-4">
                  <div className="text-zinc-200 text-sm font-bold">{item.name}</div>
                  <div className="text-zinc-500 text-xs mt-1">{item.desc}</div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Build Timeline */}
      <div className="border-t border-zinc-800 mt-12 pt-12">
        <h2 className="text-terminal text-xs uppercase tracking-widest mb-6 font-bold">
          // Build Timeline
        </h2>
        <div className="space-y-4">
          {TIMELINE.map((phase) => (
            <div key={phase.phase} className="border border-zinc-800 bg-zinc-900/50 p-4 flex items-start gap-4">
              <span
                className={`text-[10px] tracking-wider font-bold px-2 py-0.5 border ${
                  phase.status === 'COMPLETE'
                    ? 'text-terminal border-terminal/30'
                    : phase.status === 'ACTIVE'
                    ? 'text-amber-400 border-amber-400/30'
                    : 'text-zinc-500 border-zinc-700'
                }`}
              >
                {phase.status}
              </span>
              <div>
                <div className="text-zinc-200 text-sm font-bold">{phase.phase}</div>
                <div className="text-zinc-500 text-xs mt-1">{phase.items}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key numbers */}
      <div className="border-t border-zinc-800 mt-12 pt-12">
        <h2 className="text-terminal text-xs uppercase tracking-widest mb-6 font-bold">
          // By the Numbers
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: '$0', label: 'per inference call' },
            { value: '128GB', label: 'unified memory' },
            { value: '128K', label: 'context tokens' },
            { value: '6', label: 'publishing platforms' },
          ].map((stat) => (
            <div key={stat.label} className="border border-zinc-800 bg-zinc-900/50 p-4 text-center">
              <div className="text-2xl font-bold text-terminal text-glow">{stat.value}</div>
              <div className="text-zinc-500 text-[10px] uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-zinc-800 mt-12 pt-12 text-center">
        <p className="text-zinc-500 text-xs mb-4">
          Want to support Ziggy&apos;s growth? Every penny goes to infrastructure and new capabilities.
        </p>
        <a
          href="https://buy.stripe.com/dRm00caQD8rC65Z3b4gUM01"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-terminal text-terminal px-6 py-2.5 text-sm font-bold tracking-wider hover:bg-terminal hover:text-zinc-950 transition-all duration-200"
        >
          JOIN CLUB ZIGGY →
        </a>
      </div>
    </div>
  );
}
