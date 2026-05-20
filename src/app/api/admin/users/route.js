import connectDB from '@/lib/db'
import User from '@/models/User'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdmin()
    await connectDB()
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean()
    return Response.json({ success: true, users }, { status: 200 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: error.message === 'Forbidden' || error.message === 'Unauthorized' ? 401 : 500 })
  }
}
