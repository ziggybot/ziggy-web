import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Ziggy's Arcade",
  description: '5 free retro browser games. Terminal aesthetic. No cloud required. No accounts. No tracking.',
  openGraph: {
    title: "Ziggy's Arcade — ZIGGY",
    description: '5 free retro browser games with CRT terminal aesthetic. Signal Surge, Memory Matrix, Prompt Runner, Token Breaker, Bit Invaders.',
    url: 'https://ziggy.bot/arcade',
  },
  twitter: {
    title: "Ziggy's Arcade — ZIGGY",
    description: '5 free retro browser games with CRT terminal aesthetic. No accounts. No tracking.',
  },
};

export default function ArcadeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
