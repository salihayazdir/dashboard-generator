import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isJsonString(str: string) {
  try {
    const parsed = JSON.parse(str);
    if (typeof parsed !== 'object') throw '';
  } catch (e) {
    return false;
  }
  return true;
}
