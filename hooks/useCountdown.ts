import { useState, useEffect } from "react";

interface UseCountdownProps {
  initialCount: number;
  onComplete?: () => void;
  start?: boolean;
}

export function useCountdown({
  initialCount,
  onComplete,
  start = true,
}: UseCountdownProps) {
  const [countdown, setCountdown] = useState(initialCount);
  const [isComplete, setIsComplete] = useState(false);

  const reset = () => {
    setCountdown(initialCount);
    setIsComplete(false);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (start && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsComplete(true);
      onComplete?.();
    }

    return () => clearInterval(timer);
  }, [start, countdown, onComplete]);

  return {
    countdown,
    isComplete,
    reset,
  };
}
