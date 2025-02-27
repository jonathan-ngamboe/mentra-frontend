import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split('.').reduce<unknown>((prev, curr) => {
    if (prev && typeof prev === 'object' && curr in (prev as Record<string, unknown>)) {
      return (prev as Record<string, unknown>)[curr];
    }
    return path;
  }, obj) as string;
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
