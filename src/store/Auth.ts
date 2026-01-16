/**
 * This file defines the Authentication Store using Zustand.
 * It manages the user's session, JWT, and profile data across the entire application.
 * It also handles core auth actions like logging in, creating an account, and logging out.
 */

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import { AppwriteException, ID, Models } from "appwrite";
import { account } from "@/models/client/config";

/**
 * Defines the custom preferences for a user, such as their reputation score.
 */
export interface UserPrefs {
  reputation: number;
}

/**
 * The interface defining the state and actions available in our Auth Store.
 */
interface IAuthStore {
  session: Models.Session | null; // Stores information about the current active session
  jwt: string | null; // Stores the JSON Web Token for authenticated server requests
  user: Models.User<UserPrefs> | null; // Stores the profile details of the logged-in user
  hydrated: boolean; // Tracks if the store has finished loading from local storage

  setHydrated(): void; // Marks the store as hydrated
  verfiySession(): Promise<void>; // Checks if there is an active session on the Appwrite server

  /**
   * Logs in a user using their email and password.
   * On success, it also fetches the user's profile and creates a JWT.
   */
  login(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;

  /**
   * Creates a new user account on the Appwrite server.
   */
  createAccount(
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;

  /**
   * Logs out the user by deleting all active sessions.
   */
  logout(): Promise<void>;
}

/**
 * create the Auth Store with middleware:
 * - 'persist': Automatically saves the store data to local storage so the user stays logged in after a refresh.
 * - 'immer': Allows us to update the state in a "mutable" way while keeping it immutable under the hood.
 */
export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set) => ({
      // --- Initial State ---
      session: null,
      jwt: null,
      user: null,
      hydrated: false,

      // --- Actions ---

      setHydrated() {
        set({ hydrated: true });
      },

      /**
       * Checks if the user is already logged in on the Appwrite server.
       */
      async verfiySession() {
        try {
          const session = await account.getSession("current");
          set({ session });
        } catch (error) {
          console.log("No active session found:", error);
        }
      },

      /**
       * Handles the login process.
       */
      async login(email: string, password: string) {
        try {
          // 1. Create the session
          const session = await account.createEmailPasswordSession(
            email,
            password
          );

          // 2. Fetch user profile and create a JWT concurrently
          const [user, { jwt }] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT(),
          ]);

          // 3. Initialize reputation if it's a new field
          if (!user.prefs?.reputation) {
            await account.updatePrefs<UserPrefs>({ reputation: 0 });
          }

          // 4. Update the global state
          set({ session, user, jwt });

          return { success: true };
        } catch (error) {
          console.log("Login failed:", error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      /**
       * Handles account creation.
       */
      async createAccount(name: string, email: string, password: string) {
        try {
          // Use ID.unique() to let Appwrite generate a unique user ID
          await account.create(ID.unique(), email, password, name);
          return { success: true };
        } catch (error) {
          console.log("Account creation failed:", error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      /**
       * Handles logout.
       */
      async logout() {
        try {
          await account.deleteSessions(); // Clear all sessions on the server
          set({ session: null, jwt: null, user: null }); // Clear state in the app
        } catch (error) {
          console.log("Logout failed:", error);
        }
      },
    })),
    {
      name: "auth", // The key used in local storage
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    }
  )
);
