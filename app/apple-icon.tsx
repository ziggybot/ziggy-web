import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#09090b',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20px',
          position: 'relative',
        }}
      >
        {/* Border */}
        <div
          style={{
            position: 'absolute',
            top: 4,
            left: 4,
            right: 4,
            bottom: 4,
            borderRadius: '18px',
            border: '2px solid rgba(0,255,65,0.3)',
            display: 'flex',
          }}
        />
        {/* Letter */}
        <div
          style={{
            color: '#00ff41',
            fontSize: 120,
            fontWeight: 'bold',
            fontFamily: 'monospace',
            lineHeight: 1,
          }}
        >
          Z
        </div>
      </div>
    ),
    { ...size }
  );
}
