import connectDB from '@/lib/db'
import Review from '@/models/Review'

export async function GET(request, { params }) {
  try {
    await connectDB()
    const { menuId } = await params
    const reviews = await Review.find({ menuItem: menuId }).populate('user', 'name').sort({ createdAt: -1 })
    return Response.json({ success: true, reviews }, { status: 200 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}