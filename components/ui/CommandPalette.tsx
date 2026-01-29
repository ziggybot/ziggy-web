'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Command {
  label: string;
  category: string;
  action: () => void;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const commands: Command[] = [
    { label: 'Home / Signal Dashboard', category: 'NAV', action: () => router.push('/') },
    { label: 'Experiments', category: 'NAV', action: () => router.push('/experiments') },
    { label: 'Dissent Log', category: 'NAV', action: () => router.push('/dissent') },
    { label: 'Death Watch', category: 'NAV', action: () => router.push('/death-watch') },
    { label: 'About / How It Works', category: 'NAV', action: () => router.push('/about') },
    { label: 'Subscribe ($4.20/mo)', category: 'ACTION', action: () => window.open('https://buy.stripe.com/dRm00caQD8rC65Z3b4gUM01', '_blank') },
    { label: 'Filter: Show REFUTED', category: 'FILTER', action: () => router.push('/experiments') },
    { label: 'Filter: Show SUPPORTED', category: 'FILTER', action: () => router.push('/experiments') },
    { label: 'Filter: Active Dissent', category: 'FILTER', action: () => router.push('/dissent') },
    { label: 'Filter: Declining Targets', category: 'FILTER', action: () => router.push('/death-watch') },
  ];

  const filtered = query
    ? commands.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery('');
        setSelectedIndex(0);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSelect = (command: Command) => {
    command.action();
    setOpen(false);
    setQuery('');
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      handleSelect(filtered[selectedIndex]);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Palette */}
      <div className="relative w-full max-w-lg mx-4 border border-zinc-700 bg-zinc-900 shadow-2xl shadow-terminal/5">
        {/* Input */}
        <div className="flex items-center border-b border-zinc-800 px-4 py-3">
          <span className="text-terminal text-sm mr-2">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
          />
          <kbd className="text-[9px] text-zinc-600 border border-zinc-700 px-1.5 py-0.5 ml-2">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-64 overflow-y-auto py-2">
          {filtered.map((command, i) => (
            <button
              key={command.label}
              onClick={() => handleSelect(command)}
              className={`w-full text-left px-4 py-2 flex items-center gap-3 text-sm transition-colors ${
                i === selectedIndex
                  ? 'bg-zinc-800 text-terminal'
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
              }`}
            >
              <span className="text-[9px] text-zinc-600 w-12 shrink-0 uppercase">{command.category}</span>
              <span>{command.label}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-zinc-600">
              No commands found.
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t border-zinc-800 px-4 py-2 flex items-center justify-between text-[9px] text-zinc-600">
          <span>navigate with ↑↓ &middot; select with ↵</span>
          <span>
            <kbd className="border border-zinc-700 px-1 py-0.5 mr-1">⌘</kbd>
            <kbd className="border border-zinc-700 px-1 py-0.5">K</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
