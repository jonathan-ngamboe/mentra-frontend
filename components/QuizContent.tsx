'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function QuizContent() {
  const { setTheme } = useTheme();
  const [themeSet, setThemeSet] = useState(false);

  useEffect(() => {
    if (!themeSet) {
      setTheme('dark');
      setThemeSet(true);
    }
  }, [setTheme, themeSet]);

  return null;
}
