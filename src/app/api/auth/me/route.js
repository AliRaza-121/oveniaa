import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import connectDB from '@/lib/db'
import User from '@/models/User'

const JWT_SECRET = process.env.JWT_SECRET

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return Response.json({ success: false }, { status: 401 })

    const decoded = jwt.verify(token, JWT_SECRET)
    await connectDB()
    const user = await User.findById(decoded.id).select('-password')
    if (!user || user.status !== 'active') return Response.json({ success: false }, { status: 401 })

    return Response.json({ success: true, user }, { status: 200 })
  } catch {
    return Response.json({ success: false }, { status: 401 })
  }
}