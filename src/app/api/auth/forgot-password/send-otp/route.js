import connectDB from '@/lib/db'
import User from '@/models/User'
import OTP from '@/models/OTP'
import { sendPasswordResetOTP } from '@/lib/email'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request) {
  const ip = getClientIp(request)
  if (!checkRateLimit(ip, 3, 60000 * 5)) {
    return Response.json({ success: false, error: 'Too many requests. Try again later.' }, { status: 429 })
  }

  try {
    await connectDB()
    const { email } = await request.json()

    if (!email) return Response.json({ success: false, error: 'Email required' }, { status: 400 })

    const user = await User.findOne({ email: email.toLowerCase(), status: 'active' })
    if (!user) {
      // Don't reveal if email exists or not for security
      return Response.json({ success: true, message: 'If an account exists, a reset code has been sent.' }, { status: 200 })
    }

    // Check if Google-only user
    if (user.provider === 'google' && !user.password) {
      return Response.json({ success: false, error: 'This account uses Google Sign-In. Please sign in with Google.' }, { status: 400 })
    }

    // Delete old OTPs for this email
    await OTP.deleteMany({ email: email.toLowerCase() })

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await OTP.create({ email: email.toLowerCase(), otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) })

    await sendPasswordResetOTP(email, otp)
    return Response.json({ success: true, message: 'Reset code sent to your email' }, { status: 200 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
