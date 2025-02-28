import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Dictionary } from '@/types/dictionary';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDictionaryValue(dictionary: Dictionary, path: string): string {
  return path.split('.').reduce<unknown>((prev, curr) => {
    if (prev && typeof prev === 'object' && curr in prev) {
      return (prev as Record<string, unknown>)[curr];
    }
    return path;
  }, dictionary) as string;
}

export const isExternalUrl = (url: string): boolean => {
  if (url.startsWith('/')) return false;
  if (!url.includes('://') && !url.startsWith('//')) return false;

  try {
    const urlObj = new URL(url, window.location.origin);
    return urlObj.hostname !== window.location.hostname;
  } catch {
    return false;
  }
};

/**
 * Generate a random vibrant color
 * @returns Hexadecimal color
 */
export function getRandomVibrantColor(): string {
  // Generate a random hue (0-360)
  const hue = Math.floor(Math.random() * 360);
  
  // High saturation (80-100%)
  const saturation = Math.floor(Math.random() * 20) + 80;
  
  // Medium to high lightness (50-70%)
  const lightness = Math.floor(Math.random() * 20) + 50;
  
  // Convert HSL to hexadecimal
  return hslToHex(hue, saturation, lightness);
}

/**
 * Convert an HSL color to hexadecimal
 * @param h Tint (0-360)
 * @param s Saturation (0-100)
 * @param l Lightness (0-100)
 * @returns Hexadecimal color
 */
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  
  let r, g, b;
  
  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }
  
  // Convert to hex
  const toHex = (value: number) => {
    const hex = Math.round((value + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
