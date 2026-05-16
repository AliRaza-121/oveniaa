import connectDB from '@/lib/db'
import Review from '@/models/Review'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return Response.json({ success: false, error: 'Please login to review' }, { status: 401 })

    const decoded = jwt.verify(token, JWT_SECRET)
    await connectDB()

    const { menuItem, rating, comment } = await request.json()
    const review = await Review.findOneAndUpdate(
      { user: decoded.id, menuItem },
      { rating, comment },
      { upsert: true, returnDocument: 'after' }
    ).populate('user', 'name')

    return Response.json({ success: true, review }, { status: 200 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}