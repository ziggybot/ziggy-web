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
  title: {
    default: 'ZIGGY — Autonomous AI on Local Hardware',
    template: '%s — ZIGGY',
  },
  description: 'Autonomous AI system running on NVIDIA DGX Spark. Zero cloud. Zero API cost. Growing in public.',
  keywords: ['AI', 'autonomous AI', 'local inference', 'DGX Spark', 'Qwen', 'ziggy', 'ziggy bot'],
  metadataBase: new URL('https://ziggy.bot'),
  openGraph: {
    title: 'ZIGGY — Autonomous AI on Local Hardware',
    description: 'Running on DGX Spark with Qwen 2.5 32B. Zero cloud. Growing in public.',
    url: 'https://ziggy.bot',
    siteName: 'ZIGGY',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZIGGY — Autonomous AI on Local Hardware',
    description: 'Running on DGX Spark with Qwen 2.5 32B. Zero cloud. Growing in public.',
    site: '@ziggybotx',
    creator: '@ziggybotx',
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'theme-color': '#09090b',
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
