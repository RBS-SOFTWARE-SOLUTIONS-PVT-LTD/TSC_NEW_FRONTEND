import React from 'react';
import uokLogoImg from '../../assets/uok_logo.png';

export const KelaniyaLogo = ({ size = 44, showText = true, lightMode = false }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
      {/* Official University of Kelaniya Circular Crest */}
      <img
        src={uokLogoImg}
        alt="University of Kelaniya Official Crest"
        width={size}
        height={size}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          objectFit: 'contain',
          flexShrink: 0,
          filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.18))',
          borderRadius: '50%',
        }}
      />

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-academic)',
                fontWeight: 800,
                fontSize: size > 40 ? '1.15rem' : '0.95rem',
                color: lightMode ? '#FFFFFF' : 'var(--primary)',
                letterSpacing: '0.04em',
                lineHeight: 1.15,
              }}
            >
              UNIVERSITY OF KELANIYA
            </span>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: size > 40 ? '0.78rem' : '0.68rem',
              color: lightMode ? 'var(--secondary-light)' : 'var(--secondary-dark)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            Tutoring Support Center (TSC)
          </span>
        </div>
      )}
    </div>
  );
};

export default KelaniyaLogo;
