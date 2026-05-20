import connectDB from '@/lib/db'
import User from '@/models/User'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(request) {
  try {
    const { idToken } = await request.json()
    if (!idToken) {
      return Response.json({ success: false, error: 'ID token required' }, { status: 400 })
    }

    // Verify Google ID token via Google's tokeninfo endpoint
    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`)
    if (!googleRes.ok) {
      return Response.json({ success: false, error: 'Invalid Google token' }, { status: 401 })
    }

    const googleUser = await googleRes.json()
    const { sub: googleId, email, name, email_verified } = googleUser

    if (!email_verified || email_verified === 'false') {
      return Response.json({ success: false, error: 'Email not verified with Google' }, { status: 400 })
    }

    await connectDB()

    // Find existing user by email or googleId
    let user = await User.findOne({ $or: [{ email: email.toLowerCase() }, { googleId }] })

    if (user) {
      // Existing user — update googleId if not set and check status
      if (user.status !== 'active') {
        return Response.json({ success: false, error: 'Account is disabled' }, { status: 403 })
      }
      if (!user.googleId) {
        user.googleId = googleId
        user.provider = user.provider === 'local' ? 'both' : 'google'
        await user.save()
      }
      user.lastLogin = new Date()
      await user.save()
    } else {
      // New user — auto-register with Google
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        googleId,
        provider: 'google',
        role: 'customer',
      })
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })

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
