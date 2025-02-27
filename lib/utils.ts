import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNestedValue(obj: any, path: string): string {
  return path.split(".").reduce((prev, curr) => {
    return prev && prev[curr] ? prev[curr] : path;
  }, obj);
}
