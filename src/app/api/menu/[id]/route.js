import connectDB from '@/lib/db'
import MenuItem from '@/models/MenuItem'
import { requireAdmin } from '@/lib/auth'

export async function GET(req, { params }) {
  const { id } = await params; await connectDB()
  const item = await MenuItem.findById(id)
  return Response.json({ success: true, item })
}

export async function PUT(req, { params }) {
  try {
    await requireAdmin()
    const { id } = await params; const body = await req.json(); await connectDB()
    const item = await MenuItem.findByIdAndUpdate(id, body, { new: true })
    return Response.json({ success: true, item })
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 401 })
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireAdmin()
    const { id } = await params; await connectDB()
    await MenuItem.findByIdAndDelete(id)
    return Response.json({ success: true })
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 401 })
  }
}