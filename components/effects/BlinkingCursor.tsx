export default function BlinkingCursor({ className = '' }: { className?: string }) {
  return (
    <span className={`cursor-blink inline-block w-2.5 h-5 bg-terminal ml-1 align-middle ${className}`} />
  );
}
