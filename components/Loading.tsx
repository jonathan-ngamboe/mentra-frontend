export function Loading({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[120px] w-full gap-3">
      <div className="relative">
        {/* Spinner*/}
        <div
          className="w-10 h-10 rounded-full border-3 border-transparent animate-spin
                        [border-image:linear-gradient(45deg,#6366f1,#a855f7,#ec4899)_1]
                        shadow-sm"
        ></div>

        {/* Pulse effect */}
        <div
          className="absolute inset-0 w-10 h-10 rounded-full animate-[pulse_2s_ease-in-out_infinite] 
                        bg-gradient-to-r from-indigo-500/10 via-purple-500/15 to-pink-500/10"
        ></div>
      </div>

      {/* Text */}
      <p className="text-sm bg-clip-text text-transparent bg-gradient-to-r from-indigo-500/70 to-pink-500/70 animate-[pulse_2s_ease-in-out_infinite]">
        {text}
      </p>
    </div>
  );
}
