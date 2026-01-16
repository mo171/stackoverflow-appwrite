/**
 * This file defines the structure (schema) for the "Comments" collection in Appwrite.
 * Comments are flexible and can be attached to either a Question or an Answer.
 */

import { Permission } from "node-appwrite";
import { commentCollection, db } from "../name";
import { databases } from "./config";

export default async function createCommentCollection() {
  /**
   * Create the Collection.
   */
  await databases.createCollection(db, commentCollection, commentCollection, [
    Permission.create("users"),
    Permission.read("any"),
    Permission.read("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);
  console.log("Comment Collection Created");

  /**
   * Define Attributes (Fields) for the Comments Collection.
   */
  await Promise.all([
    // The text content of the comment
    databases.createStringAttribute(
      db,
      commentCollection,
      "content",
      10000,
      true
    ),

    // Is this comment for an "answer" or a "question"? (Enum attribute restricted to these two)
    databases.createEnumAttribute(
      db,
      commentCollection,
      "type",
      ["answer", "question"],
      true
    ),

    // The ID of the specific answer or question this comment is for
    databases.createStringAttribute(db, commentCollection, "typeId", 50, true),

    // The ID of the user who wrote the comment
    databases.createStringAttribute(
      db,
      commentCollection,
      "authorId",
      50,
      true
    ),
  ]);
  console.log("Comment Attributes Created");
}
