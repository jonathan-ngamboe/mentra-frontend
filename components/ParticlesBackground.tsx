'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { useParticles } from '@/contexts/ParticlesContext';
import Particles from '@/components/reactbits/Backgrounds/Particles/Particles';

export function ParticlesBackground() {
  const particlesContext = useParticles();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && resolvedTheme) {
      if (!particlesContext.particlesColor) {
        const themeBasedColor = resolvedTheme === 'dark' ? '#ffffff' : '#000000';
        particlesContext.setThemeColor(themeBasedColor);
      }
    }
  }, [resolvedTheme, mounted, particlesContext]);

  if (!mounted) return null;

  return particlesContext.showParticles ? (
    <div className="absolute inset-0 pointer-events-none">
      <Particles
        key={particlesContext.key} // Use the key to force the remount
        particleColors={[particlesContext.particlesColor || particlesContext.themeColor]}
        particleCount={particlesContext.particleCount}
        particleSpread={particlesContext.particleSpread}
        speed={particlesContext.speed}
        particleBaseSize={particlesContext.particleBaseSize}
        moveParticlesOnHover={particlesContext.moveParticlesOnHover}
        alphaParticles={particlesContext.alphaParticles}
        disableRotation={particlesContext.disableRotation}
        cameraDistance={particlesContext.cameraDistance}
        sizeRandomness={particlesContext.sizeRandomness}
        particleHoverFactor={particlesContext.particleHoverFactor}
      />
    </div>
  ) : null;
}
