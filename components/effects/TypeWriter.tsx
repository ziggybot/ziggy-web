'use client';

import { useState, useEffect } from 'react';

interface TypeWriterProps {
  lines: string[];
  speed?: number;
  lineDelay?: number;
  onComplete?: () => void;
  className?: string;
  cursorColor?: string;
}

export default function TypeWriter({
  lines,
  speed = 30,
  lineDelay = 200,
  onComplete,
  className = '',
  cursorColor = 'bg-terminal',
}: TypeWriterProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (currentLine >= lines.length) {
      setDone(true);
      onComplete?.();
      return;
    }

    if (currentChar === 0 && currentLine > 0) {
      const timeout = setTimeout(() => {
        setCurrentChar(1);
      }, lineDelay);
      return () => clearTimeout(timeout);
    }

    if (currentChar <= lines[currentLine].length) {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const updated = [...prev];
          updated[currentLine] = lines[currentLine].slice(0, currentChar);
          return updated;
        });
        setCurrentChar((c) => c + 1);
      }, speed + Math.random() * 20);
      return () => clearTimeout(timeout);
    } else {
      setCurrentLine((l) => l + 1);
      setCurrentChar(0);
    }
  }, [currentLine, currentChar, lines, speed, lineDelay, onComplete]);

  return (
    <div className={`font-mono ${className}`}>
      {displayedLines.map((line, i) => (
        <div key={i} className="whitespace-pre">
          {line}
          {i === currentLine && !done && (
            <span className={`cursor-blink inline-block w-2 h-4 ${cursorColor} ml-0.5 align-middle`} />
          )}
        </div>
      ))}
      {!done && displayedLines.length === 0 && (
        <span className={`cursor-blink inline-block w-2 h-4 ${cursorColor} align-middle`} />
      )}
    </div>
  );
}
