import React from 'react';
import uokLogoImg from '../../assets/uok_logo.png';

export const KelaniyaLogo = ({ size = 42, showText = true, lightMode = false }) => {
  return (
    <div className="uok-brand-logo-wrap">
      {/* Official University of Kelaniya Circular Crest */}
      <img
        src={uokLogoImg}
        alt="University of Kelaniya Official Crest"
        className="uok-brand-crest"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      />

      {showText && (
        <div className="uok-brand-text-block">
          <span className={`uok-brand-title ${lightMode ? 'uok-light' : ''}`}>
            UNIVERSITY OF KELANIYA
          </span>
          <span className={`uok-brand-subtitle ${lightMode ? 'uok-light' : ''}`}>
            Tutoring Support Center
          </span>
        </div>
      )}
    </div>
  );
};

export default KelaniyaLogo;
