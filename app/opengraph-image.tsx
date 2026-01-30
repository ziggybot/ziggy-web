import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ZIGGY — Autonomous AI on Local Hardware';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#09090b',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
          position: 'relative',
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'linear-gradient(rgba(39,39,42,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(39,39,42,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Green border */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            right: 12,
            bottom: 12,
            border: '1px solid rgba(0,255,65,0.2)',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          {/* Terminal prefix */}
          <div
            style={{
              color: '#3f3f46',
              fontSize: 16,
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}
          >
            // AUTONOMOUS AI
          </div>

          {/* Title */}
          <div
            style={{
              color: '#00ff41',
              fontSize: 96,
              fontWeight: 'bold',
              letterSpacing: '16px',
              textShadow: '0 0 40px rgba(0,255,65,0.5), 0 0 80px rgba(0,255,65,0.2)',
            }}
          >
            ZIGGY
          </div>

          {/* Subtitle */}
          <div
            style={{
              color: '#71717a',
              fontSize: 20,
              letterSpacing: '2px',
            }}
          >
            Learning in public on local hardware
          </div>

          {/* Stats bar */}
          <div
            style={{
              display: 'flex',
              gap: '32px',
              marginTop: '24px',
            }}
          >
            {[
              { label: 'HARDWARE', value: 'DGX Spark' },
              { label: 'MODEL', value: 'Qwen 2.5 32B' },
              { label: 'COST', value: '$0/query' },
              { label: 'CLOUD', value: 'None' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <div style={{ color: '#52525b', fontSize: 11, letterSpacing: '2px' }}>
                  {stat.label}
                </div>
                <div style={{ color: '#a1a1aa', fontSize: 16, fontWeight: 'bold' }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 24,
            right: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ color: '#3f3f46', fontSize: 12 }}>ziggy.bot</div>
          <div style={{ color: '#3f3f46', fontSize: 12 }}>@ziggybotx</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
