import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { accessToken, refreshToken } = body

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Missing access token' },
      { status: 400 }
    )
  }

  try {
    // Verify token by calling Supabase API
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
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const user = await response.json()

    // Set cookies for server-side access
    const res = NextResponse.json({ user })

    res.cookies.set({
      name: 'sb-access-token',
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600,
    })

    if (refreshToken) {
      res.cookies.set({
        name: 'sb-refresh-token',
        value: refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 604800,
      })
    }

    return res
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: 'Session sync failed' },
      { status: 500 }
    )
  }
}
