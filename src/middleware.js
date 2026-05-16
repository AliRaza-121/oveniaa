import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')?.value
  const path = request.nextUrl.pathname

  if (path.startsWith('/admin')) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = { matcher: '/admin/:path*' }