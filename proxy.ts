import { type NextRequest, NextResponse } from 'next/server'
import { fetchSupabaseUser } from '@/lib/supabase-auth'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const publicRoutes = ['/', '/auth/login', '/auth/signup', '/auth/verify']

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/config')) {
    const accessToken = request.cookies.get('sb-access-token')?.value

    if (!accessToken) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    const user = await fetchSupabaseUser(accessToken)
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
