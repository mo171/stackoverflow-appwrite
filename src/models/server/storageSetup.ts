/**
 * This file ensures the Appwrite Storage Bucket for question attachments is created and configured.
 * It sets file type restrictions and access permissions.
 */

import { Permission } from "node-appwrite";
import { questionAttachmentBucket } from "../name";
import { storage } from "./config";

/**
 * Checks if the storage bucket exists. If not, it creates it with specific permissions.
 */
export default async function getOrCreateStorage() {
  try {
    // Attempt to fetch the bucket to see if it exists
    await storage.getBucket(questionAttachmentBucket);
    console.log("Storage Bucket Connected");
  } catch (error) {
    // If it doesn't exist, we create it
    try {
      await storage.createBucket(
        questionAttachmentBucket, // Bucket ID
        questionAttachmentBucket, // Bucket Name
        [
          Permission.create("users"), // Logged-in users can create/upload files
          Permission.read("any"), // Anyone (even guests) can view/read files
          Permission.read("users"), // Logged-in users can read files
          Permission.update("users"), // Logged-in users can update their files
          Permission.delete("users"), // Logged-in users can delete their files
        ],
        false, // Is the bucket public? (We control access via permissions instead)
        undefined,
        undefined,
        ["jpg", "png", "gif", "jpeg", "webp", "heic"] // Allowed file extensions
      );

      console.log("Storage Bucket Created");
      console.log("Storage Connected");
    } catch (error) {
      console.error("Error creating storage bucket:", error);
    }
  }
}
