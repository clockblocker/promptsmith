import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using clsx and tailwind-merge to handle Tailwind CSS conflicts.
 * @param inputs - Class values (strings, arrays, objects) to merge.
 * @returns A single merged class name string.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Converts a string to a URL-safe slug (lowercase, alphanumeric, hyphens).
 * @param text - The string to slugify.
 * @returns The slugified string.
 */
export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}
