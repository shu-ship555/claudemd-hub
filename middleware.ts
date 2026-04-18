import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth/login', '/auth/signup', '/auth/verify']

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Protected routes - check for authentication
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/config')) {
    // TODO: Add Supabase session verification here
    // For now, let the routes handle it
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
