import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request) {
  const token = request.cookies.get('token')?.value
  const path = request.nextUrl.pathname

  const isUiRoute = path.startsWith('/admin')
  const isApiRoute = path.startsWith('/api/admin')

  if (isUiRoute || isApiRoute) {
    if (!token) {
      if (isUiRoute) return NextResponse.redirect(new URL('/login', request.url))
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      const { payload } = await jwtVerify(token, secret)
      if (payload.role !== 'admin') {
        if (isUiRoute) return NextResponse.redirect(new URL('/', request.url))
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
      }
    } catch (e) {
      if (isUiRoute) return NextResponse.redirect(new URL('/login', request.url))
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] }