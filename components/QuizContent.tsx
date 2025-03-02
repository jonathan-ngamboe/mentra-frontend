'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export function QuizContent() {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);
  return null;
}
