'use client';

import Particles from '@/components/reactbits/Backgrounds/Particles/Particles';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

type ParticlesBackgroundProps = {
  color?: string;
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleBaseSize?: number;
  moveParticlesOnHover?: boolean;
  alphaParticles?: boolean;
  disableRotation?: boolean;
  cameraDistance?: number;
};

export function ParticlesBackground({
  color = '',
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleBaseSize = 100,
  moveParticlesOnHover = true,
  alphaParticles = false,
  disableRotation = false,
  cameraDistance = 20,
}: ParticlesBackgroundProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [particlesColor, setParticlesColor] = useState<string>('#cccccc');
  const [key, setKey] = useState(0); // Key to force the remount

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (color) {
        setParticlesColor(color);
      } else if (resolvedTheme) {
        setParticlesColor(resolvedTheme === 'dark' ? '#ffffff' : '#000000');
      }
      setKey((prev) => prev + 1); // Increment the key to force the remount
    }
  }, [resolvedTheme, mounted, color]);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-auto">
      <Particles
        key={key} // Use the key to force the remount
        particleColors={[particlesColor, particlesColor]}
        particleCount={particleCount}
        particleSpread={particleSpread}
        speed={speed}
        particleBaseSize={particleBaseSize}
        moveParticlesOnHover={moveParticlesOnHover}
        alphaParticles={alphaParticles}
        disableRotation={disableRotation}
        cameraDistance={cameraDistance}
      />
    </div>
  );
}
