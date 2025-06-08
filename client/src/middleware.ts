// middleware.ts or middleware.js (depending on your setup)
import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = new Set(["/sign-in", "/sign-up", "/forgot-password"]);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const userCookie = req.cookies.get('auth_token');
  console.log('this is my token',userCookie)

  // Check if user has a cookie and trying to access a public route like sign-in or sign-up
  if (publicRoutes.has(pathname) && userCookie) {
    console.log('Redirecting authenticated user from public route');
    return NextResponse.redirect(new URL('/', req.url)); // Redirect authenticated users to home page
  }

  // If the route is a public route, allow the request to continue
  if (publicRoutes.has(pathname)) {
    console.log('Public route, allowing access');
    return NextResponse.next(); // Proceed to the route
  }

  // If the user is not authenticated and not accessing a public route, redirect to sign-in
  if (!userCookie) {
    console.log('User not authenticated, redirecting to sign-in');
    return NextResponse.redirect(new URL('/sign-in', req.url)); // Redirect to login
  }

  // Allow the user to continue to the page if everything is okay
  return NextResponse.next();
}

// Define which routes the middleware should apply to
export const config = {
  matcher: [
    "/sign-in", 
    "/sign-up", 
    "/forgot-password", 
    "/", 
    "/chat/:path*" 
  ]
};
