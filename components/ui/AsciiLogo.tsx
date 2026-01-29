'use client';

const ASCII_ART = `
 ███████╗██╗ ██████╗  ██████╗██╗   ██╗
 ╚══███╔╝██║██╔════╝ ██╔════╝╚██╗ ██╔╝
   ███╔╝ ██║██║  ███╗██║  ███╗╚████╔╝
  ███╔╝  ██║██║   ██║██║   ██║ ╚██╔╝
 ███████╗██║╚██████╔╝╚██████╔╝  ██║
 ╚══════╝╚═╝ ╚═════╝  ╚═════╝   ╚═╝
`.trim();

export default function AsciiLogo({ className = '' }: { className?: string }) {
  return (
    <pre className={`text-terminal text-glow select-none leading-tight ${className}`}>
      {ASCII_ART}
    </pre>
  );
}
