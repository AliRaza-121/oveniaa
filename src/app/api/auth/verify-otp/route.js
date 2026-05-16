import connectDB from '@/lib/db'
import User from '@/models/User'
import OTP from '@/models/OTP'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(request) {
  try {
    await connectDB()
    const { name, email, password, otp } = await request.json()

    if (!name || !email || !password || !otp) {
      return Response.json({ success: false, error: 'All fields required' }, { status: 400 })
    }

    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      otp,
      verified: false,
      expiresAt: { $gt: new Date() },
    })

    if (!otpRecord) return Response.json({ success: false, error: 'Invalid or expired OTP' }, { status: 400 })

    otpRecord.verified = true
    await otpRecord.save()

    const user = await User.create({ name, email: email.toLowerCase(), password, role: 'customer' })

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })

    const cookieStore = await cookies()
    cookieStore.set('token', token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 7 * 24 * 60 * 60,
    })

    return Response.json({ success: true, user: { _id: user._id, name, email, role: user.role } }, { status: 201 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}