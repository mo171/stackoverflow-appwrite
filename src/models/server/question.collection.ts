/**
 * This file defines the structure (schema) for the "Questions" collection in Appwrite.
 * It specifies what data a question can have (title, content, tags, etc.) and who can access it.
 */

import { IndexType, Permission } from "node-appwrite";
import { db, questionCollection } from "../name";
import { databases } from "./config";

export default async function createQuestionCollection() {
  /**
   * Create the Collection.
   * Permissions here allow anyone to read questions, but only logged-in users to create/update/delete.
   */
  await databases.createCollection(db, questionCollection, questionCollection, [
    Permission.read("any"),
    Permission.read("users"),
    Permission.create("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);
  console.log("Question collection created successfully");

  /**
   * Define Attributes (Fields) for the Questions Collection.
   * Each attribute defines a piece of data that will be stored for every question.
   */
  await Promise.all([
    // The main title of the question (e.g., "How to use React Hooks?")
    databases.createStringAttribute(db, questionCollection, "title", 100, true),

    // The detailed body of the question (supports up to 10,000 characters)
    databases.createStringAttribute(
      db,
      questionCollection,
      "content",
      10000,
      true
    ),

    // The ID of the user who asked the question
    databases.createStringAttribute(
      db,
      questionCollection,
      "authorId",
      50,
      true
    ),

    // An array of tags associated with the question (e.g., ["react", "javascript"])
    databases.createStringAttribute(
      db,
      questionCollection,
      "tags",
      50,
      true,
      undefined,
      true
    ),

    // Optional ID linking to an image/file in the storage bucket
    databases.createStringAttribute(
      db,
      questionCollection,
      "attachmentId",
      50,
      false
    ),

    // Optional ID linking to the "best" answer selected for this question
    databases.createStringAttribute(
      db,
      questionCollection,
      "bestAnswerId",
      50,
      false
    ),
  ]);
  console.log("Question Attributes created successfully");

  // Note: Fulltext indexes can be added here once attributes are processed by Appwrite.
}
