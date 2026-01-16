/**
 * This file defines the structure (schema) for the "Votes" collection in Appwrite.
 * It tracks upvotes and downvotes for both questions and answers.
 */

import { Permission } from "node-appwrite";
import { db, voteCollection } from "../name";
import { databases } from "./config";

export default async function createVoteCollection() {
  /**
   * Create the Collection.
   */
  await databases.createCollection(db, voteCollection, voteCollection, [
    Permission.create("users"),
    Permission.read("any"),
    Permission.read("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);
  console.log("Vote Collection Created");

  /**
   * Define Attributes (Fields) for the Votes Collection.
   */
  await Promise.all([
    // Is the vote for a "question" or an "answer"?
    databases.createEnumAttribute(
      db,
      voteCollection,
      "type",
      ["question", "answer"],
      true
    ),

    // The ID of the question or answer being voted on
    databases.createStringAttribute(db, voteCollection, "typeId", 50, true),

    // Whether it's an "upvoted" or "downvoted" status
    databases.createEnumAttribute(
      db,
      voteCollection,
      "voteStatus",
      ["upvoted", "downvoted"],
      true
    ),

    // The ID of the user who cast the vote
    databases.createStringAttribute(db, voteCollection, "votedById", 50, true),
  ]);
  console.log("Vote Attributes Created");
}
