/**
 * This is the Next.js Middleware file.
 * Middleware runs before every request in your application (except for those excluded in the config).
 * It's a great place to handle tasks like authentication checks or environment setup.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import getOrCreateDB from "./models/server/dbSetup";
import getOrCreateStorage from "./models/server/storageSetup";

/**
 * The middleware function itself.
 * In this project, it's used for:
 * 1. Infrastructure Setup: Ensuring Appwrite DB and Storage are ready.
 * 2. Security Gatekeeping: Protecting private routes from unauthenticated access.
 */
export async function middleware(request: NextRequest) {
  // --- 1. Infrastructure Preparation ---
  // Ensure the DB and Storage are ready (runs on the server side)
  await Promise.all([getOrCreateDB(), getOrCreateStorage()]);

  // --- 2. Security Gatekeeping ---
  // Check if there is an active Appwrite session cookie
  const session = request.cookies.get(
    "a_session_" + process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
  );

  // Define routes that require the user to be logged in
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/questions/ask") ||
    request.nextUrl.pathname.includes("/edit");

  // If trying to access a protected route without a session, redirect to login
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Continue to the next step
  return NextResponse.next();
}

/**
 * Configure which paths the middleware should run on.
 */
export const config = {
  /* 
    Match all request paths except for:
    - _next/static (static files)
    - _next/image (image optimization)
    - favicon.ico (browser icon)
  */
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
