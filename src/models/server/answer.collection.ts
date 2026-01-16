/**
 * This file defines the structure (schema) for the "Answers" collection in Appwrite.
 * Every answer is linked to a specific question and an author.
 */

import { IndexType, Permission } from "node-appwrite";
import { answerCollection, db } from "../name";
import { databases } from "./config";

export default async function createAnswerCollection() {
  /**
   * Create the Collection.
   * Logged-in users can create/update/delete their answers.
   */
  await databases.createCollection(db, answerCollection, answerCollection, [
    Permission.create("users"),
    Permission.read("any"),
    Permission.read("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);
  console.log("Answer Collection Created");

  /**
   * Define Attributes (Fields) for the Answers Collection.
   */
  await Promise.all([
    // The text content of the answer
    databases.createStringAttribute(
      db,
      answerCollection,
      "content",
      10000,
      true
    ),

    // The ID of the question this answer belongs to (foreign key concept)
    databases.createStringAttribute(
      db,
      answerCollection,
      "questionId",
      50,
      true
    ),

    // The ID of the user who wrote this answer
    databases.createStringAttribute(db, answerCollection, "authorId", 50, true),
  ]);
  console.log("Answer Attributes Created");
}
