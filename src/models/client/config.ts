/**
 * This file initializes the Appwrite client for use on the frontend (client-side).
 * It sets up connections to the database, authentication, avatars, and storage services.
 */

import env from "@/app/env";
import { Client, Account, Avatars, Databases, Storage } from "appwrite";

/**
 * Initialize the Appwrite Client.
 * The .setEndpoint() and .setProject() methods tell the client which Appwrite project to connect to.
 * These values are pulled from environment variables for security and flexibility.
 */
const client = new Client()
  .setEndpoint(env.appwrite.endpoint) // The URL of your Appwrite server
  .setProject(env.appwrite.projectId); // Your unique Appwrite Project ID

/**
 * Account service: Used for user authentication (login, signup, etc.)
 */
const account = new Account(client);

/**
 * Databases service: Used to interact with the Appwrite databases and collections.
 */
const databases = new Databases(client);

/**
 * Avatars service: Used to generate or fetch user avatars/identicons.
 */
const avatars = new Avatars(client);

/**
 * Storage service: Used to upload, download, and manage files (like images).
 */
const storage = new Storage(client);

export { client, databases, account, avatars, storage };
