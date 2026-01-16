# Appwrite & Next.js Setup Guide

This guide details the architectural approach and setup procedures used to integrate **Appwrite** with this **Next.js** application. Use this as a reference for building similar full-stack projects.

## 1. Connection Architecture

We use a dual-config approach to handle both client-side interations and administrative server-side operations.

### Client-Side Configuration

Located in `src/models/client/config.ts`. This is used for actions performed directly by the user, like logging in or fetching public data.

```typescript
import { Client, Account, Avatars, Databases, Storage } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("YOUR_PROJECT_ID");

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
```

### Server-Side Configuration

Located in `src/models/server/config.ts`. This uses the `node-appwrite` SDK and an **API Key** to perform administrative tasks (e.g., creating collections, managing all users).

```typescript
import { Client, Databases, Storage, Users } from "node-appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("YOUR_PROJECT_ID")
  .setKey("YOUR_SECRET_API_KEY");

export const databases = new Databases(client);
export const users = new Users(client);
```

---

## 2. Automated Database Initialization

To ensure the project works immediately after cloning, we use an automated "Get or Create" pattern. This is triggered by a **Next.js Middleware**.

### The Setup Logic (`src/models/server/dbSetup.ts`)

This function checks if the database exists; if not, it creates it along with all required collections.

```typescript
export default async function getOrCreateDB() {
  try {
    await databases.get(dbId);
  } catch (error) {
    await databases.create(dbId, dbName);
    // Call functions to create individual collections
    await Promise.all([
      createQuestionCollection(),
      createAnswerCollection(),
      // ...other collections
    ]);
  }
}
```

### Middleware Integration (`src/middleware.ts`)

The middleware runs on every request, ensuring that the database and storage buckets are initialized before any page is served.

```typescript
export async function middleware(request: NextRequest) {
  // Ensure DB and Storage reside in the Appwrite project
  await Promise.all([getOrCreateDB(), getOrCreateStorage()]);
  return NextResponse.next();
}
```

---

## 3. Creating Collections & Attributes

Attributes (fields) are defined programmatically. This ensures the schema is version-controlled and consistent across environments.

### Example: Question Collection (`src/models/server/question.collection.ts`)

```typescript
await databases.createCollection(dbId, collectionId, name, permissions);

// Add attributes
await Promise.all([
  databases.createStringAttribute(dbId, collectionId, "title", 100, true),
  databases.createStringAttribute(dbId, collectionId, "content", 10000, true),
  databases.createStringAttribute(
    dbId,
    collectionId,
    "tags",
    50,
    true,
    undefined,
    true
  ), // Array attribute
]);
```

---

## 4. Role-Based Access Control (RBAC)

Appwrite's Permission system is used to handle security at the database level.

### Common Permission Patterns:

- **Public Read**: `Permission.read("any")` - Anyone (including guests) can see the data.
- **Authenticated Access**: `Permission.create("users")` - Only logged-in users can create documents.
- **Owner-only management**: Logic-wise, we store an `authorId` on documents and check it in our API routes before allowing `DELETE` or `UPDATE` operations.

---

## 5. Authentication & Session Management

We use **Zustand** to mirror the Appwrite auth state in the frontend.

### Creating an Account (`src/store/Auth.ts`)

```typescript
const createAccount = async (email, password, name) => {
  const account = await account.create(ID.unique(), email, password, name);
  // Automatically log them in after signup
  return login(email, password);
};
```

---

## 6. Storage Setup (`src/models/server/storageSetup.ts`)

Similar to the database, the storage bucket for attachments is created automatically.

```typescript
await storage.createBucket(
  bucketId,
  bucketName,
  [Permission.read("any"), Permission.write("users")],
  false,
  undefined,
  undefined,
  ["jpg", "png", "gif"]
);
```

---

---

## 7. Security Gatekeeping (Middleware)

Beyond database permissions, we use **Next.js Middleware** as a first line of defense to redirect unauthenticated users away from private pages.

### How it Works (`src/middleware.ts`)

The middleware checks for the presence of the Appwrite session cookie before allowing access to specific routes.

```typescript
export async function middleware(request: NextRequest) {
  // Check for the Appwrite session cookie
  const session = request.cookies.get(
    "a_session_" + process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
  );

  // Define protected paths
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/questions/ask") ||
    request.nextUrl.pathname.includes("/edit");

  // Redirect if no session is found on a protected route
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
```

### Why this approach?

- **User Experience**: Prevents "flicker" where a user sees a page they shouldn't before being redirected by a client-side hook.
- **SEO**: Ensures search engines don't index private or broken pages.
- **Simplicity**: Centralizes routing logic in one file instead of checking `user === null` in every single component.

---

## 📊 Summary of Approach

1.  **Environment Variables**: All sensitive IDs and URLs are kept in `.env`.
2.  **Centralized Names**: Collection and DB names are kept in `src/models/name.ts` for easy refactoring.
3.  **Client/Server Split**: Use `appwrite` for web hooks and `node-appwrite` for secure API routes/setup scripts.
