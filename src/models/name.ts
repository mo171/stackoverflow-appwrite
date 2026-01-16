/**
 * This file contains the names of the Appwrite database, collections, and buckets used in the project.
 * These constants are used throughout the application to ensure consistency and avoid typos.
 */

/** The name of the main database in Appwrite */
export const db = "main-stackflow";

/** The name of the collection stores all the questions */
export const questionCollection = "questions";

/** The name of the collection that stores all the answers to questions */
export const answerCollection = "answers";

/** The name of the collection that stores comments on questions and answers */
export const commentCollection = "comments";

/** The name of the collection that stores votes for questions and answers */
export const voteCollection = "votes";

/** The name of the storage bucket where question attachments (like images) are uploaded */
export const questionAttachmentBucket = "question-attachment";
