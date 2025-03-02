import SplashCursor from '@/components/reactbits/Animations/SplashCursor/SplashCursor';
import { ParticlesBackground } from '@/components/ParticlesBackground';

export function Background() {
  return (
    <>
      {/* Background patterns to accentuate the blur effect */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-color-1/20 via-color-3/20 to-color-2/20" />

        {/* Geometric patterns */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[5%] left-[15%] w-[20vw] h-[20vw] rounded-full bg-color-1/30" />
          <div className="absolute bottom-[10%] right-[5%] w-[15vw] h-[15vw] rounded-full bg-color-3/30" />
          <div className="absolute top-[35%] right-[25%] w-[10vw] h-[10vw] rounded-full bg-color-2/30" />
          <div className="absolute bottom-[30%] left-[25%] w-[5vw] h-[5vw] rounded-full bg-color-4/30" />
        </div>
      </div>

      {/* Blur effect */}
      <div className="fixed inset-0 -z-10 backdrop-blur-[25px] bg-background/40 dark:bg-background/80">
        {/* Reflections on the glass */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/10 to-transparent dark:from-white/0" />
      </div>

      {/* Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ParticlesBackground/>
      </div>

      {/* Splash cursor */}
      <SplashCursor TRANSPARENT />
    </>
  );
}
