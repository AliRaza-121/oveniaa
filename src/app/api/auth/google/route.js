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

    // Verify Firebase ID token via Identity Toolkit
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    const googleRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    })
    
    if (!googleRes.ok) {
      return Response.json({ success: false, error: 'Invalid Google token' }, { status: 401 })
    }

    const data = await googleRes.json()
    if (!data.users || data.users.length === 0) {
      return Response.json({ success: false, error: 'Invalid Google token payload' }, { status: 401 })
    }

    const googleUser = data.users[0]
    const googleId = googleUser.localId
    const email = googleUser.email
    const name = googleUser.displayName || email.split('@')[0]
    const email_verified = googleUser.emailVerified

    if (!email_verified) {
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
