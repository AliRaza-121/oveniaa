import connectDB from '@/lib/db'
import User from '@/models/User'
import { requireAdmin } from '@/lib/auth'

export async function PUT(request, { params }) {
  try {
    await requireAdmin()
    await connectDB()
    const { id } = await params
    const body = await request.json()
    
    const updates = {
      name: body.name,
      email: body.email,
      role: body.role,
      status: body.status
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password')
    if (!user) return Response.json({ success: false, error: 'User not found' }, { status: 404 })

    return Response.json({ success: true, user }, { status: 200 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: error.message === 'Forbidden' || error.message === 'Unauthorized' ? 401 : 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAdmin()
    await connectDB()
    const { id } = await params
    const user = await User.findByIdAndDelete(id)
    if (!user) return Response.json({ success: false, error: 'User not found' }, { status: 404 })

    return Response.json({ success: true, message: 'User deleted successfully' }, { status: 200 })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: error.message === 'Forbidden' || error.message === 'Unauthorized' ? 401 : 500 })
  }
}
