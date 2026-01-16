/**
 * This component provides a pagination UI to navigate through multiple pages of data.
 * It uses URL search parameters (?page=X) to maintain the current page state,
 * making it SEO-friendly and bookmarkable.
 */

"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const Pagination = ({
  className,
  total, // The total number of items across all pages
  limit, // How many items are shown per page
}: {
  className?: string;
  limit: number;
  total: number;
}) => {
  // --- Next.js Hooks ---
  const searchParams = useSearchParams(); // To read the current URL parameters
  const router = useRouter(); // To navigate to new URLs
  const pathnanme = usePathname(); // To get the current path (e.g., /questions)

  const page = searchParams.get("page") || "1"; // Get current page from URL, default to 1
  const totalPages = Math.ceil(total / limit); // Calculate total number of pages

  /**
   * Navigates to the previous page.
   */
  const prev = () => {
    if (page <= "1") return; // Can't go below page 1
    const pageNumber = parseInt(page);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", `${pageNumber - 1}`);
    router.push(`${pathnanme}?${newSearchParams}`); // Update the URL
  };

  /**
   * Navigates to the next page.
   */
  const next = () => {
    if (page >= `${totalPages}`) return; // Can't go beyond the last page
    const pageNumber = parseInt(page);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", `${pageNumber + 1}`);
    router.push(`${pathnanme}?${newSearchParams}`); // Update the URL
  };

  return (
    <div className="flex items-center justify-center gap-4">
      {/* Previous Button */}
      <button
        className={`${className} rounded-lg bg-white/10 px-2 py-0.5 duration-200 hover:bg-white/20`}
        onClick={prev}
        disabled={page <= "1"}
      >
        Previous
      </button>

      {/* Page Indicator */}
      <span>
        {page} of {totalPages || "1"}{" "}
        {/* Show "1 of 1" if there are no items */}
      </span>

      {/* Next Button */}
      <button
        className={`${className} rounded-lg bg-white/10 px-2 py-0.5 duration-200 hover:bg-white/20`}
        onClick={next}
        disabled={page >= `${totalPages}`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
