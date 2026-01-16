/**
 * This component displays the list of answers for a specific question.
 * It also allows logged-in users to post new answers, delete their own answers,
 * and allows the question author to mark an answer as "solved" (best answer).
 */

"use client";

import { ID, Models } from "appwrite";
import React from "react";
import VoteButtons from "./VoteButtons";
import { useAuthStore } from "@/store/Auth";
import { avatars, databases } from "@/models/client/config";
import { cn } from "@/lib/utils";
import { answerCollection, db } from "@/models/name";
import RTE, { MarkdownPreview } from "./RTE";
import Comments from "./Comments";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { IconTrash, IconCheck } from "@tabler/icons-react";

const Answers = ({
  answers: _answers, // The initial list of answers from the server
  questionId, // The ID of the question these answers belong to
  bestAnswerId: _bestAnswerId, // The ID of the current best answer (if any)
  authorId: questionAuthorId, // The ID of the user who asked the question
}: {
  answers: Models.DocumentList<Models.Document>;
  questionId: string;
  bestAnswerId?: string;
  authorId: string;
}) => {
  // --- State Hooks ---
  const [answers, setAnswers] = React.useState(_answers); // Local state for the list of answers
  const [newAnswer, setNewAnswer] = React.useState(""); // Content for the new answer being typed
  const [bestAnswerId, setBestAnswerId] = React.useState(_bestAnswerId); // Current best answer ID
  const { user } = useAuthStore(); // Current logged-in user from the global store

  /**
   * Marks a specific answer as the "best" answer for the question.
   * Only the question author can trigger this via the UI.
   *
   * @param answerId - The ID of the answer to mark as solved.
   */
  const handleSolve = async (answerId: string) => {
    try {
      const response = await fetch("/api/answer/solve", {
        method: "POST",
        body: JSON.stringify({
          questionId: questionId,
          answerId: answerId,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw data;

      setBestAnswerId(() => answerId);
    } catch (error: any) {
      window.alert(error?.message || "Error marking answer as solved");
    }
  };

  /**
   * Submits a new answer to the server.
   *
   * @param e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newAnswer || !user) return; // Don't submit if empty or if user is not logged in

    try {
      const response = await fetch("/api/answer", {
        method: "POST",
        body: JSON.stringify({
          questionId: questionId,
          answer: newAnswer,
          authorId: user.$id,
        }),
      });

      const data = await response.json(); // The new answer document from the server

      if (!response.ok) throw data;

      // Reset the editor and update the local list of answers
      setNewAnswer(() => "");
      setAnswers((prev) => ({
        total: prev.total + 1,
        documents: [
          {
            ...data,
            author: user, // Manually attach the author object for immediate display
            upvotesDocuments: { documents: [], total: 0 },
            downvotesDocuments: { documents: [], total: 0 },
            comments: { documents: [], total: 0 },
          },
          ...prev.documents,
        ],
      }));
    } catch (error: any) {
      window.alert(error?.message || "Error creating answer");
    }
  };

  /**
   * Deletes an answer from the server.
   *
   * @param answerId - The ID of the answer to delete.
   */
  const deleteAnswer = async (answerId: string) => {
    try {
      const response = await fetch("/api/answer", {
        method: "DELETE",
        body: JSON.stringify({
          answerId: answerId,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw data;

      // Remove the deleted answer from the local state
      setAnswers((prev) => ({
        total: prev.total - 1,
        documents: prev.documents.filter((answer) => answer.$id !== answerId),
      }));
    } catch (error: any) {
      window.alert(error?.message || "Error deleting answer");
    }
  };

  return (
    <>
      <h2 className="mb-4 text-xl">{answers.total} Answers</h2>
      {answers.documents.map((answer) => (
        <div
          key={answer.$id}
          className={cn(
            "flex gap-4 p-4 rounded-xl transition-all duration-300",
            bestAnswerId === answer.$id
              ? "bg-orange-50/50 border border-orange-200" // Highlight the best answer
              : ""
          )}
        >
          {/* Left Side: Vote Buttons and Action Icons */}
          <div className="flex shrink-0 flex-col items-center gap-4">
            <VoteButtons
              type="answer"
              id={answer.$id}
              upvotes={answer.upvotesDocuments}
              downvotes={answer.downvotesDocuments}
            />

            {/* Show Trash Icon if the user is the author of this answer */}
            {user?.$id === answer.authorId ? (
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500 p-1 text-red-500 duration-200 hover:bg-red-500/10"
                onClick={() => deleteAnswer(answer.$id)}
              >
                <IconTrash className="h-4 w-4" />
              </button>
            ) : null}

            {/* Show Solve Icon if the user is the author of the question and this isn't solved yet */}
            {user?.$id === questionAuthorId && bestAnswerId !== answer.$id ? (
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full border border-green-500 p-1 text-green-500 duration-200 hover:bg-green-500/10"
                onClick={() => handleSolve(answer.$id)}
                title="Mark as best answer"
              >
                <IconCheck className="h-4 w-4" />
              </button>
            ) : null}

            {/* Show Green Check if this is the best answer */}
            {bestAnswerId === answer.$id ? (
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 p-1 text-white"
                title="Best Answer"
              >
                <IconCheck className="h-6 w-6" />
              </div>
            ) : null}
          </div>

          {/* Right Side: Answer Content and Metadata */}
          <div className="w-full overflow-auto">
            {/* Render the Markdown content of the answer */}
            <MarkdownPreview
              className="rounded-xl p-4"
              source={answer.content}
            />

            <div className="mt-4 flex items-center justify-end gap-1">
              {/* Author Avatar and Info */}
              <picture>
                <img
                  src={avatars.getInitials(answer.author.name, 36, 36).href}
                  alt={answer.author.name}
                  className="rounded-lg"
                />
              </picture>
              <div className="block leading-tight">
                <Link
                  href={`/users/${answer.author.$id}/${slugify(
                    answer.author.name
                  )}`}
                  className="text-orange-500 hover:text-orange-600"
                >
                  {answer.author.name}
                </Link>
                <p>
                  <strong>{answer.author.reputation}</strong>
                </p>
              </div>
            </div>

            {/* Render the Comments section for this specific answer */}
            <Comments
              comments={answer.comments}
              className="mt-4"
              type="answer"
              typeId={answer.$id}
            />
            <hr className="my-4 border-white/40" />
          </div>
        </div>
      ))}

      {/* Form to Post a New Answer */}
      <hr className="my-4 border-white/40" />
      <form onSubmit={handleSubmit} className="space-y-2">
        <h2 className="mb-4 text-xl">Your Answer</h2>
        <RTE
          value={newAnswer}
          onChange={(value) => setNewAnswer(() => value || "")}
        />
        <button className="shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600">
          Post Your Answer
        </button>
      </form>
    </>
  );
};

export default Answers;
