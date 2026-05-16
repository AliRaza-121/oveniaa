import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.set('token', '', { httpOnly: true, secure: false, sameSite: 'lax', path: '/', maxAge: 0 })
  return Response.json({ success: true, message: 'Logged out' }, { status: 200 })
}