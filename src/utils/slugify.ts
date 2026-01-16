/**
 * This utility function converts a string into a URL-friendly "slug".
 * For example: "Hello World! This is Great" becomes "hello-world-this-is-great"
 * This is useful for creating SEO-friendly URLs for questions.
 *
 * @param text The input string to be slugified.
 * @returns A cleaner, lowercase string with dashes instead of spaces.
 */
export default function slugify(text: string) {
  return text
    .toString()
    .toLowerCase() // Convert the entire string to lowercase
    .trim() // Remove whitespace from the beginning and end of the string
    .replace(/\s+/g, "-") // Replace one or more spaces with a single dash (-)
    .replace(/[^\w\-]+/g, "") // Remove all characters that are NOT words (letters/numbers) or dashes
    .replace(/\-\-+/g, "-"); // If there are multiple consecutive dashes, replace them with just one
}
