/**
 * This component provides a Rich Text Editor (RTE) for Markdown.
 * It uses the '@uiw/react-md-editor' library.
 */

"use client";

import dynamic from "next/dynamic";
import Editor from "@uiw/react-md-editor";

/**
 * We use Next.js 'dynamic' import with { ssr: false } for the editor.
 * Why? Because the editor relies on browser-only features (like 'document' or 'window').
 * If we try to render it on the server, it will throw an error.
 * This ensures it only loads on the client side.
 */
const RTE = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default;
    }),
  { ssr: false }
);

/**
 * Export a preview component to display Markdown content without editing.
 */
export const MarkdownPreview = Editor.Markdown;

export default RTE;
