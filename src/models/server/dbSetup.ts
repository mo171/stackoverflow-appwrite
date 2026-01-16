/**
 * This file is responsible for ensuring the Appwrite database and its collections
 * are correctly set up on the server. If they don't exist, it creates them.
 * This is typically run during the initial deployment or setup of the application.
 */

import { db } from "../name";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";

import { databases } from "./config";

/**
 * Checks if the database exists. If not, it creates the database and all necessary collections.
 * @returns The initialized Appwrite Databases service.
 */
export default async function getOrCreateDB() {
  try {
    // Attempt to get the database. If it exists, this will succeed.
    await databases.get(db);
    console.log("Database connection established");
  } catch (error) {
    // If the database doesn't exist, an error is thrown, and we catch it here to create it.
    try {
      await databases.create(db, db);
      console.log("Database created successfully");

      /**
       * Once the database is created, we need to create the individual collections (tables).
       * We use Promise.all to run all collection creation functions concurrently (at the same time).
       */
      await Promise.all([
        createQuestionCollection(),
        createAnswerCollection(),
        createCommentCollection(),
        createVoteCollection(),
      ]);
      console.log("Collections created successfully");
      console.log("Database connected");
    } catch (error) {
      console.log("Error creating databases or collections:", error);
    }
  }

  return databases;
}
