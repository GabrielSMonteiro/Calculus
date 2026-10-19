import React, { useState, useEffect } from 'react';
import './MobileDeviceFrame.css';

interface MobileDeviceFrameProps {
  children: React.ReactNode;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({ children }) => {
  const [isPhoneMode, setIsPhoneMode] = useState<boolean>(() => {
    // Default to true on desktop if window > 768px, false on mobile
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('beege_phone_frame_mode');
      if (saved !== null) return saved === 'true';
      return window.innerWidth > 600;
    }
    return true;
  });

  const [currentTime, setCurrentTime] = useState('9:41');

  useEffect(() => {
    localStorage.setItem('beege_phone_frame_mode', String(isPhoneMode));
  }, [isPhoneMode]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${h}:${m}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`app-device-wrapper ${isPhoneMode ? 'frame-enabled' : 'frame-disabled'}`}>
      {/* Desktop Background & Controls */}
      {isPhoneMode && (
        <div className="desktop-backdrop-hint">
          <div className="desktop-brand-tag">
            <span className="brand-dot" /> BeeGe Mobile • Cálculo 1 (Multi-Universidade)
          </div>
        </div>
      )}

      {/* Floating Viewport Switcher for Desktop Testing */}
      <button
        className="mobile-frame-toggle-btn"
        onClick={() => setIsPhoneMode(!isPhoneMode)}
        title="Alternar entre visualização de Smartphone e Tela Cheia"
      >
        {isPhoneMode ? '🖥️ Ver Tela Cheia' : '📱 Ver Modo Celular'}
      </button>

      {/* Phone Shell */}
      <div className={`phone-mockup-container ${isPhoneMode ? 'is-phone' : 'is-full'}`}>
        {isPhoneMode && (
          <>
            {/* Dynamic Island / Speaker */}
            <div className="phone-dynamic-island">
              <div className="phone-camera-lens" />
              <div className="phone-sensor" />
            </div>

            {/* Hardware Side Buttons */}
            <div className="phone-button-mute" />
            <div className="phone-button-volume-up" />
            <div className="phone-button-volume-down" />
            <div className="phone-button-power" />
          </>
        )}

        {/* Screen Content Wrapper */}
        <div className="phone-screen-viewport">
          {children}

          {/* Bottom Home Indicator on Phone Mode */}
          {isPhoneMode && (
            <div className="phone-home-indicator-bar" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileDeviceFrame;
