import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines dynamic class names and cleanly resolves Tailwind conflicts
 * at runtime using a memory-efficient merger.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}