import { NextResponse, type NextRequest } from 'next/server';

/**
 * Next.js Middleware for Route Protection
 * Protects role-specific dashboard routes:
 * - /admin/* -> requires role 'admin'
 * - /keluarga/* -> requires role 'family'
 * - /art -> requires role 'art' (exact dashboard route; /art/:id is public profile)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve user role from session cookie
  const roleCookie = request.cookies.get('artin_role')?.value;

  // 1. Protect Admin Routes
  if (pathname.startsWith('/admin')) {
    if (!roleCookie || roleCookie !== 'admin') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'unauthorized_admin');
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protect Family / Employer Routes
  if (pathname.startsWith('/keluarga')) {
    if (!roleCookie || roleCookie !== 'family') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'unauthorized_family');
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Protect ART Dashboard Route (/art exact)
  // Note: /art/[id] is the public candidate profile page and must remain accessible to everyone!
  if (pathname === '/art' || pathname === '/art/') {
    if (!roleCookie || roleCookie !== 'art') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'unauthorized_art');
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/keluarga/:path*', '/art'],
};
