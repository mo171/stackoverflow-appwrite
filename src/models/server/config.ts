/**
 * This file initializes the Appwrite client for use on the server-side (Node.js/Next.js).
 * Unlike the client-side config, this one uses 'node-appwrite' and requires an API key for administrative access.
 */

import env from "@/app/env";
import { Avatars, Client, Databases, Storage, Users } from "node-appwrite";

let client = new Client();

/**
 * Initialize the Appwrite Client for Server-Side use.
 * .setKey() is crucial here—it provides the administrative privileges needed by the server.
 */
client
  .setEndpoint(env.appwrite.endpoint) // The URL of your Appwrite server
  .setProject(env.appwrite.projectId) // Your unique Appwrite Project ID
  .setKey(env.appwrite.apikey); // Your Secret API Key (Keep this secret!)

/**
 * Databases service (Server version): Allows administrative database operations.
 */
const databases = new Databases(client);

/**
 * Avatars service (Server version): Used for server-side avatar processing.
 */
const avatars = new Avatars(client);

/**
 * Storage service (Server version): Used for server-side file management.
 */
const storage = new Storage(client);

/**
 * Users service: Only available on the server-side. Used to manage all users in the project.
 */
const users = new Users(client);

export { client, databases, users, avatars, storage };
