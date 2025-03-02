'use client';

import { useEffect, createContext, useContext, useState } from 'react';

const ParticlesContext = createContext<
  | {
      key: number;
      setKey: (key: number) => void;
      particlesColor: string;
      setParticlesColor: (color: string) => void;
      themeColor: string;
      setThemeColor: (color: string) => void;
      particleCount: number;
      setParticleCount: (count: number) => void;
      particleSpread: number;
      setParticleSpread: (spread: number) => void;
      speed: number;
      setSpeed: (speed: number) => void;
      particleBaseSize: number;
      setParticleBaseSize: (size: number) => void;
      moveParticlesOnHover: boolean;
      setMoveParticlesOnHover: (move: boolean) => void;
      alphaParticles: boolean;
      setAlphaParticles: (alpha: boolean) => void;
      disableRotation: boolean;
      setDisableRotation: (disable: boolean) => void;
      cameraDistance: number;
      setCameraDistance: (distance: number) => void;
      sizeRandomness: number;
      setSizeRandomness: (sizeRandomness: number) => void;
      particleHoverFactor: number;
      setParticleHoverFactor: (particleHoverFactor: number) => void;
    }
  | undefined
>(undefined);

export function ParticlesProvider({ children }: { children: React.ReactNode }) {
  const [key, setKey] = useState(0);
  const [themeColor, setThemeColor] = useState<string>('');
  const [particlesColor, setParticlesColor] = useState<string>(''); // IMPORTANT: particlesColor has to be empty string to use themeColor as default
  const [particleCount, setParticleCount] = useState(200);
  const [particleSpread, setParticleSpread] = useState(10);
  const [speed, setSpeed] = useState(0.1);
  const [particleBaseSize, setParticleBaseSize] = useState(100);
  const [moveParticlesOnHover, setMoveParticlesOnHover] = useState(true);
  const [alphaParticles, setAlphaParticles] = useState(false);
  const [disableRotation, setDisableRotation] = useState(false);
  const [cameraDistance, setCameraDistance] = useState(20);
  const [sizeRandomness, setSizeRandomness] = useState(0);
  const [particleHoverFactor, setParticleHoverFactor] = useState(0.5);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setKey((prev) => prev + 1);
    }
  }, [
    mounted,
    particlesColor,
    themeColor,
    particleCount,
    particleSpread,
    speed,
    particleBaseSize,
    moveParticlesOnHover,
    alphaParticles,
    disableRotation,
    cameraDistance,
    sizeRandomness,
    particleHoverFactor,
  ]);

  return (
    <ParticlesContext.Provider
      value={{
        key,
        setKey,
        particlesColor,
        themeColor,
        setThemeColor,
        setParticlesColor,
        particleCount,
        setParticleCount,
        particleSpread,
        setParticleSpread,
        speed,
        setSpeed,
        particleBaseSize,
        setParticleBaseSize,
        moveParticlesOnHover,
        setMoveParticlesOnHover,
        alphaParticles,
        setAlphaParticles,
        disableRotation,
        setDisableRotation,
        cameraDistance,
        setCameraDistance,
        sizeRandomness,
        setSizeRandomness,
        particleHoverFactor,
        setParticleHoverFactor,
      }}
    >
      {children}
    </ParticlesContext.Provider>
  );
}

export function useParticles() {
  const context = useContext(ParticlesContext);
  if (context === undefined) {
    throw new Error('useParticles must be used within a ParticlesProvider');
  }
  return context;
}
