import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



// lib/utils.ts
export const getClientInfo = () => {
  return {
      screenResolution: typeof window !== 'undefined' 
          ? `${window.screen.width}x${window.screen.height}` 
          : undefined,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      timestamp: new Date().toISOString()
  };
};