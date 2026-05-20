import connectDB from '@/lib/db'
import Category from '@/models/Category'
import { requireAdmin } from '@/lib/auth'

export async function PUT(req, { params }) {
  try {
    await requireAdmin()
    const { id } = await params; const body = await req.json()
    await connectDB(); const c = await Category.findByIdAndUpdate(id, body, { new: true })
    return Response.json({ success: true, category: c })
  } catch(e) { return Response.json({success: false, error: e.message}, {status: 401}) }
}
export async function DELETE(req, { params }) {
  try {
    await requireAdmin()
    const { id } = await params
    await connectDB(); await Category.findByIdAndDelete(id)
    return Response.json({ success: true })
  } catch(e) { return Response.json({success: false, error: e.message}, {status: 401}) }
}