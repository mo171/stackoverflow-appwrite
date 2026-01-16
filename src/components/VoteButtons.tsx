/**
 * This component handles voting (upvote/downvote) for both Questions and Answers.
 * it manages the visual state of buttons and the total score.
 */

"use client";

import { databases } from "@/models/client/config";
import { db, voteCollection } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import { IconCaretUpFilled, IconCaretDownFilled } from "@tabler/icons-react";
import { ID, Models, Query } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";

const VoteButtons = ({
  type, // "question" or "answer"
  id, // The ID of the item being voted on
  upvotes, // Initial list of upvotes from the server
  downvotes, // Initial list of downvotes from the server
  className,
}: {
  type: "question" | "answer";
  id: string;
  upvotes: Models.DocumentList<Models.Document>;
  downvotes: Models.DocumentList<Models.Document>;
  className?: string;
}) => {
  // --- State Hooks ---
  const [votedDocument, setVotedDocument] =
    React.useState<Models.Document | null>(); // The specific vote document for the current user (if any)
  const [voteResult, setVoteResult] = React.useState<number>(
    upvotes.total - downvotes.total
  ); // The calculated score

  const { user } = useAuthStore();
  const router = useRouter();

  /**
   * When the component loads (or user changes), we check if the current user
   * has already voted on this specific item.
   * We use Appwrite's Query system to find a match in the 'votes' collection.
   */
  React.useEffect(() => {
    (async () => {
      if (user) {
        const response = await databases.listDocuments(db, voteCollection, [
          Query.equal("type", type),
          Query.equal("typeId", id),
          Query.equal("votedById", user.$id),
        ]);
        // If a document is found, it means the user has already voted
        setVotedDocument(() => response.documents[0] || null);
      }
    })();
  }, [user, id, type]);

  /**
   * Toggles an upvote.
   * Hits the /api/vote endpoint which handles the complex logic
   * (creating, deleting, or switching votes).
   */
  const toggleUpvote = async () => {
    if (!user) return router.push("/login"); // Must be logged in to vote

    if (votedDocument === undefined) return; // Prevent clicking before we know the user's vote status

    try {
      const response = await fetch(`/api/vote`, {
        method: "POST",
        body: JSON.stringify({
          votedById: user.$id,
          voteStatus: "upvoted",
          type,
          typeId: id,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw data;

      // Update local state with the results from the server
      setVoteResult(() => data.data.voteResult);
      setVotedDocument(() => data.data.document);
    } catch (error: any) {
      window.alert(error?.message || "Something went wrong");
    }
  };

  /**
   * Toggles a downvote. Symmetric to toggleUpvote.
   */
  const toggleDownvote = async () => {
    if (!user) return router.push("/login");

    if (votedDocument === undefined) return;

    try {
      const response = await fetch(`/api/vote`, {
        method: "POST",
        body: JSON.stringify({
          votedById: user.$id,
          voteStatus: "downvoted",
          type,
          typeId: id,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw data;

      setVoteResult(() => data.data.voteResult);
      setVotedDocument(() => data.data.document);
    } catch (error: any) {
      window.alert(error?.message || "Something went wrong");
    }
  };

  return (
    <div
      className={cn(
        "flex shrink-0 flex-col items-center justify-start gap-y-4",
        className
      )}
    >
      {/* Upvote Button */}
      <button
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
          votedDocument && votedDocument.voteStatus === "upvoted"
            ? "border-orange-500 text-orange-500" // Highlight if upvoted
            : "border-white/30"
        )}
        onClick={toggleUpvote}
      >
        <IconCaretUpFilled />
      </button>

      {/* Total Vote Score */}
      <span>{voteResult}</span>

      {/* Downvote Button */}
      <button
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
          votedDocument && votedDocument.voteStatus === "downvoted"
            ? "border-orange-500 text-orange-500" // Highlight if downvoted
            : "border-white/30"
        )}
        onClick={toggleDownvote}
      >
        <IconCaretDownFilled />
      </button>
    </div>
  );
};

export default VoteButtons;
