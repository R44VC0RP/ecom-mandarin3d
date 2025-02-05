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

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/', req.url));
      }
      return null;
    }

    if (!isAuth && isProtectedPage) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    if (isAdminPage && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/account/:path*', '/orders/:path*', '/auth/:path*']
}; 