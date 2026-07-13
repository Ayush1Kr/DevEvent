import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// A standard utility function used in Next.js/Tailwind projects to conditionally merge class names
// without styling conflicts.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
