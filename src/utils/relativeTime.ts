/**
 * This utility function takes a JavaScript Date object and returns a human-readable
 * "relative time" string (e.g., "2 hours ago", "5 days ago", "Just now").
 * This is commonly used in social apps like StackOverflow to show when something was posted.
 *
 * @param date The Date object to be converted.
 * @returns A string representing how much time has passed since the given date.
 */
export default function convertDateToRelativeTime(date: Date) {
  // If the provided date is not valid, return an empty string
  if (date.toString().toLowerCase() === "invalid date") return "";

  const now = new Date(); // Current time
  const timeDifferenceInMiliSeconds = now.getTime() - date.getTime(); // Difference in milliseconds

  // Calculate seconds passed
  const seconds = Math.floor(timeDifferenceInMiliSeconds / 1000);
  if (seconds < 10) {
    return `Just now`;
  }
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  }

  // Calculate minutes passed
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }

  // Calculate hours passed
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  // Calculate days passed
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }

  // Calculate months passed (using 30.44 days as an average month length)
  const months = Math.floor(days / 30.44);
  if (months < 12) {
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  }

  // Calculate years passed
  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}
