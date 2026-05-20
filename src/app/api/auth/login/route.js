import connectDB from '@/lib/db'
import User from '@/models/User'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(request) {
  const ip = getClientIp(request)
  if (!checkRateLimit(ip, 5, 60000 * 15)) {
    return Response.json({ success: false, error: 'Too many attempts. Please try again later.' }, { status: 429 })
  }

  try {
    await connectDB()
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ success: false, error: 'Email and password required' }, { status: 400 })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user || user.status !== 'active') {
      return Response.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return Response.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
    user.lastLogin = new Date()
    await user.save()

    const cookieStore = await cookies()
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })

    return Response.json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    }, { status: 200 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}