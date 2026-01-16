/**
 * This file contains utility functions that are used throughout the UI components.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * The 'cn' (class name) utility function is used to combine and merge Tailwind CSS classes.
 * It uses 'clsx' to handle conditional classes and 'twMerge' to resolve Tailwind conflicts
 * (e.g., if you pass both 'p-2' and 'p-4', 'twMerge' ensures the correct one is applied).
 *
 * @param inputs - A list of class names or conditional class objects.
 * @returns A single string of merged CSS classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
