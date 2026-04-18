import { type NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth/login', '/auth/signup', '/auth/verify']

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // For protected routes, verify authentication via token
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/config')) {
    const accessToken = request.cookies.get('sb-access-token')?.value

    if (!accessToken) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Verify token with Supabase
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          },
        }
      )

      if (!response.ok) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
