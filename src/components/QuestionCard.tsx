/**
 * This component displays a summary of a question in a card format.
 * It's used on the home page and search results to list questions.
 * It highlights the title, votes, answers, tags, and author info.
 */

"use client";

import React from "react";
import { BorderBeam } from "./magicui/border-beam";
import Link from "next/link";
import { Models } from "appwrite";
import slugify from "@/utils/slugify";
import { avatars } from "@/models/client/config";
import convertDateToRelativeTime from "@/utils/relativeTime";

const QuestionCard = ({ ques }: { ques: Models.Document }) => {
  // --- State for Animation ---
  const [height, setHeight] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  /**
   * We measure the height of the card after it's rendered.
   * This height is passed to the 'BorderBeam' animation component to ensure its path
   * matches the card's actual size.
   */
  React.useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
    }
  }, [ref]);

  return (
    <div
      ref={ref}
      className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 shadow-sm duration-200 hover:shadow-md sm:flex-row text-black"
    >
      {/* A fancy animated border effect from MagicUI */}
      <BorderBeam size={height} duration={12} delay={9} />

      {/* Stats Summary (Votes and Answers) */}
      <div className="relative shrink-0 text-sm sm:text-right text-neutral-600">
        <p>{ques.totalVotes} votes</p>
        <p>{ques.totalAnswers} answers</p>
      </div>

      {/* Main Content Area */}
      <div className="relative w-full">
        {/* Question Title with a link to the full question page */}
        <Link
          href={`/questions/${ques.$id}/${slugify(ques.title)}`}
          className="text-orange-600 duration-200 hover:text-orange-700"
        >
          <h2 className="text-xl font-semibold">{ques.title}</h2>
        </Link>

        {/* Tags and Author info */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          {/* List all tags linked to the tag search page */}
          {ques.tags.map((tag: string) => (
            <Link
              key={tag}
              href={`/questions?tag=${tag}`}
              className="inline-block rounded-lg bg-neutral-100 px-2 py-0.5 text-neutral-700 duration-200 hover:bg-neutral-200"
            >
              #{tag}
            </Link>
          ))}

          {/* Author Details Section */}
          <div className="ml-auto flex items-center gap-1 text-neutral-600">
            <picture>
              <img
                src={avatars.getInitials(ques.author.name, 24, 24).href}
                alt={ques.author.name}
                className="rounded-lg"
              />
            </picture>
            <Link
              href={`/users/${ques.author.$id}/${slugify(ques.author.name)}`}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              {ques.author.name}
            </Link>
            {/* Reputation score */}
            <strong>&quot;{ques.author.reputation}&quot;</strong>
          </div>

          {/* When it was asked */}
          <span className="text-neutral-500">
            asked {convertDateToRelativeTime(new Date(ques.$createdAt))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
