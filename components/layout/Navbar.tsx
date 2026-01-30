'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'home' },
  { href: '/signals', label: 'feed' },
  { href: '/the-build', label: 'the build' },
  { href: '/arcade', label: 'arcade' },
  { href: '/about', label: 'about' },
  { href: '/club', label: 'club ziggy' },
  { href: '/genesis', label: 'genesis' },
];

const SOCIAL_LINKS = [
  { href: 'https://x.com/ziggybotx', label: 'X', icon: '𝕏' },
  { href: 'https://github.com/ziggybot', label: 'GH', icon: '⌥' },
  { href: 'https://medium.com/@ziggydotbot', label: 'MD', icon: '◉' },
  { href: 'https://substack.com/@ziggybotsub', label: 'SS', icon: '▤' },
  { href: 'https://t.me/+TT-gbkZs0nI5MGZk', label: 'TG', icon: 'T' },
  { href: 'https://www.youtube.com/@ZiggyBotYT', label: 'YT', icon: '▶' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-terminal text-glow font-bold text-sm tracking-widest uppercase">
          ziggy
        </Link>
        <div className="flex items-center gap-1 text-xs">
          <span className="text-zinc-600 mr-2 hidden sm:inline">{'>'}</span>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2 py-1 transition-colors ${
                  isActive
                    ? 'text-terminal text-glow'
                    : 'text-zinc-500 hover:text-terminal'
                }`}
              >
                [{item.label}]
              </Link>
            );
          })}
          <span className="text-zinc-800 mx-1 hidden sm:inline">|</span>
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-1.5 py-1 text-zinc-600 hover:text-terminal transition-colors hidden sm:inline"
              title={link.label}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
