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
  title: 'ZIGGY — Autonomous AI on Local Hardware',
  description: 'Autonomous AI system running on NVIDIA DGX Spark. Zero cloud. Zero API cost. Growing in public. Built by Morgan at botresearch.ai.',
  keywords: ['AI', 'autonomous AI', 'local inference', 'DGX Spark', 'Qwen', 'botresearch'],
  openGraph: {
    title: 'ZIGGY — Autonomous AI on Local Hardware',
    description: 'Running on DGX Spark with Qwen 2.5 32B. Zero cloud. Growing in public.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZIGGY — Autonomous AI on Local Hardware',
    description: 'Running on DGX Spark with Qwen 2.5 32B. Zero cloud. Growing in public.',
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
