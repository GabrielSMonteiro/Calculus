import React from 'react';
import './MathChalkboardHeader.css';

interface MathChalkboardHeaderProps {
  variant?: 'login' | 'signup' | 'compact';
  showMascot?: boolean;
}

export const MathChalkboardHeader: React.FC<MathChalkboardHeaderProps> = ({
  variant = 'login',
  showMascot = false
}) => {
  return (
    <div className={`chalkboard-container ${variant}`}>
      {/* Status Bar Mobile */}
      <div className="mobile-status-bar light">
        <span className="status-time">9:41</span>
        <div className="status-icons">
          <svg width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="7.5" width="2.5" height="3" rx="0.5" fill="currentColor"/>
            <rect x="4.5" y="5.5" width="2.5" height="5" rx="0.5" fill="currentColor"/>
            <rect x="8.5" y="3.5" width="2.5" height="7" rx="0.5" fill="currentColor"/>
            <rect x="12.5" y="0.5" width="2.5" height="10" rx="0.5" fill="currentColor"/>
          </svg>
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 10.5C8.05228 10.5 8.5 10.0523 8.5 9.5C8.5 8.94772 8.05228 8.5 7.5 8.5C6.94772 8.5 6.5 8.94772 6.5 9.5C6.5 10.0523 6.94772 10.5 7.5 10.5Z" fill="currentColor"/>
            <path d="M4.3 6.8C5.2 6.1 6.3 5.7 7.5 5.7C8.7 5.7 9.8 6.1 10.7 6.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M2.1 4.2C3.6 3.1 5.5 2.5 7.5 2.5C9.5 2.5 11.4 3.1 12.9 4.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M0.5 1.8C2.5 0.6 4.9 0 7.5 0C10.1 0 12.5 0.6 14.5 1.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <svg width="24" height="11" viewBox="0 0 24 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="20" height="10" rx="3" stroke="currentColor"/>
            <rect x="2" y="2" width="15" height="7" rx="1.5" fill="currentColor"/>
            <path d="M22 3.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Chalkboard math sketches & formulas overlay */}
      <svg className="chalkboard-math-svg" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.22" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round">
          {/* Integral and Limit */}
          <path d="M 30 60 C 25 35 45 35 40 15" strokeWidth="1.8" fill="none" />
          <text x="48" y="42" fill="#FFFFFF" fontSize="13" fontFamily="serif" stroke="none">f(x) dx = F(b) - F(a)</text>
          
          <text x="240" y="32" fill="#FFFFFF" fontSize="12" fontFamily="serif" stroke="none">lim x→0 [sin(x)/x] = 1</text>
          
          {/* Derivative formula */}
          <text x="35" y="95" fill="#FFFFFF" fontSize="14" fontFamily="serif" stroke="none">dy/dx = f'(x)</text>
          <text x="170" y="85" fill="#FFFFFF" fontSize="12" fontFamily="serif" stroke="none">(u·v)' = u'v + uv'</text>

          {/* Coordinate axes with tangent curve */}
          <path d="M 280 130 L 370 130" />
          <path d="M 300 150 L 300 65" />
          <path d="M 290 125 Q 320 120 355 75" strokeWidth="1.5" />
          <path d="M 310 135 L 350 70" strokeDasharray="3 3" />

          {/* Sigma sum & Epsilon-Delta */}
          <text x="40" y="145" fill="#FFFFFF" fontSize="14" fontFamily="serif" stroke="none">∑ n=1..∞ xⁿ/n!</text>
          <text x="180" y="130" fill="#FFFFFF" fontSize="11" fontFamily="serif" stroke="none">|f(x) - L| &lt; ε</text>

          {/* Triangle with angle theta */}
          <path d="M 190 180 L 245 180 L 245 140 Z" />
          <path d="M 205 180 A 15 15 0 0 0 200 172" />
          <text x="207" y="174" fill="#FFFFFF" fontSize="9" fontFamily="serif" stroke="none">θ</text>

          {/* Golden ratio / Pi */}
          <text x="45" y="195" fill="#FFFFFF" fontSize="13" fontFamily="serif" stroke="none">π ≈ 3.14159...   e ≈ 2.718</text>
          <text x="280" y="175" fill="#FFFFFF" fontSize="11" fontFamily="serif" stroke="none">∫ xⁿ dx = xⁿ⁺¹/(n+1)</text>
        </g>
      </svg>

      {/* Limia Mascot if requested */}
      {showMascot && (
        <div className="chalkboard-mascot-wrapper">
          <img
            src="/limia.png"
            alt="Limia Mascote"
            className="chalkboard-mascot-img"
          />
        </div>
      )}

      {/* SVG S-Curve transition matching Figma design */}
      <div className="chalkboard-wave">
        <svg viewBox="0 0 400 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          {variant === 'login' ? (
            <path
              d="M 0 0 C 130 50 250 65 400 20 L 400 60 L 0 60 Z"
              fill="#FAF5EE"
            />
          ) : (
            <path
              d="M 0 20 C 150 60 270 50 400 0 L 400 60 L 0 60 Z"
              fill="#FAF5EE"
            />
          )}
        </svg>
      </div>
    </div>
  );
};

export default MathChalkboardHeader;
