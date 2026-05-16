import connectDB from '@/lib/db'
import User from '@/models/User'
import OTP from '@/models/OTP'
import { sendOTP } from '@/lib/email'

export async function POST(request) {
  try {
    await connectDB()
    const { email } = await request.json()

    if (!email) return Response.json({ success: false, error: 'Email required' }, { status: 400 })

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) return Response.json({ success: false, error: 'Email already registered' }, { status: 400 })

    await OTP.deleteMany({ email: email.toLowerCase() })

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await OTP.create({ email: email.toLowerCase(), otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) })

    await sendOTP(email, otp)
    return Response.json({ success: true, message: 'OTP sent' }, { status: 200 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}