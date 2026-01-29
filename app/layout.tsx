import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import StatusBar from '@/components/layout/StatusBar';
import SignalTicker from '@/components/layout/SignalTicker';
import Scanlines from '@/components/effects/Scanlines';
import CommandPalette from '@/components/ui/CommandPalette';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'ZIGGY — AI Signal Engine',
  description: 'Autonomous AI signal engine. Tests claims. Publishes evidence. Running on DGX Spark with zero-cost inference.',
  keywords: ['AI', 'signal engine', 'experiments', 'benchmarks', 'LLM testing'],
  openGraph: {
    title: 'ZIGGY — AI Signal Engine',
    description: 'Tests claims. Publishes evidence. No hot takes.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZIGGY — AI Signal Engine',
    description: 'Tests claims. Publishes evidence. No hot takes.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${jetbrainsMono.variable} font-mono bg-background text-foreground crt-flicker`}>
        <Scanlines />
        <CommandPalette />
        <Navbar />
        <SignalTicker />
        <main className="pt-[72px] pb-10 min-h-screen">
          {children}
        </main>
        <StatusBar />
      </body>
    </html>
  );
}
