import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Dictionary } from '@/types/dictionary';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDictionaryValue(dictionary: Dictionary, path: string): string {
  return path.split('.').reduce<unknown>((prev, curr) => {
    if (prev && typeof prev === 'object' && curr in prev) {
      return (prev as any)[curr];
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
