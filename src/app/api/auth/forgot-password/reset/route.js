import connectDB from '@/lib/db'
import User from '@/models/User'
import OTP from '@/models/OTP'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request) {
  const ip = getClientIp(request)
  if (!checkRateLimit(ip, 5, 60000 * 15)) {
    return Response.json({ success: false, error: 'Too many attempts. Try again later.' }, { status: 429 })
  }

  try {
    await connectDB()
    const { email, otp, newPassword } = await request.json()

    if (!email || !otp || !newPassword) {
      return Response.json({ success: false, error: 'All fields required' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return Response.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      otp,
      verified: false,
      expiresAt: { $gt: new Date() },
    })

    if (!otpRecord) {
      return Response.json({ success: false, error: 'Invalid or expired code' }, { status: 400 })
    }

    // Mark OTP as used
    otpRecord.verified = true
    await otpRecord.save()

    // Update password
    const user = await User.findOne({ email: email.toLowerCase(), status: 'active' })
    if (!user) {
      return Response.json({ success: false, error: 'Account not found' }, { status: 404 })
    }

    user.password = newPassword
    if (user.provider === 'google') user.provider = 'both'
    await user.save()

    return Response.json({ success: true, message: 'Password reset successfully' }, { status: 200 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
