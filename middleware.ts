import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
    const isAdminPage = req.nextUrl.pathname.startsWith('/dashboard');
    const isProtectedPage = req.nextUrl.pathname.startsWith('/account') || 
                           req.nextUrl.pathname.startsWith('/orders');

    // Allow access to auth pages without token
    if (isAuthPage) {
      return null;
    }

    // Redirect unauthenticated users to sign-in page
    if (!isAuth && isProtectedPage) {
      const callbackUrl = req.nextUrl.pathname;
      return NextResponse.redirect(
        new URL(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`, req.url)
      );
    }

    // Check admin access
    if (isAdminPage && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Always allow access to auth pages
        if (req.nextUrl.pathname.startsWith('/auth')) {
          return true;
        }
        // Require token for protected pages
        if (req.nextUrl.pathname.startsWith('/account') ||
            req.nextUrl.pathname.startsWith('/orders') ||
            req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token;
        }
        // Allow access to public pages
        return true;
      }
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/account/:path*', '/orders/:path*', '/auth/:path*']
}; 